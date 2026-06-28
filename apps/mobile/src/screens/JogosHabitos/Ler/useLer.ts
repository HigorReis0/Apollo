import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// INTERFACE: Define a estrutura REAL retornada pelo back-end
// O back-end retorna os dados com os seguintes campos:
// - id_leitura: número identificador
// - pag_lidas: quantidade de páginas lidas
// - nota_leitura: reflexão sobre a leitura (pode ser null)
// - data_hora: data do registro no formato ISO
// - livro: objeto com nome_livro e autor (relacionamento)
// ============================================================
export interface ReadingEntry {
  id_leitura: number;
  pag_lidas: number;
  nota_leitura: string | null;
  data_hora: string;
  livro: {
    nome_livro: string;
    autor: string | null;
  };
}

// ============================================================
// HOOK: useLer
// Responsabilidade: gerenciar estados, carregar histórico e
// registrar novas leituras, integrando com a API e o sistema de XP.
// ============================================================
export const useLer = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Estados do formulário (o que o usuário digita)
  const [bookName, setBookName] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [note, setNote] = useState('');

  // Estados de dados (vindos da API)
  const [totalMonthPages, setTotalMonthPages] = useState(0);
  const [history, setHistory] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: carregarHistorico
  // Busca no backend o histórico de leituras do usuário.
  // O backend retorna um array diretamente (não um objeto com "registros").
  // ============================================================
  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leitura/historico');

      // O retorno é um array de leituras
      const dados = res.data || [];
      setHistory(dados);

      // Calcula o total de páginas lidas no mês atual
      const now = new Date();
      const mesAtual = now.getMonth();
      const anoAtual = now.getFullYear();
      const total = dados
        .filter((item: any) => {
          const data = new Date(item.data_hora);
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        })
        .reduce((acc: number, item: any) => acc + (item.pag_lidas || 0), 0);
      setTotalMonthPages(total);
    } catch (error: any) {
      console.error('[useLer] Erro ao carregar histórico:', error?.response?.data || error.message);
      setHistory([]);
      setTotalMonthPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Carrega o histórico automaticamente ao abrir a tela
  useEffect(() => {
    carregarHistorico();
  }, []);

  // ============================================================
  // FUNÇÃO: handleAddReading
  // Valida os campos, envia os dados para a API e registra XP.
  // ============================================================
  const handleAddReading = async () => {
    // Validação: nome do livro e páginas são obrigatórios
    if (!bookName || !pagesRead) {
      Alert.alert('Preencha o nome do livro e a quantidade de páginas.');
      return;
    }

    const pages = parseInt(pagesRead);

    // Validação: páginas deve ser um número positivo
    if (isNaN(pages) || pages <= 0) {
      Alert.alert('Erro', 'Quantidade de páginas inválida.');
      return;
    }

    try {
      setLoading(true);

      // 1. Persiste o registro de leitura no backend
      await api.post('/leitura/registrar', {
        nome_livro: bookName,
        paginas_lidas: pages,
        nota: note || null
      });

      // 2. Registra o ganho de XP (motivo LEITURA) e captura o valor
      const resultado = await registrarXP(MOTIVOS_XP.LEITURA);

      // 3. Limpa o formulário
      setBookName('');
      setPagesRead('');
      setNote('');

      // 4. Feedback ao usuário (com XP ganho)
      if (resultado.sucesso) {
        Alert.alert(
          'Sucesso! 📚',
          `Você leu ${pages} página(s) de "${bookName}". +${resultado.xp_ganho} XP!`
        );
      } else {
        Alert.alert(
          'Aviso',
          'Leitura registrada, mas não foi possível registrar o XP. Verifique sua conexão.'
        );
      }

      // 5. Recarrega o histórico para mostrar os dados atualizados
      await carregarHistorico();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Não foi possível registrar a leitura. Verifique sua conexão.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Navega de volta para a tela anterior
  const handleGoBack = () => navigation.goBack();

  // ============================================================
  // Retorna todos os estados e funções para a View consumir
  // ============================================================
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