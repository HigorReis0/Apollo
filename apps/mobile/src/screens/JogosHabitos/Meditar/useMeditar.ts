import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useMeditar
// Responsabilidade: controlar o timer regressivo e registrar
// XP ao concluir a sessão de meditação.
// O timer usa useRef para o intervalo — evita memory leak,
// padrão recomendado pela React Documentation (Meta, 2025).
// ============================================================
export const useMeditar = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Tempo restante em segundos (padrão: 5 minutos)
  const [tempoRestante, setTempoRestante] = useState(300);

  // Controla se o timer está ativo
  const [isAtivo, setIsAtivo] = useState(false);

  // Controla se o XP já foi concedido nessa sessão (evita duplicidade)
  const [xpConcedido, setXpConcedido] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // Valor do campo de entrada para tempo personalizado (em minutos)
  const [inputMinutos, setInputMinutos] = useState('');

  // useRef armazena o ID do intervalo sem causar re-render.
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // EFFECT: controla o ciclo de vida do timer
  // ============================================================
  useEffect(() => {
    if (isAtivo && tempoRestante > 0) {
      intervaloRef.current = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tempoRestante === 0 && isAtivo) {
      setIsAtivo(false);
      handleConcluirSessao();
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [isAtivo, tempoRestante]);

  // ============================================================
  // FUNÇÃO: handleConcluirSessao
  // Registra o XP no backend ao término da sessão.
  // ============================================================
  const handleConcluirSessao = async () => {
    if (xpConcedido) return;

    try {
      setLoading(true);
      const resultado = await registrarXP(MOTIVOS_XP.MEDITACAO);

      if (resultado.sucesso) {
        setXpConcedido(true);
        Alert.alert(
          'Mente em Paz',
          `Sua sessão de meditação foi concluída com sucesso! +${resultado.xp_ganho} XP registrado!`
        );
      } else {
        Alert.alert(
          'Sessão concluída',
          'Meditação concluída, mas não foi possível registrar o XP. Verifique sua conexão.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Formata segundos no padrão MM:SS para exibição
  const formatarTempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  // Altera a duração da sessão (5, 10 ou 15 minutos)
  const selecionarDuracao = (minutos: number) => {
    setIsAtivo(false);
    setTempoRestante(minutos * 60);
    setXpConcedido(false);
    setInputMinutos(''); // Limpa o campo personalizado
  };

  // ============================================================
  // FUNÇÃO: definirTempoPersonalizado
  // Permite ao usuário digitar um valor customizado em minutos.
  // Valida se é um número positivo e atualiza o timer.
  // ============================================================
  const definirTempoPersonalizado = () => {
    const minutos = parseInt(inputMinutos);
    if (isNaN(minutos) || minutos <= 0) {
      Alert.alert('Erro', 'Digite um valor válido em minutos (ex.: 3, 7, 12).');
      return;
    }
    if (minutos > 120) {
      Alert.alert('Erro', 'O tempo máximo é de 120 minutos.');
      return;
    }
    setIsAtivo(false);
    setTempoRestante(minutos * 60);
    setXpConcedido(false);
    setInputMinutos('');
  };

  // Alterna entre pausar e retomar o timer
  const toggleTimer = () => setIsAtivo(prev => !prev);

  const handleGoBack = () => navigation.goBack();

  return {
    tempoRestante,
    isAtivo,
    loading,
    xpConcedido,
    inputMinutos,
    setInputMinutos,
    formatarTempo,
    selecionarDuracao,
    definirTempoPersonalizado,
    toggleTimer,
    handleGoBack,
  };
};