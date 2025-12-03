import React from 'react';
import 'react-native-gesture-handler'; // Importante para o funcionamento correto dos gestos de navegação
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // O App agora apenas carrega o Navegador, que decide qual tela mostrar (começando pelo Login)
    <AppNavigator />
  );
}