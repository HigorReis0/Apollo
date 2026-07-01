import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';

// ============================================================
// TIPOS E INTERFACES
// ============================================================

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

// ============================================================
// CONSTANTES
// ============================================================

export const META_DIARIA = 2000;
export const VOLUMES = [150, 200, 600, 1000];

import imgCopoAgua from '../../../../assets/copodeagua.png';
import imgRefri from '../../../../assets/refrigerantes.png';
import imgRefriZero from '../../../../assets/refrizero.png';
import imgCafe from '../../../../assets/cafe.png';
import imgSuco from '../../../../assets/agua.png';

export const DRINK_TYPES: DrinkType[] = [
  { label: 'Água',      icon: imgCopoAgua  },
  { label: 'Refri',     icon: imgRefri     },
  { label: 'Refri Zero',icon: imgRefriZero },
  { label: 'Suco',      icon: imgSuco      },
  { label: 'Café',      icon: imgCafe      },
];

// ============================================================
// HOOK: useBeberAgua
// ============================================================
export const useBeberAgua = () => {
  const navigation = useNavigation();

  const [totalConsumido, setTotalConsumido]     = useState<number>(0);
  const [totalMeta, setTotalMeta]               = useState<number>(0);
  const [pontos, setPontos]                     = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen]     = useState<boolean>(false);
  const [selectedDrink, setSelectedDrink]       = useState<DrinkType>(DRINK_TYPES[0]);
  const [volumeSelecionado, setVolumeSelecionado] = useState<number>(200);
  const [history, setHistory]                   = useState<HistoricoConsumo[]>([]);
  const [loading, setLoading]                   = useState<boolean>(false);

  // ============================================================
  // FUNÇÃO: carregarDadosDoServidor
  // ============================================================
  const carregarDadosDoServidor = async () => {
    try {
      setLoading(true);

      const resAgua = await api.get('/agua/hoje');
      setHistory(resAgua.data.consumos);
      setTotalConsumido(resAgua.data.total_ml);
      setTotalMeta(resAgua.data.percentual);

      const resXp = await api.get('/xp/saldo');
      setPontos(resXp.data.xp_total);

    } catch (error: any) {
      console.error(
        "Erro ao sincronizar com a API:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados apenas na montagem da tela
  useEffect(() => {
    carregarDadosDoServidor();
  }, []);

  // ============================================================
  // FUNÇÃO: handleAdicionarBebida
  // Agora atualiza o estado local MANUALMENTE, sem recarregar do banco.
  // ============================================================
  const handleAdicionarBebida = async () => {
    try {
      setLoading(true);

      // 1. Envia a requisição para o backend (persiste no banco)
      const resposta = await api.post('/agua/registrar', {
        tipo_bebida:   selectedDrink.label,
        quantidade_ml: volumeSelecionado
      });

      // 2. Atualiza o estado local MANUALMENTE (sem recarregar do banco)
      const novoTotal = totalConsumido + volumeSelecionado;
      setTotalConsumido(novoTotal);
      setTotalMeta(Math.min((novoTotal / META_DIARIA) * 100, 100));

      // 3. Adiciona o novo consumo ao histórico local
      const novoRegistro: HistoricoConsumo = {
        id_consumo_agua: Date.now(), // ID temporário (apenas para key do map)
        tipo_bebida: selectedDrink.label,
        quantidade_ml: volumeSelecionado,
        data_hora: new Date().toISOString()
      };
      setHistory(prev => [novoRegistro, ...prev]);

      // 4. Atualiza o saldo de XP (busca do backend ou usa o retorno da API)
      if (resposta.data.xp_ganho) {
        setPontos(prev => prev + resposta.data.xp_ganho);
        Alert.alert(
          "Hidratação registrada!",
          `Você consumiu ${volumeSelecionado}ml de ${selectedDrink.label}. +${resposta.data.xp_ganho} XP!`
        );
      } else {
        Alert.alert(
          "Hidratação registrada!",
          `Você consumiu ${volumeSelecionado}ml de ${selectedDrink.label}.`
        );
      }

      // 5. Verifica se bateu a meta (localmente)
      if (novoTotal >= META_DIARIA && resposta.data.bonus_meta) {
        Alert.alert(
          "Meta Batida!",
          `Parabéns! Você atingiu sua meta diária de hidratação e ganhou +${resposta.data.bonus_meta} XP de bônus!`
        );
        setPontos(prev => prev + resposta.data.bonus_meta);
      }

    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Não foi possível registrar o consumo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: handleReset (Zerar Registro)
  // Reseta APENAS o estado local (não afeta o banco de dados)
  // ============================================================
  const handleReset = () => {
    setTotalConsumido(0);
    setHistory([]);
    setTotalMeta(0);
    // Não altera o saldo de XP (pontos) pois o banco mantém o histórico real
  };

  // ============================================================
  // HANDLERS DE UI
  // ============================================================
  const handleSelectDrink = (drink: DrinkType) => {
    setSelectedDrink(drink);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================
  const handleGoBack = () => {
    navigation.goBack();
  };

  // ============================================================
  // RETORNO
  // ============================================================
  return {
    totalConsumido,
    totalMeta,
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
    handleGoBack,
    handleReset,
  };
};