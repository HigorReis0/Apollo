import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTAÇÃO DAS TELAS - Verifique se os nomes das pastas estão corretos (Maiúsculas/Minúsculas)
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Cadastro';
import RecoverPasswordScreen from '../screens/RecuperacaoSenha/recuperacao_senha';
import HomeScreen from '../screens/Home';
import HabitsScreen from '../screens/Habitos/tela_habitos';
import BeberAguaScreen from '../screens/JogosHabitos/BeberAgua';
import ProfileScreen from '../screens/Perfil';
import ReadingScreen from '../screens/JogosHabitos/Ler';

import { colors } from '../theme/colors';
import SonoScreen from '../screens/JogosHabitos/SonoRegulado';
import MeditarScreen from '../screens/JogosHabitos/Meditar';
import MontarRotinaScreen from '../screens/JogosHabitos/MontarRotina';
import MusculacaoScreen from '../screens/JogosHabitos/Musculacao';
import SaudeBucalScreen from '../screens/JogosHabitos/SaudeBucal';
import CorridaScreen from '../screens/JogosHabitos/Corrida';
import ArrumarCamaScreen from '../screens/JogosHabitos/ArrumarCama';

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
  Meditar: undefined;
  MontarRotina: undefined;
  Musculacao: undefined;
  SaudeBucal: undefined;
  SonoRegulado: undefined;
  Corrida: undefined;
  ArrumarCama: undefined;
};

// 2. Criação do Stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // @ts-ignore - Essa linha ignora o erro de 'id' se ele persistir por causa de versão
    <Stack.Navigator 
      initialRouteName="Home"
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
      <Stack.Screen name="Meditar" component={MeditarScreen} />
      <Stack.Screen name="MontarRotina" component={MontarRotinaScreen} />
      <Stack.Screen name="Musculacao" component={MusculacaoScreen} />
      <Stack.Screen name="SaudeBucal" component={SaudeBucalScreen} />
      <Stack.Screen name="SonoRegulado" component={SonoScreen} />
      <Stack.Screen name="Corrida" component={CorridaScreen} />
      <Stack.Screen name="ArrumarCama" component={ArrumarCamaScreen} />
    </Stack.Navigator>
  );
}