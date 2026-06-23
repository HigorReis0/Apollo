import { useState } from 'react';
import { Alert } from 'react-native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useMusculacao
// Responsabilidade: controlar o registro de treino e
// gamificação da musculação. Clean Architecture — Hook/View.
// XP registrado no backend via useRegistrarXP (DRY).
// ============================================================
export const useMusculacao = () => {
  const { registrarXP } = useRegistrarXP();

  // Total de minutos treinados no dia
  const [minutosTreinados, setMinutosTreinados] = useState(0);

  // Grupo muscular selecionado para o treino
  const [grupoMuscular, setGrupoMuscular] = useState('Geral');

  // Protege contra duplo bônus de meta no mesmo dia
  const [metaBatida, setMetaBatida] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // Meta diária fixa de treino (60 minutos)
  const META_DIARIA = 60;

  // Percentual de progresso para a barra visual (limitado a 100%)
  const progresso = Math.min((minutosTreinados / META_DIARIA) * 100, 100);

  // ============================================================
  // FUNÇÃO: adicionarTempo
  // Incrementa os minutos treinados e registra XP no backend.
  // Bônus de meta concedido apenas uma vez por sessão (flag metaBatida).
  // Princípio Security by Design: o servidor decide o valor do XP,
  // não o cliente.
  // ============================================================
  const adicionarTempo = async (minutos: number) => {
    try {
      setLoading(true);

      const novoTotal = minutosTreinados + minutos;
      setMinutosTreinados(novoTotal);

      // Registra XP pelo incremento de treino
      await registrarXP(MOTIVOS_XP.MUSCULACAO);

      // Verifica se bateu a meta agora e ainda não ganhou o bônus
      if (novoTotal >= META_DIARIA && !metaBatida) {
        setMetaBatida(true);

        const bonusSucesso = await registrarXP(MOTIVOS_XP.META_MUSCULACAO);

        if (bonusSucesso) {
          Alert.alert(
            "Missão Cumprida! 💪",
            "Você atingiu sua meta de treino de hoje! Bônus de XP registrado!"
          );
        }
      }

    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível registrar o XP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Reset manual — útil para testes e simulação de novo dia
  const handleReset = () => {
    setMinutosTreinados(0);
    setMetaBatida(false);
  };

  return {
    minutosTreinados,
    META_DIARIA,
    grupoMuscular,
    progresso,
    loading,
    metaBatida,
    adicionarTempo,
    setGrupoMuscular,
    handleReset,
  };
};