import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { API_URL } from '../../services/api';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Garante que o navegador feche após a autenticação
WebBrowser.maybeCompleteAuthSession();

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const useLogin = () => {
  const navigation = useNavigation<LoginScreenProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Configuração Google
  const googleRedirectUri = "https://auth.expo.io/@higorreis/projeto-praticando";
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "892333494449-s3qviv65lhdmojbvp97upkgphlr6bj3b.apps.googleusercontent.com",
    androidClientId: "892333494449-s3qviv65lhdmojbvp97upkgphlr6bj3b.apps.googleusercontent.com",
    redirectUri: googleRedirectUri,
  });

  // 2. Observer para Resposta do Google
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleBackendLogin(idToken);
      }
    }
  }, [response]);

  // 3. Login Manual
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });
      const data = await res.json();
      if (res.ok) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', data.erro || 'Falha no login');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Login Google (Backend)
  const handleGoogleBackendLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/login-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      if (res.ok) {
        navigation.navigate('Home');
      } else {
        const data = await res.json();
        Alert.alert('Erro Google', data.erro || "Erro no processamento do token");
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao autenticar com Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoading,
    handleLogin,
    promptAsync,
    requestReady: !!request,
    navigateToCadastro: () => navigation.navigate('Cadastro'),
  };
};