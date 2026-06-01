import React from 'react';
import { useMeditar } from './useMeditar';
import { MeditarView } from './meditar.view';

export default function MeditarScreen() {
  const bindings = useMeditar();

  return <MeditarView {...bindings} />;
}