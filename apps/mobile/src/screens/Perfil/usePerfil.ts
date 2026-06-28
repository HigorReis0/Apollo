// ============================================================
// IMPORTAÇÕES
// ============================================================

// Importa hooks do React para gerenciar estado e efeitos colaterais
import { useState, useEffect } from 'react';

// Importa o cliente HTTP personalizado (com get, post, put, delete)
import { api } from '../../services/api';

// Importa o Alert para exibir mensagens ao usuário
import { Alert } from 'react-native';

// ============================================================
// IMAGENS DOS HÁBITOS (FALLBACK)
// ============================================================

// Caso o backend não retorne uma imagem, usamos estas como fallback
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

// Essas imagens são exibidas quando o usuário desbloqueia uma conquista
// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

// ============================================================
// INTERFACES (TIPAGEM DOS DADOS)
// ============================================================

// Define a estrutura dos dados principais do perfil
interface PerfilData {
  usuario_id: number;          // ID do usuário (chave primária)
  nome: string;                // Nome do usuário
  email: string;               // E-mail do usuário
  avatar_url?: string;         // URL da foto de perfil (opcional)
  total_xp: number;            // Total de XP acumulado
  nivel: string;               // Nível atual (ex.: "Iniciante")
  xp_proximo_nivel: number | null; // XP necessário para o próximo nível
  data_nascimento?: string;    // Data de nascimento (YYYY-MM-DD no banco)
  peso?: number;               // Peso em kg
  altura?: number;             // Altura em metros (banco), mas exibimos em cm
}

// Define a estrutura de um hábito recente (vem do backend)
interface HabitoRecente {
  id: number;                  // ID do hábito
  label: string;               // Nome do hábito (ex.: "Corrida")
  image: string | null;        // URL da imagem (ou null)
}

// ============================================================
// HOOK PRINCIPAL: usePerfil
// ============================================================

