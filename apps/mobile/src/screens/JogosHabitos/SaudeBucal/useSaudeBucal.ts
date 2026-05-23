import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useSaudeBucal = () => {
  const navigation = useNavigation();

  // Estados booleanos para controlar cada etapa do checklist.
  const [escovacao, setEscovacao] = useState(false);
  const [fioDental, setFioDental] = useState(false);
  const [enxaguante, setEnxaguante] = useState(false);

  const alternarEscovacao = () => {
    const novoValor = !escovacao;
    setEscovacao(novoValor);
    if (novoValor) {
      Alert.alert("Escovagem Concluída!", "Dentes limpos e protegidos. Ganhou +20 XP!");
    }
  };

  const alternarFioDental = () => {
    const novoValor = !fioDental;
    setFioDental(novoValor);
    if (novoValor) {
      Alert.alert("Fio Dental!", "Gengivas saudáveis e livres de impurezas. Ganhou +15 XP!");
    }
  };

  const alternarEnxaguante = () => {
    const novoValor = !enxaguante;
    setEnxaguante(novoValor);
    if (novoValor) {
      Alert.alert("Enxaguante Bucal!", "Hálito fresco e proteção extra ativada. Ganhou +15 XP!");
    }
  };

  const verificarRotinaCompleta = () => {
    if (escovacao && fioDental && enxaguante) {
      Alert.alert("Sorriso Perfeito!", "Parabéns! Completou a rotina diária de higiene oral com sucesso! Bónus de +50 XP adicionado.");
    } else {
      Alert.alert("Aviso", "Ainda faltam etapas para completar a sua rotina de saúde oral hoje!");
    }
  };

  const handleReset = () => {
    setEscovacao(false);
    setFioDental(false);
    setEnxaguante(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    escovacao,
    fioDental,
    enxaguante,
    alternarEscovacao,
    alternarFioDental,
    alternarEnxaguante,
    verificarRotinaCompleta,
    handleReset,
    handleGoBack,
  };
};