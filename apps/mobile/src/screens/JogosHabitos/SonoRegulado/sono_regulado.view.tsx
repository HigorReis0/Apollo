import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { styles } from './sono.styles';
import { Header } from '../../../components/Header';
import { useSonoRegulado } from './useSonoRegulado';

// @ts-ignore
import imgSono from '../../../../assets/sono.png';

type SonoReguladoViewProps = ReturnType<typeof useSonoRegulado>;

export const SonoReguladoView: React.FC<SonoReguladoViewProps> = ({
  horasSono,
  META_DIARIA,
  progresso,
  adicionarHoras,
  handleReset,
  handleGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Renderiza o cabeçalho do app */}
        <Header />

        {/* Botão para voltar à tela anterior de Hábitos */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal: Monitoramento de Sono */}
        <View style={styles.mainCard}>
          <Image source={imgSono} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Sono Regulado</Text>
          <Text style={styles.subtitle}>"O sono é a melhor meditação para o corpo."</Text>

          {/* Container da Barra de Progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Registro de Descanso</Text>
              <Text style={styles.progressValue}>{horasSono} / {META_DIARIA}h</Text>
            </View>
            <View style={styles.progressBarBackground}>
              {/* Preenchimento da barra com base na porcentagem */}
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Grid de botões para registro rápido de horas dormidas */}
        <View style={styles.gridButtons}>
          {[1, 5, 8, 10].map((valor) => (
            <TouchableOpacity 
              key={valor} 
              style={styles.actionButton} 
              onPress={() => adicionarHoras(valor)}
            >
              <Text style={styles.actionButtonText}>{valor}h dormidas</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opção para zerar o contador do dia atual */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Zerar Registro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};