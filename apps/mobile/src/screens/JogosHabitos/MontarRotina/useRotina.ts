import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';

// ============================================================
// INTERFACES
// ============================================================

// Representa um hábito vindo do backend
export interface HabitoItem {
  id: string;
  titulo: string;
  xp: number;
  ativo: boolean;
  categoria: string;
}

// ============================================================
// HOOK: useRotina
// Responsabilidade: carregar os hábitos disponíveis do backend
// e permitir que o usuário monte sua rotina diária.
// Substitui lista hardcoded por Single Source of Truth —
// dados reais do PostgreSQL via API REST.
// ============================================================
export const useRotina = () => {
  const navigation = useNavigation();

  // Lista de hábitos disponíveis no sistema
  const [habitos, setHabitos] = useState<HabitoItem[]>([]);

  // Loading durante requisições ao backend
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: carregarHabitos
  // Busca os hábitos disponíveis do backend.
  // Single Source of Truth — elimina lista hardcoded.
  // ============================================================
  const carregarHabitos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/habitos');
      setHabitos(res.data);
    } catch (error: any) {
      console.error(
        '[useRotina] Erro ao carregar hábitos:',
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao montar a tela (Lifecycle Hook)
  useEffect(() => {
    carregarHabitos();
  }, []);

  // ============================================================
  // FUNÇÃO: alternarHabito
  // Inverte o status de ativação de um hábito pelo ID.
  // Imutabilidade do React: usa spread operator para criar
  // novo array sem mutar o estado anterior (Abramov, 2015).
  // ============================================================
  const alternarHabito = (id: string) => {
    setHabitos(prev =>
      prev.map(habito =>
        habito.id === id
          ? { ...habito, ativo: !habito.ativo }
          : habito
      )
    );
  };

  // Calcula dinamicamente o XP máximo dos hábitos ativos
  const xpTotalDisponivel = habitos.reduce(
    (acc, habito) => habito.ativo ? acc + habito.xp : acc, 0
  );

  // ============================================================
  // FUNÇÃO: salvarRotina
  // Persiste a rotina do usuário no backend.
  // Envia apenas os IDs dos hábitos ativos — payload mínimo
  // (Twelve-Factor App — III: Config).
  // ============================================================
  const salvarRotina = async () => {
    const habitosAtivos = habitos.filter(h => h.ativo);

    if (habitosAtivos.length === 0) {
      Alert.alert(
        "Aviso",
        "Selecione pelo menos um hábito para compor a sua rotina diária!"
      );
      return;
    }

    try {
      setLoading(true);

      // Envia apenas os IDs dos hábitos ativos ao backend
      await api.post('/habitos/rotina', {
        habitos_ids: habitosAtivos.map(h => h.id)
      });

      Alert.alert(
        "Rotina Pronta! 🚀",
        `Sua rotina foi salva com ${habitosAtivos.length} hábitos ativos. Meta de hoje: +${xpTotalDisponivel} XP!`,
        [{ text: "Confirmar", onPress: () => navigation.goBack() }]
      );

    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Não foi possível salvar a rotina. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  return {
    habitos,
    loading,
    xpTotalDisponivel,
    alternarHabito,
    salvarRotina,
    handleGoBack,
  };
};