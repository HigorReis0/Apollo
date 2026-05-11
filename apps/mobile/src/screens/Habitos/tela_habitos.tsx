// Importa o React, fundamental para componentes funcionais.
import React from 'react';
// Importa componentes do React Native.
import {
  View, // Container básico.
  Text, // Exibição de texto.
  Image, // Exibição de imagens.
  SafeAreaView, // Área segura.
  ScrollView, // Rolagem.
  StatusBar, // Controle da barra de status.
  TouchableOpacity, // Botão com opacidade.
  Alert, // Popups nativos.
} from 'react-native';
// Hooks e tipos para navegação.
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Definição das rotas.
import { RootStackParamList } from '../../navigation/AppNavigator';
// Estilos específicos desta tela.
import { styles } from './tela_habitos.styles';

// Importa o cabeçalho reutilizável.
import { Header } from '../../components/Header';

// --- Importação das Imagens dos Hábitos (TS Ignore para facilitar importação direta) ---
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

// Define o tipo de navegação específico para esta tela.
type HabitsScreenProp = StackNavigationProp<RootStackParamList, 'Habitos'>;

export default function HabitsScreen() {
  // Inicializa o hook de navegação.
  const navigation = useNavigation<HabitsScreenProp>();
  
  // Lista de dados dos hábitos para renderizar os cartões dinamicamente.
  // Cada objeto contém id, título, imagem e texto descritivo.
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

  // Função para lidar com o clique em um hábito.
  const handleHabitPress = (habitTitle: string) => {
    // Redireciona para telas específicas se o hábito já foi implementado.
    if (habitTitle === "Beber Água") {
      navigation.navigate('BeberAgua');
    } else if (habitTitle === "Leitura") {
      navigation.navigate('Ler');
    } else {
      // Caso contrário, mostra um alerta informando que será implementado em breve.
      Alert.alert("Em Breve", `A funcionalidade de ${habitTitle} estará disponível em breve!`);
    }
  };

  return (
    // Área segura da tela.
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de status configurada. */}
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* ScrollView para listar todos os hábitos. */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho reutilizável com menu. */}
        <Header />

        {/* Mapeamento da lista de hábitos para criar os cartões. */}
        {habitsList.map((habit) => (
          <TouchableOpacity 
            key={habit.id} // Chave única para o React identificar o item na lista.
            style={styles.card} // Estilo do cartão.
            activeOpacity={0.9} // Opacidade ao clicar.
            onPress={() => handleHabitPress(habit.title)} // Chama a função de clique.
          >
            {/* Imagem do hábito. */}
            <Image 
              source={habit.image} 
              style={styles.cardImage} 
              resizeMode="contain" 
            />
            
            {/* Conteúdo textual do cartão. */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardText}>
                {habit.text}
              </Text>
            </View>
            
            {/* Elemento decorativo visual no canto do cartão (definido no estilo). */}
            <View style={styles.decorativeCurve} /> 
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}