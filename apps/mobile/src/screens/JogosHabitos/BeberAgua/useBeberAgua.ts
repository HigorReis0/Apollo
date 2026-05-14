import { useState, useMemo } from 'react';
import { Alert } from 'react-native';

// --- Assets atrelados aos dados de domínio ---
// @ts-ignore
import imgCopoAgua from '../../../../assets/copodeagua.png';
// @ts-ignore
import imgRefri from '../../../../assets/refrigerantes.png';
// @ts-ignore
import imgRefriZero from '../../../../assets/refrizero.png';
// @ts-ignore
import imgCafe from '../../../../assets/cafe.png';
// @ts-ignore
import imgSuco from '../../../../assets/agua.png';

// Interfaces estritas para garantir previsibilidade de tipo
export interface DrinkType {
  label: string;
  icon: any;
}

// Constantes de Negócio
export const META_DIARIA = 2000;
export const VOLUMES = [150, 200, 600, 1000];
export const DRINK_TYPES: DrinkType[] = [
  { label: 'Água', icon: imgCopoAgua },
  { label: 'Refri', icon: imgRefri },
  { label: 'Refri Zero', icon: imgRefriZero },
  { label: 'Suco', icon: imgSuco },
  { label: 'Café', icon: imgCafe },
];

// Dados simulados
export const MOCK_HISTORY = [
  { date: 'Ontem', amount: 2400 },
  { date: '30/11', amount: 1800 },
  { date: '29/11', amount: 2100 },
];

export const useBeberAgua = () => {
  // --- Estados da Aplicação ---
  const [totalConsumido, setTotalConsumido] = useState(0);
  const [pontos, setPontos] = useState(120);
  const [metaBatida, setMetaBatida] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>(DRINK_TYPES[0]);
  const [volumeSelecionado, setVolumeSelecionado] = useState(200);

  // useMemo garante que este cálculo matemático só ocorra uma vez na montagem
  // (ou se MOCK_HISTORY mudar futuramente), economizando processamento.
  const average = useMemo(() => {
    return Math.round(
      MOCK_HISTORY.reduce((acc, curr) => acc + curr.amount, 0) / MOCK_HISTORY.length
    );
  }, []);

  // --- Handlers (Controladores de Ação) ---
  const handleAdicionarBebida = () => {
    const novoTotal = totalConsumido + volumeSelecionado;
    setTotalConsumido(novoTotal);
    
    // Regra de Gamificação Isolada
    if (!metaBatida && novoTotal >= META_DIARIA) {
      setMetaBatida(true);
      setPontos(prev => prev + 50);
      Alert.alert("🎉 Meta Batida!", "Parabéns! Você atingiu sua meta diária e ganhou +50 pontos!");
    }
  };

  const handleSelectDrink = (drink: DrinkType) => {
    setSelectedDrink(drink);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  return {
    totalConsumido,
    pontos,
    isDropdownOpen,
    selectedDrink,
    volumeSelecionado,
    average,
    handleAdicionarBebida,
    handleSelectDrink,
    toggleDropdown,
    setVolumeSelecionado,
  };
};