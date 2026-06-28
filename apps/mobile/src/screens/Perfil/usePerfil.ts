// ============================================================
// IMPORTAÇÕES
// ============================================================

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Alert } from 'react-native';

// ============================================================
// IMAGENS DOS HÁBITOS (FALLBACK)
// ============================================================

// @ts-ignore
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// ============================================================
// IMAGENS DAS CONQUISTAS (MEDALHAS)
// ============================================================

// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

// ============================================================
// INTERFACES (TIPAGEM DOS DADOS)
// ============================================================

interface PerfilData {
  usuario_id: number;
  nome: string;
  email: string;
  avatar_url?: string;
  total_xp: number;
  nivel: string;
  xp_proximo_nivel: number | null;
  data_nascimento?: string;
  peso?: number;
  altura?: number;
}

// ============================================================
// INTERFACE HABITO RECENTE (COM XP E MENSAGEM)
// ============================================================

interface HabitoRecente {
  id: number;
  label: string;               // Nome do hábito (ex.: "Corrida")
  xp: number;                  // XP ganho neste registro (NOVO)
  image: string | null;        // URL da imagem (ou null)
  mensagem?: string;           // Mensagem personalizada (NOVO)
}

// ============================================================
// HOOK PRINCIPAL: usePerfil
// ============================================================

