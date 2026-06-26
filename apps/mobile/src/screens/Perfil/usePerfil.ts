import { useState, useEffect } from 'react';
import { api } from '../../services/api';

// --- Importação das Imagens (todas no topo, como exige o JavaScript) ---
// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

// --- Interface para os dados do perfil ---
interface PerfilData {
  nome: string;
  email: string;
  avatar_url?: string;
  total_xp: number;
  nivel: string;
  xp_proximo_nivel: number | null;
}

export const usePerfil = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Busca dados do perfil e saldo de XP em paralelo
        const [perfilResponse, xpResponse] = await Promise.all([
          api.get('/usuarios/perfil'),
          api.get('/xp/saldo')
        ]);

        setPerfil({
          nome: perfilResponse.data.nome || 'Usuário',
          email: perfilResponse.data.email || '',
          avatar_url: perfilResponse.data.avatar_url,
          total_xp: xpResponse.data.total_xp ?? 0,
          nivel: xpResponse.data.nivel_atual || 'Iniciante',
          xp_proximo_nivel: xpResponse.data.xp_proximo_nivel ?? null,
        });
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err);
        setError('Não foi possível carregar os dados do perfil.');
        // Fallback para não quebrar a UI
        setPerfil({
          nome: 'Usuário',
          email: '',
          total_xp: 0,
          nivel: '--',
          xp_proximo_nivel: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  // Dados estáticos (mockados) para as seções que ainda não estão integradas
  const personalData = [
    { label: 'Data de Nascimento', value: '15/04/1995' },
    { label: 'Idade', value: '28 anos' },
    { label: 'Peso', value: '62 kg' },
    { label: 'Altura', value: '1.68 m' },
  ];

  const achievements = [
    { title: '10 Dias', icon: imgDezDias },
    { title: '50 Dias', icon: imgCinquentaDias },
    { title: '100 Dias', icon: imgCemDias },
  ];

  const myHabits = [
    { label: 'Musculação', image: imgMusculacao },
    { label: 'Leitura', image: imgLeitura },
    { label: 'Beber Água', image: imgAgua },
    { label: 'Correr', image: imgCorrendo },
  ];

  const handleEditProfile = () => {
    console.log('Editar Perfil clicado');
  };

  return {
    perfil,
    isLoading,
    error,
    personalData,
    achievements,
    myHabits,
    handleEditProfile,
  };
};