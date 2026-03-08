// Importa o React e o hook useState para gerenciar estados locais (como os textos dos inputs)
import React, { useState } from 'react';
// Importa componentes visuais do React Native
import {
  View, // Container básico (como uma div)
  Text, // Para exibir texto
  SafeAreaView, // Garante que o conteúdo não fique sob a barra de status/notch
  ScrollView, // Permite rolar a tela verticalmente
  Image, // Para exibir imagens
  Alert, // Para exibir popups de alerta nativos
  KeyboardAvoidingView, // Ajusta o layout quando o teclado aparece
  Platform, // Para detectar se é iOS ou Android
} from 'react-native';
// Importa o hook de navegação para voltar telas
import { useNavigation } from '@react-navigation/native';
// Importa os estilos definidos externamente
import { styles } from './ler.styles';

// Componentes customizados reutilizáveis
import { Header } from '../../../components/Header';
import { CustomInput } from '../../../components/CustomInput';
import { CustomButton } from '../../../components/CustomButton';

// Importa a imagem de ilustração (ignorando verificação de tipo do TS)
// @ts-ignore
import imgLeitura from '../../../../assets/leitura.png';

// Define a estrutura de dados (interface) para um item do histórico de leitura
interface ReadingEntry {
  id: string;        // Identificador único
  bookName: string;  // Nome do livro
  pages: number;     // Número de páginas lidas
  note: string;      // Anotação ou reflexão
  date: string;      // Data da leitura
}

// Componente principal da tela de Leitura
export default function ReadingScreen() {
  // Inicializa o hook de navegação
  const navigation = useNavigation();

  // --- Estados do Formulário (controlam os inputs) ---
  const [bookName, setBookName] = useState(''); // Nome do livro digitado
  const [pagesRead, setPagesRead] = useState(''); // Páginas lidas (string para input)
  const [note, setNote] = useState(''); // Nota opcional

  // --- Estados de Dados (armazenam as informações do usuário) ---
  // Contador total de páginas no mês (inicia com um valor simulado de 120)
  const [totalMonthPages, setTotalMonthPages] = useState(120); 
  
  // Lista de histórico de leituras (inicia com dados mockados para demonstração)
  const [history, setHistory] = useState<ReadingEntry[]>([
    { id: '1', bookName: 'O Poder do Hábito', pages: 15, note: 'Gatilho, rotina e recompensa. Conceito chave.', date: 'Ontem' },
    { id: '2', bookName: '1984', pages: 30, note: 'A parte sobre a novilíngua é assustadora.', date: '28/11' }
  ]);

  // Função para processar o registro de uma nova leitura
  const handleAddReading = () => {
    // Validação: Verifica se os campos obrigatórios estão preenchidos
    if (!bookName || !pagesRead) {
      Alert.alert("Ops!", "Preencha o nome do livro e a quantidade de páginas.");
      return;
    }

    // Converte a string de páginas para número inteiro
    const pages = parseInt(pagesRead);
    // Validação: Verifica se é um número válido e maior que zero
    if (isNaN(pages) || pages <= 0) {
      Alert.alert("Erro", "Quantidade de páginas inválida.");
      return;
    }

    // Cria um novo objeto com os dados da leitura
    const newEntry: ReadingEntry = {
      id: Math.random().toString(), // Gera um ID aleatório simples
      bookName,
      pages,
      note: note || 'Sem nota adicionada.', // Texto padrão se não houver nota
      date: 'Hoje' // Em um app real, usaria new Date() formatado
    };

    // Atualiza o estado do histórico, adicionando o novo item no início da lista
    setHistory([newEntry, ...history]);
    // Atualiza o total de páginas somando as novas páginas
    setTotalMonthPages(prev => prev + pages);
    
    // Limpa os campos do formulário para a próxima entrada
    setBookName('');
    setPagesRead('');
    setNote('');

    // Feedback de sucesso para o usuário
    Alert.alert("Sucesso!", `Você leu ${pages} páginas de "${bookName}". Continue assim!`);
  };

  return (
    // SafeAreaView protege contra entalhes e barras do sistema
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView empurra o conteúdo para cima no iOS para o teclado não cobrir os inputs */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* ScrollView permite rolar a tela se o conteúdo for extenso */}
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Cabeçalho padrão do app */}
          <Header />

          {/* Cartão principal branco que envolve todo o conteúdo */}
          <View style={styles.mainCard}>
            <View style={styles.contentContainer}>
              
              {/* Cabeçalho da seção com Ícone e Título */}
              <View style={styles.titleRow}>
                <Image source={imgLeitura} style={styles.iconImage} resizeMode="contain" />
                <Text style={styles.title}>Clube do Livro</Text>
              </View>
              
              <Text style={styles.subtitle}>
                Acompanhe seu progresso e guarde seus aprendizados.
              </Text>

              {/* Bloco de estatística (Contador de páginas) */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsValue}>{totalMonthPages}</Text>
                <Text style={styles.statsLabel}>Páginas lidas este mês</Text>
              </View>

              {/* --- Formulário de Registro --- */}
              <Text style={styles.sectionTitle}>Registrar Leitura</Text>
              
              <View style={styles.inputContainer}>
                {/* Input para o nome do livro */}
                <CustomInput 
                  label="Nome do Livro"
                  placeholder="Ex: Dom Casmurro"
                  value={bookName}
                  onChangeText={setBookName}
                />
                
                {/* Input numérico para páginas */}
                <CustomInput 
                  label="Páginas Lidas"
                  placeholder="Ex: 20"
                  keyboardType="numeric" // Abre o teclado numérico
                  value={pagesRead}
                  onChangeText={setPagesRead}
                />

                {/* Input para anotações (multilinha/textarea) */}
                <CustomInput 
                  label="Nota / Reflexão"
                  placeholder="O que você aprendeu com essa leitura?"
                  value={note}
                  onChangeText={setNote}
                  multiline={true} // Permite várias linhas
                  numberOfLines={3}
                  // Estilo extra para aumentar a altura e alinhar o texto no topo
                  style={{ height: 80, textAlignVertical: 'top', paddingTop: 10 }} 
                />
              </View>

              {/* Botão principal para salvar */}
              <CustomButton 
                title="Salvar Leitura" 
                onPress={handleAddReading} 
                variant="primary" 
              />

              {/* Linha divisória visual */}
              <View style={styles.divider} />

              {/* --- Lista de Histórico --- */}
              <Text style={styles.sectionTitle}>Últimas Leituras</Text>
              
              <View style={styles.historyList}>
                {/* Mapeia o array de histórico para renderizar cada item */}
                {history.map((item) => (
                  <View key={item.id} style={styles.historyItem}>
                    <Text style={styles.bookTitle}>{item.bookName}</Text>
                    <Text style={styles.bookPages}>📖 {item.pages} páginas • {item.date}</Text>
                    <Text style={styles.bookNote}>"{item.note}"</Text>
                  </View>
                ))}
              </View>

              {/* Botão simples para voltar à tela anterior */}
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