export const usePerfil = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habitosRecentes, setHabitosRecentes] = useState<HabitoRecente[]>([]);

  const [editNomeModalVisible, setEditNomeModalVisible] = useState(false);
  const [editNome, setEditNome] = useState('');

  const [editDadosModalVisible, setEditDadosModalVisible] = useState(false);
  const [editDataNascimento, setEditDataNascimento] = useState('');
  const [editPeso, setEditPeso] = useState('');
  const [editAltura, setEditAltura] = useState('');

  // ============================================================
  // FUNÇÃO: carregarDados
  // ============================================================
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [perfilResponse, xpResponse] = await Promise.all([
        api.get('/usuarios/perfil'),
        api.get('/xp/saldo')
      ]);

      setPerfil({
        usuario_id: perfilResponse.data.usuario_id || 0,
        nome: perfilResponse.data.nome || 'Usuário',
        email: perfilResponse.data.email || '',
        avatar_url: perfilResponse.data.avatar_url,
        total_xp: xpResponse.data.total_xp ?? 0,
        nivel: xpResponse.data.nivel_atual || 'Iniciante',
        xp_proximo_nivel: xpResponse.data.xp_proximo_nivel ?? null,
        data_nascimento: perfilResponse.data.data_nascimento || '',
        peso: perfilResponse.data.peso || null,
        altura: perfilResponse.data.altura || null,
      });

      await carregarHabitosRecentes();

    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setError('Não foi possível carregar os dados do perfil.');
      setPerfil({
        usuario_id: 0,
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

  // ============================================================
  // FUNÇÃO: carregarHabitosRecentes (COM XP E MENSAGEM)
  // ============================================================
  const carregarHabitosRecentes = async () => {
    try {
      const res = await api.get('/usuarios/habitos-recentes');
      
      const dados = res.data.map((h: any) => ({
        id: h.id || h.habito_id || 0,
        label: h.label || h.nome || 'Hábito',
        xp: h.xp || 0,                                   // <-- ADICIONADO
        image: h.image || h.icone_url || getImagemFallback(h.label || h.nome),
        mensagem: h.mensagem || `+${h.xp || 0} XP`        // <-- ADICIONADO
      }));
      setHabitosRecentes(dados);
    } catch (error) {
      console.error('Erro ao carregar hábitos recentes:', error);
      setHabitosRecentes([]);
    }
  };

  // ============================================================
  // FUNÇÃO AUXILIAR: getImagemFallback
  // ============================================================
  const getImagemFallback = (label: string) => {
    const map: Record<string, any> = {
      'Musculação': imgMusculacao,
      'Leitura': imgLeitura,
      'Beber Água': imgAgua,
      'Corrida': imgCorrendo,
      'Correr': imgCorrendo,
    };
    return map[label] || imgMusculacao;
  };

  // ============================================================
  // LÓGICA DAS CONQUISTAS
  // ============================================================
  const niveisOrdenados = ['Iniciante', 'Aprendiz', 'Praticante', 'Dedicado', 'Mestre', 'Lendário'];
  const nivelAtual = perfil?.nivel || 'Iniciante';
  const nivelIndex = niveisOrdenados.indexOf(nivelAtual);

  const todasConquistas = [
    { icon: imgDezDias, nivelMinimo: 'Aprendiz' },
    { icon: imgCinquentaDias, nivelMinimo: 'Praticante' },
    { icon: imgCemDias, nivelMinimo: 'Dedicado' },
  ];

  const conquistasDesbloqueadas = todasConquistas.filter(c => {
    const nivelMinIndex = niveisOrdenados.indexOf(c.nivelMinimo);
    return nivelIndex >= nivelMinIndex;
  });

  // ============================================================
  // FUNÇÃO: calcularIdade
  // ============================================================
  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '--';
    const nasc = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  // ============================================================
  // FUNÇÕES DE FORMATAÇÃO E CONVERSÃO
  // ============================================================
  const formatarDataBR = (dataISO: string) => {
    if (!dataISO) return 'Não definida';
    try {
      const partes = dataISO.split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch {
      return dataISO;
    }
  };

  const converterDataParaISO = (dataBR: string) => {
    if (!dataBR) return null;
    const partes = dataBR.split('/');
    if (partes.length !== 3) return null;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  const aplicarMascaraData = (texto: string) => {
    let numeros = texto.replace(/\D/g, '');
    if (numeros.length > 8) numeros = numeros.slice(0, 8);
    
    let formatado = '';
    if (numeros.length <= 2) {
      formatado = numeros;
    } else if (numeros.length <= 4) {
      formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else {
      formatado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    }
    return formatado;
  };

  const metrosParaCm = (metros: number | null | undefined) => {
    if (!metros) return '';
    return Math.round(metros * 100).toString();
  };

  const cmParaMetros = (cm: string) => {
    if (!cm) return null;
    const valor = parseFloat(cm);
    if (isNaN(valor) || valor <= 0) return null;
    return valor / 100;
  };

  // ============================================================
  // DADOS PESSOAIS FORMATADOS
  // ============================================================
  const personalData = [
    { 
      label: 'Data de Nascimento', 
      value: perfil?.data_nascimento ? formatarDataBR(perfil.data_nascimento) : 'Não definida' 
    },
    { 
      label: 'Idade', 
      value: perfil?.data_nascimento ? calcularIdade(perfil.data_nascimento) : '--' 
    },
    { 
      label: 'Peso', 
      value: perfil?.peso ? `${perfil.peso} kg` : '--' 
    },
    { 
      label: 'Altura', 
      value: perfil?.altura ? `${metrosParaCm(perfil.altura)} cm` : '--' 
    },
  ];

  // ============================================================
  // FUNÇÃO: salvarNome
  // ============================================================
  const salvarNome = async () => {
    if (!editNome.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }
    try {
      setIsLoading(true);
      await api.put(`/usuarios/${perfil?.usuario_id}`, { nome: editNome.trim() });
      await carregarDados();
      setEditNomeModalVisible(false);
      Alert.alert('Sucesso', 'Nome atualizado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: salvarDadosPessoais
  // ============================================================
  const salvarDadosPessoais = async () => {
    const dataISO = converterDataParaISO(editDataNascimento);
    const alturaMetros = cmParaMetros(editAltura);
    
    if (editDataNascimento && !dataISO) {
      Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA (ex.: 15/04/1995).');
      return;
    }

    try {
      setIsLoading(true);
      await api.put('/usuarios/dados-pessoais', {
        data_nascimento: dataISO || null,
        peso: editPeso ? parseFloat(editPeso) : null,
        altura: alturaMetros,
      });
      await carregarDados();
      setEditDadosModalVisible(false);
      Alert.alert('Sucesso', 'Dados pessoais atualizados!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÕES PARA ABRIR OS MODAIS
  // ============================================================
  const abrirModalNome = () => {
    setEditNome(perfil?.nome || '');
    setEditNomeModalVisible(true);
  };

  const abrirModalDados = () => {
    setEditDataNascimento(
      perfil?.data_nascimento ? formatarDataBR(perfil.data_nascimento) : ''
    );
    setEditPeso(perfil?.peso ? String(perfil.peso) : '');
    setEditAltura(perfil?.altura ? metrosParaCm(perfil.altura) : '');
    setEditDadosModalVisible(true);
  };

  // ============================================================
  // CARREGAR DADOS AO MONTAR
  // ============================================================
  useEffect(() => {
    carregarDados();
  }, []);

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  return {
    perfil,
    isLoading,
    error,
    personalData,
    conquistasDesbloqueadas,
    habitosRecentes: habitosRecentes.length > 0 ? habitosRecentes : [],
    
    editNomeModalVisible,
    setEditNomeModalVisible,
    editNome,
    setEditNome,
    salvarNome,
    abrirModalNome,
    
    editDadosModalVisible,
    setEditDadosModalVisible,
    editDataNascimento,
    setEditDataNascimento,
    aplicarMascaraData,
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,
  };
};