import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';

// --- Data & Asset Binding (Acoplados à lógica de negócio/dados) ---
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

  const habits: HabitItem[] = [
    { id: 1, label: 'Beber Água', image: imgAgua },
    { id: 2, label: 'Leitura', image: imgLeitura },
    { id: 3, label: 'Musculação', image: imgMusculacao },
    { id: 4, label: 'Correr', image: imgCorrendo },
  ];

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
    }
    else {
      Alert.alert('Em Breve', `A funcionalidade de ${habitLabel} estará disponível em breve!`);
    }
  };

  const handleProfileRedirect = () => {
    navigation.navigate('Perfil');
  };

  return {
    habits,
    handleHabitsRedirect,
    handleHabitPress,
    handleProfileRedirect,
  };
};