import React from 'react';
import 'react-native-gesture-handler'; 
import { NavigationContainer } from '@react-navigation/native'; // Verifique se importou isso
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // Se o NavigationContainer não estiver aqui (ou dentro do AppNavigator), o app explode no celular
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}