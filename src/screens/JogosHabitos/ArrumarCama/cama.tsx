// Importa o React e o hook useState para controlar se a tarefa foi concluída.
import React, { useState } from 'react';
// Importa os componentes do React Native para a interface.
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
// Importa os estilos específicos desta tela.
import { styles } from './cama.styles';
// Hook para navegação.
import { useNavigation } from '@react-navigation/native';
// Componente de cabeçalho padrão.
import { Header } from '../../../components/Header';

// @ts-ignore - Importa a imagem da cama.
import imgCama from '../../../../assets/cama.png';

export default function ArrumarCamaScreen() {
  // Inicializa o hook de navegação.
  const navigation = useNavigation();
  
  // Estado booleano para saber se a cama já foi arrumada hoje.
  const [estaArrumada, setEstaArrumada] = useState(false);

  // Função para confirmar a ação.
  const handleCheckIn = () => {
    if (!estaArrumada) {
      setEstaArrumada(true);
      Alert.alert("Organizado!", "Sua primeira vitória do dia! Quarto organizado, mente organizada. +50 XP");
    } else {
      Alert.alert("Aviso", "Você já concluiu este hábito hoje!");
    }
  };

  return (
    // Área segura da tela.
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do app. */}
        <Header />

        {/* Botão para voltar. */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal. */}
        <View style={styles.mainCard}>
          <Image 
            source={imgCama} 
            style={[styles.iconHeader, estaArrumada && { opacity: 0.5 }]} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>Arrumar a Cama</Text>
          <Text style={styles.subtitle}>"Se você quer mudar o mundo, comece arrumando a sua cama."</Text>

          {/* Status visual do hábito. */}
          <View style={styles.statusBadge}>
             <Text style={[styles.statusText, { color: estaArrumada ? '#059669' : '#DC2626' }]}>
               {estaArrumada ? "✓ CONCLUÍDO HOJE" : "○ PENDENTE"}
             </Text>
          </View>
        </View>

        {/* Botão de Ação Única. */}
        <TouchableOpacity 
          style={[styles.actionButton, estaArrumada ? styles.buttonDone : styles.buttonActive]} 
          onPress={handleCheckIn}
          disabled={estaArrumada}
        >
          <Text style={styles.actionButtonText}>
            {estaArrumada ? "Cama Arrumada!" : "Marcar como Arrumada"}
          </Text>
        </TouchableOpacity>

        {/* Opção para resetar (apenas para testes). */}
        {estaArrumada && (
          <TouchableOpacity style={styles.resetButton} onPress={() => setEstaArrumada(false)}>
            <Text style={styles.resetButtonText}>Zerar Status</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}