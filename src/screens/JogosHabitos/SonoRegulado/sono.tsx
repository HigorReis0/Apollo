// Importa o React e o hook useState para gerenciar as horas de sono registradas.
import React, { useState } from 'react';
// Importa os componentes do React Native para construção da interface.
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
// Importa os estilos específicos definidos para a tela de sono.
import { styles } from './sono.styles';
// Hook de navegação para permitir o retorno à tela de hábitos.
import { useNavigation } from '@react-navigation/native';
// Componente de cabeçalho padrão do projeto.
import { Header } from '../../../components/Header';

// @ts-ignore - Importação da imagem de sono/lua.
import imgSono from '../../../../assets/sono.png';

export default function SonoScreen() {
  // Inicializa o hook de navegação.
  const navigation = useNavigation();
  
  // Estado para armazenar a quantidade de horas de sono (inicia em 0).
  const [horasSono, setHorasSono] = useState(0);
  // Define a meta recomendada de sono (8 horas por noite).
  const META_DIARIA = 8; 

  // Cálculo da porcentagem para a barra de progresso visual.
  const progresso = (horasSono / META_DIARIA) * 100;

  // Função para adicionar horas ao registro do dia.
  const adicionarHoras = (quantidade: number) => {
    const novoTotal = horasSono + quantidade;
    
    // Limita o registro a 24 horas por motivos óbvios de lógica.
    if (novoTotal > 24) {
      Alert.alert("Aviso", "O dia possui apenas 24 horas!");
      return;
    }

    setHorasSono(novoTotal);

    // Dispara alerta de meta batida ao atingir 8 horas.
    if (novoTotal >= META_DIARIA && horasSono < META_DIARIA) {
      Alert.alert("🌙 Descanso Merecido!", "Você atingiu a meta ideal de sono! Seu cérebro agradece. +120 XP");
    }
  };

  return (
    // SafeAreaView para garantir que o conteúdo respeite os limites físicos da tela.
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Renderiza o cabeçalho do app. */}
        <Header />

        {/* Botão para voltar à tela anterior de Hábitos. */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal: Monitoramento de Sono. */}
        <View style={styles.mainCard}>
          <Image source={imgSono} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Sono Regulado</Text>
          <Text style={styles.subtitle}>"O sono é a melhor meditação para o corpo."</Text>

          {/* Container da Barra de Progresso. */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Registro de Descanso</Text>
              <Text style={styles.progressValue}>{horasSono} / {META_DIARIA}h</Text>
            </View>
            <View style={styles.progressBarBackground}>
              {/* Preenchimento da barra com base na porcentagem do estado horasSono. */}
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Grid de botões para registro rápido de horas dormidas. */}
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

        {/* Opção para zerar o contador do dia atual. */}
        <TouchableOpacity style={styles.resetButton} onPress={() => setHorasSono(0)}>
          <Text style={styles.resetButtonText}>Zerar Registro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}