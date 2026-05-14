import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export interface ReadingEntry {
  id: string;
  bookName: string;
  pages: number;
  note: string;
  date: string;
}

export const useLer = () => {
  const navigation = useNavigation();

  // --- Estados do Formulário ---
  const [bookName, setBookName] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [note, setNote] = useState('');

  // --- Estados de Dados ---
  const [totalMonthPages, setTotalMonthPages] = useState(120);
  const [history, setHistory] = useState<ReadingEntry[]>([
    { id: '1', bookName: 'O Poder do Hábito', pages: 15, note: 'Gatilho, rotina e recompensa. Conceito chave.', date: 'Ontem' },
    { id: '2', bookName: '1984', pages: 30, note: 'A parte sobre a novilíngua é assustadora.', date: '28/11' }
  ]);

  // --- Handlers (Controladores de Ação) ---
  const handleAddReading = () => {
    if (!bookName || !pagesRead) {
      Alert.alert("Ops!", "Preencha o nome do livro e a quantidade de páginas.");
      return;
    }

    const pages = parseInt(pagesRead);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert("Erro", "Quantidade de páginas inválida.");
      return;
    }

    const newEntry: ReadingEntry = {
      id: Math.random().toString(),
      bookName,
      pages,
      note: note || 'Sem nota adicionada.',
      date: 'Hoje'
    };

    setHistory(prevHistory => [newEntry, ...prevHistory]);
    setTotalMonthPages(prev => prev + pages);
    
    // Reset do formulário
    setBookName('');
    setPagesRead('');
    setNote('');

    Alert.alert("Sucesso!", `Você leu ${pages} páginas de "${bookName}". Continue assim!`);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    bookName,
    setBookName,
    pagesRead,
    setPagesRead,
    note,
    setNote,
    totalMonthPages,
    history,
    handleAddReading,
    handleGoBack,
  };
};