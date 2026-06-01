import React from 'react';
import { useSaudeBucal } from './useSaudeBucal';
import { SaudeBucalView } from './saude_bucal.view';

export default function SaudeBucalScreen() {
  const bindings = useSaudeBucal();

  return <SaudeBucalView {...bindings} />;
}