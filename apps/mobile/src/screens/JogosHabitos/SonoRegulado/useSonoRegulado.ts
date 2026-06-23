import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP, MotivoXP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useSonoRegulado
// Responsabilidade: controlar o registro de horas de sono e
// registrar XP no backend ao atingir a meta diária.
// Clean Architecture — padrão Hook/View (Martin, 2017).
// ============================================================
export const useSonoRegulado = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Total de horas de sono registradas
  const [horasSono, setHorasSono] = useState(0);

  // Protege contra duplo bônus de meta no mesmo dia
  const [metaBatida, setMetaBatida] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // Meta diária recomendada pela literatura científica
  // (Walker, "Why We Sleep", 2017 — 8h para adultos)
  const META_DIARIA = 8;

  // Percentual de progresso para a barra visual (limitado a 100%)
  const progresso = Math.min((horasSono / META_DIARIA) * 100, 100);

  // ============================================================
  // FUNÇÃO: adicionarHoras
  // Incrementa as horas de sono e registra XP ao bater a meta.
  // Limite de 24h garante integridade dos dados (invariante de domínio).
  // Bônus concedido apenas uma vez por sessão via flag metaBatida.
  // ============================================================
  const adicionarHoras = async (quantidade: number) => {
    const novoTotal = horasSono + quantidade;

    // Invariante de domínio: limite máximo de 24h por dia
    if (novoTotal > 24) {
      Alert.alert("Aviso", "O dia possui apenas 24 horas!");
      return;
    }

    try {
      setLoading(true);
      setHorasSono(novoTotal);

      // Verifica se bateu a meta agora e ainda não ganhou o bônus
      if (novoTotal >= META_DIARIA && !metaBatida) {
        setMetaBatida(true);

        // Registra XP no backend — servidor decide o valor (Security by Design)
        const sucesso = await registrarXP(MOTIVOS_XP.SONO_REGULADO);

        if (sucesso) {
          Alert.alert(
            "Descanso Merecido!",
            "Você atingiu a meta ideal de sono! Seu cérebro agradece. XP registrado!"
          );
        } else {
          Alert.alert(
            "Meta atingida!",
            "Você dormiu bem, mas não foi possível registrar o XP. Verifique sua conexão."
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
    setHorasSono(0);
    setMetaBatida(false);
  };

  const handleGoBack = () => navigation.goBack();

  return {
    horasSono,
    META_DIARIA,
    progresso,
    loading,
    metaBatida,
    adicionarHoras,
    handleReset,
    handleGoBack,
  };
};