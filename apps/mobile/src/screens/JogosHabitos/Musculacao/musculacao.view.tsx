import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { styles } from './musculacao.styles';
import { Header } from '../../../components/Header';
import { useMusculacao } from './useMusculacao';

// @ts-ignore
import imgMusculacao from '../../../../assets/musculacao.png';

type MusculacaoViewProps = ReturnType<typeof useMusculacao>;

export const MusculacaoView: React.FC<MusculacaoViewProps> = ({
  minutosTreinados,
  metaMinutos,
  metaInput,
  setMetaInput,
  salvarMeta,
  grupoMuscular,
  progresso,
  adicionarTempo,
  setGrupoMuscular,
  handleReset,
  handleGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <Header />

        {/* ============================================================
            BOTÃO: Voltar para Hábitos (cor azul padrão)
            ============================================================ */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        <View style={styles.mainCard}>
          <Image source={imgMusculacao} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Musculação</Text>
          <Text style={styles.subtitle}>"O corpo alcança o que a mente acredita."</Text>

          {/* Edição da meta */}
          <View style={styles.metaContainer}>
            <Text style={styles.metaLabel}>Meta diária (minutos):</Text>
            <View style={styles.metaRow}>
              <TextInput
                style={styles.metaInput}
                keyboardType="numeric"
                value={metaInput}
                onChangeText={setMetaInput}
                placeholder="60"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.metaButton} onPress={() => salvarMeta(metaInput)}>
                <Text style={styles.metaButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.metaAtual}>Meta atual: {metaMinutos} min</Text>
          </View>

          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progresso Diário</Text>
              <Text style={styles.progressValue}>{minutosTreinados} / {metaMinutos} min</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
            {minutosTreinados >= metaMinutos && (
              <Text style={styles.metaAlcancada}>Meta diária alcançada!</Text>
            )}
          </View>
        </View>

        {/* Grupo muscular */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Foco de Hoje:</Text>
          <View style={styles.chipContainer}>
            {['Peito', 'Costas', 'Pernas', 'Braços', 'Geral'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, grupoMuscular === item && styles.chipActive]}
                onPress={() => setGrupoMuscular(item)}
              >
                <Text style={[styles.chipText, grupoMuscular === item && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botões de tempo */}
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

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Zerar Treino</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};