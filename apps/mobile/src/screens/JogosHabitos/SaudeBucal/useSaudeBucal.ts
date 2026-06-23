import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP, MotivoXP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useSaudeBucal
// Responsabilidade: controlar o checklist de higiene oral e
// registrar XP no backend ao concluir cada etapa.
// Padrão State Machine implícito — cada etapa tem estado
// booleano independente com transição unidirecional (false → true).
// ============================================================
export const useSaudeBucal = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Estados individuais de cada etapa do checklist
  const [escovacao, setEscovacao]   = useState(false);
  const [fioDental, setFioDental]   = useState(false);
  const [enxaguante, setEnxaguante] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO GENÉRICA: registrarEtapa
  // Evita duplicação de lógica entre as 3 etapas (DRY).
  // Recebe o setter do estado, o id_motivo e a mensagem do alerta.
  // Só registra se a etapa ainda não foi concluída — transição
  // unidirecional garante idempotência da operação.
  // ============================================================
  const registrarEtapa = async (
    jaConcluido: boolean,
    setter: (v: boolean) => void,
    idMotivo: MotivoXP,
    mensagem: string
  ) => {
    // Idempotência: ignora se já foi concluído
    if (jaConcluido) return;

    try {
      setLoading(true);
      const sucesso = await registrarXP(idMotivo);

      if (sucesso) {
        setter(true);
        Alert.alert("Concluído!", mensagem);
      } else {
        Alert.alert("Erro", "Não foi possível registrar o XP. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cada alternador chama a função genérica com seus parâmetros específicos
  const alternarEscovacao = () =>
    registrarEtapa(
      escovacao,
      setEscovacao,
      MOTIVOS_XP.SAUDE_BUCAL,
      "Dentes limpos e protegidos. XP registrado!"
    );

  const alternarFioDental = () =>
    registrarEtapa(
      fioDental,
      setFioDental,
      MOTIVOS_XP.SAUDE_BUCAL,
      "Gengivas saudáveis e livres de impurezas. XP registrado!"
    );

  const alternarEnxaguante = () =>
    registrarEtapa(
      enxaguante,
      setEnxaguante,
      MOTIVOS_XP.SAUDE_BUCAL,
      "Hálito fresco e proteção extra ativada. XP registrado!"
    );

  // ============================================================
  // FUNÇÃO: verificarRotinaCompleta
  // Verifica se todas as etapas foram concluídas e registra
  // o bônus de rotina completa no backend.
  // Só concede o bônus se as 3 etapas estiverem marcadas —
  // garante integridade da regra de negócio no cliente.
  // ============================================================
  const verificarRotinaCompleta = async () => {
    if (!escovacao || !fioDental || !enxaguante) {
      Alert.alert(
        "Aviso",
        "Ainda faltam etapas para completar sua rotina de saúde oral hoje!"
      );
      return;
    }

    try {
      setLoading(true);
      const sucesso = await registrarXP(MOTIVOS_XP.SAUDE_BUCAL_COMPLETA);

      if (sucesso) {
        Alert.alert(
          "Sorriso Perfeito!",
          "Rotina completa de higiene oral concluída! Bônus de XP registrado!"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset manual — útil para testes e simulação de novo dia
  const handleReset = () => {
    setEscovacao(false);
    setFioDental(false);
    setEnxaguante(false);
  };

  const handleGoBack = () => navigation.goBack();

  return {
    escovacao,
    fioDental,
    enxaguante,
    loading,
    alternarEscovacao,
    alternarFioDental,
    alternarEnxaguante,
    verificarRotinaCompleta,
    handleReset,
    handleGoBack,
  };
};