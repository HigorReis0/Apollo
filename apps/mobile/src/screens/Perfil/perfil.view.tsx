import React from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './perfil.styles';
import { Header } from '../../components/Header';

// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

interface ProfileViewProps {
  perfil: ReturnType<typeof import('./usePerfil').usePerfil>;
}

export default function ProfileView({ perfil }: ProfileViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>
        
        {/* Seção de Identificação (Avatar + Nome + Barra de Nível) */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={imgPerfil} style={styles.avatar} />
          </View>
          
          <Text style={styles.name}>{perfil.userName}</Text>
          <Text style={styles.email}>{perfil.userEmail}</Text>

          {/* Barra de Progresso de Nível resgatada do seu código antigo */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Nível {perfil.userLevel}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: perfil.xpPercentage }]} />
            </View>
            <Text style={styles.xpText}>{perfil.currentXp} / {perfil.maxXp} XP</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={perfil.handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Cartão 1: Dados Pessoais */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          <View style={styles.dataGrid}>
            {perfil.personalData.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cartão 2: Conquistas */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {perfil.achievements.map((item, index) => (
              <View key={index} style={{ alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
                <Image source={item.icon} style={styles.achievementIcon} resizeMode="contain" />
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4B5563' }}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cartão 3: Meus Hábitos */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Meus Hábitos</Text>
          <View style={styles.habitsGrid}>
            {perfil.myHabits.map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                <Image source={habit.image} style={styles.habitImage} resizeMode="contain" />
                <Text style={styles.habitLabel}>{habit.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}