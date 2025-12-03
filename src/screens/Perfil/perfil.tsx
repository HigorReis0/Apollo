import React from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
// Puxando os estilos específicos dessa tela
import { styles } from './perfil.styles';
// Reutilizando o nosso Header que já tem o menu e a barra de progresso
import { Header } from '../../components/Header';

// --- Imagens ---
// @ts-ignore: O TS reclama de imagens, mas o RN aceita de boa
import imgPerfil from '../../../assets/imagemExemploPerfil.png';
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// --- Novas Imagens de Conquistas (Medalhas) ---
// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

export default function ProfileScreen() {
  
  // Array com os dados pessoais pra gente não ficar repetindo <Text> na mão
  // Se fosse um app real, isso viria do Backend/API
  const personalData = [
    { label: 'Data de Nascimento', value: '15/04/1995' },
    { label: 'Idade', value: '28 anos' },
    { label: 'Peso', value: '62 kg' },
    { label: 'Altura', value: '1.68 m' },
  ];

  // Lista de conquistas (Medalhas que o usuário ganhou)
  const achievements = [
    { title: '10 Dias', icon: imgDezDias },
    { title: '50 Dias', icon: imgCinquentaDias },
    { title: '100 Dias', icon: imgCemDias },
  ];

  // Lista de hábitos que aparecem no perfil (Resumo)
  const myHabits = [
    { label: 'Musculação', image: imgMusculacao },
    { label: 'Leitura', image: imgLeitura },
    { label: 'Beber Água', image: imgAgua },
    { label: 'Correr', image: imgCorrendo },
  ];

  return (
    // SafeAreaView pra garantir que não corte nada no topo (Notch)
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Adicionando um padding lateral só pro Header não grudar na borda */}
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>
        
        {/* --- Seção de Identificação (Avatar + Nome) --- */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={imgPerfil} style={styles.avatar} />
          </View>
          
          <Text style={styles.name}>Beatriz Santos</Text>
          <Text style={styles.email}>beatriz.santos@email.com</Text>

          {/* Botãozinho de editar (por enquanto só visual) */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* --- Cartão 1: Dados Pessoais --- */}
        {/* Usando o estilo 'mainCard' pra dar aquele efeito de "papel" branco flutuando */}
        <View style={styles.mainCard}>
          {/* Título agora fica DENTRO do cartão */}
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          
          {/* Grid pra organizar os dados lado a lado */}
          <View style={styles.dataGrid}>
            {personalData.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- Cartão 2: Conquistas --- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          
          {/* Lista horizontal de medalhas */}
          <View style={styles.achievementsGrid}>
            {achievements.map((item, index) => (
              // Container individual pra alinhar a medalha com o texto embaixo dela
              <View key={index} style={{ alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
                <Image 
                  source={item.icon} 
                  style={styles.achievementIcon} 
                  resizeMode="contain" 
                />
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4B5563' }}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- Cartão 3: Meus Hábitos (Resumo) --- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Meus Hábitos</Text>
          
          <View style={styles.habitsGrid}>
            {myHabits.map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                <Image 
                  source={habit.image} 
                  style={styles.habitImage} 
                  resizeMode="contain" 
                />
                <Text style={styles.habitLabel}>{habit.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}