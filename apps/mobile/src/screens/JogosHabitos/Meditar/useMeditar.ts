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

  // useRef armazena o ID do intervalo sem causar re-render.
  // Diferente do useState, mutações no ref não re-renderizam o componente —
  // padrão essencial para timers (Abramov, "Overreacted", 2019).
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // EFFECT: controla o ciclo de vida do timer
  // A função de limpeza (return) garante que o intervalo seja
  // destruído ao desmontar o componente — previne memory leak,
  // violação do princípio de gerenciamento de recursos (RAII).
  // ============================================================
  useEffect(() => {
    if (isAtivo && tempoRestante > 0) {
      intervaloRef.current = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tempoRestante === 0 && isAtivo) {
      // Timer chegou a zero — encerra e registra XP
      setIsAtivo(false);
      handleConcluirSessao();
    }

    // Limpeza: destrói o intervalo ao pausar ou desmontar
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [isAtivo, tempoRestante]);

  // ============================================================
  // FUNÇÃO: handleConcluirSessao
  // Registra o XP no backend ao término da sessão.
  // Protegida contra duplo disparo via flag xpConcedido.
  // ============================================================
  const handleConcluirSessao = async () => {
    // Impede duplo registro caso o effect dispare mais de uma vez
    if (xpConcedido) return;

    try {
      setLoading(true);
      const sucesso = await registrarXP(MOTIVOS_XP.MEDITACAO);

      if (sucesso) {
        setXpConcedido(true);
        Alert.alert(
          "Mente em Paz 🧘",
          "Sua sessão de meditação foi concluída com sucesso! XP registrado!"
        );
      } else {
        Alert.alert(
          "Sessão concluída",
          "Meditação concluída, mas não foi possível registrar o XP. Verifique sua conexão."
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
  // Reseta o timer e o flag de XP ao trocar de duração
  const selecionarDuracao = (minutos: number) => {
    setIsAtivo(false);
    setTempoRestante(minutos * 60);
    setXpConcedido(false);
  };

  // Alterna entre pausar e retomar o timer
  const toggleTimer = () => setIsAtivo(prev => !prev);

  const handleGoBack = () => navigation.goBack();

  return {
    tempoRestante,
    isAtivo,
    loading,
    xpConcedido,
    formatarTempo,
    selecionarDuracao,
    toggleTimer,
    handleGoBack,
  };
};