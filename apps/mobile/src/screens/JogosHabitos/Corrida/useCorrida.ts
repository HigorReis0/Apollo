import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useCorrida
// Responsabilidade: controlar o estado e lógica da tela
// de corrida. Segue Clean Architecture — padrão Hook/View.
// XP registrado no backend via useRegistrarXP (DRY).
// ============================================================
export const useCorrida = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Distância acumulada no dia (em km)
  const [distancia, setDistancia] = useState(0);

  // Controla se o bônus de meta já foi concedido (evita duplicidade)
  const [metaBatida, setMetaBatida] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // Meta diária fixa de corrida
  const META_DIARIA = 5.0;

  // Percentual de progresso para a barra visual (0-100)
  const progresso = Math.min((distancia / META_DIARIA) * 100, 100);

  // ============================================================
  // FUNÇÃO: adicionarDistancia
  // Incrementa a distância percorrida e verifica se a meta
  // foi batida para conceder o bônus de XP.
  // O XP de corrida é registrado a cada incremento.
  // O bônus de meta é concedido apenas uma vez por dia.
  // ============================================================
  const adicionarDistancia = async (km: number) => {
    try {
      setLoading(true);

      const novoTotal = Number((distancia + km).toFixed(1));
      setDistancia(novoTotal);

      // Registra XP pelo registro de corrida
      await registrarXP(MOTIVOS_XP.CORRIDA);

      // Verifica se bateu a meta agora e ainda não ganhou o bônus
      if (novoTotal >= META_DIARIA && !metaBatida) {
        setMetaBatida(true);

        // Registra bônus de meta no backend
        const bonusSucesso = await registrarXP(MOTIVOS_XP.META_CORRIDA);

        if (bonusSucesso) {
          Alert.alert(
            "Meta Alcançada! 🏃",
            "Você completou seus 5km de hoje! Bônus de XP registrado!"
          );
        }
      }

    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível registrar o XP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  // Reset manual — útil para testes e simulação de novo dia
  const handleReset = () => {
    setDistancia(0);
    setMetaBatida(false);
  };

  return {
    distancia,
    META_DIARIA,
    progresso,
    loading,
    metaBatida,
    adicionarDistancia,
    handleGoBack,
    handleReset,
  };
};