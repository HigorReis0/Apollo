import React from 'react';
import { useCama } from './useCama';
import { CamaView } from './cama.view';

export default function ArrumarCamaScreen() {
  const bindings = useCama();

  return <CamaView {...bindings} />;
}