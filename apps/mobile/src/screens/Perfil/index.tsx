import React from 'react';
import ProfileView from './perfil.view';
import { usePerfil } from './usePerfil';

export default function ProfileScreen() {
  const perfilProps = usePerfil();
  return <ProfileView perfil={perfilProps} />;
}