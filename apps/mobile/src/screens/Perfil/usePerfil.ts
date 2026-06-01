import { useState } from 'react';

// --- Importação das Imagens de Hábitos ---
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// --- Importação das Medalhas ---
// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

export const usePerfil = () => {
  // Simulando dados que virão do banco futuramente
  const [userName] = useState('Beatriz Santos');
  const [userEmail] = useState('beatriz.santos@email.com');
  const [userLevel] = useState(5);
  const [currentXp] = useState(1300);
  const [maxXp] = useState(2000);
  
  // Calcula dinamicamente a porcentagem da barra para o estilo inline
  const xpPercentage = `${(currentXp / maxXp) * 100}%` as import('react-native').DimensionValue;

  const personalData = [
    { label: 'Data de Nascimento', value: '15/04/1995' },
    { label: 'Idade', value: '28 anos' },
    { label: 'Peso', value: '62 kg' },
    { label: 'Altura', value: '1.68 m' },
  ];

  const achievements = [
    { title: '10 Dias', icon: imgDezDias },
    { title: '50 Dias', icon: imgCinquentaDias },
    { title: '100 Dias', icon: imgCemDias },
  ];

  const myHabits = [
    { label: 'Musculação', image: imgMusculacao },
    { label: 'Leitura', image: imgLeitura },
    { label: 'Beber Água', image: imgAgua },
    { label: 'Correr', image: imgCorrendo },
  ];

  const handleEditProfile = () => {
    // Lógica para abrir modal ou navegar para edição
    console.log('Editar Perfil clicado');
  };

  return {
    userName,
    userEmail,
    userLevel,
    currentXp,
    maxXp,
    xpPercentage,
    personalData,
    achievements,
    myHabits,
    handleEditProfile,
  };
};