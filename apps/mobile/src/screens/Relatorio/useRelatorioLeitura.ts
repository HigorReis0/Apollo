// ============================================================
// IMPORTAÇÕES
// ============================================================
// useState: hook para gerenciar estado local (dados, loading, erro)
// useEffect: hook para ciclo de vida (executar ao montar, desmontar)
import { useState, useEffect } from 'react';

// api: cliente HTTP customizado que injeta JWT automaticamente
import { api } from '../../services/api';

// Alert: componente nativo do React Native para mostrar diálogos
import { Alert } from 'react-native';

// ============================================================
// INTERFACE: Tipagem dos dados do backend
// ============================================================
// Define a estrutura exata dos dados retornados por GET /relatorio/leitura
// Garante type-safety: TypeScript valida se estamos usando as propriedades corretas
interface RelatorioLeitura {
  // Soma total de TODAS as páginas lidas (histórico completo do usuário)
  total_paginas_geral: number;
  
  // Quantidade de LIVROS DIFERENTES cadastrados
  total_livros: number;
  
  // Quantidade de SESSÕES de leitura ESTE MÊS
  total_sessoes_mes: number;
  
  // Total de PÁGINAS lidas ESTE MÊS (usado para calcular progresso)
  total_paginas_mes: number;
  
  // Média arredondada de páginas por sessão (total / sessões)
  media_por_sessao: number;
  
  // Meta mensal do usuário em páginas (padrão 500)
  meta_mensal: number;
  
  // Percentual de progresso em relação à meta (0-100%)
  percentual_meta: number;
  
  // Objeto com dados do último livro lido (ou null se nunca leu)
  ultimo_livro: {
    // Nome do livro (ex: "O Hobbit")
    nome: string;
    // Autor do livro (ex: "J.R.R. Tolkien")
    autor: string;
    // Quantidade de páginas lidas NA ÚLTIMA SESSÃO
    paginas_ultima_sessao: number;
  } | null;
}

