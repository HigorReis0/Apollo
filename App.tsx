import React from 'react';
// Importa o componente da tela de login
import LoginScreen from './src/screens/tela_login'; 

export default function App() {
  return (
    // Renderiza a tela de login em vez do conteúdo padrão.
    <LoginScreen />
  );
}