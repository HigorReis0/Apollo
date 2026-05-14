import React from 'react';
import { useBeberAgua } from './useBeberAgua';
import { BeberAguaView } from './beber_agua.view';

export default function BeberAguaScreen() {
  const bindings = useBeberAgua();
  
  return <BeberAguaView {...bindings} />;
}