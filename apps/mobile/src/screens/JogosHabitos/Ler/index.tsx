import React from 'react';
import { useLer } from './useLer';
import { LerView } from './ler.view';

export default function ReadingScreen() {
  const bindings = useLer();

  return <LerView {...bindings} />;
}