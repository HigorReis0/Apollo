# 📚 DOCUMENTAÇÃO COMENTADA - APOLLO
## Relatório de Leitura + JogosHabitos + Controllers Backend

**Última atualização:** 30 de junho de 2026  
**Apresentação:** 01 de julho de 2026

---

## 📑 ÍNDICE
1. [Relatório de Leitura](#relatório-de-leitura)
2. [JogosHabitos](#jogohabitos)
3. [Controllers Backend](#controllers-backend)

---

# 1️⃣ RELATÓRIO DE LEITURA

## 📄 Arquivo: `useRelatorioLeitura.ts`
**Localização:** `apps/mobile/src/screens/Relatorio/useRelatorioLeitura.ts`

### O que faz?
Hook customizado que gerencia toda a lógica da tela de Relatório de Leitura:
- Busca dados do backend (total de páginas, livros, sessões)
- Gerencia a meta mensal de leitura
- Permite editar a meta
- Carrega dados ao montar a tela (useEffect)

### Fluxo de dados
```
Backend /relatorio/leitura ──> dados do relatório (SUM, COUNT, AVG)
Backend /usuarios/meta-leitura ──> meta mensal atual
Hook ──> estado local (meta, novaMeta, editandoMeta)
View ──> renderiza usando estado do hook
```

### Código comentado linha por linha:

\`\`\`typescript
// ============================================================
// IMPORTAÇÕES
// ============================================================

// Hook de estado (useState) e ciclo de vida (useEffect)
import { useState, useEffect } from 'react';

// Cliente HTTP customizado que injeita token JWT automaticamente
import { api } from '../../services/api';

// Componente de diálogo nativo do React Native (alerta/confirmação)
import { Alert } from 'react-native';

// ============================================================
// INTERFACE: Tipagem dos dados retornados pelo backend
// ============================================================
// Descreve a estrutura exata dos dados que vêm do endpoint /relatorio/leitura
interface RelatorioLeitura {
  // Soma total de todas as páginas lidas do usuário (HISTÓRICO COMPLETO)
  total_paginas_geral: number;
  
  // Quantidade de livros diferentes cadastrados pelo usuário
  total_livros: number;
  
  // Quantidade de sessões de leitura registradas ESTE MÊS
  total_sessoes_mes: number;
  
  // Total de páginas lidas ESTE MÊS (usado para calcular progresso da meta)
  total_paginas_mes: number;
  
  // Média arredondada de páginas por sessão (total_paginas_geral / sessões)
  media_por_sessao: number;
  
  // Meta mensal definida pelo usuário (padrão 500 páginas)
  meta_mensal: number;
  
  // Percentual de progresso em relação à meta (0-100%)
  percentual_meta: number;
  
  // Objeto com informações do último livro lido (ou null se nunca leu)
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
// Este hook ENCAPSULA toda a lógica de negócio
// A View (relatorioLeitura.view.tsx) não precisa saber como os dados são obtidos
// Princípio Clean Architecture: separação entre lógica e interface
export const useRelatorioLeitura = () => {
  
  // ── ESTADO 1: Dados do relatório vindo do backend ──
  // Inicialmente null, preenchido no useEffect
  // Exemplo: { total_paginas_geral: 1523, total_livros: 12, ... }
  const [dados, setDados] = useState<RelatorioLeitura | null>(null);
  
  // ── ESTADO 2: Flag de carregamento ──
  // true = requisição em andamento, exibir spinner na View
  // false = requisição concluída, exibir dados na View
  const [isLoading, setIsLoading] = useState(true);
  
  // ── ESTADO 3: Mensagem de erro ──
  // null = sem erro, exibir dados normalmente
  // string = erro capturado, exibir mensagem de erro
  // Exemplo: "Não foi possível carregar o relatório."
  const [error, setError] = useState<string | null>(null);
  
  // ── ESTADO 4: Meta mensal atual ──
  // Valor numérico da meta (padrão 500 páginas)
  // Atualizado quando o usuário salva uma nova meta
  // NOTA: Este estado LOCAL é a "source of truth" para a meta exibida
  const [meta, setMeta] = useState<number>(500);
  
  // ── ESTADO 5: Booleano de edição de meta ──
  // true = formulário de edição visível
  // false = formulário de edição escondido
  // Controlado pela View quando usuário clica "Editar meta"
  const [editandoMeta, setEditandoMeta] = useState(false);
  
  // ── ESTADO 6: Valor digitado no campo de edição ──
  // String porque vem de TextInput (não é número ainda)
  // Convertido para número com parseInt() quando salvar
  // Exemplo: "750" (string) → 750 (number)
  const [novaMeta, setNovaMeta] = useState('');

  // ============================================================
  // FUNÇÃO: carregarDados
  // ============================================================
  // Responsável por buscar dados do backend na primeira renderização
  // Chamada no useEffect() abaixo
  // Também pode ser chamada como função de "refresh" (pull-to-refresh)
  const carregarDados = async () => {
    try {
      // Habilita spinner de carregamento na View
      setIsLoading(true);
      
      // Limpa qualquer erro anterior
      setError(null);

      // ── REQUISIÇÃO PARALELA (Promise.all) ──
      // Faz 2 requisições HTTP simultaneamente em vez de uma após a outra
      // Mais eficiente: 200ms (paralelo) vs 400ms (sequencial)
      // Ambas usam Bearer token do JWT injetado automaticamente por api.ts
      const [relatorioRes, metaRes] = await Promise.all([
        // GET /relatorio/leitura → retorna dados consolidados
        // Body: vazio (token no header Authorization)
        // Response: { total_paginas_geral, total_livros, meta_mensal, ... }
        api.get('/relatorio/leitura'),
        
        // GET /usuarios/meta-leitura → retorna meta do usuário
        // Body: vazio (token no header Authorization)
        // Response: { meta: 500 }
        api.get('/usuarios/meta-leitura')
      ]);

      // Salva os dados do relatório no estado
      // relatorioRes.data = { total_paginas_geral: 1523, ... }
      setDados(relatorioRes.data);
      
      // Salva a meta mensal (numérica)
      // metaRes.data.meta = 500
      setMeta(metaRes.data.meta);
      
      // Inicializa o campo de edição com a meta atual (como string)
      // Necessário porque TextInput trabalha com strings
      setNovaMeta(String(metaRes.data.meta));
      
    } catch (err: any) {
      // Se a requisição falhar (servidor offline, erro 500, timeout, etc)
      // Loga o erro no console para debugging
      console.error('[useRelatorioLeitura] Erro:', err);
      
      // Define mensagem de erro genérica para exibir na View
      setError('Não foi possível carregar o relatório.');
    } finally {
      // Desabilita spinner independentemente de sucesso ou erro
      // finally = sempre executado, seja try ou catch
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: salvarMeta
  // ============================================================
  // Responsável por atualizar a meta mensal do usuário
  // Chamada quando usuário clica em "Salvar" na edição de meta
  // IMPORTANTE: Não recarrega dados do backend (evita sobrescrita)
  const salvarMeta = async () => {
    // Converte a string digitada para número
    // Exemplo: "750" → 750
    const valor = parseInt(novaMeta);
    
    // Validação 1: Verifica se é número válido
    // isNaN(valor) = true se conversão falhou (ex: "abc" → NaN)
    if (isNaN(valor) || valor <= 0) {
      // Mostra alerta nativo (popup) ao usuário
      Alert.alert('Erro', 'Digite um número positivo.');
      // Para a execução da função aqui
      return;
    }

    try {
      // Habilita spinner enquanto salva
      setIsLoading(true);
      
      // ── REQUISIÇÃO PUT ──
      // PUT /usuarios/meta-leitura
      // Body: { meta: 750 }
      // Backend: atualiza usuario.meta_leitura = 750 no PostgreSQL
      // Response: { mensagem: "Meta atualizada com sucesso!", meta: 750 }
      await api.put('/usuarios/meta-leitura', { meta: valor });
      
      // ── ATUALIZA ESTADO LOCAL (sem recarregar backend) ──
      // Isso é importante: se chamássemos carregarDados() aqui,
      // o backend retornaria dados da requisição anterior (cache ou delay)
      // e o número mostrado não mudaria instantaneamente
      
      // Atualiza o estado da meta com o novo valor
      setMeta(valor);
      
      // Atualiza o campo de edição também (para manter sincronizado)
      setNovaMeta(String(valor));
      
      // Fecha o formulário de edição
      // Retorna à visualização normal (sem input field)
      setEditandoMeta(false);
      
      // Mostra alerta de sucesso
      Alert.alert('Sucesso', 'Meta atualizada!');
      
      // ❌ NÃO FAZEMOS: await carregarDados()
      // Isso causaria o bug original onde o número não mudava
      
    } catch (err) {
      // Se falhar (servidor offline, erro 400 validação, etc)
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    } finally {
      // Desabilita spinner
      setIsLoading(false);
    }
  };

  // ============================================================
  // HOOK: useEffect (ciclo de vida)
  // ============================================================
  // Executa uma vez quando o componente monta (componentDidMount)
  // Array vazio [] = dependências vazias = executa apenas uma vez
  useEffect(() => {
    // Carrega dados ao montar a tela
    // Se o usuário voltar para essa tela, useEffect NÃO executa novamente
    // Se quiser refresh ao voltar, usar useFocusEffect no lugar
    carregarDados();
  }, []); // [] = Array de dependências vazio

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  // Retorna um objeto com tudo que a View precisa
  // A View usa: const { dados, isLoading, ... } = useRelatorioLeitura();
  return {
    dados,                    // Dados do relatório (null durante carregamento)
    isLoading,               // Flag de carregamento
    error,                   // Mensagem de erro (null se OK)
    meta,                    // Meta atual (número)
    editandoMeta,            // Flag de edição de meta
    setEditandoMeta,         // Função para abrir/fechar edição
    novaMeta,                // Valor digitado no campo (string)
    setNovaMeta,             // Função para atualizar o campo
    salvarMeta,              // Função para salvar nova meta
    recarregar: carregarDados, // Função de refresh (pull-to-refresh)
  };
};
\`\`\`

---

## 📄 Arquivo: `relatorioLeitura.view.tsx`
**Localização:** `apps/mobile/src/screens/Relatorio/relatorioLeitura.view.tsx`

### O que faz?
Componente visual puro que renderiza a tela de Relatório de Leitura.
- NÃO tem lógica de negócio (Clean Architecture)
- Recebe tudo do hook via desestruturação
- Renderiza condicionalmente (carregando / erro / vazio / dados)
- Emite eventos (navegação, cliques)

### Estrutura visual
```
┌─────────────────────────────────────┐
│  ← Voltar                           │
├─────────────────────────────────────┤
│  📚 Relatório de Leitura            │
│  Análise do seu progresso...        │
├─────────────────────────────────────┤
│ 📖 1523    📚 12    📖 45    📊 1823 │  (Grid 2 colunas)
│ páginas   livros   sessões  páginas │
├─────────────────────────────────────┤
│  📈 Meta mensal: 500 páginas        │
│  [████░░] 89%                       │  (Barra de progresso)
│  445 / 500 páginas este mês         │
│  [ Editar ]                         │
├─────────────────────────────────────┤
│  📖 Último livro lido               │
│  O Senhor dos Anéis (J.R.R. Tolkien)│
│  Última sessão: 45 páginas          │
└─────────────────────────────────────┘
```

### Código comentado (resumido):

```typescript
// Importações essenciais para componentes React Native
import React from 'react';
import {
  View,              // Container genérico (como <div> no HTML)
  Text,              // Exibe texto na tela
  ScrollView,        // Container com scroll quando conteúdo > tela
  ActivityIndicator, // Spinner de carregamento (girador)
  SafeAreaView,      // Respeita notch, barra de status do celular
  TouchableOpacity,  // Botão que fica transparente ao toque
  TextInput,         // Campo de entrada de texto para editar meta
} from 'react-native';

// Hook de navegação para ir para outras telas
import { useNavigation } from '@react-navigation/native';

// Tipagem de navegação em Stack (garante type-safety nas rotas)
import { StackNavigationProp } from '@react-navigation/stack';

// Lista de todas as rotas do app (Relatório, Perfil, Home, etc)
import { RootStackParamList } from '../../navigation/AppNavigator';

// Hook que encapsula toda a lógica de negócio
import { useRelatorioLeitura } from './useRelatorioLeitura';

// Estilos centralizados (não hardcoded na View)
import { styles } from './relatorioLeitura.styles';

// Tema de cores (valores centralizados para evitar hardcoding)
import { colors } from '../../theme/colors';

// Tipagem da navegação específica para esta tela
// Garante que navigation.navigate() só aceita rotas válidas
type NavigationProp = StackNavigationProp<RootStackParamList, 'RelatorioLeitura'>;

// ============================================================
// COMPONENTE FUNCIONAL PRINCIPAL
// ============================================================
export default function RelatorioLeituraScreen() {
  
  // Inicializa objeto de navegação com tipo correto
  const navigation = useNavigation<NavigationProp>();

  // Desestrutura TUDO que o hook fornece (lógica encapsulada)
  const {
    dados,              // Dados do relatório (null = carregando)
    isLoading,         // true = carregando, false = pronto
    error,             // Mensagem de erro (null = OK)
    meta,              // Meta atual em número
    editandoMeta,      // true = formulário visível
    setEditandoMeta,   // Abre/fecha formulário
    novaMeta,          // Valor digitado (string)
    setNovaMeta,       // Atualiza campo digitado
    salvarMeta,        // Salva nova meta
  } = useRelatorioLeitura();

  // ============================================================
  // RENDERIZAÇÃO CONDICIONAL (Guard Clauses)
  // ============================================================
  // Em vez de if/else aninhados, cada caso retorna direto
  // Mais legível e evita piramide de if/else

  // CASO 1: Carregando dados
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Spinner giratório nativo do sistema */}
        <ActivityIndicator 
          size="large"                    // Tamanho grande
          color={colors.primary}          // Cor azul primária Apollo
        />
      </SafeAreaView>
    );
  }

  // CASO 2: Erro ao carregar
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Mensagem de erro em texto vermelho */}
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // CASO 3: Dados vazios (usuário nunca registrou leitura)
  if (!dados || dados.total_paginas_geral === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.titulo}>📚 Relatório de Leitura</Text>
          <Text style={styles.emptyText}>
            Você ainda não registrou nenhuma leitura.
          </Text>
          <Text style={styles.emptySubtext}>
            Comece agora mesmo e acompanhe seu progresso!
          </Text>
          {/* Botão para navegar para tela de Leitura */}
          <TouchableOpacity
            style={styles.botaoIrLer}
            onPress={() => navigation.navigate('Ler')}
          >
            <Text style={styles.botaoIrLerText}>📖 Ir para Leitura</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // CÁLCULO IMPORTANTE: Percentual local
  // ============================================================
  // Em vez de usar dados.percentual_meta (que vem do backend),
  // calculamos localmente usando o estado 'meta' (que é atualizado imediatamente)
  // Isso garante que a barra de progresso responde na hora ao editar a meta
  // Math.min(..., 100) garante que nunca ultrapassa 100%
  const percentualLocal = dados && meta > 0
    ? Math.min(Math.round((dados.total_paginas_mes / meta) * 100), 100)
    : 0;

  // ============================================================
  // RENDERIZAÇÃO PRINCIPAL (Dados OK)
  // ============================================================
  // Só chega aqui se: não está carregando, sem erro, tem dados
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── BOTÃO DE VOLTAR ── */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}     // Volta para tela anterior
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar para a tela anterior</Text>
        </TouchableOpacity>

        {/* ── CABEÇALHO ── */}
        <Text style={styles.titulo}>📚 Relatório de Leitura</Text>
        <Text style={styles.subtitulo}>Análise do seu progresso como leitor</Text>

        {/* ── GRID DE MÉTRICAS (2 colunas) ── */}
        {/* 4 cards com dados: total páginas, livros, sessões, média */}
        <View style={styles.grid}>
          
          {/* Card 1: Total de páginas GERAL */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📖</Text>
            <Text style={styles.cardValor}>{dados.total_paginas_geral}</Text>
            <Text style={styles.cardLabel}>Total de páginas lidas</Text>
          </View>

          {/* Card 2: Total de livros */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📚</Text>
            <Text style={styles.cardValor}>{dados.total_livros}</Text>
            <Text style={styles.cardLabel}>Total de livros</Text>
          </View>

          {/* Card 3: Total de sessões ESTE MÊS */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📖</Text>
            <Text style={styles.cardValor}>{dados.total_sessoes_mes}</Text>
            <Text style={styles.cardLabel}>Sessões este mês</Text>
          </View>

          {/* Card 4: Total de páginas ESTE MÊS */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📊</Text>
            <Text style={styles.cardValor}>{dados.total_paginas_mes}</Text>
            <Text style={styles.cardLabel}>Páginas este mês</Text>
          </View>

        </View>

        {/* ── META MENSAL COM BARRA DE PROGRESSO ── */}
        <View style={styles.metaContainer}>
          
          {/* Header: Título + "Editar" */}
          <View style={styles.metaHeader}>
            <Text style={styles.metaTitulo}>📈 Meta mensal</Text>
            
            {/* Se está editando, esconde botão "Editar" */}
            {!editandoMeta && (
              <TouchableOpacity
                style={styles.editarMetaButton}
                onPress={() => {
                  setEditandoMeta(true);    // Abre formulário
                  setNovaMeta(String(meta)); // Inicializa com valor atual
                }}
              >
                <Text style={styles.editarMetaButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Barra de progresso visual */}
          {/* Fundo cinza + preenchimento verde */}
          <View style={styles.barraFundo}>
            <View
              style={[
                styles.barraPreenchida,
                { width: `${percentualLocal}%` as any }, // Dinâmico (0-100%)
              ]}
            />
          </View>

          {/* Footer: Texto de progresso + Formulário de edição */}
          <View style={styles.metaFooter}>
            
            {/* Se NÃO está editando, exibe texto normal */}
            {!editandoMeta && (
              <>
                {/* Percentual (ex: "89%") */}
                <Text style={styles.metaPercentual}>{percentualLocal}%</Text>
                
                {/* Texto de progresso (ex: "445 / 500 páginas") */}
                <Text style={styles.metaTexto}>
                  {dados.total_paginas_mes} / {meta} páginas este mês
                </Text>
              </>
            )}

            {/* Se ESTÁ editando, exibe input field + botões */}
            {editandoMeta && (
              <View style={styles.editarMetaInputContainer}>
                
                {/* Campo de input para digitar nova meta */}
                <TextInput
                  style={styles.editarMetaInput}
                  placeholder="Digite nova meta"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"           // Mostrar teclado numérico
                  value={novaMeta}                    // Valor controlado
                  onChangeText={setNovaMeta}          // Atualiza conforme digita
                />

                {/* Botão "Salvar" */}
                <TouchableOpacity
                  style={styles.editarMetaSalvar}
                  onPress={salvarMeta}                // Chama hook para salvar
                >
                  <Text style={styles.editarMetaSalvarText}>✓ Salvar</Text>
                </TouchableOpacity>

                {/* Botão "Cancelar" */}
                <TouchableOpacity
                  style={styles.editarMetaCancelar}
                  onPress={() => setEditandoMeta(false)} // Fecha formulário
                >
                  <Text style={styles.editarMetaCancelarText}>✕ Cancelar</Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        </View>

        {/* ── ÚLTIMO LIVRO LIDO ── */}
        {/* Renderiza apenas se dados.ultimo_livro não for null */}
        {/* Se nunca leu um livro, ultima_livro é null e este bloco não renderiza */}
        {dados.ultimo_livro && (
          <View style={styles.ultimoLivro}>
            
            {/* Label descritivo */}
            <Text style={styles.ultimoLivroTitulo}>
              📖 Último livro lido
            </Text>

            {/* Nome do livro (grande) */}
            <Text style={styles.ultimoLivroNome}>
              {dados.ultimo_livro.nome}
            </Text>

            {/* Autor do livro */}
            <Text style={styles.ultimoLivroAutor}>
              {dados.ultimo_livro.autor}
            </Text>

            {/* Páginas lidas na última sessão */}
            <Text style={styles.ultimoLivroPaginas}>
              Última sessão: {dados.ultimo_livro.paginas_ultima_sessao} páginas
            </Text>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 📄 Arquivo: `relatorioLeitura.styles.ts`
**Localização:** `apps/mobile/src/screens/Relatorio/relatorioLeitura.styles.ts`

### O que faz?
Arquivo de estilos puro (StyleSheet do React Native).
- Todos os estilos em um único lugar (DRY)
- Valores de cor, tamanho, spacing centralizados
- Reutilizável pela View

### Estrutura de estilos:

```typescript
// ============================================================
// CONTAINER PRINCIPAL
// ============================================================
container: {
  flex: 1,                           // Ocupa todo espaço disponível
  backgroundColor: colors.background // Fundo claro (branco/off-white)
}

scroll: {
  padding: 20,       // Margem interna
  paddingBottom: 40  // Extra no final para não ficar cortado
}

// ============================================================
// CABEÇALHO
// ============================================================
titulo: {
  fontSize: 24,                 // Tamanho grande
  fontWeight: 'bold',          // Texto em negrito
  color: colors.textDark,      // Cor escura para contraste
  marginBottom: 6              // Espaço até próximo elemento
}

subtitulo: {
  fontSize: 14,                // Tamanho pequeno
  color: colors.primary,       // Cor azul primária
  marginBottom: 24,            // Grande espaço
  fontWeight: '600'            // Semi-negrito
}

// ============================================================
// GRID DE CARDS (2 colunas)
// ============================================================
grid: {
  flexDirection: 'row',        // Layout horizontal
  flexWrap: 'wrap',            // Quebra linha quando necessário
  justifyContent: 'space-between', // Distribui espaço igual
  gap: 12                      // Espaço entre cards
}

card: {
  width: '47%',                // 47% da tela (2 por linha)
  backgroundColor: colors.white,
  borderRadius: 12,            // Cantos arredondados
  padding: 16,                 // Espaço interno
  alignItems: 'center',        // Centraliza conteúdo
  borderWidth: 1,              // Borda fina
  borderColor: '#E5E7EB',      // Cinza claro
  shadowColor: '#000',         // Sombra (iOS)
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,         // Muito sutil
  shadowRadius: 4,
  elevation: 2                 // Sombra (Android)
}

cardIcone: {
  fontSize: 28,               // Emoji grande (📖, 📚, etc)
  marginBottom: 8
}

cardValor: {
  fontSize: 28,               // Número grande
  fontWeight: 'bold',
  color: colors.primary,      // Azul
  marginBottom: 4
}

cardLabel: {
  fontSize: 12,               // Pequeno
  color: colors.primary,
  textAlign: 'center',
  fontWeight: '600'
}

// ============================================================
// META MENSAL COM BARRA DE PROGRESSO
// ============================================================
metaContainer: {
  backgroundColor: colors.white,
  borderRadius: 12,
  padding: 16,
  marginBottom: 24,
  borderWidth: 1,
  borderColor: '#E5E7EB'       // Borda cinza clara
}

metaHeader: {
  flexDirection: 'row',        // Título + botão lado a lado
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12
}

metaTitulo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.textDark       // Texto escuro
}

barraFundo: {
  height: 12,                  // Altura da barra
  backgroundColor: '#E5E7EB',  // Cinza claro (fundo)
  borderRadius: 6,             // Cantos arredondados
  overflow: 'hidden',          // Clip do conteúdo
  marginBottom: 8
}

barraPreenchida: {
  height: 12,
  backgroundColor: '#10B981',  // Verde (progresso)
  borderRadius: 6
}

metaFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 8                 // Espaço da barra
}

metaTexto: {
  fontSize: 13,
  color: colors.primary,
  fontWeight: '600'
}

// ============================================================
// EDIÇÃO DE META (Formulário)
// ============================================================
editarMetaInput: {
  width: 80,                   // Campo pequeno
  height: 32,                  // Altura compacta
  backgroundColor: '#F9FAFB',  // Fundo muito claro
  borderRadius: 6,
  paddingHorizontal: 8,
  fontSize: 14,
  borderWidth: 1,
  borderColor: '#D1D5DB'       // Borda cinza médio
}

editarMetaSalvar: {
  paddingVertical: 4,
  paddingHorizontal: 12,
  backgroundColor: colors.primary, // Botão azul
  borderRadius: 6
}

editarMetaSalvarText: {
  color: '#FFF',               // Texto branco
  fontSize: 12,
  fontWeight: '600'
}

editarMetaCancelar: {
  paddingVertical: 4,
  paddingHorizontal: 12,
  backgroundColor: '#F3F4F6',  // Fundo cinza
  borderRadius: 6
}

editarMetaCancelarText: {
  color: '#374151',            // Texto cinza escuro
  fontSize: 12,
  fontWeight: '600'
}

// ============================================================
// ÚLTIMO LIVRO LIDO
// ============================================================
ultimoLivro: {
  backgroundColor: colors.white,
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: colors.primary  // Borda azul (destaque)
}

ultimoLivroNome: {
  fontSize: 18,
  fontWeight: '600',
  color: colors.textDark
}

ultimoLivroAutor: {
  fontSize: 14,
  color: colors.primary,
  fontWeight: '600'
}

// ============================================================
// BOTÃO DE VOLTAR
// ============================================================
backButton: {
  marginBottom: 10,
  paddingVertical: 8,
  paddingHorizontal: 12,
  alignSelf: 'flex-start'      // Alinha à esquerda
}

backButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: colors.primary,
  textDecorationLine: 'underline' // Sublinhado (parece link)
}

// ============================================================
// ESTADO VAZIO (Sem dados)
// ============================================================
emptyContainer: {
  flex: 1,                     // Ocupa tudo
  justifyContent: 'center',    // Centraliza verticalmente
  alignItems: 'center',        // Centraliza horizontalmente
  paddingHorizontal: 30
}

emptyText: {
  fontSize: 18,
  color: colors.textDark,
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 10
}

botaoIrLer: {
  backgroundColor: colors.primary, // Botão azul
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 12,
  elevation: 3,               // Sombra (Android)
  shadowColor: '#000',        // Sombra (iOS)
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4
}

// ============================================================
// ESTADO DE ERRO
// ============================================================
errorText: {
  color: '#EF4444',           // Vermelho
  fontSize: 14,
  textAlign: 'center',
  padding: 20
}
```

---

# 2️⃣ JOGOHABITOS

## 📄 Exemplo: `useCama.ts` (Arrumar Cama)
**Localização:** `apps/mobile/src/screens/JogosHabitos/ArrumarCama/useCama.ts`

### O que faz?
Hook simples para registrar o hábito "Arrumar a Cama":
- Usa `useRegistrarXP` (hook genérico reutilizável)
- Impede duplo registro no mesmo dia
- Retorna estado e funções para a View

### Padrão DRY em ação:
```javascript
// Este hook NÃO tem lógica de XP hardcoded
// Apenas chama: registrarXP(MOTIVOS_XP.ARRUMAR_CAMA)
// A lógica de segurança (servidor decide valor) é centralizada
```

### Código comentado:

\`\`\`typescript
import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Hook genérico que encapsula a lógica de registro de XP
// Reutilizado em 8+ hooks diferentes (DRY principle)
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useCama
// ============================================================
// Responsabilidade única: gerenciar estado da tela Arrumar Cama
// A lógica de XP é delegada para useRegistrarXP
// O valor de XP NUNCA é decidido no frontend
export const useCama = () => {
  
  // Hook de navegação para voltar
  const navigation = useNavigation();

  // Desestrutura o hook genérico de XP
  // Ele cuidará de validações e envio ao servidor
  const { registrarXP } = useRegistrarXP();

  // ── ESTADO 1: Flag de conclusão ──
  // Impede que o usuário registre a mesma tarefa 2x no mesmo dia
  const [estaArrumada, setEstaArrumada] = useState(false);

  // ── ESTADO 2: Flag de carregamento ──
  // Desabilita o botão enquanto a requisição está sendo processada
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: handleCheckIn
  // Responsável por:
  // 1. Validar se já foi feito hoje
  // 2. Enviar ao backend via hook genérico
  // 3. Atualizar estado local
  // 4. Exibir alerta com XP ganho
  // ============================================================
  const handleCheckIn = async () => {
    
    // Guard Clause: se já foi feito, avisa e volta
    if (estaArrumada) {
      Alert.alert('Aviso', 'Você já concluiu este hábito hoje!');
      return;
    }

    try {
      setLoading(true);

      // Chama o hook genérico com o ID do motivo
      // MOTIVOS_XP.ARRUMAR_CAMA = 1 (centralizado, nunca hardcoded)
      // O hook retorna: { sucesso: boolean, xp_ganho: number }
      const resultado = await registrarXP(MOTIVOS_XP.ARRUMAR_CAMA);

      // Se a requisição foi bem-sucedida
      if (resultado.sucesso) {
        setEstaArrumada(true); // Marca como concluído hoje
        
        // Exibe o XP ganho no alerta
        // Exemplo: "+20 XP registrado!"
        Alert.alert(
          'Organizado!',
          \`Sua primeira vitória do dia! Quarto organizado, mente organizada. +\${resultado.xp_ganho} XP registrado!\`
        );
      } else {
        // Se falhou
        Alert.alert(
          'Erro',
          'Não foi possível registrar o XP. Verifique sua conexão e tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para voltar à tela anterior
  const handleGoBack = () => navigation.goBack();

  // Função para reset manual (útil para testes)
  const handleReset = () => setEstaArrumada(false);

  // Retorna tudo que a View precisa
  return {
    estaArrumada,   // Flag de conclusão
    loading,        // Flag de carregamento
    handleCheckIn,  // Função de registro
    handleGoBack,   // Função de volta
    handleReset,    // Função de reset (testes)
  };
};
\`\`\`

---

## 📄 Exemplo: `useBeberAgua.ts` (Consumo de Água)
**Localização:** `apps/mobile/src/screens/JogosHabitos/BeberAgua/useBeberAgua.ts`

### O que faz?
Hook mais complexo que gerencia:
- Consumo de água com múltiplos tipos de bebida
- Meta diária (2000ml)
- Histórico de consumos
- Bônus XP ao bater a meta

### Fluxo de dados:
```
User seleciona bebida + volume
        ↓
handleAdicionarBebida()
        ↓
POST /agua/registrar {tipo, quantidade}
        ↓
Backend (ACID transaction):
  - INSERT tab_consumo_agua
  - INSERT tab_xp_log (registro)
  - Verifica meta
  - INSERT tab_xp_log (bônus se meta batida)
        ↓
Frontend atualiza estado LOCAL (sem recarregar)
```

### Código comentado (resumido):

\`\`\`typescript
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/api';

// ============================================================
// CONSTANTES (Centralização de valores mágicos)
// ============================================================
export const META_DIARIA = 2000;      // 2 litros em ml
export const VOLUMES = [150, 200, 600, 1000]; // Atalhos de volume

// ============================================================
// TIPOS & INTERFACES
// ============================================================
export interface DrinkType {
  label: string;       // "Água", "Refrigerante", etc
  icon: any;           // Caminho da imagem
}

export interface HistoricoConsumo {
  id_consumo_agua: number;
  tipo_bebida: string;
  quantidade_ml: number;
  data_hora: string;
}

// ============================================================
// HOOK: useBeberAgua
// ============================================================
export const useBeberAgua = () => {
  const navigation = useNavigation();

  // ── ESTADO 1: Total consumido HOJE ──
  const [totalConsumido, setTotalConsumido] = useState<number>(0);

  // ── ESTADO 2: Percentual da meta ──
  // 0-100% (capped em 100 para não estouro visual)
  const [totalMeta, setTotalMeta] = useState<number>(0);

  // ── ESTADO 3: Pontos XP do usuário ──
  const [pontos, setPontos] = useState<number>(0);

  // ── ESTADO 4: Dropdown aberto/fechado ──
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // ── ESTADO 5: Bebida selecionada ──
  // Default: "Água" (primeiro item)
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>(DRINK_TYPES[0]);

  // ── ESTADO 6: Volume selecionado ──
  // Default: 200ml
  const [volumeSelecionado, setVolumeSelecionado] = useState<number>(200);

  // ── ESTADO 7: Histórico de consumos do dia ──
  // Array com todos os registros (usado para listar consumos recentes)
  const [history, setHistory] = useState<HistoricoConsumo[]>([]);

  // ── ESTADO 8: Flag de carregamento ──
  const [loading, setLoading] = useState<boolean>(false);

  // ============================================================
  // FUNÇÃO: carregarDadosDoServidor
  // Busca dados do backend na montagem
  // ============================================================
  const carregarDadosDoServidor = async () => {
    try {
      setLoading(true);

      // Requisição 1: GET /agua/hoje → retorna consumos de hoje
      const resAgua = await api.get('/agua/hoje');
      setHistory(resAgua.data.consumos);              // Array de consumos
      setTotalConsumido(resAgua.data.total_ml);       // Total em ml
      setTotalMeta(resAgua.data.percentual);          // Percentual 0-100%

      // Requisição 2: GET /xp/saldo → retorna XP total
      const resXp = await api.get('/xp/saldo');
      setPontos(resXp.data.xp_total);                 // Total XP

    } catch (error: any) {
      console.error("Erro ao sincronizar com a API:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CICLO DE VIDA: Carrega dados ao montar
  // ============================================================
  useEffect(() => {
    carregarDadosDoServidor();
  }, []); // Executa apenas uma vez

  // ============================================================
  // FUNÇÃO: handleAdicionarBebida
  // IMPORTANTE: Atualiza estado LOCAL sem recarregar do servidor
  // (padrão otimista — feedback imediato ao usuário)
  // ============================================================
  const handleAdicionarBebida = async () => {
    try {
      setLoading(true);

      // 1. Envia ao backend (persiste no banco)
      const resposta = await api.post('/agua/registrar', {
        tipo_bebida: selectedDrink.label,
        quantidade_ml: volumeSelecionado
      });

      // 2. Atualiza o total LOCAL (sem esperar resposta do servidor)
      // Isso garante feedback imediato na UI
      const novoTotal = totalConsumido + volumeSelecionado;
      setTotalConsumido(novoTotal);
      
      // 3. Recalcula percentual da meta
      setTotalMeta(Math.min((novoTotal / META_DIARIA) * 100, 100));

      // 4. Adiciona o novo consumo ao histórico LOCAL
      const novoRegistro: HistoricoConsumo = {
        id_consumo_agua: Date.now(), // ID temporário
        tipo_bebida: selectedDrink.label,
        quantidade_ml: volumeSelecionado,
        data_hora: new Date().toISOString()
      };
      setHistory(prev => [novoRegistro, ...prev]); // Prepend (mais recente primeiro)

      // 5. Atualiza XP se a resposta retornar xp_ganho
      if (resposta.data.xp_ganho) {
        setPontos(prev => prev + resposta.data.xp_ganho);
        Alert.alert(
          "Hidratação registrada!",
          \`Você consumiu \${volumeSelecionado}ml de \${selectedDrink.label}. +\${resposta.data.xp_ganho} XP!\`
        );
      }

      // 6. Verifica se bateu a meta (bônus extra)
      if (novoTotal >= META_DIARIA && resposta.data.bonus_meta) {
        Alert.alert(
          "Meta Batida!",
          \`Parabéns! Meta de hidratação atingida! +\${resposta.data.bonus_meta} XP de bônus!\`
        );
        setPontos(prev => prev + resposta.data.bonus_meta);
      }

    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível registrar o consumo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Retorna tudo que a View precisa
  return {
    totalConsumido,
    totalMeta,
    pontos,
    isDropdownOpen,
    selectedDrink,
    volumeSelecionado,
    history,
    loading,
    // ... funções de atualização
  };
};
\`\`\`

---

## 📄 Exemplo: `useMeditar.ts` (Meditação com Timer)
**Localização:** `apps/mobile/src/screens/JogosHabitos/Meditar/useMeditar.ts`

### O que faz?
Hook avançado com timer regressivo:
- Gerencia duração customizável
- Usa `useRef` para intervalo (evita memory leak)
- Registra XP ao concluir sessão

### Por que useRef?

\`\`\`javascript
// ❌ ERRADO: usaria setState
const [intervalo, setIntervalo] = useState(null);
// Problema: causa re-render a cada tick (60x/segundo) — performance péssima

// ✅ CORRETO: useRef
const intervaloRef = useRef(null);
// Não causa re-render, apenas armazena referência
// Pode ser limpo no return do useEffect (cleanup)
\`\`\`

### Código comentado:

\`\`\`typescript
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useMeditar
// ============================================================
// Gerencia um timer regressivo para meditação
// Usa useRef para o intervalo (não causa re-render)
// Registra XP ao concluir
export const useMeditar = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // ── ESTADO 1: Tempo restante em SEGUNDOS ──
  // 300 = 5 minutos (padrão)
  const [tempoRestante, setTempoRestante] = useState(300);

  // ── ESTADO 2: Timer ativo? ──
  // true = timer está rodando (decrescente)
  // false = pausa ou não iniciado
  const [isAtivo, setIsAtivo] = useState(false);

  // ── ESTADO 3: XP já foi concedido? ──
  // Evita conceder XP 2x se clicar "concluir" 2 vezes
  const [xpConcedido, setXpConcedido] = useState(false);

  // ── ESTADO 4: Loading ──
  const [loading, setLoading] = useState(false);

  // ── ESTADO 5: Campo de tempo customizado ──
  // String porque vem de TextInput
  // "15" (string) → 15 minutos
  const [inputMinutos, setInputMinutos] = useState('');

  // ============================================================
  // REF: Armazena o ID do intervalo (sem causar re-render)
  // ============================================================
  // useRef retorna { current: value }
  // intervaloRef.current = ID do setInterval
  // Necessário para poder fazer clearInterval() depois
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // EFFECT: Controla o ciclo de vida do timer
  // ============================================================
  // Executa quando isAtivo ou tempoRestante mudam
  useEffect(() => {
    // Se está ativo E ainda tem tempo
    if (isAtivo && tempoRestante > 0) {
      // Cria um intervalo que decrementa 1 segundo a cada 1000ms
      intervaloRef.current = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    }
    // Se chegou a 0 e estava ativo
    else if (tempoRestante === 0 && isAtivo) {
      setIsAtivo(false);        // Para o timer
      handleConcluirSessao();   // Registra XP
    }

    // ============================================================
    // CLEANUP FUNCTION
    // Executa quando o componente desmontar ou dependências mudarem
    // Crucial para evitar memory leak!
    // ============================================================
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [isAtivo, tempoRestante]);

  // ============================================================
  // FUNÇÃO: handleConcluirSessao
  // Registra o XP ao fim do timer
  // ============================================================
  const handleConcluirSessao = async () => {
    // Guard: se já concedeu XP, não faz novamente
    if (xpConcedido) return;

    try {
      setLoading(true);

      // Registra XP via hook genérico
      const resultado = await registrarXP(MOTIVOS_XP.MEDITACAO);

      if (resultado.sucesso) {
        setXpConcedido(true);
        Alert.alert(
          'Mente em Paz',
          \`Sessão concluída com sucesso! +\${resultado.xp_ganho} XP registrado!\`
        );
      } else {
        Alert.alert('Sessão concluída', 'Não foi possível registrar o XP.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: formatarTempo
  // Converte segundos em MM:SS para exibição (ex: "05:32")
  // ============================================================
  const formatarTempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    // padStart(2, '0') garante 2 dígitos (ex: "05" não "5")
    return \`\${mins.toString().padStart(2, '0')}:\${segs.toString().padStart(2, '0')}\`;
  };

  // ============================================================
  // FUNÇÃO: selecionarDuracao
  // Permite escolher entre 5, 10 ou 15 minutos
  // ============================================================
  const selecionarDuracao = (minutos: number) => {
    setIsAtivo(false);                    // Para o timer
    setTempoRestante(minutos * 60);       // Converte minutos em segundos
    setXpConcedido(false);                // Reset XP
    setInputMinutos('');                  // Limpa campo customizado
  };

  // ============================================================
  // FUNÇÃO: definirTempoPersonalizado
  // Permite digitar duração customizada
  // Valida se é número positivo
  // ============================================================
  const definirTempoPersonalizado = () => {
    const minutos = parseInt(inputMinutos);
    
    // Validação 1: Número válido?
    if (isNaN(minutos) || minutos <= 0) {
      Alert.alert('Erro', 'Digite um valor válido (ex.: 3, 7, 12).');
      return;
    }
    
    // Validação 2: Não maior que 2 horas
    if (minutos > 120) {
      Alert.alert('Erro', 'O tempo máximo é de 120 minutos.');
      return;
    }
    
    // Tudo OK, atualiza o timer
    setIsAtivo(false);
    setTempoRestante(minutos * 60);
    setXpConcedido(false);
    setInputMinutos('');
  };

  // Alterna entre pausar e retomar
  const toggleTimer = () => setIsAtivo(prev => !prev);

  // Volta à tela anterior
  const handleGoBack = () => navigation.goBack();

  // Retorna tudo que a View precisa
  return {
    tempoRestante,
    isAtivo,
    loading,
    xpConcedido,
    inputMinutos,
    setInputMinutos,
    formatarTempo,
    selecionarDuracao,
    definirTempoPersonalizado,
    toggleTimer,
    handleGoBack,
  };
};
\`\`\`

**PADRÃO IMPORTANTE:** Todos os outros hábitos (Musculação, Corrida, Saúde Bucal, Sono, Ler) seguem o mesmo padrão com variações menores. A lógica de XP é SEMPRE delegada para `useRegistrarXP()`.

---

# 3️⃣ CONTROLLERS BACKEND

## 📄 Arquivo: `xpLogController.js`
**Localização:** `apps/api/src/controllers/xpLogController.js`

### O que faz?
Controla todo o sistema de gamificação:
- Registra XP (Fail Fast validation)
- Calcula saldo com nível (SUM, Op.lte, Op.gt)
- Lista histórico
- Deleta logs

### Princípio de Segurança (CRÍTICO):
```javascript
// ❌ NUNCA fazer:
const xp_ganho = req.body.xp_ganho;  // Cliente poderia enviar 99999

// ✅ SEMPRE fazer:
const motivoEncontrado = await Motivo.findByPk(id_motivo);
const xp_ganho = motivoEncontrado.xp_padrao;  // Servidor decide!
```

### Código comentado:

\`\`\`javascript
const XpLog = require("../models/XpLog");
const Usuario = require("../models/Usuario");
const Motivo = require("../models/Motivo");

// ============================================================
// CONTROLLER: xpLogController
// ============================================================
// Responsável pela camada de controle da gamificação
// Padrão MVC: recebe requisições, valida, interage com modelo
// Princípio "Fail Fast": rejeita dados inválidos antes do banco

module.exports = {

  // ============================================================
  // MÉTODO: registrar
  // Rota: POST /xp/registrar
  // ============================================================
  // O que faz:
  // 1. Recebe id_motivo do frontend
  // 2. Busca o xp_padrao no banco (servidor decide o valor!)
  // 3. Cria o log
  //
  // Por que tão restritivo?
  // → Impede que usuário hackeado envie xp_ganho: 99999
  // → Security by Design (Schneier, 2000)
  async registrar(req, res) {
    try {
      // usuario_id vem do authMiddleware (JWT validado)
      // NUNCA confiamos no ID enviado pelo frontend
      const usuario_id = req.usuarioId;
      
      // id_motivo vem do body
      // Qual motivo causou o XP? (1=ArrumarCama, 2=Água, etc)
      const { id_motivo } = req.body;

      // ============================================================
      // VALIDAÇÃO 1: Dados obrigatórios presentes?
      // Fail Fast — rejeita imediatamente
      // ============================================================
      if (!usuario_id || !id_motivo) {
        return res.status(400).json({
          erro: "Dados insuficientes (id_motivo no body obrigatório)."
        });
      }

      // ============================================================
      // VALIDAÇÃO 2: Usuário existe?
      // Integridade referencial — evita XP de usuário fantasma
      // ============================================================
      const usuarioExiste = await Usuario.findByPk(usuario_id);
      if (!usuarioExiste) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado." 
        });
      }

      // ============================================================
      // VALIDAÇÃO 3: Motivo existe? Busca o valor correto!
      // SEGURANÇA CRÍTICA: O valor vem do banco, não do cliente
      // ============================================================
      const motivoEncontrado = await Motivo.findByPk(id_motivo);
      if (!motivoEncontrado) {
        return res.status(404).json({
          erro: "Motivo de XP não encontrado na tabela tab_motivo."
        });
      }

      // ============================================================
      // CRIAÇÃO: Insere o log com o valor CORRETO
      // xp_ganho = motivoEncontrado.xp_padrao (do banco, não do cliente!)
      // ============================================================
      const log = await XpLog.create({
        usuario_id,
        id_motivo: motivoEncontrado.motivo_id,
        xp_ganho: motivoEncontrado.xp_padrao  // ✅ Do banco!
      });

      // Retorna o log criado (201 = Created)
      return res.status(201).json(log);

    } catch (error) {
      // Erro no servidor
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: calcularSaldo
  // Rota: GET /xp/saldo
  // ============================================================
  // Retorna:
  // - total_xp: SUM de todos os xp_ganho
  // - nivel_atual: nome do nível baseado em xp_minimo
  // - xp_proximo_nivel: XP necessário para próximo nível
  //
  // Exemplo de níveis:
  // - Iniciante: 0 XP
  // - Aprendiz: 200 XP
  // - Dedicado: 1000 XP
  // - Mestre: 2000 XP
  async calcularSaldo(req, res) {
    try {
      const usuarioId = req.usuarioId;  // Do middleware

      // ============================================================
      // PASSO 1: Soma TOTAL de XP (historicamente)
      // SUM = agregação SQL (mais eficiente que buscar todos os logs)
      // ============================================================
      const totalXp = await XpLog.sum('xp_ganho', {
        where: { usuario_id: usuarioId }
      }) || 0;  // || 0 = fallback se null

      // ============================================================
      // PASSO 2: Busca o modelo Nivel
      // ============================================================
      const Nivel = require('../models/Nivel');
      const { Op } = require('sequelize');

      // ============================================================
      // PASSO 3: Nível ATUAL (maior xp_minimo <= totalXp)
      // Op.lte = "less than or equal" (<= )
      // ORDER BY DESC + LIMIT 1 = encontra o maior xp_minimo que cabe
      // ============================================================
      // Exemplo: totalXp = 1500
      // Níveis: [0, 200, 500, 1000, 2000]
      // Op.lte 1500 = [0, 200, 500, 1000]
      // DESC + LIMIT 1 = 1000 (Dedicado)
      const nivelAtual = await Nivel.findOne({
        where: {
          xp_minimo: { [Op.lte]: totalXp }  // xp_minimo <= totalXp
        },
        order: [['xp_minimo', 'DESC']],  // Ordenação decrescente
        attributes: ['nivel_id', 'nome_nivel', 'xp_minimo']
      });

      // ============================================================
      // PASSO 4: Próximo NÍVEL (menor xp_minimo > totalXp)
      // Op.gt = "greater than" (>)
      // ORDER BY ASC + LIMIT 1 = encontra o menor xp_minimo acima
      // ============================================================
      // Exemplo: totalXp = 1500
      // Op.gt 1500 = [2000, 5000, ...]
      // ASC + LIMIT 1 = 2000 (próximo é Mestre)
      const proximoNivel = await Nivel.findOne({
        where: {
          xp_minimo: { [Op.gt]: totalXp }   // xp_minimo > totalXp
        },
        order: [['xp_minimo', 'ASC']],   // Ordenação crescente
        attributes: ['xp_minimo']
      });

      // ============================================================
      // PASSO 5: Retorna a resposta formatada
      // ============================================================
      return res.json({
        total_xp: totalXp,                                    // Total
        nivel_atual: nivelAtual ? nivelAtual.nome_nivel : 'Iniciante',
        nivel_id: nivelAtual ? nivelAtual.nivel_id : null,
        xp_proximo_nivel: proximoNivel ? proximoNivel.xp_minimo : null
      });

    } catch (error) {
      console.error('Erro ao calcular saldo:', error);
      return res.status(500).json({ erro: error.message });
    }
  }
};
\`\`\`

---

## 📄 Arquivo: `consumoAguaController.js`
**Localização:** `apps/api/src/controllers/consumoAguaController.js`

### O que faz?
Gerencia hidratação com gamificação:
- Registra consumo atomicamente (ACID)
- Verifica meta diária (2000ml)
- Concede bônus XP se meta batida
- Evita duplo bônus no mesmo dia

### Conceito ACID (Database Transactions):
```javascript
const t = await sequelize.transaction();
try {
  // 1. INSERT consumo
  // 2. INSERT xp_log
  // 3. Verifica meta
  // 4. INSERT xp_log (bônus)
  // Tudo com sucesso? → COMMIT (persistir)
  // Algum erro? → ROLLBACK (desfazer tudo)
} catch {
  await t.rollback();  // Se falha, volta como se nada tivesse acontecido
}
```

### Código comentado (condensado):

\`\`\`javascript
const ConsumoAgua = require("../models/ConsumoAgua");
const XpLog = require("../models/XpLog");
const Motivo = require("../models/Motivo");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// ============================================================
// CONSTANTES DE DOMÍNIO (Nunca hardcoded!)
// ============================================================
const ID_MOTIVO_REGISTRO_AGUA = 1;  // "Registro de Água"        → 20 XP
const ID_MOTIVO_META_DIARIA   = 3;  // "Meta Hidratação Batida"  → 50 XP
const META_DIARIA_ML          = 2000; // 2 litros

module.exports = {

  // ============================================================
  // MÉTODO: registrarConsumo
  // Rota: POST /agua/registrar
  // ============================================================
  // Por que TRANSACTION?
  // Imagine: INSERT consumo OK, servidor cai antes de INSERT xp_log
  // Resultado: consumo registrado mas sem XP! Bug crítico.
  // 
  // Com transação:
  // - Tudo registra ("commit") OU nada registra ("rollback")
  // - Garantia ACID: Atomicity (A de ACID)
  async registrarConsumo(req, res) {

    // ============================================================
    // INICIA A TRANSAÇÃO
    // Todas as queries abaixo executam junto (atomicamente)
    // ============================================================
    const t = await sequelize.transaction();

    try {
      const usuario_id = req.usuarioId;  // JWT validado
      const { tipo_bebida, quantidade_ml } = req.body;

      // ============================================================
      // VALIDAÇÃO FAIL FAST
      // ============================================================
      if (!quantidade_ml) {
        await t.rollback();  // Cancela a transação
        return res.status(400).json({ 
          erro: "quantidade_ml é obrigatória." 
        });
      }

      // ============================================================
      // PASSO 1: Registra o consumo na tabela tab_consumo_agua
      // { transaction: t } = executa DENTRO da transação
      // ============================================================
      const consumo = await ConsumoAgua.create({
        usuario_id,
        tipo_bebida: tipo_bebida || "Água",
        quantidade_ml
      }, { transaction: t });

      // ============================================================
      // PASSO 2: Busca o motivo para obter xp_padrao
      // ID_MOTIVO_REGISTRO_AGUA = 1 (Arrumar Cama = 20 XP)
      // ============================================================
      const motivoRegistro = await Motivo.findByPk(
        ID_MOTIVO_REGISTRO_AGUA,
        { transaction: t }
      );
      if (!motivoRegistro) {
        await t.rollback();
        return res.status(404).json({ 
          erro: "Motivo não encontrado na tabela tab_motivo." 
        });
      }

      // ============================================================
      // PASSO 3: Registra o XP do consumo (20 XP)
      // ============================================================
      await XpLog.create({
        usuario_id,
        id_motivo: motivoRegistro.motivo_id,
        xp_ganho: motivoRegistro.xp_padrao
      }, { transaction: t });

      // ============================================================
      // PASSO 4: Verifica se bateu a meta diária (2000ml)
      // ============================================================
      // Define início do dia (00:00)
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // SUM(quantidade_ml) de hoje
      const totalHoje = await ConsumoAgua.sum("quantidade_ml", {
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }  // >= hoje 00:00
        },
        transaction: t
      }) || 0;

      const totalComAtual = (totalHoje || 0) + quantidade_ml;
      let bonusMeta = null;

      // ============================================================
      // PASSO 5: Se bateu a meta, concede bônus (se não concedeu hoje)
      // ============================================================
      if (totalComAtual >= META_DIARIA_ML) {
        
        // Verifica se bônus já foi concedido HOJE
        const bonusJaConcedido = await XpLog.findOne({
          where: {
            usuario_id,
            id_motivo: ID_MOTIVO_META_DIARIA,
            data_hora: { [Op.gte]: inicioDia }
          },
          transaction: t
        });

        // Se não foi concedido, concede agora!
        if (!bonusJaConcedido) {
          const motivoMeta = await Motivo.findByPk(
            ID_MOTIVO_META_DIARIA,
            { transaction: t }
          );
          
          if (motivoMeta) {
            await XpLog.create({
              usuario_id,
              id_motivo: motivoMeta.motivo_id,
              xp_ganho: motivoMeta.xp_padrao  // 50 XP de bônus
            }, { transaction: t });
            
            bonusMeta = motivoMeta.xp_padrao;
          }
        }
      }

      // ============================================================
      // COMMIT: Todas as operações foram bem-sucedidas!
      // Padrão implícito ao final do try (sem await t.commit())
      // ============================================================
      
      // Retorna sucesso com informações
      return res.status(201).json({
        consumo,
        xp_ganho: motivoRegistro.xp_padrao,
        bonus_meta: bonusMeta,
        mensagem: "Consumo registrado com sucesso!"
      });

    } catch (error) {
      // ============================================================
      // ERRO: Desfazer TUDO (ROLLBACK)
      // Se qualquer INSERT falhar, volta ao estado anterior
      // ============================================================
      await t.rollback();
      console.error('[consumoAguaController] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  }
};
\`\`\`

---

## 📄 Arquivo: `leituraController.js`
**Localização:** `apps/api/src/controllers/leituraController.js`

### O que faz?
Gerencia sessões de leitura:
- Registra páginas lidas atomicamente
- Auto-cria livros se não existir
- Suporta busca por ID ou nome (flexível)
- Retorna histórico e informações do último livro

### Fluxo inteligente:
```
Frontend envia: nome_livro="O Hobbit", paginas_lidas=45, autor="J.R.R. Tolkien"
    ↓
Backend:
  1. Livro "O Hobbit" existe? 
     - Sim → usa id_livro_lido existente
     - Não → cria novo com autor
  2. Registra leitura na tab_leitura
  3. Registra XP na tab_xp_log
  4. (Transaction) Tudo com sucesso → commit
    ↓
Frontend: "+20 XP! Leitura registrada"
```

### Código comentado:

\`\`\`javascript
const { Leitura, LivrosLidos, XpLog, Motivo, sequelize } = require("../models");

const MOTIVO_LEITURA_ID = 6;  // ID da leitura na tab_motivo

const leituraController = {

  // ============================================================
  // MÉTODO: registrarSessao
  // Rota: POST /leitura/registrar
  // ============================================================
  // Suporta 2 formas de envio:
  // 1. nome_livro + paginas_lidas + autor (mais comum, auto-cria livro)
  // 2. id_livro_lido + paginas_lidas (compatibilidade)
  registrarSessao: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      // Extrai dados do body (incluindo autor agora!)
      const { nome_livro, paginas_lidas, nota, id_livro_lido, autor } = req.body;
      
      // usuario_id do middleware de autenticação
      const usuarioId = req.usuario?.id || req.usuarioId;

      // ============================================================
      // VALIDAÇÕES
      // ============================================================
      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      // Validação: nome_livro OU id_livro_lido é obrigatório
      if (!id_livro_lido && !nome_livro) {
        return res.status(400).json({ 
          error: "Informe id_livro_lido ou nome_livro." 
        });
      }

      // Validação: páginas deve ser número positivo
      const paginas = parseInt(paginas_lidas);
      if (!paginas_lidas || isNaN(paginas) || paginas <= 0) {
        return res.status(400).json({ 
          error: "paginas_lidas deve ser um número positivo." 
        });
      }

      // ============================================================
      // RESOLUÇÃO DO LIVRO
      // ============================================================
      let livroId = id_livro_lido;

      // Caso 1: Usando nome_livro (mais comum no app)
      if (!livroId && nome_livro) {
        // Tenta encontrar livro existente
        let livro = await LivrosLidos.findOne({
          where: { 
            usuario_id: usuarioId, 
            nome_livro: nome_livro.trim()
          },
          transaction: t
        });

        // Se não existe, cria novo livro
        if (!livro) {
          livro = await LivrosLidos.create({
            usuario_id: usuarioId,
            nome_livro: nome_livro.trim(),
            autor: autor || null,            // ✅ NOVO: salva autor!
            total_pag: null,
            data_inicio: new Date()
          }, { transaction: t });
        } else {
          // Se existe mas não tem autor, atualiza
          if (autor && autor.trim() && !livro.autor) {
            await livro.update(
              { autor: autor.trim() },
              { transaction: t }
            );
          }
        }

        livroId = livro.id_livro_lido;
      }

      // ============================================================
      // REGISTRA A LEITURA
      // ============================================================
      const leitura = await Leitura.create({
        id_livro_lido: livroId,
        usuario_id: usuarioId,
        pag_lidas: paginas,
        nota_leitura: nota || null
      }, { transaction: t });

      // ============================================================
      // REGISTRA XP
      // ============================================================
      const motivo = await Motivo.findByPk(MOTIVO_LEITURA_ID, { 
        transaction: t 
      });

      if (!motivo) {
        await t.rollback();
        return res.status(404).json({ 
          error: "Motivo de leitura não encontrado." 
        });
      }

      await XpLog.create({
        usuario_id: usuarioId,
        id_motivo: motivo.motivo_id,
        xp_ganho: motivo.xp_padrao
      }, { transaction: t });

      // ============================================================
      // SUCESSO: Tudo foi registrado atomicamente
      // ============================================================
      return res.status(201).json({
        leitura,
        xp_ganho: motivo.xp_padrao,
        mensagem: "Leitura registrada com sucesso!"
      });

    } catch (error) {
      await t.rollback();
      console.error('[leituraController] Erro:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};
\`\`\`

---

**Data de criação:** 30 de junho de 2026  
**Última atualização:** Durante preparação para apresentação  
**Status:** Documento completo com Relatório, JogosHabitos e Controllers
