import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useSonoRegulado = () => {
  const navigation = useNavigation();
  
  // Estado para armazenar a quantidade de horas de sono.
  const [horasSono, setHorasSono] = useState(0);
  // Meta recomendada de sono (8 horas por noite).
  const META_DIARIA = 8; 

  // Cálculo da porcentagem para a barra de progresso visual.
  const progresso = (horasSono / META_DIARIA) * 100;

  // Função para adicionar horas ao registro do dia.
  const adicionarHoras = (quantidade: number) => {
    const novoTotal = horasSono + quantidade;
    
    // Limita o registro ao máximo de horas do dia.
    if (novoTotal > 24) {
      Alert.alert("Aviso", "O dia possui apenas 24 horas!");
      return;
    }

    setHorasSono(novoTotal);

    // Dispara alerta de meta batida ao atingir as 8 horas ideais.
    if (novoTotal >= META_DIARIA && horasSono < META_DIARIA) {
      Alert.alert("Descanso Merecido!", "Você atingiu a meta ideal de sono! Seu cérebro agradece. +120 XP");
    }
  };

  const handleReset = () => {
    setHorasSono(0);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    horasSono,
    META_DIARIA,
    progresso,
    adicionarHoras,
    handleReset,
    handleGoBack,
  };
};