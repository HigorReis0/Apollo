import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { styles } from './tela_login.styles';
import { colors } from '../../theme/colors';

// Componentes reutilizáveis
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
import telaLoginImage from '../../../assets/homem_sentado_login.png';

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Validação simples
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha para continuar.');
      return;
    }

    setIsLoading(true);

    // Simula requisição ao backend (2s)
    setTimeout(() => {
      setIsLoading(false); 

      // Credenciais hardcoded para teste
      if (email.trim().toLowerCase() === 'admin@gmail.com' && password === 'admin') {
        navigation.navigate('Home'); 
      } else {
        Alert.alert('Erro de Acesso', 'E-mail ou senha incorretos.'); 
      }
    }, 2000);
  };

  const handleSignUpRedirect = () => {
    navigation.navigate('Cadastro');
  };

  const handleForgotPassword = () => {
    navigation.navigate('RecuperacaoSenha');
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
              <Image
                source={telaLoginImage}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.loginCard}>
            
            <CustomInput 
              label="Email"
              placeholder="exemplo@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            <CustomInput 
              label="Password"
              placeholder="••••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            {/* Alterna entre Spinner e Botão Entrar */}
            {isLoading ? (
              <View style={{ marginTop: 30, marginBottom: 10, height: 50, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <CustomButton 
                title="Entrar" 
                onPress={handleLogin} 
                variant="primary" 
              />
            )}

            <CustomButton 
              title="Cadastrar" 
              onPress={handleSignUpRedirect} 
              variant="secondary"
              disabled={isLoading} 
            />

            <CustomButton 
              title="Esqueceu a senha?" 
              onPress={handleForgotPassword} 
              variant="link"
              disabled={isLoading} 
            />

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}