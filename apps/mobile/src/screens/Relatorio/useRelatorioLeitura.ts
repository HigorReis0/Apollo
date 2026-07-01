import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Alert } from 'react-native';

// ============================================================
// INTERFACE: dados retornados pelo endpoint /relatorio/leitura
// ============================================================
interface RelatorioLeitura {
  total_paginas_geral: number;
  total_livros: number;
  total_sessoes_mes: number;
  total_paginas_mes: number;
  media_por_sessao: number;
  meta_mensal: number;
  percentual_meta: number;
  ultimo_livro: {
    nome: string;
    autor: string;
    paginas_ultima_sessao: number;
  } | null;
}

// ============================================================
// HOOK: useRelatorioLeitura
// ============================================================
export const useRelatorioLeitura = () => {
  const [dados, setDados] = useState<RelatorioLeitura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<number>(500);
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [novaMeta, setNovaMeta] = useState('');

  // Carrega os dados e a meta
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Busca relatório e meta em paralelo
      const [relatorioRes, metaRes] = await Promise.all([
        api.get('/relatorio/leitura'),
        api.get('/usuarios/meta-leitura')
      ]);

      setDados(relatorioRes.data);
      setMeta(metaRes.data.meta);
      setNovaMeta(String(metaRes.data.meta));
    } catch (err: any) {
      console.error('[useRelatorioLeitura] Erro:', err);
      setError('Não foi possível carregar o relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  // Salva a nova meta
  const salvarMeta = async () => {
    const valor = parseInt(novaMeta);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Digite um número positivo.');
      return;
    }

    try {
      setIsLoading(true);
      await api.put('/usuarios/meta-leitura', { meta: valor });
      // Atualiza estado local diretamente — sem recarregar do backend
      // Isso evita que o estado seja sobrescrito por dados antigos do servidor
      setMeta(valor);
      setNovaMeta(String(valor));
      setEditandoMeta(false);
      Alert.alert('Sucesso', 'Meta atualizada!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return {
    dados,
    isLoading,
    error,
    meta,
    editandoMeta,
    setEditandoMeta,
    novaMeta,
    setNovaMeta,
    salvarMeta,
    recarregar: carregarDados,
  };
};