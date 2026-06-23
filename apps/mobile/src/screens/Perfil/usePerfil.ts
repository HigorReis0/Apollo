import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../services/api';

// Interface que espelha os dados do usuário vindos do backend
export interface UsuarioDados {
  nome: string;
  email: string;
  nivel: number;
  xp_atual: number;
  xp_maximo: number;
}

export const usePerfil = () => {
  // Dados simulados iniciais para evitar telas em branco enquanto carrega
  const [usuario, setUsuario] = useState<UsuarioDados>({
    nome: 'Caio Trajano',
    email: 'caio.trajano@email.com',
    nivel: 1,
    xp_atual: 0,
    xp_maximo: 1000,
  });

  const [loading, setLoading] = useState(true);

  const buscarDadosAtuais = async () => {
    try {
      setLoading(true);
      
      // 1. Buscamos o saldo atualizado de XP (Rota blindada sem ID na URL!)
      const respostaXp = await api.get('/xp/saldo');
      
      // 2. Buscamos dados básicos do perfil do usuário
      const respostaPerfil = await api.get('/usuarios/perfil'); 

      // 3. Atualizamos o estado unificado
      setUsuario({
        nome: respostaPerfil.data.nome || 'Caio Trajano',
        email: respostaPerfil.data.email || 'caio@email.com',
        nivel: respostaXp.data.nivel || 1,
        xp_atual: respostaXp.data.xp_atual || 0,
        xp_maximo: respostaXp.data.xp_maximo || 1000,
      });
    } catch (error: any) {
      console.warn(
        '[usePerfil] Erro ao sincronizar XP. Usando dados locais.',
        error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  // O useCallback garante que a função não seja recriada a cada render, evitando gargalo de processamento.
  useFocusEffect(
    useCallback(() => {
      buscarDadosAtuais();
    }, [])
  );

  // Calcula com segurança para evitar divisão por zero
  const divisor = usuario.xp_maximo > 0 ? usuario.xp_maximo : 1000;
  const porcentagemXp = `${Math.min((usuario.xp_atual / divisor) * 100, 100)}%` as import('react-native').DimensionValue;

  const dadosPessoais = [
    { label: 'Data de Nascimento', value: '25/08/2000' },
    { label: 'Curso', value: 'Análise e Des. de Sistemas' },
    { label: 'Período', value: '5º Semestre' },
    { label: 'Instituição', value: 'Faculdade CCI' },
  ];

  return {
    userName: usuario.nome,
    userEmail: usuario.email,
    userLevel: usuario.nivel,
    currentXp: usuario.xp_atual,
    maxXp: usuario.xp_maximo,
    xpPercentage: porcentagemXp,
    personalData: dadosPessoais,
    loading,
    recarregar: buscarDadosAtuais,
  };
};