// ============================================================
// IMPORTAÇÕES
// ============================================================
// useState: hook para gerenciar múltiplos estados
// useEffect: hook para ciclo de vida (executar ao montar)
import { useState, useEffect } from 'react';

// Alert: diálogo nativo do React Native
import { Alert } from 'react-native';

// useNavigation: hook para navegação entre telas
import { useNavigation } from '@react-navigation/native';

// api: cliente HTTP customizado que injeita JWT automaticamente
import { api } from '../../../services/api';

// ============================================================
// TIPOS E INTERFACES (TypeScript)
// ============================================================
// Interface para um tipo de bebida (Água, Refrigerante, etc)
export interface DrinkType {
  // Label exibido na UI (ex: "Água", "Café")
  label: string;
  // Importação da imagem/ícone para exibir visualmente
  icon: any;
}

// Interface para um registro de consumo no histórico
export interface HistoricoConsumo {
  // ID único do consumo no banco (tab_consumo_agua)
  id_consumo_agua: number;
  // Tipo de bebida consumida (ex: "Água")
  tipo_bebida: string;
  // Quantidade em mililitros (ex: 200)
  quantidade_ml: number;
  // Data/hora do registro (ISO string: "2026-06-30T15:30:00Z")
  data_hora: string;
}

// ============================================================
// CONSTANTES (Valores fixos, nunca hardcoded)
// ============================================================
// Meta diária de hidratação em mililitros (2 litros)
export const META_DIARIA = 2000;

// Array com volumes pré-configurados para atalhos rápidos
export const VOLUMES = [150, 200, 600, 1000];

// ============================================================
// IMPORTAÇÕES DE IMAGENS (Assets)
// ============================================================
// Imagens dos tipos de bebida (armazenadas em assets/)
import imgCopoAgua from '../../../../assets/copodeagua.png';
import imgRefri from '../../../../assets/refrigerantes.png';
import imgRefriZero from '../../../../assets/refrizero.png';
import imgCafe from '../../../../assets/cafe.png';
import imgSuco from '../../../../assets/agua.png';

// ============================================================
// ARRAY DE TIPOS DE BEBIDA (Constante centralizada)
// ============================================================
// Define todos os tipos de bebida disponíveis no app
// Cada tipo tem um label (texto) e um ícone (imagem)
export const DRINK_TYPES: DrinkType[] = [
  { label: 'Água',       icon: imgCopoAgua   }, // Índice 0 (padrão)
  { label: 'Refri',      icon: imgRefri      },
  { label: 'Refri Zero', icon: imgRefriZero  },
  { label: 'Suco',       icon: imgSuco       },
  { label: 'Café',       icon: imgCafe       },
];

