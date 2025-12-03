import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { styles } from './tela_habitos.styles';

// IMPORTANTE: Importando o Header reutilizável
import { Header } from '../../components/Header';

// --- Importação das Imagens ---
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';
// @ts-ignore
import imgSono from '../../../assets/sono.png';
// @ts-ignore
import imgCama from '../../../assets/cama.png';
// @ts-ignore
import imgMeditacao from '../../../assets/meditacao.png';
// @ts-ignore
import imgDentes from '../../../assets/dentes.png';
// @ts-ignore
import imgRotina from '../../../assets/rotina.png';

type HabitsScreenProp = StackNavigationProp<RootStackParamList, 'Habitos'>;

export default function HabitsScreen() {
  const navigation = useNavigation<HabitsScreenProp>();
  
  const habitsList = [
    {
      id: 3,
      title: "Beber Água",
      image: imgAgua,
      text: "Seu cérebro é composto por 75% de água. Uma leve desidratação já é suficiente para prejudicar a atenção e memória."
    },
    {
      id: 1,
      title: "Leitura",
      image: imgLeitura,
      text: "Ler por apenas 6 minutos pode reduzir os níveis de estresse em até 68%, relaxando os músculos e o coração."
    },
    {
      id: 2,
      title: "Musculação",
      image: imgMusculacao,
      text: "O tecido muscular queima três vezes mais calorias em repouso do que a gordura, acelerando seu metabolismo basal."
    },
    {
      id: 4,
      title: "Correr",
      image: imgCorrendo,
      text: "Corredores regulares tendem a viver, em média, três anos a mais do que pessoas que não praticam corrida."
    },
    {
      id: 5,
      title: "Sono Regulado",
      image: imgSono,
      text: "Dormir e acordar no mesmo horário regula seu relógio biológico e melhora o foco e a memória."
    },
    {
      id: 6,
      title: "Arrumar a Cama",
      image: imgCama,
      text: "Começar o dia arrumando a cama cria um senso imediato de realização e organização."
    },
    {
      id: 7,
      title: "Meditar",
      image: imgMeditacao,
      text: "A meditação reduz significativamente o estresse e pode aumentar a massa cinzenta do cérebro."
    },
    {
      id: 8,
      title: "Saúde Bucal",
      image: imgDentes,
      text: "Manter a saúde bucal em dia previne não apenas cáries, mas também doenças cardíacas."
    },
    {
      id: 9,
      title: "Montar Rotina",
      image: imgRotina,
      text: "Planejar o dia seguinte antes de dormir reduz a ansiedade matinal e melhora a qualidade do sono."
    }
  ];

  const handleHabitPress = (habitTitle: string) => {
    if (habitTitle === "Beber Água") {
      navigation.navigate('BeberAgua');
    } else if (habitTitle === "Leitura") {
      // Nova Navegação
      navigation.navigate('Ler');
    } else {
      Alert.alert("Em Breve", `A funcionalidade de ${habitTitle} estará disponível em breve!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Header />

        {/* Lista de Cards */}
        {habitsList.map((habit) => (
          <TouchableOpacity 
            key={habit.id} 
            style={styles.card}
            activeOpacity={0.9} 
            onPress={() => handleHabitPress(habit.title)}
          >
            <Image 
              source={habit.image} 
              style={styles.cardImage} 
              resizeMode="contain" 
            />
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardText}>
                {habit.text}
              </Text>
            </View>
            
            <View style={styles.decorativeCurve} /> 
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}