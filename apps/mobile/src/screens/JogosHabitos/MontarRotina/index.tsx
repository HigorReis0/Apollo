import React from 'react';
import { useRotina } from './useRotina';
import { RotinaView } from './montar_rotina.view';

export default function MontarRotinaScreen() {
  const bindings = useRotina();

  return <RotinaView {...bindings} />;
}