import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useMusculacao
// Responsabilidade: gerenciar o estado do treino de musculação,
// registrar XP e permitir meta personalizada (salva no AsyncStorage).
// ============================================================
export const useMusculacao = () => {
  // ============================================================
  // NAVEGAÇÃO (para voltar à tela de hábitos)
  // ============================================================
  const navigation = useNavigation();

  const { registrarXP } = useRegistrarXP();

  // ============================================================
  // 1. ESTADOS PRINCIPAIS
  // ============================================================

  // Total de minutos treinados no dia atual
  const [minutosTreinados, setMinutosTreinados] = useState(0);

  // Grupo muscular selecionado (ex.: Peito, Costas, etc.)
  const [grupoMuscular, setGrupoMuscular] = useState('Geral');

  // Flag que impede o bônus de meta de ser concedido mais de uma vez
  const [metaBatida, setMetaBatida] = useState(false);

  // Indicador de carregamento durante requisições
  const [loading, setLoading] = useState(false);

  // ============================================================
  // 2. META PERSONALIZADA (persistente)
  // ============================================================

  // Valor da meta em minutos (inicia em 60)
  const [metaMinutos, setMetaMinutos] = useState(60);

  // Valor do campo de texto (string) para edição da meta
  const [metaInput, setMetaInput] = useState('60');

  // ============================================================
  // 3. CARREGAR A META SALVA (ao iniciar)
  // ============================================================
  const carregarMeta = async () => {
    try {
      const metaSalva = await AsyncStorage.getItem('@Apollo:metaMusculacao');
      if (metaSalva) {
        const meta = parseInt(metaSalva);
        if (!isNaN(meta) && meta > 0) {
          setMetaMinutos(meta);
          setMetaInput(String(meta));
        }
      }
    } catch (error) {
      console.error('[useMusculacao] Erro ao carregar meta:', error);
    }
  };

  // Executa ao montar o hook
  useEffect(() => {
    carregarMeta();
  }, []);

  // ============================================================
  // 4. SALVAR NOVA META (AsyncStorage)
  // ============================================================
  const salvarMeta = async (novoValor: string) => {
    const meta = parseInt(novoValor);
    if (isNaN(meta) || meta <= 0) {
      Alert.alert('Erro', 'Digite um valor válido (mínimo 1 minuto).');
      return;
    }

    try {
      await AsyncStorage.setItem('@Apollo:metaMusculacao', String(meta));
      setMetaMinutos(meta);
      setMetaInput(String(meta));
      Alert.alert('Sucesso', `Meta atualizada para ${meta} minutos!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    }
  };

  // ============================================================
  // 5. PROGRESSO DA BARRA (baseado na meta personalizada)
  // ============================================================
  const progresso = Math.min((minutosTreinados / metaMinutos) * 100, 100);

  // ============================================================
  // 6. ADICIONAR TEMPO DE TREINO (com bônus)
  // ============================================================
  const adicionarTempo = async (minutos: number) => {
    try {
      setLoading(true);

      const novoTotal = minutosTreinados + minutos;
      setMinutosTreinados(novoTotal);

      // 6.1. Registra XP pelo treino (silenciosamente)
      const resultado = await registrarXP(MOTIVOS_XP.MUSCULACAO);
      if (!resultado.sucesso) {
        console.warn('[useMusculacao] Falha ao registrar XP de treino:', resultado);
      }

      // 6.2. Verifica se a meta personalizada foi batida agora
      if (novoTotal >= metaMinutos && !metaBatida) {
        setMetaBatida(true);

        // 6.3. Concede o bônus de meta (+50 XP) e exibe alerta
        const bonusResultado = await registrarXP(MOTIVOS_XP.META_MUSCULACAO);

        if (bonusResultado.sucesso) {
          Alert.alert(
            'Missão Cumprida!',
            `Você atingiu sua meta de ${metaMinutos} minutos de treino hoje! +${bonusResultado.xp_ganho} XP de bônus!`
          );
        } else {
          Alert.alert(
            'Aviso',
            'Meta atingida, mas não foi possível registrar o bônus. Verifique sua conexão.'
          );
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível registrar o XP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 7. RESET (para testes ou novo dia)
  // ============================================================
  const handleReset = () => {
    setMinutosTreinados(0);
    setMetaBatida(false);
  };

  // ============================================================
  // 8. NAVEGAÇÃO: voltar para a tela de hábitos
  // ============================================================
  const handleGoBack = () => navigation.goBack();

  // ============================================================
  // 9. RETORNO DOS DADOS E FUNÇÕES
  // ============================================================
  return {
    minutosTreinados,
    metaMinutos,
    metaInput,
    setMetaInput,
    salvarMeta,
    grupoMuscular,
    progresso,
    loading,
    metaBatida,
    adicionarTempo,
    setGrupoMuscular,
    handleReset,
    handleGoBack,
  };
};