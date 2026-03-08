// Importa o React, necessário para componentes funcionais
import React from 'react';
// Importa componentes visuais do React Native
import {
  View, // Container flexível
  Text, // Exibição de texto
  Image, // Exibição de imagens
  SafeAreaView, // Área segura contra entalhes/notches
  ScrollView, // Rolagem da tela
  TouchableOpacity, // Botão com opacidade ao toque
  StatusBar, // Controle da barra de status do dispositivo
  Alert, // Popup nativo de alerta
} from 'react-native';
// Hooks e tipos para navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Definição das rotas da aplicação
import { RootStackParamList } from '../../navigation/AppNavigator';
// Importa os estilos desta tela
import { styles } from './tela_inicial.styles';

// Importação do Componente Header reutilizável
import { Header } from '../../components/Header';

// --- Importação das Imagens (Ignorando verificação de tipos do TS) ---
// @ts-ignore
import imgOvelha from '../../../assets/ovelha.png';
// @ts-ignore
import imgSeta from '../../../assets/setaHome.png';
// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// Define o tipo de navegação específico para a tela Home
type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  // Inicializa o hook de navegação
  const navigation = useNavigation<HomeScreenProp>();
  
  // Lista de hábitos para exibição dinâmica no grid
  const habits = [
    { id: 1, label: 'Beber Água', image: imgAgua },
    { id: 2, label: 'Leitura', image: imgLeitura },
    { id: 3, label: 'Musculação', image: imgMusculacao },
    { id: 4, label: 'Correr', image: imgCorrendo },
  ];

  // Função para redirecionar para a tela geral de Hábitos (via seta no topo)
  const handleHabitsRedirect = () => {
    navigation.navigate('Habitos');
  };

  // Gerencia o clique nos cards individuais de hábitos
  const handleHabitPress = (habitLabel: string) => {
    // Redireciona para telas específicas se existirem
    if (habitLabel === 'Beber Água') {
      navigation.navigate('BeberAgua');
    } else if (habitLabel === 'Leitura') {
      navigation.navigate('Ler');
    } else {
      // Caso contrário, mostra um alerta de funcionalidade futura
      Alert.alert('Em Breve', `A funcionalidade de ${habitLabel} estará disponível em breve!`);
    }
  };

  // Redireciona para a tela de Perfil ao clicar no card do usuário
  const handleProfileRedirect = () => {
    navigation.navigate('Perfil');
  };

  return (
    // Área segura da tela
    <SafeAreaView style={styles.safeArea}>
      {/* Configura a barra de status para ícones escuros e fundo claro (Android) */}
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Componente de Cabeçalho com Menu */}
        <Header />

        {/* --- Seção Hero (Destaque Principal) --- */}
        <View style={styles.heroSection}>
          {/* Título de chamada para ação */}
          <Text style={styles.heroTitle}>Vamos adotar um{'\n'}novo hábito?</Text>
          
          <View style={styles.heroContent}>
            {/* Imagem ilustrativa (Ovelha) */}
            <Image 
              source={imgOvelha} 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
            
            {/* Botão de seta para ver todos os hábitos */}
            <TouchableOpacity 
              style={styles.arrowButton} 
              activeOpacity={0.8}
              onPress={handleHabitsRedirect}
            >
              <Image 
                source={imgSeta} 
                style={styles.arrowIcon} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Container de Conteúdo Inferior --- */}
        <View style={styles.contentContainer}>
          
          {/* Card de Perfil Clicável */}
          <TouchableOpacity 
            style={styles.profileCard} 
            activeOpacity={0.9}
            onPress={handleProfileRedirect}
          >
            <Image source={imgPerfil} style={styles.cardAvatar} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardName}>Beatriz Santos</Text>
              <Text style={styles.cardBio}>
                Eu sou a Beatriz e eu acho que hábitos podem engradecer e organizar nossas vidas.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Título da seção de hábitos */}
          <Text style={styles.sectionTitle}>Meus Hábitos</Text>
          
          {/* Grid de Hábitos */}
          <View style={styles.habitsGrid}>
            {/* Mapeia a lista de hábitos para criar os botões */}
            {habits.map((habit) => (
              <TouchableOpacity 
                key={habit.id} 
                style={styles.habitItem}
                activeOpacity={0.9}
                onPress={() => handleHabitPress(habit.label)}
              >
                <Text style={styles.habitLabel}>{habit.label}</Text>
                <Image 
                  source={habit.image} 
                  style={styles.habitImage} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}