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
import { styles } from './corrida.styles';
import { Header } from '../../../components/Header';
import { useCorrida } from './useCorrida';

// @ts-ignore
import imgCorrida from '../../../../assets/correndo.png';

// Tipagem extraída automaticamente do Hook customizado
type CorridaViewProps = ReturnType<typeof useCorrida>;

export const CorridaView: React.FC<CorridaViewProps> = ({
  distancia,
  metaDistancia,
  metaInput,
  setMetaInput,
  salvarMeta,
  progresso,
  adicionarDistancia,
  handleGoBack,
  handleReset,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Renderiza o componente de cabeçalho */}
        <Header />

        {/* Link de navegação para retornar à tela anterior */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal: Exibe o ícone, título e a barra de progresso */}
        <View style={styles.mainCard}>
          <Image source={imgCorrida} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Corrida</Text>
          <Text style={styles.subtitle}>"Não importa a velocidade, o importante é não parar."</Text>

          {/* ============================================================
              SEÇÃO: EDIÇÃO DA META (personalizada)
              ============================================================ */}
          <View style={styles.metaContainer}>
            <Text style={styles.metaLabel}>Meta diária (km):</Text>
            <View style={styles.metaRow}>
              <TextInput
                style={styles.metaInput}
                keyboardType="decimal-pad"
                value={metaInput}
                onChangeText={setMetaInput}
                placeholder="5.0"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.metaButton} onPress={() => salvarMeta(metaInput)}>
                <Text style={styles.metaButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.metaAtual}>Meta atual: {metaDistancia} km</Text>
          </View>

          {/* ============================================================
              SEÇÃO: BARRA DE PROGRESSO
              ============================================================ */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progresso Diário</Text>
              <Text style={styles.progressValue}>{distancia} / {metaDistancia} km</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
            {distancia >= metaDistancia && (
              <Text style={styles.metaAlcancada}>Meta diária alcançada!</Text>
            )}
          </View>
        </View>

        {/* Grid de botões rápidos para adicionar quilometragem */}
        <View style={styles.gridButtons}>
          {[0.5, 1.0, 2.0, 5.0].map((valor) => (
            <TouchableOpacity 
              key={valor} 
              style={styles.actionButton} 
              onPress={() => adicionarDistancia(valor)}
            >
              <Text style={styles.actionButtonText}>+{valor} km</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão secundário para resetar os dados do dia */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Zerar Percurso</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};