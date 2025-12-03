import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importação das Telas
import LoginScreen from '../screens/Login/tela_login';
import RegisterScreen from '../screens/Cadastro/tela_cadastro';
import RecoverPasswordScreen from '../screens/RecuperacaoSenha/recuperacao_senha';
import HomeScreen from '../screens/Home/tela_inicial';
import HabitsScreen from '../screens/Habitos/tela_habitos';
import BeberAguaScreen from '../screens/JogosHabitos/BeberAgua/beber_agua';
import ProfileScreen from '../screens/Perfil/perfil';
import ReadingScreen from '../screens/JogosHabitos/Ler/ler';

import { colors } from '../theme/colors';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  RecuperacaoSenha: undefined;
  Home: undefined;
  Habitos: undefined;
  BeberAgua: undefined;
  Perfil: undefined;
  Ler: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Configuração de Transição Rápida
const transitionConfig = {
  animation: 'timing',
  config: {
    duration: 200, // Tempo curto (200ms) para ser ágil
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, 
          cardStyle: { backgroundColor: colors.background },
          
          // Aplica a configuração de velocidade para abrir e fechar telas
          transitionSpec: {
            open: transitionConfig as any,
            close: transitionConfig as any,
          },
          
          // ALTERADO: Agora usamos o estilo de deslizar horizontalmente (padrão iOS)
          // Isso faz a tela entrar da direita para a esquerda.
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="RecuperacaoSenha" component={RecoverPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Habitos" component={HabitsScreen} />
        <Stack.Screen name="BeberAgua" component={BeberAguaScreen} />
        <Stack.Screen name="Perfil" component={ProfileScreen} />
        <Stack.Screen name="Ler" component={ReadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}