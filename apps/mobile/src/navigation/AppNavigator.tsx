import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTAÇÃO DAS TELAS - Verifique se os nomes das pastas estão corretos (Maiúsculas/Minúsculas)
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Cadastro';
import RecoverPasswordScreen from '../screens/RecuperacaoSenha/recuperacao_senha';
import HomeScreen from '../screens/Home/tela_inicial';
import HabitsScreen from '../screens/Habitos/tela_habitos';
import BeberAguaScreen from '../screens/JogosHabitos/BeberAgua';
import ProfileScreen from '../screens/Perfil/perfil';
import ReadingScreen from '../screens/JogosHabitos/Ler/ler';

import { colors } from '../theme/colors';

// 1. Tipagem das Rotas
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

// 2. Criação do Stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // @ts-ignore - Essa linha ignora o erro de 'id' se ele persistir por causa de versão
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
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
  );
}