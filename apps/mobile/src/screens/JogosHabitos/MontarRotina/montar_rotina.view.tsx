import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { styles } from './montar_rotina.styles';
import { Header } from '../../../components/Header';
import { useRotina } from './useRotina';

type RotinaViewProps = ReturnType<typeof useRotina>;

export const RotinaView: React.FC<RotinaViewProps> = ({
  habitos,
  xpTotalDisponivel,
  alternarHabito,
  salvarRotina,
  handleGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Renderiza o cabeçalho oficial do Apollo */}
        <Header />

        {/* Botão de retorno para a tela anterior */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancelar e Voltar</Text>
        </TouchableOpacity>

        {/* Seção de introdução e instrução da tela */}
        <View style={styles.introCard}>
          <Text style={styles.title}>Montar Rotina</Text>
          <Text style={styles.subtitle}>Monte o seu deck diário. Ative os hábitos que irá praticar hoje.</Text>
        </View>

        {/* Bloco que lista os cartões de hábitos com os seletores */}
        <View style={styles.listContainer}>
          {habitos.map((habito) => (
            <TouchableOpacity 
              key={habito.id} 
              style={[styles.habitRow, habito.ativo ? styles.habitRowActive : styles.habitRowInactive]} 
              onPress={() => alternarHabito(habito.id)}
            >
              {/* Lado Esquerdo: Textos de identificação do hábito */}
              <View style={styles.habitInfo}>
                <Text style={styles.habitTitle}>{habito.titulo}</Text>
                <Text style={styles.habitCategory}>{habito.categoria} • +{habito.xp} XP</Text>
              </View>

              {/* Lado Direito: O Checkbox Customizado */}
              <View style={[styles.checkboxBase, habito.ativo ? styles.checkboxChecked : styles.checkboxUnchecked]}>
                {habito.ativo && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card do Rodapé: Painel resumo de recompensa projetada */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Potencial de Ganho Diário:</Text>
            <Text style={styles.summaryValue}>{xpTotalDisponivel} XP</Text>
          </View>

          {/* Botão de ação principal para gravar as alterações da rotina */}
          <TouchableOpacity style={styles.saveButton} onPress={salvarRotina}>
            <Text style={styles.saveButtonText}>Confirmar e Ativar Deck</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};