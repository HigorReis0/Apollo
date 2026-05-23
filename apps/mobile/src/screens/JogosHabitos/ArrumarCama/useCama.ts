import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useCama = () => {
  const navigation = useNavigation();
  
  // Estado booleano para saber se a cama já foi arrumada hoje.
  const [estaArrumada, setEstaArrumada] = useState(false);

  // Função para confirmar a ação.
  const handleCheckIn = () => {
    if (!estaArrumada) {
      setEstaArrumada(true);
      Alert.alert("Organizado!", "Sua primeira vitória do dia! Quarto organizado, mente organizada. +50 XP");
    } else {
      Alert.alert("Aviso", "Você já concluuiu este hábito hoje!");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    setEstaArrumada(false);
  };

  return {
    estaArrumada,
    handleCheckIn,
    handleGoBack,
    handleReset,
  };
};