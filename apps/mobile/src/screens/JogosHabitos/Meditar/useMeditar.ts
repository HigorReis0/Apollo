import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useMeditar = () => {
  const navigation = useNavigation();

  // Estados para controlar o tempo restante (em segundos) e se o timer está ativo.
  const [tempoRestante, setTempoRestante] = useState(300); // 300 segundos = 5 minutos padrão
  const [isAtivo, setIsAtivo] = useState(false);

  // Effect que controla o comportamento do cronômetro regressivo.
  useEffect(() => {
    let intervalo: any = null;

    if (isAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante((tempo) => tempo - 1);
      }, 1000);
    } else if (tempoRestante === 0 && isAtivo) {
      setIsAtivo(false);
      Alert.alert("Mente em Paz", "Sua sessão de meditação foi concluída com sucesso! +100 XP");
    }

    // Limpa o intervalo ao desmontar o componente ou pausar.
    return () => clearInterval(intervalo);
  }, [isAtivo, tempoRestante]);

  // Função para formatar os segundos no padrão minuto/segundo.
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  // Altera a sessão de tempo (5, 10 ou 15 minutos).
  const selecionarDuracao = (minutos: number) => {
    setIsAtivo(false);
    setTempoRestante(minutos * 60);
  };

  const toggleTimer = () => {
    setIsAtivo(!isAtivo);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    tempoRestante,
    isAtivo,
    formatarTempo,
    selecionarDuracao,
    toggleTimer,
    handleGoBack,
  };
};