// ============================================================
// HOOK CUSTOMIZADO: useRelatorioLeitura
// ============================================================
// Este hook ENCAPSULA toda a lógica de negócio da tela de Relatório
// A View (relatorioLeitura.view.tsx) é pura — não tem lógica, só renderiza
// Princípio: Clean Architecture (separação entre lógica e interface)
export const useRelatorioLeitura = () => {
  
  // ── ESTADO 1: Dados do relatório vindo do backend ──
  // Inicialmente null, será preenchido no useEffect
  // Tipagem: RelatorioLeitura | null
  // Exemplo de valor: { total_paginas_geral: 1523, total_livros: 12, ... }
  const [dados, setDados] = useState<RelatorioLeitura | null>(null);
  
  // ── ESTADO 2: Flag de carregamento ──
  // true = requisição HTTP em andamento, mostrar spinner
  // false = requisição concluída, mostrar dados ou erro
  const [isLoading, setIsLoading] = useState(true);
  
  // ── ESTADO 3: Mensagem de erro ──
  // null = sem erro, renderizar dados normalmente
  // string = erro capturado, renderizar mensagem (ex: "Não foi possível carregar...")
  const [error, setError] = useState<string | null>(null);
  
  // ── ESTADO 4: Meta mensal ATUAL ──
  // Número que representa a meta em páginas (padrão 500)
  // Atualizado quando usuário salva uma nova meta
  // IMPORTANTE: Este estado LOCAL é a "source of truth" para exibição
  const [meta, setMeta] = useState<number>(500);
  
  // ── ESTADO 5: Flag de edição ──
  // true = formulário de edição de meta está visível
  // false = formulário escondido, exibindo apenas texto
  const [editandoMeta, setEditandoMeta] = useState(false);
  
  // ── ESTADO 6: Valor digitado no campo de edição ──
  // String porque vem de TextInput (não é número ainda)
  // Será convertido para number com parseInt() ao salvar
  // Exemplo: "750" (string) → 750 (number)
  const [novaMeta, setNovaMeta] = useState('');

  // ============================================================
  // FUNÇÃO: carregarDados
  // ============================================================
  // Responsabilidade: Buscar dados do backend na primeira renderização
  // Também pode ser chamada como função de "refresh" (pull-to-refresh)
  // Executa 2 requisições HTTP em PARALELO (mais eficiente)
  const carregarDados = async () => {
    try {
      // Ativa o spinner (setLoading(true))
      setIsLoading(true);
      
      // Limpa qualquer erro anterior
      setError(null);

      // ── REQUISIÇÕES EM PARALELO (Promise.all) ──
      // Faz 2 requisições simultaneamente em vez de uma após a outra
      // Mais rápido: 200ms (paralelo) vs 400ms (sequencial)
      // Ambas usam Bearer token do JWT (injetado por api.ts)
      const [relatorioRes, metaRes] = await Promise.all([
        // Requisição 1: GET /relatorio/leitura
        // Retorna: { total_paginas_geral, total_livros, total_sessoes_mes, ... }
        api.get('/relatorio/leitura'),
        
        // Requisição 2: GET /usuarios/meta-leitura
        // Retorna: { meta: 500 }
        api.get('/usuarios/meta-leitura')
      ]);

      // Salva os dados do relatório no estado
      // relatorioRes.data contém a estrutura de RelatorioLeitura
      setDados(relatorioRes.data);
      
      // Salva a meta mensal (número)
      // metaRes.data.meta = 500 (ou outro valor definido pelo usuário)
      setMeta(metaRes.data.meta);
      
      // Inicializa o campo de edição com o valor atual da meta (como string)
      // Necessário porque TextInput trabalha com strings, não números
      setNovaMeta(String(metaRes.data.meta));
      
    } catch (err: any) {
      // Se a requisição falhar (servidor offline, timeout, erro 500, etc)
      // Loga o erro no console para debugging
      console.error('[useRelatorioLeitura] Erro:', err);
      
      // Define mensagem de erro genérica para exibir na View
      setError('Não foi possível carregar o relatório.');
    } finally {
      // Desativa o spinner (setLoading(false))
      // Executa SEMPRE, seja sucesso ou erro (finally garante isso)
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: salvarMeta
  // ============================================================
  // Responsabilidade: Atualizar a meta mensal do usuário
  // Chamada quando usuário clica em "Salvar" na edição de meta
  // IMPORTANTE: Atualiza estado LOCAL sem recarregar dados do backend
  const salvarMeta = async () => {
    // Converte a string digitada para número
    // Exemplo: "750" → 750 (número)
    const valor = parseInt(novaMeta);
    
    // Validação: Verifica se é um número válido e positivo
    // isNaN(valor) = true se conversão falhou (ex: "abc" → NaN)
    if (isNaN(valor) || valor <= 0) {
      // Mostra alerta nativo (popup) ao usuário
      Alert.alert('Erro', 'Digite um número positivo.');
      // Para a execução da função (return no meio do try)
      return;
    }

    try {
      // Ativa o spinner enquanto faz a requisição
      setIsLoading(true);
      
      // ── REQUISIÇÃO PUT ──
      // PUT /usuarios/meta-leitura
      // Body: { meta: 750 }
      // Backend: UPDATE usuario SET meta_leitura = 750 WHERE usuario_id = ...
      // Response: { mensagem: "...", meta: 750 }
      await api.put('/usuarios/meta-leitura', { meta: valor });
      
      // ── ATUALIZA ESTADO LOCAL (padrão otimista) ──
      // IMPORTANTE: NÃO recarregamos do backend (não fazemos await carregarDados())
      // Por quê? Se recarregássemos, poderia receber dados em cache ou atrasados
      // e o valor novo não apareceria na hora (bug original)
      
      // Atualiza o estado da meta com o novo valor
      // Isso faz a View renderizar o novo número IMEDIATAMENTE
      setMeta(valor);
      
      // Atualiza o campo de edição também (mantém sincronizado)
      setNovaMeta(String(valor));
      
      // Fecha o formulário de edição
      // Retorna à visualização normal (sem input field)
      setEditandoMeta(false);
      
      // Mostra alerta de sucesso ao usuário
      Alert.alert('Sucesso', 'Meta atualizada!');
      
    } catch (err) {
      // Se falhar (servidor offline, erro 400 validação, etc)
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    } finally {
      // Desativa o spinner
      setIsLoading(false);
    }
  };

  // ============================================================
  // HOOK: useEffect (ciclo de vida)
  // ============================================================
  // Executa quando o componente é MONTADO (componentDidMount)
  // Array vazio [] = dependências vazias = executa apenas UMA VEZ
  useEffect(() => {
    // Carrega os dados ao montar a tela
    // Se o usuário VOLTA para essa tela, useEffect NÃO executa novamente
    // (porque [] vazio = sem dependências)
    // Se quiser refresh ao voltar, usar useFocusEffect no lugar
    carregarDados();
  }, []); // [] = Array de dependências vazio

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  // Retorna um objeto com tudo que a View (relatorioLeitura.view.tsx) precisa
  // A View desestrutura: const { dados, isLoading, ... } = useRelatorioLeitura();
  return {
    dados,                    // Dados do relatório (null durante carregamento)
    isLoading,               // Flag: true = carregando, false = pronto
    error,                   // Mensagem de erro (null se OK)
    meta,                    // Meta atual em número
    editandoMeta,            // Flag: true = formulário visível
    setEditandoMeta,         // Função: abre/fecha formulário
    novaMeta,                // Valor digitado no campo (string)
    setNovaMeta,             // Função: atualiza o campo
    salvarMeta,              // Função: salva a nova meta
    recarregar: carregarDados, // Função de refresh (pull-to-refresh)
  };
};