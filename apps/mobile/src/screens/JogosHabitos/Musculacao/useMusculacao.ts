import { useState } from 'react';
import { Alert } from 'react-native';

export const useMusculacao = () => {
  // Estado para armazenar o total de minutos treinados no dia.
  const [minutosTreinados, setMinutosTreinados] = useState(0);
  // Define a meta diária fixa (60 minutos).
  const META_DIARIA = 60; 
  // Estado para armazenar qual grupo muscular está selecionado.
  const [grupoMuscular, setGrupoMuscular] = useState('Geral');

  // Cálculo da porcentagem do progresso para a barra visual.
  const progresso = (minutosTreinados / META_DIARIA) * 100;

  // Função disparada ao clicar nos botões de adicionar tempo.
  const adicionarTempo = (minutos: number) => {
    const novoTotal = minutosTreinados + minutos;
    setMinutosTreinados(novoTotal);

    // Verifica se o usuário atingiu a meta agora para disparar o alerta de recompensa.
    if (novoTotal >= META_DIARIA && minutosTreinados < META_DIARIA) {
      Alert.alert("Missão Cumprida!", "Você atingiu sua meta de treino de hoje! +100 XP");
    }
  };

  const handleReset = () => {
    setMinutosTreinados(0);
  };

  return {
    minutosTreinados,
    META_DIARIA,
    grupoMuscular,
    progresso,
    adicionarTempo,
    setGrupoMuscular,
    handleReset,
  };
};