import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useCama
// Responsabilidade: controlar o estado e lógica da tela
// "Arrumar a Cama". Segue Clean Architecture — Hook/View.
// O XP é registrado no backend via useRegistrarXP (DRY).
// ============================================================
export const useCama = () => {
  const navigation = useNavigation();

  // Hook genérico de XP — Single Responsibility (SOLID)
  const { registrarXP } = useRegistrarXP();

  // Controla se a cama já foi arrumada hoje (evita duplo registro)
  const [estaArrumada, setEstaArrumada] = useState(false);

  // Estado de loading para desabilitar o botão durante a requisição
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: handleCheckIn
  // Registra o hábito e envia o XP ao backend atomicamente.
  // O id_motivo vem do mapa centralizado MOTIVOS_XP —
  // nunca um número hardcoded (princípio DRY).
  // ============================================================
  const handleCheckIn = async () => {
    // Impede duplo registro no mesmo dia
    if (estaArrumada) {
      Alert.alert("Aviso", "Você já concluiu este hábito hoje!");
      return;
    }

    try {
      setLoading(true);

      // Registra o XP no backend — servidor decide o valor (Security by Design)
      const sucesso = await registrarXP(MOTIVOS_XP.ARRUMAR_CAMA);

      if (sucesso) {
        setEstaArrumada(true);
        Alert.alert(
          "Organizado!",
          "Sua primeira vitória do dia! Quarto organizado, mente organizada. XP registrado!"
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível registrar o XP. Verifique sua conexão e tente novamente."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  // Reset manual — útil para testes e para simular novo dia
  const handleReset = () => setEstaArrumada(false);

  return {
    estaArrumada,
    loading,
    handleCheckIn,
    handleGoBack,
    handleReset,
  };
};