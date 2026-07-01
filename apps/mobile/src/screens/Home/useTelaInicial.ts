import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { api } from '../../services/api';

// --- Data & Asset Binding ---
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export interface HabitItem {
  id: number;
  label: string;
  image: any;
}

export const useTelaInicial = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const [userName, setUserName] = useState<string>('Carregando...');
  const [userBio, setUserBio] = useState<string>('Buscando as suas informações no banco...');

  const habits: HabitItem[] = [
    { id: 1, label: 'Beber Água', image: imgAgua },
    { id: 2, label: 'Leitura', image: imgLeitura },
    { id: 3, label: 'Musculação', image: imgMusculacao },
    { id: 4, label: 'Correr', image: imgCorrendo },
  ];

  // Busca os dados reais do usuário logado no banco de dados local
  const carregarDadosUsuario = async () => {
    try {
      const resposta = await api.get('/usuarios/perfil');
      if (resposta.data && resposta.data.nome) {
        setUserName(resposta.data.nome);
        setUserBio(`Eu sou o ${resposta.data.nome} e estou focado em construir hábitos extraordinários!`);
      }
    } catch (error) {
      console.warn('[useTelaInicial] Não foi possível carregar dados do usuário. Usando padrão local.');
      setUserName('Usuário Apollo');
      setUserBio('Organize a sua rotina diária e evolua os seus hábitos!');
    }
  };

  // Garante que os dados do usuário atualizam sempre que o usuário voltar para esta tela
  useFocusEffect(
    useCallback(() => {
      carregarDadosUsuario();
    }, [])
  );

  const handleHabitsRedirect = () => {
    navigation.navigate('Habitos');
  };

  const handleHabitPress = (habitLabel: string) => {
    if (habitLabel === 'Beber Água') {
      navigation.navigate('BeberAgua');
    } else if (habitLabel === 'Leitura') {
      navigation.navigate('Ler');
    } else if (habitLabel === 'Musculação') {
      navigation.navigate('Musculacao');
    } else if (habitLabel === 'Correr') {
      navigation.navigate('Corrida');
    } else {
      Alert.alert('Em Breve', `A funcionalidade de ${habitLabel} estará disponível em breve!`);
    }
  };

  const handleProfileRedirect = () => {
    navigation.navigate('Perfil');
  };

  return {
    habits,
    userName,
    userBio,
    handleHabitsRedirect,
    handleHabitPress,
    handleProfileRedirect,
  };
};