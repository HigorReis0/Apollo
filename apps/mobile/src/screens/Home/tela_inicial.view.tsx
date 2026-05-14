import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { styles } from './tela_inicial.styles';
import { Header } from '../../components/Header';
import { HabitItem } from './useTelaInicial';

// --- Presentation Assets ---
// @ts-ignore
import imgOvelha from '../../../assets/ovelha.png';
// @ts-ignore
import imgSeta from '../../../assets/setaHome.png';
// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

interface TelaInicialViewProps {
  habits: HabitItem[];
  handleHabitsRedirect: () => void;
  handleHabitPress: (habitLabel: string) => void;
  handleProfileRedirect: () => void;
}

export const TelaInicialView: React.FC<TelaInicialViewProps> = ({
  habits,
  handleHabitsRedirect,
  handleHabitPress,
  handleProfileRedirect,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header />

        {/* Seção Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Vamos adotar um{'\n'}novo hábito?</Text>
          
          <View style={styles.heroContent}>
            <Image source={imgOvelha} style={styles.heroImage} resizeMode="contain" />
            
            <TouchableOpacity 
              style={styles.arrowButton} 
              activeOpacity={0.8}
              onPress={handleHabitsRedirect}
            >
              <Image source={imgSeta} style={styles.arrowIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Container de Conteúdo Inferior */}
        <View style={styles.contentContainer}>
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
                <Image source={habit.image} style={styles.habitImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};