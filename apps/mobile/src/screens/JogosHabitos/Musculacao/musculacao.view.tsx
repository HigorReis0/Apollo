import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { styles } from './musculacao.styles';
import { Header } from '../../../components/Header';
import { useMusculacao } from './useMusculacao';

// @ts-ignore
import imgMusculacao from '../../../../assets/musculacao.png';

type MusculacaoViewProps = ReturnType<typeof useMusculacao>;

export const MusculacaoView: React.FC<MusculacaoViewProps> = ({
  minutosTreinados,
  META_DIARIA,
  grupoMuscular,
  progresso,
  adicionarTempo,
  setGrupoMuscular,
  handleReset,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho reutilizável do app */}
        <Header />

        {/* Card principal com o resumo do progresso */}
        <View style={styles.mainCard}>
          <Image source={imgMusculacao} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Musculação</Text>
          <Text style={styles.subtitle}>"O corpo alcança o que a mente acredita."</Text>

          {/* Container da barra de progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progresso Diário</Text>
              <Text style={styles.progressValue}>{minutosTreinados} / {META_DIARIA} min</Text>
            </View>
            {/* Trilho cinza da barra */}
            <View style={styles.progressBarBackground}>
              {/* Parte preenchida da barra (dinâmica com o estado) */}
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Card de seleção de foco/grupo muscular */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Foco de Hoje:</Text>
          <View style={styles.chipContainer}>
            {['Peito', 'Costas', 'Pernas', 'Braços', 'Geral'].map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.chip, grupoMuscular === item && styles.chipActive]}
                onPress={() => setGrupoMuscular(item)}
              >
                <Text style={[styles.chipText, grupoMuscular === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grid de botões para adicionar tempo de treino de forma rápida */}
        <View style={styles.gridButtons}>
          {[10, 15, 30, 45].map((tempo) => (
            <TouchableOpacity 
              key={tempo} 
              style={styles.actionButton} 
              onPress={() => adicionarTempo(tempo)}
            >
              <Text style={styles.actionButtonText}>+{tempo} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de suporte para zerar o progresso */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Zerar Treino</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};