// ============================================================
// HOOK: useBeberAgua
// ============================================================
// Responsabilidade: Gerenciar lógica da tela "Beber Água"
// Inclui: consumo diário, meta, histórico, XP
// A View (beber_agua.view.tsx) apenas renderiza baseado nesses estados
export const useBeberAgua = () => {
  
  // Hook de navegação
  const navigation = useNavigation();

  // ── ESTADO 1: Total consumido HOJE ──
  // Quantidade total em ml registrada hoje
  // Exemplo: 1800 (significa que bebeu 1800ml até agora)
  const [totalConsumido, setTotalConsumido] = useState<number>(0);
  
  // ── ESTADO 2: Percentual da meta ──
  // 0-100% (capped em 100 para não estouro visual)
  // Exemplo: 90 (significa 1800/2000 = 90%)
  const [totalMeta, setTotalMeta] = useState<number>(0);
  
  // ── ESTADO 3: Saldo de XP do usuário ──
  // Total de XP acumulado (histórico completo)
  const [pontos, setPontos] = useState<number>(0);
  
  // ── ESTADO 4: Dropdown aberto/fechado ──
  // true = lista de bebidas visível
  // false = lista escondida
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  // ── ESTADO 5: Bebida selecionada ──
  // Qual tipo de bebida está selecionado? (default: ÁGUA)
  // Exemplo: { label: "Água", icon: ... }
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>(DRINK_TYPES[0]);
  
  // ── ESTADO 6: Volume selecionado ──
  // Quantos ml vão ser consumidos? (default: 200ml)
  // Pode ser 150, 200, 600, 1000 ou customizado pelo usuário
  const [volumeSelecionado, setVolumeSelecionado] = useState<number>(200);
  
  // ── ESTADO 7: Histórico de consumos ──
  // Array com todos os consumos do dia (mais recente primeiro)
  // Usado para listar "Histórico" na UI
  const [history, setHistory] = useState<HistoricoConsumo[]>([]);
  
  // ── ESTADO 8: Loading durante requisição ──
  // true = requisição HTTP em andamento
  // false = pronto
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================================
  // FUNÇÃO: carregarDadosDoServidor
  // ============================================================
  // Responsabilidade: Buscar dados atualizados do backend
  // Chamada ao montar a tela (useEffect)
  // Faz 2 requisições: água/hoje + xp/saldo
  const carregarDadosDoServidor = async () => {
    try {
      // Ativa loading
      setLoading(true);

      // ── REQUISIÇÃO 1: GET /agua/hoje ──
      // Retorna consumos de HOJE (filtro no backend por data)
      const resAgua = await api.get('/agua/hoje');
      
      // Salva o array de consumos histórico
      setHistory(resAgua.data.consumos);
      
      // Salva o total em ml
      setTotalConsumido(resAgua.data.total_ml);
      
      // Salva o percentual da meta (já vem calculado do backend)
      setTotalMeta(resAgua.data.percentual);

      // ── REQUISIÇÃO 2: GET /xp/saldo ──
      // Retorna saldo total de XP do usuário
      const resXp = await api.get('/xp/saldo');
      
      // Salva o XP total acumulado
      setPontos(resXp.data.xp_total);

    } catch (error: any) {
      // Log do erro no console (debugging)
      console.error(
        "Erro ao sincronizar com a API:",
        error?.response?.data || error.message
      );
      // Não mostra erro visual ao usuário (falha silenciosa)
    } finally {
      // Desativa loading (sempre, seja sucesso ou erro)
      setLoading(false);
    }
  };

  // ============================================================
  // HOOK: useEffect (carrega dados ao montar)
  // ============================================================
  // Executa apenas UMA VEZ quando a tela monta
  // Array vazio [] = sem dependências
  useEffect(() => {
    carregarDadosDoServidor();
  }, []);

  // ============================================================
  // FUNÇÃO: handleAdicionarBebida
  // ============================================================
  // Responsabilidade: Registrar novo consumo de bebida
  // IMPORTANTE: Usa padrão OTIMISTA (atualiza UI antes de confirmar server)
  // Isso garante feedback imediato ao usuário (melhor UX)
  const handleAdicionarBebida = async () => {
    try {
      // Ativa loading
      setLoading(true);

      // ── PASSO 1: Envia para o backend ──
      // POST /agua/registrar { tipo_bebida: "Água", quantidade_ml: 200 }
      // Backend vai:
      //   - INSERT na tab_consumo_agua
      //   - INSERT na tab_xp_log (20 XP)
      //   - Verificar se bateu meta (2000ml?)
      //   - Se bateu, INSERT na tab_xp_log (50 XP bônus)
      // Tudo em uma TRANSACTION ACID (tudo ou nada)
      const resposta = await api.post('/agua/registrar', {
        tipo_bebida:   selectedDrink.label,        // Ex: "Água"
        quantidade_ml: volumeSelecionado            // Ex: 200
      });

      // ── PASSO 2: Atualiza estado LOCAL imediatamente ──
      // NÃO esperamos o backend retornar tudo novamente
      // Isso é padrão OTIMISTA — feedback na hora
      
      // Calcula novo total (anterior + adicionado)
      const novoTotal = totalConsumido + volumeSelecionado;
      
      // Atualiza o total consumido (ex: 1800 → 2000)
      setTotalConsumido(novoTotal);
      
      // Recalcula percentual da meta (ex: 90% → 100%)
      // Math.min(..., 100) garante que nunca passa 100%
      setTotalMeta(Math.min((novoTotal / META_DIARIA) * 100, 100));

      // ── PASSO 3: Adiciona novo consumo ao histórico LOCAL ──
      // Usa Date.now() como ID temporário (apenas para renderização)
      const novoRegistro: HistoricoConsumo = {
        id_consumo_agua: Date.now(),                    // ID temporário
        tipo_bebida: selectedDrink.label,               // "Água"
        quantidade_ml: volumeSelecionado,               // 200
        data_hora: new Date().toISOString()             // "2026-06-30T15:30:00Z"
      };
      
      // Prepend ao histórico (mais recente fica primeiro)
      setHistory(prev => [novoRegistro, ...prev]);

      // ── PASSO 4: Atualiza XP ──
      // Se o backend retornou xp_ganho, atualiza os pontos
      if (resposta.data.xp_ganho) {
        // Incrementa o saldo de XP (ex: 1000 → 1020)
        setPontos(prev => prev + resposta.data.xp_ganho);
        
        // Mostra alerta com o XP ganho
        Alert.alert(
          "Hidratação registrada!",
          `Você consumiu ${volumeSelecionado}ml de ${selectedDrink.label}. +${resposta.data.xp_ganho} XP!`
        );
      } else {
        // Se não retornou XP (erro/motivo não encontrado)
        Alert.alert(
          "Hidratação registrada!",
          `Você consumiu ${volumeSelecionado}ml de ${selectedDrink.label}.`
        );
      }

      // ── PASSO 5: Verifica se bateu a meta (BÔNUS XP) ──
      // Se o total atingiu/ultrapassou 2000ml E o backend retornou bonus_meta
      if (novoTotal >= META_DIARIA && resposta.data.bonus_meta) {
        // Mostra alerta de meta batida
        Alert.alert(
          "Meta Batida!",
          `Parabéns! Você atingiu sua meta diária de hidratação e ganhou +${resposta.data.bonus_meta} XP de bônus!`
        );
        
        // Incrementa XP com o bônus (ex: 1020 → 1070)
        setPontos(prev => prev + resposta.data.bonus_meta);
      }

    } catch (error: any) {
      // Se falhar (servidor offline, validação erro, etc)
      Alert.alert(
        "Erro",
        "Não foi possível registrar o consumo. Tente novamente."
      );
    } finally {
      // Desativa loading
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: handleReset (Zerar Registro)
  // ============================================================
  // Reseta APENAS o estado local da UI
  // NÃO afeta o banco de dados (dados continuam lá)
  // Útil para testes ou simular novo dia
  const handleReset = () => {
    // Zera o total consumido
    setTotalConsumido(0);
    
    // Limpa o histórico
    setHistory([]);
    
    // Zera o percentual
    setTotalMeta(0);
    
    // NÃO altera o saldo de XP (pontos)
    // Porque o banco mantém o histórico real
  };

  // ============================================================
  // FUNÇÕES DE INTERFACE
  // ============================================================
  
  // Seleciona uma bebida e fecha o dropdown
  const handleSelectDrink = (drink: DrinkType) => {
    setSelectedDrink(drink);       // Muda a bebida selecionada
    setIsDropdownOpen(false);      // Fecha o dropdown
  };

  // Alterna dropdown: abre se fechado, fecha se aberto
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================
  
  // Volta à tela anterior
  const handleGoBack = () => {
    navigation.goBack();
  };

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  // A View (beber_agua.view.tsx) desestrututa TODOS esses valores
  return {
    totalConsumido,              // Total consumido hoje
    totalMeta,                   // Percentual da meta (0-100%)
    pontos,                      // Saldo total de XP
    isDropdownOpen,              // Dropdown aberto?
    selectedDrink,               // Bebida selecionada
    volumeSelecionado,           // Volume selecionado
    history,                     // Histórico de consumos
    loading,                     // Carregando?
    handleAdicionarBebida,       // Registra novo consumo
    handleSelectDrink,           // Seleciona tipo de bebida
    toggleDropdown,              // Abre/fecha dropdown
    setVolumeSelecionado,        // Atualiza volume
    handleGoBack,                // Volta
    handleReset,                 // Reset (testes)
  };
};