import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ler.styles';

// Componentes
import { Header } from '../../../components/Header';
import { CustomInput } from '../../../components/CustomInput';
import { CustomButton } from '../../../components/CustomButton';

// Imagens
// @ts-ignore
import imgLeitura from '../../../../assets/leitura.png';

// Interface para o histórico de leitura
interface ReadingEntry {
  id: string;
  bookName: string;
  pages: number;
  note: string;
  date: string;
}

export default function ReadingScreen() {
  const navigation = useNavigation();

  // Estados do Formulário
  const [bookName, setBookName] = useState('');
  const [pagesRead, setPagesRead] = useState('');
  const [note, setNote] = useState('');

  // Estados de Dados
  const [totalMonthPages, setTotalMonthPages] = useState(120); // Começa com um valor simulado
  const [history, setHistory] = useState<ReadingEntry[]>([
    { id: '1', bookName: 'O Poder do Hábito', pages: 15, note: 'Gatilho, rotina e recompensa. Conceito chave.', date: 'Ontem' },
    { id: '2', bookName: '1984', pages: 30, note: 'A parte sobre a novilíngua é assustadora.', date: '28/11' }
  ]);

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

    // Cria nova entrada
    const newEntry: ReadingEntry = {
      id: Math.random().toString(),
      bookName,
      pages,
      note: note || 'Sem nota adicionada.',
      date: 'Hoje'
    };

    // Atualiza estados
    setHistory([newEntry, ...history]);
    setTotalMonthPages(prev => prev + pages);
    
    // Limpa formulário
    setBookName('');
    setPagesRead('');
    setNote('');

    Alert.alert("Sucesso!", `Você leu ${pages} páginas de "${bookName}". Continue assim!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <Header />

          <View style={styles.mainCard}>
            <View style={styles.contentContainer}>
              
              {/* Título com Ícone */}
              <View style={styles.titleRow}>
                <Image source={imgLeitura} style={styles.iconImage} resizeMode="contain" />
                <Text style={styles.title}>Clube do Livro</Text>
              </View>
              
              <Text style={styles.subtitle}>
                Acompanhe seu progresso e guarde seus aprendizados.
              </Text>

              {/* Contador de Destaque */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsValue}>{totalMonthPages}</Text>
                <Text style={styles.statsLabel}>Páginas lidas este mês</Text>
              </View>

              {/* Formulário de Registro */}
              <Text style={styles.sectionTitle}>Registrar Leitura</Text>
              
              <View style={styles.inputContainer}>
                <CustomInput 
                  label="Nome do Livro"
                  placeholder="Ex: Dom Casmurro"
                  value={bookName}
                  onChangeText={setBookName}
                />
                
                <CustomInput 
                  label="Páginas Lidas"
                  placeholder="Ex: 20"
                  keyboardType="numeric"
                  value={pagesRead}
                  onChangeText={setPagesRead}
                />

                {/* Campo de Nota (Personalizado com altura maior) */}
                <CustomInput 
                  label="Nota / Reflexão"
                  placeholder="O que você aprendeu com essa leitura?"
                  value={note}
                  onChangeText={setNote}
                  multiline={true}
                  numberOfLines={3}
                  style={{ height: 80, textAlignVertical: 'top', paddingTop: 10 }} 
                />
              </View>

              <CustomButton 
                title="Salvar Leitura" 
                onPress={handleAddReading} 
                variant="primary" 
              />

              <View style={styles.divider} />

              {/* Histórico */}
              <Text style={styles.sectionTitle}>Últimas Leituras</Text>
              
              <View style={styles.historyList}>
                {history.map((item) => (
                  <View key={item.id} style={styles.historyItem}>
                    <Text style={styles.bookTitle}>{item.bookName}</Text>
                    <Text style={styles.bookPages}>📖 {item.pages} páginas • {item.date}</Text>
                    <Text style={styles.bookNote}>"{item.note}"</Text>
                  </View>
                ))}
              </View>

              <CustomButton 
                title="Voltar" 
                onPress={() => navigation.goBack()} 
                variant="link" 
                style={{ alignItems: 'center', marginTop: 20 }} 
              />

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}