// Importa o React e o hook useState para gerenciar o tempo de treino.
import React, { useState } from 'react';
// Importa os componentes básicos do React Native para interface e interação.
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
// Importa os estilos específicos definidos para esta tela.
import { styles } from './musculacao.styles';
// Componente de cabeçalho padrão do aplicativo.
import { Header } from '../../../components/Header';

// @ts-ignore - Importa a imagem do peso/musculação (ignora erro de tipagem de assets).
import imgMusculacao from '../../../../assets/musculacao.png';

export default function MusculacaoScreen() {
  // Estado para armazenar o total de minutos treinados no dia.
  const [minutosTreinados, setMinutosTreinados] = useState(0);
  // Define a meta diária fixa (ex: 60 minutos).
  const META_DIARIA = 60; 
  // Estado para armazenar qual grupo muscular está selecionado.
  const [grupoMuscular, setGrupoMuscular] = useState('Geral');

  // Cálculo da porcentagem do progresso para a barra visual.
  const progresso = (minutosTreinados / META_DIARIA) * 100;

  // Função disparada ao clicar nos botões de adicionar tempo.
  const adicionarTempo = (minutos: number) => {
    const novoTotal = minutosTreinados + minutos;
    setMinutosTreinados(novoTotal); // Atualiza o estado com o novo valor.

    // Verifica se o usuário atingiu a meta agora para disparar o alerta de recompensa.
    if (novoTotal >= META_DIARIA && minutosTreinados < META_DIARIA) {
      Alert.alert("💪 Missão Cumprida!", "Você atingiu sua meta de treino de hoje! +100 XP");
    }
  };

  return (
    // Área segura para evitar interferência com o notch do celular.
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView permite rolar a tela em aparelhos menores. */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cabeçalho reutilizável do app. */}
        <Header />

        {/* Card principal com o resumo do progresso. */}
        <View style={styles.mainCard}>
          {/* Ícone ilustrativo do hábito. */}
          <Image source={imgMusculacao} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Musculação</Text>
          <Text style={styles.subtitle}>"O corpo alcança o que a mente acredita."</Text>

          {/* Container da barra de progresso. */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progresso Diário</Text>
              {/* Exibe os valores numéricos atuais. */}
              <Text style={styles.progressValue}>{minutosTreinados} / {META_DIARIA} min</Text>
            </View>
            {/* Trilho cinza da barra. */}
            <View style={styles.progressBarBackground}>
              {/* Parte preenchida da barra (dinâmica com o estado). */}
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Card de seleção de foco/grupo muscular. */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Foco de Hoje:</Text>
          <View style={styles.chipContainer}>
            {/* Mapeia os grupos musculares para criar botões de seleção (Chips). */}
            {['Peito', 'Costas', 'Pernas', 'Braços', 'Geral'].map((item) => (
              <TouchableOpacity 
                key={item} 
                // Aplica estilo diferenciado se o chip estiver selecionado.
                style={[styles.chip, grupoMuscular === item && styles.chipActive]}
                onPress={() => setGrupoMuscular(item)}
              >
                <Text style={[styles.chipText, grupoMuscular === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grid de botões para adicionar tempo de treino de forma rápida. */}
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

        {/* Botão de suporte para zerar o progresso (Reset). */}
        <TouchableOpacity style={styles.resetButton} onPress={() => setMinutosTreinados(0)}>
          <Text style={styles.resetButtonText}>Zerar Treino</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}