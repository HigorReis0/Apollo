import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { styles } from './cama.styles';
import { Header } from '../../../components/Header';
import { useCama } from './useCama';

// @ts-ignore
import imgCama from '../../../../assets/cama.png';

// Tipagem extraída dinamicamente do Hook corporativo
type CamaViewProps = ReturnType<typeof useCama>;

export const CamaView: React.FC<CamaViewProps> = ({
  estaArrumada,
  handleCheckIn,
  handleGoBack,
  handleReset,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do app */}
        <Header />

        {/* Botão para voltar */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal */}
        <View style={styles.mainCard}>
          <Image 
            source={imgCama} 
            style={[styles.iconHeader, estaArrumada && { opacity: 0.5 }]} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>Arrumar a Cama</Text>
          <Text style={styles.subtitle}>"Se você quer mudar o mundo, comece arrumando a sua cama."</Text>

          {/* Status visual do hábito */}
          <View style={styles.statusBadge}>
             <Text style={[styles.statusText, { color: estaArrumada ? '#059669' : '#DC2626' }]}>
               {estaArrumada ? "CONCLUÍDO HOJE" : "○ PENDENTE"}
             </Text>
          </View>
        </View>

        {/* Botão de Ação Única */}
        <TouchableOpacity 
          style={[styles.actionButton, estaArrumada ? styles.buttonDone : styles.buttonActive]} 
          onPress={handleCheckIn}
          disabled={estaArrumada}
        >
          <Text style={styles.actionButtonText}>
            {estaArrumada ? "Cama Arrumada!" : "Marcar como Arrumada"}
          </Text>
        </TouchableOpacity>

        {/* Opção para resetar (apenas para testes) */}
        {estaArrumada && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Zerar Status</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};