import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// ── Telas principais ──
import LoginScreen from '../screens/Login';
import CadastroScreen from '../screens/Cadastro';
import HomeScreen from '../screens/Home';
import PerfilScreen from '../screens/Perfil';
import HabitosScreen from '../screens/Habitos/tela_habitos';
import RecuperacaoSenhaScreen from '../screens/RecuperacaoSenha/recuperacao_senha';

// ── Telas de hábitos ──
import BeberAguaScreen from '../screens/JogosHabitos/BeberAgua';
import CamaScreen from '../screens/JogosHabitos/ArrumarCama';
import CorridaScreen from '../screens/JogosHabitos/Corrida';
import MeditarScreen from '../screens/JogosHabitos/Meditar';
import MusculacaoScreen from '../screens/JogosHabitos/Musculacao';
import SaudeBucalScreen from '../screens/JogosHabitos/SaudeBucal';
import SonoReguladoScreen from '../screens/JogosHabitos/SonoRegulado';
import LerScreen from '../screens/JogosHabitos/Ler';
import MontarRotinaScreen from '../screens/JogosHabitos/MontarRotina';

// ── Tela de relatório ──
import RelatorioLeituraScreen from '../screens/Relatorio/relatorioLeitura.view';

// ============================================================
// TIPOS DAS ROTAS
// Define os parâmetros aceitos por cada tela.
// ============================================================
export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  Perfil: undefined;
  Habitos: undefined;
  RecuperacaoSenha: undefined;
  BeberAgua: undefined;
  Cama: undefined;
  Corrida: undefined;
  Meditar: undefined;
  Musculacao: undefined;
  SaudeBucal: undefined;
  SonoRegulado: undefined;
  Ler: undefined;
  MontarRotina: undefined;
  RelatorioLeitura: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login"             component={LoginScreen} />
        <Stack.Screen name="Cadastro"          component={CadastroScreen} />
        <Stack.Screen name="Home"              component={HomeScreen} />
        <Stack.Screen name="Perfil"            component={PerfilScreen} />
        <Stack.Screen name="Habitos"           component={HabitosScreen} />
        <Stack.Screen name="RecuperacaoSenha"  component={RecuperacaoSenhaScreen} />
        <Stack.Screen name="BeberAgua"         component={BeberAguaScreen} />
        <Stack.Screen name="Cama"              component={CamaScreen} />
        <Stack.Screen name="Corrida"           component={CorridaScreen} />
        <Stack.Screen name="Meditar"           component={MeditarScreen} />
        <Stack.Screen name="Musculacao"        component={MusculacaoScreen} />
        <Stack.Screen name="SaudeBucal"        component={SaudeBucalScreen} />
        <Stack.Screen name="SonoRegulado"      component={SonoReguladoScreen} />
        <Stack.Screen name="Ler"               component={LerScreen} />
        <Stack.Screen name="MontarRotina"      component={MontarRotinaScreen} />
        <Stack.Screen name="RelatorioLeitura"  component={RelatorioLeituraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}