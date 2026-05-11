import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

import { styles } from './tela_login.styles';
import { colors } from '../../theme/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
import telaLoginImage from '../../../assets/homem_sentado_login.png';

// Garante que o navegador feche após a autenticação
WebBrowser.maybeCompleteAuthSession();

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Usamos a URI fixa que o Google já aceitou no seu painel
  const googleRedirectUri = "https://auth.expo.io/@higorreis/projeto-praticando";

  // 2. Hook simplificado: Web ID em ambos para forçar o fluxo de Proxy
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "892333494449-s3qviv65lhdmojbvp97upkgphlr6bj3b.apps.googleusercontent.com",

    androidClientId: "892333494449-s3qviv65lhdmojbvp97upkgphlr6bj3b.apps.googleusercontent.com",
    
    redirectUri: googleRedirectUri,
  });

  useEffect(() => {
    // LOG DE DEBUG: Essencial para ver se o Token chegou no app
    if (response) {
      console.log("DEBUG: Resposta do Google capturada:", response.type);
    }

    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleBackendLogin(idToken);
      } else {
        Alert.alert("Erro", "Não foi possível obter o ID Token.");
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://10.200.40.192:3000/usuarios/login', {
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
      Alert.alert('Erro de Conexão', 'Não foi possível contatar o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleBackendLogin = async (idToken: string) => {
    setIsLoading(true);
    console.log("Enviando Token para o Backend...");
    try {
      const res = await fetch('http://192.168.1.11:3000/usuarios/login-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Sucesso no Backend!");
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro Google', data.erro || "Erro no processamento do token");
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao autenticar com Google no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image source={telaLoginImage} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.loginCard}>
            <CustomInput 
              label="Email"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
            <CustomInput 
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <>
                <CustomButton title="Entrar" onPress={handleLogin} variant="primary" />
                <CustomButton 
                  title="Entrar com Google" 
                  onPress={() => promptAsync()} 
                  variant="secondary"
                  disabled={!request}
                />
              </>
            )}
            
            <View style={{ marginTop: 10 }}>
              <CustomButton title="Cadastrar" onPress={() => navigation.navigate('Cadastro')} variant="link" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}