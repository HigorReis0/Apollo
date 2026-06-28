import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useCorrida
// Responsabilidade: controlar o estado e lógica da tela
// de corrida. Segue Clean Architecture — padrão Hook/View.
// XP registrado no backend via useRegistrarXP (DRY).
// ============================================================
export const useCorrida = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // ============================================================
  // 1. ESTADOS PRINCIPAIS
  // ============================================================

  // Distância acumulada no dia (em km)
  const [distancia, setDistancia] = useState(0);

  // Controla se o bônus de meta já foi concedido (evita duplicidade)
  const [metaBatida, setMetaBatida] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // ============================================================
  // 2. META PERSONALIZADA (persistente)
  // ============================================================

  // Valor da meta em quilômetros (inicia em 5.0)
  const [metaDistancia, setMetaDistancia] = useState(5.0);

  // Valor do campo de texto (string) para edição da meta
  const [metaInput, setMetaInput] = useState('5.0');

  // ============================================================
  // 3. CARREGAR A META SALVA (ao iniciar)
  // ============================================================
  const carregarMeta = async () => {
    try {
      const metaSalva = await AsyncStorage.getItem('@Apollo:metaCorrida');
      if (metaSalva) {
        const meta = parseFloat(metaSalva);
        if (!isNaN(meta) && meta > 0) {
          setMetaDistancia(meta);
          setMetaInput(String(meta));
        }
      }
    } catch (error) {
      console.error('[useCorrida] Erro ao carregar meta:', error);
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
    const meta = parseFloat(novoValor);
    if (isNaN(meta) || meta <= 0) {
      Alert.alert('Erro', 'Digite um valor válido (mínimo 0.5 km).');
      return;
    }

    try {
      await AsyncStorage.setItem('@Apollo:metaCorrida', String(meta));
      setMetaDistancia(meta);
      setMetaInput(String(meta));
      Alert.alert('Sucesso', `Meta atualizada para ${meta} km!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    }
  };

  // ============================================================
  // 5. PROGRESSO DA BARRA (baseado na meta personalizada)
  // ============================================================
  const progresso = Math.min((distancia / metaDistancia) * 100, 100);

  // ============================================================
  // 6. ADICIONAR DISTÂNCIA (com bônus)
  // ============================================================
  const adicionarDistancia = async (km: number) => {
    try {
      setLoading(true);

      const novoTotal = Number((distancia + km).toFixed(1));
      setDistancia(novoTotal);

      // 6.1. Registra XP pelo registro de corrida (silenciosamente)
      await registrarXP(MOTIVOS_XP.CORRIDA);

      // 6.2. Verifica se a meta personalizada foi batida agora
      if (novoTotal >= metaDistancia && !metaBatida) {
        setMetaBatida(true);

        // 6.3. Concede o bônus de meta (+50 XP) e captura o valor
        const bonusResultado = await registrarXP(MOTIVOS_XP.META_CORRIDA);

        if (bonusResultado.sucesso) {
          Alert.alert(
            'Meta Alcançada!',
            `Você completou seus ${metaDistancia} km de hoje! +${bonusResultado.xp_ganho} XP de bônus!`
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
  // 7. NAVEGAÇÃO E RESET
  // ============================================================

  const handleGoBack = () => navigation.goBack();

  // Reset manual — útil para testes e simulação de novo dia
  const handleReset = () => {
    setDistancia(0);
    setMetaBatida(false);
  };

  // ============================================================
  // 8. RETORNO DOS DADOS E FUNÇÕES
  // ============================================================
  return {
    distancia,
    metaDistancia,
    metaInput,
    setMetaInput,
    salvarMeta,
    progresso,
    loading,
    metaBatida,
    adicionarDistancia,
    handleGoBack,
    handleReset,
  };
};