import React from 'react';
import { useBeberAgua } from './useBeberAgua';
import { BeberAguaView } from './beber_agua.view';

export default function BeberAguaScreen() {
  const bindings = useBeberAgua();
  
  // Repassa a lógica (bindings) para a sua View que já está resolvida
  return <BeberAguaView {...bindings} />;
}