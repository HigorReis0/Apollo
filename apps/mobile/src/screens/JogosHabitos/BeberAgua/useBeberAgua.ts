import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { api } from '../../../../services/api';

export interface DrinkType {
  label: string;
  icon: any;
}

export interface HistoricoConsumo {
  id_consumo_agua: number;
  tipo_bebida: string;
  quantidade_ml: number;
  data_hora: string;
}

export const META_DIARIA = 2000;
export const VOLUMES = [150, 200, 600, 1000];

// IDs dos motivos cadastrados na sua tabela 'tab_motivo' do PostgreSQL
const MOTIVO_REGISTRO_AGUA = 1; 
const MOTIVO_META_BATIDA = 2;

import imgCopoAgua from '../../../../assets/copodeagua.png';
import imgRefri from '../../../../assets/refrigerantes.png';
import imgRefriZero from '../../../../assets/refrizero.png';
import imgCafe from '../../../../assets/cafe.png';
import imgSuco from '../../../../assets/agua.png';

export const DRINK_TYPES: DrinkType[] = [
  { label: 'Água', icon: imgCopoAgua },
  { label: 'Refri', icon: imgRefri },
  { label: 'Refri Zero', icon: imgRefriZero },
  { label: 'Suco', icon: imgSuco },
  { label: 'Café', icon: imgCafe },
];

export const useBeberAgua = () => {
  const [totalConsumido, setTotalConsumido] = useState<number>(0);
  const [pontos, setPontos] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>(DRINK_TYPES[0]);
  const [volumeSelecionado, setVolumeSelecionado] = useState<number>(200);
  const [history, setHistory] = useState<HistoricoConsumo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Single Source of Truth: Busca os dados reais consolidados do PostgreSQL
  const carregarDadosDoServidor = async () => {
    try {
      setLoading(true);
      
      // 1. Busca o histórico de consumos do dia de hoje (tab_consumo_agua)
      const resAgua = await api.get('/agua/hoje');
      const listaHoje: HistoricoConsumo[] = resAgua.data;
      setHistory(listaHoje);

      // Calcula a soma volumétrica em tempo de execução
      const somaMl = listaHoje.reduce((acc, curr) => acc + curr.quantidade_ml, 0);
      setTotalConsumido(somaMl);

      // 2. Busca o saldo real de XP acumulado pelo usuário (tb_xp_log)
      const resXp = await api.get('/xp/saldo');
      setPontos(resXp.data.xp_total);

    } catch (error: any) {
      console.error("Erro ao sincronizar com a API de hidratação:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao montar a tela (Lifecycle Hook)
  useEffect(() => {
    carregarDadosDoServidor();
  }, []);

  // Transação Atômica: Salva consumo e pontua a experiência se o usuário estiver logado
  const handleAdicionarBebida = async () => {
    try {
      setLoading(true);
      
      // 1. Registra a ação física na tabela 'tab_consumo_agua'
      await api.post('/agua/registrar', {
        tipo_bebida: selectedDrink.label,
        quantidade_ml: volumeSelecionado
      });

      const novoTotal = totalConsumido + volumeSelecionado;

      // 2. Registra o evento de ganho de XP na 'tb_xp_log' baseado no motivo cadastrado
      // Resgata o xp_padrao do motivo 1 (ex: 10 XP)
      await api.post('/xp/registrar', {
        id_motivo: MOTIVO_REGISTRO_AGUA,
        xp_ganho: 10 
      });

      // 3. Regra de Negócio / Gamificação: Verifica se bateu a meta nesta jogada
      if (totalConsumido < META_DIARIA && novoTotal >= META_DIARIA) {
        await api.post('/xp/registrar', {
          id_motivo: MOTIVO_META_BATIDA,
          xp_ganho: 50 // Bônus de meta batida
        });
        Alert.alert("🎉 Meta Batida!", `Parabéns! Você atingiu sua meta diária de hidratação e ganhou bônus de XP!`);
      }

      // Sincroniza a UI chamando os dados oficiais recalculados do banco
      await carregarDadosDoServidor();

    } catch (error: any) {
      Alert.alert("Erro de Integração", "Não foi possível persistir o registro no servidor.");
    } finally {
      setLoading(false);
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
    history,
    loading,
    handleAdicionarBebida,
    handleSelectDrink,
    toggleDropdown,
    setVolumeSelecionado,
  };
};