import React from 'react';
import { useMusculacao } from './useMusculacao';
import { MusculacaoView } from './musculacao.view';

export default function MusculacaoScreen() {
  const bindings = useMusculacao();

  return <MusculacaoView {...bindings} />;
}