// ============================================================
// IMPORTAÇÕES
// ============================================================
// useState: hook para estado local
// useEffect: hook para ciclo de vida
// useRef: hook para armazenar referência sem causar re-render
//         (usado aqui para guardar o ID do intervalo do timer)
import { useState, useEffect, useRef } from 'react';

// Alert: diálogo nativo do React Native
import { Alert } from 'react-native';

// useNavigation: hook para navegação entre telas
import { useNavigation } from '@react-navigation/native';

// Hook genérico de XP (reutilizável em todos os hábitos)
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useMeditar
// ============================================================
// Responsabilidade: Gerenciar timer regressivo e registrar XP
// Padrão AVANÇADO: usa useRef para evitar memory leak
//
// POR QUE USEREF?
// Se usássemos useState para armazenar o intervalo:
// - Cada re-render criaria um novo intervalo (bug!)
// - O timer aceleraria (chamando setInterval múltiplas vezes)
// - Consumo de memória cresceria
//
// Com useRef:
// - Armazena a referência sem causar re-render
// - Timer roda normalmente
// - Pode ser limpo com clearInterval() quando desmontar
export const useMeditar = () => {
  
  // Hook de navegação
  const navigation = useNavigation();
  
  // Hook genérico de XP
  const { registrarXP } = useRegistrarXP();

  // ── ESTADO 1: Tempo restante em SEGUNDOS ──
  // 300 = 5 minutos (padrão ao montar)
  // Decrementa 1 a cada segundo enquanto isAtivo = true
  const [tempoRestante, setTempoRestante] = useState(300);

  // ── ESTADO 2: Timer ativo? ──
  // true = timer está rodando (decrementando tempoRestante)
  // false = timer pausado ou não iniciado
  const [isAtivo, setIsAtivo] = useState(false);

  // ── ESTADO 3: XP já foi concedido nessa sessão? ──
  // Evita conceder XP 2x se usuário clicar "Concluir" múltiplas vezes
  // true = XP já foi concedido, não fazer novamente
  // false = XP ainda não foi concedido
  const [xpConcedido, setXpConcedido] = useState(false);

  // ── ESTADO 4: Loading durante requisição HTTP ──
  // true = requisição ao backend em andamento
  // false = pronto
  const [loading, setLoading] = useState(false);

  // ── ESTADO 5: Campo de entrada para tempo customizado ──
  // String porque vem de TextInput (será convertido com parseInt)
  // Exemplo: "15" → 15 minutos
  const [inputMinutos, setInputMinutos] = useState('');

  // ============================================================
  // REF: Armazena o ID do intervalo (SEM causar re-render)
  // ============================================================
  // useRef retorna um objeto { current: value }
  // intervaloRef.current = ID do setInterval (ou null)
  // Necessário para poder fazer clearInterval(intervaloRef.current) depois
  // 
  // TIPO: ReturnType<typeof setInterval> = o tipo que setInterval retorna
  // null = inicialmente não há intervalo ativo
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // EFFECT: Controla o ciclo de vida do timer
  // ============================================================
  // Executa quando isAtivo ou tempoRestante mudam
  // Dependências: [isAtivo, tempoRestante]
  useEffect(() => {
    
    // Condição 1: Se o timer está ativo E ainda há tempo
    if (isAtivo && tempoRestante > 0) {
      
      // Cria um intervalo que decrementa 1 segundo a cada 1000ms
      // setInterval retorna um ID numérico
      intervaloRef.current = setInterval(() => {
        // Decrementa tempoRestante de 1 em 1
        setTempoRestante(prev => prev - 1);
      }, 1000); // 1000ms = 1 segundo
      
    }
    
    // Condição 2: Se chegou a 0 segundos E estava ativo
    else if (tempoRestante === 0 && isAtivo) {
      
      // Para o timer
      setIsAtivo(false);
      
      // Registra o XP automaticamente
      handleConcluirSessao();
    }

    // ============================================================
    // CLEANUP FUNCTION
    // ============================================================
    // Executa quando o componente desmontar OU dependências mudarem
    // CRUCIAL para evitar memory leak (timer rodando após tela sair)
    // 
    // Sem o cleanup: o intervalo continuaria rodando forever
    // Resultado: múltiplos timers simultâneos, aumento de memória
    return () => {
      // Se há um intervalo ativo, para ele
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
    
  }, [isAtivo, tempoRestante]); // Dependências

  // ============================================================
  // FUNÇÃO: handleConcluirSessao
  // ============================================================
  // Responsabilidade: Registrar XP no backend ao fim da sessão
  // Chamada automaticamente quando tempoRestante chega a 0
  const handleConcluirSessao = async () => {
    
    // Guard: Se XP já foi concedido, não fazer novamente
    if (xpConcedido) return;

    try {
      // Ativa loading
      setLoading(true);
      
      // Registra XP via hook genérico
      // MOTIVOS_XP.MEDITACAO = ID do motivo de meditação no banco
      const resultado = await registrarXP(MOTIVOS_XP.MEDITACAO);

      // Se a requisição foi bem-sucedida
      if (resultado.sucesso) {
        // Marca que XP foi concedido (evita duplo)
        setXpConcedido(true);
        
        // Mostra alerta com o XP ganho
        Alert.alert(
          'Mente em Paz',
          `Sua sessão de meditação foi concluída com sucesso! +${resultado.xp_ganho} XP registrado!`
        );
      } else {
        // Se falhou
        Alert.alert(
          'Sessão concluída',
          'Meditação concluída, mas não foi possível registrar o XP. Verifique sua conexão.'
        );
      }
    } finally {
      // Desativa loading
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: formatarTempo
  // ============================================================
  // Converte segundos em formato MM:SS para exibição visual
  // Exemplos: 5 → "00:05", 65 → "01:05", 300 → "05:00"
  const formatarTempo = (segundos: number): string => {
    // Divide segundos em minutos e segundos
    const mins = Math.floor(segundos / 60);  // Minutos (arredondado para baixo)
    const segs = segundos % 60;              // Segundos restantes (módulo 60)
    
    // padStart(2, '0') garante 2 dígitos preenchendo com 0 se necessário
    // Exemplo: "5" vira "05", "10" continua "10"
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  // ============================================================
  // FUNÇÃO: selecionarDuracao
  // ============================================================
  // Permite ao usuário escolher entre 5, 10 ou 15 minutos
  // Reset: para o timer, zera o tempo, reseta XP
  const selecionarDuracao = (minutos: number) => {
    // Para o timer se estava rodando
    setIsAtivo(false);
    
    // Converte minutos em segundos
    // Exemplo: 10 minutos = 10 * 60 = 600 segundos
    setTempoRestante(minutos * 60);
    
    // Reset: marca que XP ainda não foi concedido
    setXpConcedido(false);
    
    // Limpa o campo de tempo customizado
    setInputMinutos('');
  };

  // ============================================================
  // FUNÇÃO: definirTempoPersonalizado
  // ============================================================
  // Permite ao usuário digitar uma duração customizada
  // Inclui validações: número positivo, máximo 120 minutos
  const definirTempoPersonalizado = () => {
    // Converte a string digitada para número
    const minutos = parseInt(inputMinutos);
    
    // Validação 1: É um número válido?
    // isNaN(minutos) = true se conversão falhou (ex: "abc" → NaN)
    if (isNaN(minutos) || minutos <= 0) {
      Alert.alert('Erro', 'Digite um valor válido em minutos (ex.: 3, 7, 12).');
      return; // Sai da função
    }
    
    // Validação 2: Não ultrapassa 2 horas?
    if (minutos > 120) {
      Alert.alert('Erro', 'O tempo máximo é de 120 minutos.');
      return;
    }
    
    // Tudo OK, atualiza o timer
    setIsAtivo(false);                    // Para se estava rodando
    setTempoRestante(minutos * 60);       // Converte minutos em segundos
    setXpConcedido(false);                // Reset XP
    setInputMinutos('');                  // Limpa o campo
  };

  // ============================================================
  // FUNÇÃO: toggleTimer
  // ============================================================
  // Alterna entre pausar e retomar o timer
  // Pausa: isAtivo true → false
  // Retoma: isAtivo false → true
  const toggleTimer = () => setIsAtivo(prev => !prev);

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================
  
  // Volta à tela anterior
  const handleGoBack = () => navigation.goBack();

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  // A View (meditar.view.tsx) desestrututa TODOS esses valores
  return {
    tempoRestante,                    // Tempo restante em segundos
    isAtivo,                          // Timer está ativo?
    loading,                          // Carregando XP?
    xpConcedido,                      // XP já foi concedido?
    inputMinutos,                     // Campo de tempo customizado
    setInputMinutos,                  // Atualiza o campo
    formatarTempo,                    // Formata MM:SS
    selecionarDuracao,                // Seleciona 5/10/15 minutos
    definirTempoPersonalizado,        // Define tempo customizado
    toggleTimer,                      // Pausa/retoma timer
    handleGoBack,                     // Volta à tela anterior
  };
};