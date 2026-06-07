import React from 'react';
import 'react-native-gesture-handler'; 
import { NavigationContainer } from '@react-navigation/native';
// 1. Importe o Provider aqui
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // 2. Englobe toda a navegação com o Provider
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}