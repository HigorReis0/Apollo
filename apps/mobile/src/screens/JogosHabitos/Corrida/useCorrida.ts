import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useCorrida = () => {
  const navigation = useNavigation();
  
  // Estado que armazena a distância percorrida (inicia em 0 km).
  const [distancia, setDistancia] = useState(0);
  
  // Define a meta diária para o hábito (5 quilômetros).
  const META_DIARIA = 5.0; 

  // Calcula a porcentagem do progresso para a largura da barra visual.
  const progresso = (distancia / META_DIARIA) * 100;

  // Função disparada ao clicar nos botões de incremento de distância.
  const adicionarDistancia = (km: number) => {
    // Calcula o novo total garantindo precisão de uma casa decimal.
    const novoTotal = Number((distancia + km).toFixed(1)); 
    setDistancia(novoTotal); // Atualiza o estado.

    // Verifica se o usuário atingiu ou ultrapassou a meta agora.
    if (novoTotal >= META_DIARIA && distancia < META_DIARIA) {
      Alert.alert("Meta Alcançada!", "Você completou seus 5km de hoje! +150 XP");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    setDistancia(0);
  };

  return {
    distancia,
    META_DIARIA,
    progresso,
    adicionarDistancia,
    handleGoBack,
    handleReset,
  };
};