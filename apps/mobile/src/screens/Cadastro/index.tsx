import React from 'react';
import { useCadastro } from './useCadastro';
import { CadastroView } from './tela_cadastro.view';

export default function RegisterScreen() {
  // 1. Instancia a lógica
  const form = useCadastro();
  
  // 2. Injeta a lógica na View
  return <CadastroView form={form} />;
}