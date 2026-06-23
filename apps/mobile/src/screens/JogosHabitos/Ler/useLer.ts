import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// INTERFACES
// ============================================================

// Representa uma entrada de leitura vinda do backend
export interface ReadingEntry {
  id_leitura: number;
  nome_livro: string;
  paginas_lidas: number;
  nota: string;
  data_registro: string;
}

// ============================================================
// HOOK: useLer
// Responsabilidade: controlar o registro de leitura e
// persistir os dados no backend via API REST.
// Substitui dados hardcoded por Single Source of Truth
// (dados reais do PostgreSQL via Sequelize ORM).
// ============================================================
export const useLer = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // --- Estados do formulário ---
  const [bookName, setBookName]   = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [note, setNote]           = useState('');

  // --- Estados de dados ---
  const [totalMonthPages, setTotalMonthPages] = useState(0); // Total real do banco
  const [history, setHistory]                 = useState<ReadingEntry[]>([]);
  const [loading, setLoading]                 = useState(false);

  // ============================================================
  // FUNÇÃO: carregarHistorico
  // Busca o histórico real de leituras do usuário no backend.
  // Single Source of Truth — elimina dados hardcoded.
  // ============================================================
  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leitura/historico');
      setHistory(res.data.registros);
      setTotalMonthPages(res.data.total_paginas_mes);
    } catch (error: any) {
      console.error(
        '[useLer] Erro ao carregar histórico:',
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao montar a tela (Lifecycle Hook)
  useEffect(() => {
    carregarHistorico();
  }, []);

  // ============================================================
  // FUNÇÃO: handleAddReading
  // Valida o formulário, persiste no backend e registra XP.
  // Operação em duas etapas — registro de leitura e XP são
  // chamadas separadas pois pertencem a domínios diferentes
  // (tab_leitura e tb_xp_log). Futuramente podem ser unificadas
  // em uma Transaction no backend (padrão Unit of Work — Fowler, 2002).
  // ============================================================
  const handleAddReading = async () => {
    // Validação de campos obrigatórios
    if (!bookName || !pagesRead) {
      Alert.alert("Preencha o nome do livro e a quantidade de páginas.");
      return;
    }

    const pages = parseInt(pagesRead);

    // Validação de domínio: páginas devem ser número positivo
    if (isNaN(pages) || pages <= 0) {
      Alert.alert("Erro", "Quantidade de páginas inválida.");
      return;
    }

    try {
      setLoading(true);

      // Persiste o registro de leitura no backend
      await api.post('/leitura/registrar', {
        nome_livro:    bookName,
        paginas_lidas: pages,
        nota:          note || null
      });

      // Registra XP no backend — servidor decide o valor (Security by Design)
      await registrarXP(MOTIVOS_XP.LEITURA);

      // Reseta o formulário após sucesso
      setBookName('');
      setPagesRead('');
      setNote('');

      Alert.alert(
        "Sucesso!",
        `Você leu ${pages} página(s) de "${bookName}". XP registrado!`
      );

      // Recarrega o histórico com os dados atualizados do banco
      await carregarHistorico();

    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Não foi possível registrar a leitura. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  return {
    bookName,
    setBookName,
    pagesRead,
    setPagesRead,
    note,
    setNote,
    totalMonthPages,
    history,
    loading,
    handleAddReading,
    handleGoBack,
  };
};