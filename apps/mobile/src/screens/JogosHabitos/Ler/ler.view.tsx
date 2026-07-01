import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

import { styles } from './ler.styles';
import { Header } from '../../../components/Header';
import { CustomInput } from '../../../components/CustomInput';
import { CustomButton } from '../../../components/CustomButton';

// @ts-ignore
import imgLeitura from '../../../../assets/leitura.png';
import { useLer } from './useLer';

// ============================================================
// TIPAGEM DA NAVEGAÇÃO
// ============================================================
type NavigationProp = StackNavigationProp<RootStackParamList, 'Ler'>;

// ============================================================
// INTERFACE DAS PROPS
// Define todos os dados e funções que o componente recebe do hook.
// ============================================================
interface LerViewProps {
  bookName: string;
  setBookName: (value: string) => void;
  author: string;               // <-- NOVO CAMPO
  setAuthor: (value: string) => void; // <-- NOVO CAMPO
  pagesRead: string;
  setPagesRead: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  totalMonthPages: number;
  history: any[];
  handleAddReading: () => void;
  handleGoBack: () => void;
}

// ============================================================
// COMPONENTE: LerView
// Renderiza a interface da tela de Leitura.
// Separação total entre lógica (hook) e UI (view).
// ============================================================
export const LerView: React.FC<LerViewProps> = ({
  bookName,
  setBookName,
  author,               
  setAuthor,            
  pagesRead,
  setPagesRead,
  note,
  setNote,
  totalMonthPages,
  history,
  handleAddReading,
  handleGoBack,
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Header />

          {/* ============================================================
              BOTÃO: Voltar para Hábitos (cor azul padrão)
              ============================================================ */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
          </TouchableOpacity>

          <View style={styles.mainCard}>
            <View style={styles.contentContainer}>

              {/* Título e ícone */}
              <View style={styles.titleRow}>
                <Image source={imgLeitura} style={styles.iconImage} resizeMode="contain" />
                <Text style={styles.title}>Clube do Livro</Text>
              </View>

              <Text style={styles.subtitle}>
                Acompanhe seu progresso e guarde seus aprendizados.
              </Text>

              {/* Estatística */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsValue}>{totalMonthPages}</Text>
                <Text style={styles.statsLabel}>Páginas lidas este mês</Text>
              </View>

              {/* Formulário */}
              <Text style={styles.sectionTitle}>Registrar Leitura</Text>

              <View style={styles.inputContainer}>
                <CustomInput
                  label="Nome do Livro"
                  placeholder="Ex: Dom Casmurro"
                  value={bookName}
                  onChangeText={setBookName}
                />

                {/* ============================================================
                    NOVO CAMPO: AUTOR
                    ============================================================ */}
                <CustomInput
                  label="Autor"
                  placeholder="Ex: Machado de Assis"
                  value={author}
                  onChangeText={setAuthor}
                />

                <CustomInput
                  label="Páginas Lidas"
                  placeholder="Ex: 20"
                  keyboardType="numeric"
                  value={pagesRead}
                  onChangeText={setPagesRead}
                />

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

              {/* ============================================================
                  SEÇÃO: ÚLTIMAS LEITURAS + BOTÃO RELATÓRIO
                  ============================================================ */}
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Últimas Leituras</Text>
                <TouchableOpacity
                  style={styles.relatorioButton}
                  onPress={() => navigation.navigate('RelatorioLeitura')}
                >
                  <Text style={styles.relatorioButtonText}>📊 Relatório</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.historyList}>
                {history && history.length > 0 ? (
                  history.map((item) => (
                    <View key={item.id_leitura} style={styles.historyItem}>
                      {/* Nome do livro */}
                      <Text style={styles.bookTitle}>
                        {item.livro?.nome_livro || 'Livro sem nome'}
                      </Text>

                      {/* Autor do livro (NOVO) */}
                      <Text style={styles.bookAuthor}>
                        {item.livro?.autor || 'Autor desconhecido'}
                      </Text>

                      {/* Páginas e data */}
                      <Text style={styles.bookPages}>
                        {item.pag_lidas} páginas • {new Date(item.data_hora).toLocaleDateString('pt-BR')}
                      </Text>

                      {/* Nota/reflexão */}
                      {item.nota_leitura ? (
                        <Text style={styles.bookNote}>"{item.nota_leitura}"</Text>
                      ) : null}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyMessage}>
                    Nenhuma leitura registrada ainda.
                  </Text>
                )}
              </View>

              <CustomButton
                title="Voltar"
                onPress={handleGoBack}
                variant="link"
                style={{ alignItems: 'center', marginTop: 20 }}
              />

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};