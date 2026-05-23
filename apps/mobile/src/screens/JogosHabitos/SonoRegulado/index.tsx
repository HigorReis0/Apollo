import React from 'react';
import { useSonoRegulado } from './useSonoRegulado';
import { SonoReguladoView } from './sono_regulado.view';

export default function SonoScreen() {
  const bindings = useSonoRegulado();

  return <SonoReguladoView {...bindings} />;
}