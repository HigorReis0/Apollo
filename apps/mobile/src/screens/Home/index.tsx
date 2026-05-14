import React from 'react';
import { useTelaInicial } from './useTelaInicial';
import { TelaInicialView } from './tela_inicial.view';

export default function HomeScreen() {
  const bindings = useTelaInicial();

  // Injeta os estados e handlers (ViewModel) diretamente na View via Spread Operator
  return <TelaInicialView {...bindings} />;
}