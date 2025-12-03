import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './tela_inicial.styles';

// Importação do Componente Header
import { Header } from '../../components/Header';

// --- Importação das Imagens ---
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

type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();
  
  // Lista de hábitos reorganizada
  const habits = [
    { id: 1, label: 'Beber Água', image: imgAgua },
    { id: 2, label: 'Leitura', image: imgLeitura },
    { id: 3, label: 'Musculação', image: imgMusculacao },
    { id: 4, label: 'Correr', image: imgCorrendo },
  ];

  const handleHabitsRedirect = () => {
    navigation.navigate('Habitos');
  };

  // Gerencia o clique nos cards da Home
  const handleHabitPress = (habitLabel: string) => {
    if (habitLabel === 'Beber Água') {
      navigation.navigate('BeberAgua');
    } else if (habitLabel === 'Leitura') {
      navigation.navigate('Ler');
    } else {
      Alert.alert('Em Breve', `A funcionalidade de ${habitLabel} estará disponível em breve!`);
    }
  };

  // NOVA FUNÇÃO: Redireciona para o Perfil
  const handleProfileRedirect = () => {
    navigation.navigate('Perfil');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Header />

        {/* Seção Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Vamos adotar um{'\n'}novo hábito?</Text>
          
          <View style={styles.heroContent}>
            <Image 
              source={imgOvelha} 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
            
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

        <View style={styles.contentContainer}>
          
          {/* Card de Perfil (Agora Clicável) */}
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

          <Text style={styles.sectionTitle}>Meus Hábitos</Text>
          
          <View style={styles.habitsGrid}>
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