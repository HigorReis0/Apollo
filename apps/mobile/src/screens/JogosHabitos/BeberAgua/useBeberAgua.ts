import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { api } from '../../../services/api';

// ============================================================
// TIPOS E INTERFACES
// ============================================================

// Representa um tipo de bebida disponível para seleção
export interface DrinkType {
  label: string;
  icon: any;
}

// Representa um registro individual de consumo vindo do banco
export interface HistoricoConsumo {
  id_consumo_agua: number;
  tipo_bebida: string;
  quantidade_ml: number;
  data_hora: string;
}

// ============================================================
// CONSTANTES
// ============================================================

export const META_DIARIA = 2000; // Meta diária em ml
export const VOLUMES = [150, 200, 600, 1000]; // Volumes rápidos disponíveis

// Imports das imagens dos tipos de bebida
import imgCopoAgua from '../../../../assets/copodeagua.png';
import imgRefri from '../../../../assets/refrigerantes.png';
import imgRefriZero from '../../../../assets/refrizero.png';
import imgCafe from '../../../../assets/cafe.png';
import imgSuco from '../../../../assets/agua.png';

// Lista de bebidas disponíveis para seleção
export const DRINK_TYPES: DrinkType[] = [
  { label: 'Água',      icon: imgCopoAgua  },
  { label: 'Refri',     icon: imgRefri     },
  { label: 'Refri Zero',icon: imgRefriZero },
  { label: 'Suco',      icon: imgSuco      },
  { label: 'Café',      icon: imgCafe      },
];

// ============================================================
// HOOK: useBeberAgua
// Responsável pela lógica da tela de hidratação.
// Segue o padrão Hook/View da Clean Architecture —
// mantém a View (beberAgua.tsx) livre de qualquer lógica.
// ============================================================

export const useBeberAgua = () => {

  // ---- ESTADOS ----
  const [totalConsumido, setTotalConsumido]     = useState<number>(0);   // Total em ml consumido hoje
  const [totalMeta, setTotalMeta]               = useState<number>(0);   // Percentual da meta (0-100)
  const [pontos, setPontos]                     = useState<number>(0);   // Saldo total de XP do usuário
  const [isDropdownOpen, setIsDropdownOpen]     = useState<boolean>(false);
  const [selectedDrink, setSelectedDrink]       = useState<DrinkType>(DRINK_TYPES[0]);
  const [volumeSelecionado, setVolumeSelecionado] = useState<number>(200);
  const [history, setHistory]                   = useState<HistoricoConsumo[]>([]);
  const [loading, setLoading]                   = useState<boolean>(false);

  // ============================================================
  // FUNÇÃO: carregarDadosDoServidor
  // Busca os dados atualizados do backend e sincroniza os estados.
  // Princípio Single Source of Truth: a UI sempre reflete o banco.
  // ============================================================
  const carregarDadosDoServidor = async () => {
    try {
      setLoading(true);

      // Busca o histórico de consumos do dia de hoje.
      // O backend já retorna o total_ml e o percentual calculados.
      const resAgua = await api.get('/agua/hoje');
      setHistory(resAgua.data.consumos);       // Lista de registros do dia
      setTotalConsumido(resAgua.data.total_ml); // Total em ml do dia
      setTotalMeta(resAgua.data.percentual);    // Percentual da meta (0-100)

      // Busca o saldo total de XP acumulado pelo usuário
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

  // Carrega os dados assim que a tela é montada (Lifecycle Hook)
  useEffect(() => {
    carregarDadosDoServidor();
  }, []);

  // ============================================================
  // FUNÇÃO: handleAdicionarBebida
  // Envia UMA única requisição ao backend que, atomicamente
  // (via Transaction ACID no PostgreSQL), registra o consumo
  // de água E o XP correspondente — incluindo bônus de meta.
  //
  // A lógica de negócio (quanto XP vale, se ganhou bônus, etc.)
  // vive no backend (consumoAguaController.js), não aqui.
  // Isso segue o princípio Security by Design: o cliente nunca
  // decide quanto XP recebe — o servidor decide.
  // ============================================================
  const handleAdicionarBebida = async () => {
    try {
      setLoading(true);

      // Única chamada ao backend — o controller cuida de tudo:
      // 1. INSERT em tab_consumo_agua
      // 2. INSERT em tb_xp_log (XP pelo registro)
      // 3. INSERT em tb_xp_log (bônus se meta foi batida)
      // Se qualquer passo falhar → ROLLBACK automático (nada é salvo)
      const resposta = await api.post('/agua/registrar', {
        tipo_bebida:   selectedDrink.label,
        quantidade_ml: volumeSelecionado
      });

      // Se o backend informar que a meta foi batida, exibe o alerta
      if (resposta.data.bonus_meta) {
        Alert.alert(
          "🎉 Meta Batida!",
          `Parabéns! Você atingiu sua meta diária de hidratação e ganhou +${resposta.data.bonus_meta} XP de bônus!`
        );
      }

      // Sincroniza a UI com os dados recalculados do banco
      await carregarDadosDoServidor();

    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Não foi possível registrar o consumo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- HANDLERS DE UI ----

  // Seleciona um tipo de bebida e fecha o dropdown
  const handleSelectDrink = (drink: DrinkType) => {
    setSelectedDrink(drink);
    setIsDropdownOpen(false);
  };

  // Alterna a visibilidade do dropdown de bebidas
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // ---- RETORNO DO HOOK ----
  // Expõe apenas o necessário para a View (Interface Segregation — SOLID)
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
  };
};