import React from 'react';
import { useCorrida } from './useCorrida';
import { CorridaView } from './corrida.view';

export default function CorridaScreen() {
  const bindings = useCorrida();

  return <CorridaView {...bindings} />;
}