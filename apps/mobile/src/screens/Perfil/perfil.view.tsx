import React from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './perfil.styles';
import { Header } from '../../components/Header';
import { usePerfil } from './usePerfil';

// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

export default function ProfileView() {
  const { perfil, isLoading, error, personalData, achievements, myHabits, handleEditProfile } = usePerfil();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={() => {/* recarregar */}} style={{ marginTop: 20 }}>
            <Text style={{ color: '#6200ee' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calcula a porcentagem para a barra de progresso
  const xpPercentage = perfil && perfil.xp_proximo_nivel 
    ? `${(perfil.total_xp / perfil.xp_proximo_nivel) * 100}%` as import('react-native').DimensionValue
    : '0%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>
        
        {/* Seção de Identificação */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={perfil?.avatar_url ? { uri: perfil.avatar_url } : imgPerfil} 
              style={styles.avatar} 
            />
          </View>
          
          <Text style={styles.name}>{perfil?.nome || 'Usuário'}</Text>
          <Text style={styles.email}>{perfil?.email || ''}</Text>

          {/* Barra de Progresso de Nível */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Nível {perfil?.nivel || 'Iniciante'}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: xpPercentage }]} />
            </View>
            <Text style={styles.xpText}>
              {perfil?.total_xp ?? 0} XP 
              {perfil?.xp_proximo_nivel ? ` / ${perfil.xp_proximo_nivel} XP` : ''}
            </Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Cartão 1: Dados Pessoais */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          <View style={styles.dataGrid}>
            {personalData.map((item, index) => (
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
            {achievements.map((item, index) => (
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
            {myHabits.map((habit, index) => (
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