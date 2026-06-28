import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';

// ============================================================
// INTERFACES
// ============================================================

export interface HabitoItem {
  id: string;
  titulo: string;
  xp: number;
  ativo: boolean;
  categoria: string;
}

// ============================================================
// HOOK: useRotina
// ============================================================
export const useRotina = () => {
  const navigation = useNavigation();

  const [habitos, setHabitos] = useState<HabitoItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: carregarHabitos
  // ============================================================
  const carregarHabitos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/habitos');
      
      const dados = res.data.map((h: any) => ({
        id: String(h.habito_id),      // Garante que seja string
        titulo: h.nome,
        xp: h.xp_base,
        categoria: h.descricao || 'Geral',
        ativo: false
      }));

      // Remove duplicatas baseado no ID
      const uniqueMap = new Map<string, HabitoItem>();
      dados.forEach((item: HabitoItem) => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      setHabitos(Array.from(uniqueMap.values()));
    } catch (error: any) {
      console.error(
        '[useRotina] Erro ao carregar hábitos:',
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHabitos();
  }, []);

  const alternarHabito = (id: string) => {
    setHabitos(prev =>
      prev.map(habito =>
        habito.id === id
          ? { ...habito, ativo: !habito.ativo }
          : habito
      )
    );
  };

  const xpTotalDisponivel = habitos.reduce(
    (acc, habito) => habito.ativo ? acc + habito.xp : acc, 0
  );

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