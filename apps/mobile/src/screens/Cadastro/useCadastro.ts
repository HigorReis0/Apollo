import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { API_URL } from '../../services/api';

type CadastroScreenProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

export const useCadastro = () => {
  const navigation = useNavigation<CadastroScreenProp>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validação de Client-Side
    if (!nome || !senha || !confirmarSenha || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // Integração real com o seu Backend (usuarioController.criar)
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', data.erro || 'Falha ao realizar cadastro.');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível contatar o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nome, setNome,
    email, setEmail,
    senha, setSenha,
    confirmarSenha, setConfirmarSenha,
    isLoading,
    handleRegister,
    goBack: () => navigation.goBack(),
  };
};