// Este hook é responsável por:
// 1. Buscar os dados do perfil (nome, email, avatar, XP, nível, dados pessoais)
// 2. Buscar os hábitos recentes (últimos 4)
// 3. Calcular quais conquistas estão desbloqueadas com base no nível
// 4. Gerenciar dois modais: edição de nome e edição de dados pessoais
// 5. Salvar as alterações via API e recarregar os dados
export const usePerfil = () => {
  // ---- ESTADOS PRINCIPAIS ----
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habitosRecentes, setHabitosRecentes] = useState<HabitoRecente[]>([]);

  // ---- ESTADOS DO MODAL DE EDIÇÃO DE NOME ----
  const [editNomeModalVisible, setEditNomeModalVisible] = useState(false);
  const [editNome, setEditNome] = useState('');

  // ---- ESTADOS DO MODAL DE EDIÇÃO DE DADOS PESSOAIS ----
  const [editDadosModalVisible, setEditDadosModalVisible] = useState(false);
  const [editDataNascimento, setEditDataNascimento] = useState(''); // formato DD/MM/AAAA (exibição)
  const [editPeso, setEditPeso] = useState('');
  const [editAltura, setEditAltura] = useState(''); // em centímetros (exibição)

  // ============================================================
  // FUNÇÃO: carregarDados
  // Busca todas as informações do perfil (perfil + XP + hábitos)
  // ============================================================
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Busca os dados do perfil (nome, email, avatar, dados pessoais)
      //    e o saldo de XP (total, nível, próximo nível) em paralelo
      const [perfilResponse, xpResponse] = await Promise.all([
        api.get('/usuarios/perfil'),
        api.get('/xp/saldo')
      ]);

      // Atualiza o estado com os dados do perfil
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

      // 2. Busca os hábitos recentes (últimos 4)
      await carregarHabitosRecentes();

    } catch (err: any) {
      // Em caso de erro, exibe mensagem e mantém dados mínimos (fallback)
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
  // FUNÇÃO: carregarHabitosRecentes
  // Busca os 4 últimos hábitos que o usuário registrou (executou)
  // ============================================================
  const carregarHabitosRecentes = async () => {
    try {
      // Chama o endpoint GET /usuarios/habitos-recentes
      const res = await api.get('/usuarios/habitos-recentes');
      
      // Mapeia os dados para o formato esperado pela View
      // O backend pode retornar campos diferentes (ex.: 'nome', 'icone_url')
      const dados = res.data.map((h: any) => ({
        id: h.id || h.habito_id || 0,
        label: h.label || h.nome || 'Hábito',
        image: h.image || h.icone_url || getImagemFallback(h.label || h.nome)
      }));
      setHabitosRecentes(dados);
    } catch (error) {
      // Se falhar, exibe no console e mantém lista vazia
      console.error('Erro ao carregar hábitos recentes:', error);
      setHabitosRecentes([]);
    }
  };

  // ============================================================
  // FUNÇÃO AUXILIAR: getImagemFallback
  // Retorna uma imagem local com base no nome do hábito
  // ============================================================
  const getImagemFallback = (label: string) => {
    // Mapeia nomes comuns para imagens locais
    const map: Record<string, any> = {
      'Musculação': imgMusculacao,
      'Leitura': imgLeitura,
      'Beber Água': imgAgua,
      'Corrida': imgCorrendo,
      'Correr': imgCorrendo,
    };
    // Se não encontrar, usa a imagem de musculação como padrão
    return map[label] || imgMusculacao;
  };

  // ============================================================
  // LÓGICA DAS CONQUISTAS (baseada no nível atual)
  // ============================================================

  // Lista ordenada dos níveis (do mais baixo para o mais alto)
  const niveisOrdenados = ['Iniciante', 'Aprendiz', 'Praticante', 'Dedicado', 'Mestre', 'Lendário'];
  
  // Índice do nível atual do usuário (0 = Iniciante)
  const nivelAtual = perfil?.nivel || 'Iniciante';
  const nivelIndex = niveisOrdenados.indexOf(nivelAtual);

  // Definição das conquistas com o nível mínimo necessário para desbloquear
  const todasConquistas = [
    { icon: imgDezDias, nivelMinimo: 'Aprendiz' },      // Desbloqueia no nível Aprendiz
    { icon: imgCinquentaDias, nivelMinimo: 'Praticante' }, // Desbloqueia no nível Praticante
    { icon: imgCemDias, nivelMinimo: 'Dedicado' },       // Desbloqueia no nível Dedicado
  ];

  // Filtra apenas as conquistas que o usuário já pode ter (baseado no nível)
  const conquistasDesbloqueadas = todasConquistas.filter(c => {
    const nivelMinIndex = niveisOrdenados.indexOf(c.nivelMinimo);
    return nivelIndex >= nivelMinIndex;
  });

  // ============================================================
  // FUNÇÃO: calcularIdade
  // Calcula a idade a partir da data de nascimento (formato YYYY-MM-DD)
  // ============================================================
  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '--';
    const nasc = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    // Se ainda não fez aniversário este ano, subtrai 1
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  // ============================================================
  // FUNÇÕES DE FORMATAÇÃO E CONVERSÃO
  // ============================================================

  // Converte data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/AAAA)
  const formatarDataBR = (dataISO: string) => {
    if (!dataISO) return 'Não definida';
    try {
      const partes = dataISO.split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch {
      return dataISO;
    }
  };

  // Converte data brasileira (DD/MM/AAAA) para ISO (YYYY-MM-DD)
  const converterDataParaISO = (dataBR: string) => {
    if (!dataBR) return null;
    const partes = dataBR.split('/');
    if (partes.length !== 3) return null;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  // Aplica máscara de data DD/MM/AAAA enquanto o usuário digita
  const aplicarMascaraData = (texto: string) => {
    // Remove tudo que não é número
    let numeros = texto.replace(/\D/g, '');
    
    // Limita a 8 dígitos (DDMMAAAA)
    if (numeros.length > 8) numeros = numeros.slice(0, 8);
    
    // Aplica as barras automaticamente
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

  // Converte metros para centímetros (ex.: 1.68 → 168)
  const metrosParaCm = (metros: number | null | undefined) => {
    if (!metros) return '';
    return Math.round(metros * 100).toString();
  };

  // Converte centímetros para metros (ex.: 168 → 1.68)
  const cmParaMetros = (cm: string) => {
    if (!cm) return null;
    const valor = parseFloat(cm);
    if (isNaN(valor) || valor <= 0) return null;
    return valor / 100;
  };

  // ============================================================
  // DADOS PESSOAIS FORMATADOS PARA EXIBIÇÃO
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
  // Salva o novo nome no backend e recarrega os dados
  // ============================================================
  const salvarNome = async () => {
    // Validação: nome não pode estar vazio
    if (!editNome.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }
    try {
      setIsLoading(true);
      // O endpoint PUT /usuarios/:id espera o usuario_id na URL
      await api.put(`/usuarios/${perfil?.usuario_id}`, { 
        nome: editNome.trim() 
      });
      // Recarrega os dados para atualizar a UI
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
  // Salva os dados pessoais no backend (convertendo formatos)
  // ============================================================
  const salvarDadosPessoais = async () => {
    // Converte a data de DD/MM/AAAA para YYYY-MM-DD
    const dataISO = converterDataParaISO(editDataNascimento);
    
    // Converte a altura de cm para metros
    const alturaMetros = cmParaMetros(editAltura);
    
    // Validação da data (se foi preenchida, deve estar no formato correto)
    if (editDataNascimento && !dataISO) {
      Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA (ex.: 15/04/1995).');
      return;
    }

    try {
      setIsLoading(true);
      // Endpoint específico para dados pessoais
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
  
  // Abre o modal de edição de nome, preenchendo com o nome atual
  const abrirModalNome = () => {
    setEditNome(perfil?.nome || '');
    setEditNomeModalVisible(true);
  };

  // Abre o modal de edição de dados pessoais, preenchendo com os valores atuais
  // A data é convertida para formato brasileiro e a altura para centímetros
  const abrirModalDados = () => {
    setEditDataNascimento(
      perfil?.data_nascimento ? formatarDataBR(perfil.data_nascimento) : ''
    );
    setEditPeso(perfil?.peso ? String(perfil.peso) : '');
    setEditAltura(perfil?.altura ? metrosParaCm(perfil.altura) : '');
    setEditDadosModalVisible(true);
  };

  // ============================================================
  // CARREGAR DADOS AO MONTAR O COMPONENTE
  // ============================================================
  useEffect(() => {
    carregarDados();
  }, []); // Array vazio = executa apenas uma vez

  // ============================================================
  // RETORNO DO HOOK (tudo que a View precisa)
  // ============================================================
  return {
    // Dados principais
    perfil,
    isLoading,
    error,
    personalData,
    conquistasDesbloqueadas,
    habitosRecentes: habitosRecentes.length > 0 ? habitosRecentes : [],
    
    // Estado e funções do modal de edição de nome
    editNomeModalVisible,
    setEditNomeModalVisible,
    editNome,
    setEditNome,
    salvarNome,
    abrirModalNome,
    
    // Estado e funções do modal de edição de dados pessoais
    editDadosModalVisible,
    setEditDadosModalVisible,
    editDataNascimento,
    setEditDataNascimento,
    aplicarMascaraData,  //função para aplicar máscara no campo
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,
  };
};