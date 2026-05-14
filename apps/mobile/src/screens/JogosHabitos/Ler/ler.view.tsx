import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { styles } from './ler.styles';
import { Header } from '../../../components/Header';
import { CustomInput } from '../../../components/CustomInput';
import { CustomButton } from '../../../components/CustomButton';

// @ts-ignore
import imgLeitura from '../../../../assets/leitura.png';
import { useLer } from './useLer';

// Tipagem extraída automaticamente do Hook
type LerViewProps = ReturnType<typeof useLer>;

export const LerView: React.FC<LerViewProps> = ({
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
}) => {
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
              
              {/* Cabeçalho da Seção */}
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

              {/* Navegação */}
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