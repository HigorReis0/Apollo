import React from 'react';
import { useLogin } from './useLogin';
import { LoginView } from './tela_login.view';

export default function LoginScreen() {
  const auth = useLogin();
  return <LoginView auth={auth} />;
}