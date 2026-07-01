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
import { styles } from './meditar.styles';
import { Header } from '../../../components/Header';
import { useMeditar } from './useMeditar';

// @ts-ignore
import imgMeditacao from '../../../../assets/meditacao.png';

type MeditarViewProps = ReturnType<typeof useMeditar>;

export const MeditarView: React.FC<MeditarViewProps> = ({
  tempoRestante,
  isAtivo,
  formatarTempo,
  selecionarDuracao,
  toggleTimer,
  handleGoBack,
  inputMinutos,
  setInputMinutos,
  definirTempoPersonalizado,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Header />

        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal de Mindfulness */}
        <View style={styles.mainCard}>
          <Image source={imgMeditacao} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Meditar</Text>
          <Text style={styles.subtitle}>
            {isAtivo ? "Feche os olhos e foque na sua respiração..." : "Respire fundo e esvazie a mente."}
          </Text>

          {/* Display do Timer Digital */}
          <Text style={styles.timerText}>{formatarTempo(tempoRestante)}</Text>
        </View>

        {/* Seletores de Tempo Rápido */}
        <View style={styles.durationRow}>
          {[5, 10, 15].map((min) => (
            <TouchableOpacity 
              key={min} 
              style={[styles.durationButton, tempoRestante === min * 60 && styles.durationButtonSelected]}
              onPress={() => selecionarDuracao(min)}
            >
              <Text style={[styles.durationButtonText, tempoRestante === min * 60 && styles.durationButtonTextSelected]}>
                {min} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ============================================================
            SEÇÃO: TEMPO PERSONALIZADO
            Campo para o usuário digitar o tempo desejado em minutos.
            ============================================================ */}
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            placeholder="Digite minutos (ex.: 7)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={inputMinutos}
            onChangeText={setInputMinutos}
            editable={!isAtivo}
          />
          <TouchableOpacity
            style={[styles.customButton, !isAtivo && styles.customButtonActive]}
            onPress={definirTempoPersonalizado}
            disabled={isAtivo}
          >
            <Text style={styles.customButtonText}>Definir</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Controle Principal (Play / Pause) */}
        <TouchableOpacity 
          style={[styles.controlButton, isAtivo ? styles.buttonPause : styles.buttonStart]} 
          onPress={toggleTimer}
        >
          <Text style={styles.controlButtonText}>
            {isAtivo ? "Pausar Sessão" : "Iniciar Meditação"}
          </Text>
        </TouchableOpacity>

        {/* Reiniciar Sessão atual */}
        {!isAtivo && tempoRestante !== 300 && (
          <TouchableOpacity style={styles.resetButton} onPress={() => selecionarDuracao(5)}>
            <Text style={styles.resetButtonText}>Reiniciar para 5 min</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};