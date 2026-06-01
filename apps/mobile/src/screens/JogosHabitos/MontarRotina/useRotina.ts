import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export interface HabitoItem {
  id: string;
  titulo: string;
  xp: number;
  ativo: boolean;
  categoria: string;
}

export const useRotina = () => {
  const navigation = useNavigation();

  // Estado que armazena o array de hábitos do sistema com seus respectivos status de ativação.
  const [habitos, setHabitos] = useState<HabitoItem[]>([
    { id: '1', titulo: 'Beber Água', xp: 100, ativo: true, categoria: 'Saúde' },
    { id: '2', titulo: 'Leitura', xp: 80, ativo: true, categoria: 'Mente' },
    { id: '3', titulo: 'Musculação', xp: 150, ativo: false, categoria: 'Corpo' },
    { id: '4', titulo: 'Correr', xp: 200, ativo: false, categoria: 'Corpo' },
    { id: '5', titulo: 'Sono Regulado', xp: 120, ativo: true, categoria: 'Saúde' },
    { id: '6', titulo: 'Arrumar a Cama', xp: 50, ativo: true, categoria: 'Foco' },
    { id: '7', titulo: 'Meditar', xp: 100, ativo: false, categoria: 'Mente' },
    { id: '8', titulo: 'Saúde Bucal', xp: 50, ativo: true, categoria: 'Saúde' },
  ]);

  // Função que inverte o status de ativação de um hábito baseado no ID recebido.
  const alternarHabito = (id: string) => {
    const novaLista = habitos.map((habito) => {
      if (habito.id === id) {
        return { ...habito, ativo: !habito.ativo };
      }
      return habito;
    });
    setHabitos(novaLista);
  };

  // Calcula dinamicamente o XP máximo somando apenas os valores dos hábitos que estão ativos.
  const xpTotalDisponivel = habitos.reduce((acumulador, habito) => {
    return habito.ativo ? acumulador + habito.xp : acumulador;
  }, 0);

  // Função disparada ao clicar no botão de salvar a configuração da rotina.
  const salvarRotina = () => {
    const totalAtivos = habitos.filter(h => h.ativo).length;

    if (totalAtivos === 0) {
      Alert.alert("Aviso", "Selecione pelo menos um hábito para compor a sua rotina diária!");
      return;
    }

    Alert.alert(
      "Rotina Pronta!",
      `Sua rotina foi salva com ${totalAtivos} hábitos ativos. Meta de hoje: buscar +${xpTotalDisponivel} XP!`,
      [{ text: "Confirmar", onPress: () => navigation.goBack() }]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    habitos,
    xpTotalDisponivel,
    alternarHabito,
    salvarRotina,
    handleGoBack,
  };
};