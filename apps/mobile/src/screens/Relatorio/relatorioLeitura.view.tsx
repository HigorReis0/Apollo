// Importa o React — necessário em todo arquivo que usa JSX (sintaxe de componentes)
import React from 'react';

// Importa os componentes nativos do React Native:
// View → container genérico (equivalente a uma <div> no HTML)
// Text → exibe texto na tela
// ScrollView → container com scroll quando o conteúdo ultrapassa a tela
// ActivityIndicator → spinner de carregamento
// SafeAreaView → respeita as bordas seguras do celular (notch, barra de status)
// TouchableOpacity → botão que fica transparente ao toque
// TextInput → campo de entrada de texto
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// Importa o hook de navegação — permite navegar entre telas programaticamente
import { useNavigation } from '@react-navigation/native';

// Importa a tipagem específica para navegação em pilha (Stack Navigator)
// Garante que só rotas existentes podem ser chamadas — type-safety do TypeScript
import { StackNavigationProp } from '@react-navigation/stack';

// Importa a lista de todas as rotas do app — definida no AppNavigator
// Isso garante que navigation.navigate() só aceita nomes de tela válidos
import { RootStackParamList } from '../../navigation/AppNavigator';

// Importa o hook que contém toda a lógica de negócio desta tela
// A View (este arquivo) não tem lógica — só renderiza o que o hook retorna
// Princípio Clean Architecture: separação total entre lógica e interface
import { useRelatorioLeitura } from './useRelatorioLeitura';

// Importa os estilos em arquivo separado — padrão do projeto Apollo
// Mantém a view limpa e os estilos organizados e reutilizáveis
import { styles } from './relatorioLeitura.styles';

// Importa as cores centralizadas do tema do app
// Centralizar cores evita valores hardcoded espalhados (princípio DRY)
import { colors } from '../../theme/colors';

// ============================================================
// TIPAGEM DA NAVEGAÇÃO
// Define que esta tela é a 'RelatorioLeitura' dentro da pilha de navegação
// Permite que o TypeScript valide as chamadas de navigation.navigate()
// ============================================================
type NavigationProp = StackNavigationProp<RootStackParamList, 'RelatorioLeitura'>;

// ============================================================
// COMPONENTE PRINCIPAL: RelatorioLeituraScreen
// É uma função que retorna JSX (a interface visual da tela)
// Segue o padrão View da Clean Architecture — sem lógica de negócio
// ============================================================
export default function RelatorioLeituraScreen() {

  // Inicializa o objeto de navegação com a tipagem correta
  const navigation = useNavigation<NavigationProp>();

  // Desestrutura tudo que o hook retorna:
  // dados → objeto com as métricas vindas do backend
  // isLoading → boolean que indica se está carregando
  // error → string com mensagem de erro, ou null
  // meta → número atual da meta mensal (estado local, atualiza na hora)
  // editandoMeta → boolean que controla se o formulário de edição está visível
  // setEditandoMeta → função para abrir/fechar o formulário de edição
  // novaMeta → string com o valor digitado pelo usuário no campo de edição
  // setNovaMeta → função que atualiza o valor digitado
  // salvarMeta → função que envia a nova meta para o backend e atualiza o estado
  const {
    dados,
    isLoading,
    error,
    meta,
    editandoMeta,
    setEditandoMeta,
    novaMeta,
    setNovaMeta,
    salvarMeta,
  } = useRelatorioLeitura();

  // ============================================================
  // RENDERIZAÇÃO CONDICIONAL
  // O React renderiza condicionalmente baseado no estado atual
  // Cada condição retorna uma tela diferente — padrão Guard Clause
  // ============================================================

  // Condição 1: enquanto os dados estão sendo buscados na API
  // isLoading é true durante o fetch — exibe um spinner centralizado
  if (isLoading) {
    return (
      // SafeAreaView garante que o conteúdo não fica atrás do notch
      <SafeAreaView style={styles.container}>
        {/* ActivityIndicator = spinner giratório nativo do sistema */}
        {/* color={colors.primary} = usa a cor azul primária do tema Apollo */}
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Condição 2: se houve algum erro na requisição ao backend
  // error contém a mensagem de erro capturada no catch do hook
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Exibe a mensagem de erro para o usuário */}
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Condição 3: se o usuário nunca registrou nenhuma leitura
  // dados.total_paginas_geral === 0 significa banco vazio para este usuário
  if (!dados || dados.total_paginas_geral === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          {/* Título da tela */}
          <Text style={styles.titulo}>📚 Relatório de Leitura</Text>

          {/* Mensagem explicando que não há dados ainda */}
          <Text style={styles.emptyText}>
            Você ainda não registrou nenhuma leitura.
          </Text>

          {/* Mensagem incentivando o usuário a começar */}
          <Text style={styles.emptySubtext}>
            Comece agora mesmo e acompanhe seu progresso!
          </Text>

          {/* Botão que navega para a tela de Leitura */}
          {/* navigation.navigate('Ler') leva para a tela de registro de leitura */}
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
  // CÁLCULO DO PERCENTUAL LOCAL
  // Em vez de usar dados.percentual_meta (que vem do backend e só
  // atualiza na próxima requisição), calculamos localmente usando
  // o estado 'meta' do hook — que é atualizado imediatamente ao salvar.
  // Isso garante que a barra e o texto respondem na hora.
  // Math.min(..., 100) garante que o percentual nunca ultrapasse 100%
  // ============================================================
  const percentualLocal = dados && meta > 0
    ? Math.min(Math.round((dados.total_paginas_mes / meta) * 100), 100)
    : 0; // Fallback para 0 se não há dados ou meta inválida

  // ============================================================
  // RENDERIZAÇÃO PRINCIPAL
  // Só chega aqui se: não está carregando, sem erro e tem dados
  // ============================================================
  return (
    // SafeAreaView respeita as áreas seguras do dispositivo
    <SafeAreaView style={styles.container}>

      {/* ScrollView permite rolar o conteúdo verticalmente */}
      {/* contentContainerStyle aplica padding/margin ao conteúdo interno */}
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── BOTÃO DE VOLTAR ── */}
        {/* navigation.goBack() volta para a tela anterior na pilha */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar para a tela anterior</Text>
        </TouchableOpacity>

        {/* ── CABEÇALHO ── */}
        {/* Título principal da tela */}
        <Text style={styles.titulo}>📚 Relatório de Leitura</Text>

        {/* Subtítulo descritivo */}
        <Text style={styles.subtitulo}>Análise do seu progresso como leitor</Text>

        {/* ── GRID DE MÉTRICAS ── */}
        {/* View com flexWrap que organiza os cards em 2 colunas */}
        <View style={styles.grid}>

          {/* Card 1: Total de páginas lidas em toda a história do usuário */}
          {/* dados.total_paginas_geral → resultado do SUM(pag_lidas) no backend */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📖</Text>
            <Text style={styles.cardValor}>{dados.total_paginas_geral}</Text>
            <Text style={styles.cardLabel}>Total de páginas lidas</Text>
          </View>

          {/* Card 2: Total de livros cadastrados pelo usuário */}
          {/* dados.total_livros → resultado do COUNT na tabela tab_livros_lidos */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📚</Text>
            <Text style={styles.cardValor}>{dados.total_livros}</Text>
            <Text style={styles.cardLabel}>Livros registrados</Text>
          </View>

          {/* Card 3: Total de sessões de leitura no mês atual */}
          {/* dados.total_sessoes_mes → COUNT filtrado por data_hora >= início do mês */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📅</Text>
            <Text style={styles.cardValor}>{dados.total_sessoes_mes}</Text>
            <Text style={styles.cardLabel}>Sessões este mês</Text>
          </View>

          {/* Card 4: Média de páginas por sessão */}
          {/* dados.media_por_sessao → total_paginas / total_sessoes (equivalente ao AVG) */}
          {/* .toFixed(1) → formata com 1 casa decimal (ex: 120.0) */}
          <View style={styles.card}>
            <Text style={styles.cardIcone}>📊</Text>
            <Text style={styles.cardValor}>
              {dados.media_por_sessao.toFixed(1)}
            </Text>
            <Text style={styles.cardLabel}>Média págs/sessão</Text>
          </View>

        </View>

        {/* ── BARRA DE PROGRESSO DA META MENSAL ── */}
        <View style={styles.metaContainer}>

          {/* Linha do topo: título à esquerda e percentual à direita */}
          <View style={styles.metaHeader}>
            <Text style={styles.metaTitulo}>🎯 Meta Mensal</Text>
            {/* percentualLocal → calculado localmente, reflete a meta atual imediatamente */}
            <Text style={styles.metaPercentual}>{percentualLocal}%</Text>
          </View>

          {/* Container cinza de fundo da barra */}
          <View style={styles.barraFundo}>
            {/* Barra colorida preenchida proporcionalmente ao percentual */}
            {/* width é uma string com % — o 'as any' evita erro de tipagem do TypeScript */}
            <View
              style={[
                styles.barraPreenchida,
                { width: `${percentualLocal}%` as any },
              ]}
            />
          </View>

          {/* Rodapé da barra: texto com progresso e botão de editar */}
          <View style={styles.metaFooter}>

            {/* Texto mostrando páginas do mês versus meta atual */}
            {/* 'meta' vem do estado local — atualiza imediatamente após salvar */}
            <Text style={styles.metaTexto}>
              {dados.total_paginas_mes} / {meta} páginas este mês
            </Text>

            {/* Renderização condicional do botão ou formulário de edição */}
            {/* Se NÃO está editando: mostra o botão "Editar Meta" */}
            {!editandoMeta ? (
              <TouchableOpacity
                style={styles.editarMetaButton}
                onPress={() => setEditandoMeta(true)} // Abre o formulário de edição
              >
                <Text style={styles.editarMetaButtonText}>✎ Editar Meta</Text>
              </TouchableOpacity>
            ) : (
              // Se ESTÁ editando: mostra o formulário com input e botões
              <View style={styles.editarMetaInputContainer}>

                {/* Campo de texto para digitar a nova meta */}
                {/* keyboardType="numeric" → abre teclado numérico no celular */}
                {/* value e onChangeText → controlled input (estado novaMeta controla o valor) */}
                <TextInput
                  style={styles.editarMetaInput}
                  keyboardType="numeric"
                  value={novaMeta}
                  onChangeText={setNovaMeta} // Atualiza novaMeta a cada tecla digitada
                  placeholder="Nova meta"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Botão Salvar — chama a função que envia para o backend */}
                <TouchableOpacity
                  style={styles.editarMetaSalvar}
                  onPress={salvarMeta} // Envia PUT /usuarios/meta-leitura com o novo valor
                >
                  <Text style={styles.editarMetaSalvarText}>Salvar</Text>
                </TouchableOpacity>

                {/* Botão Cancelar — fecha o formulário e restaura o valor anterior */}
                <TouchableOpacity
                  style={styles.editarMetaCancelar}
                  onPress={() => {
                    setEditandoMeta(false);       // Fecha o formulário
                    setNovaMeta(String(meta));    // Restaura o campo com o valor atual
                  }}
                >
                  <Text style={styles.editarMetaCancelarText}>Cancelar</Text>
                </TouchableOpacity>

              </View>
            )}
          </View>
        </View>

        {/* ── ÚLTIMO LIVRO LIDO ── */}
        {/* Renderiza apenas se dados.ultimo_livro não for null */}
        {/* O backend retorna null se o usuário não tem sessões com livro associado */}
        {dados.ultimo_livro && (
          <View style={styles.ultimoLivro}>
            <Text style={styles.ultimoLivroTitulo}>📖 Último livro lido</Text>

            {/* Nome do livro — vem do JOIN com tab_livros_lidos no backend */}
            <Text style={styles.ultimoLivroNome}>
              {dados.ultimo_livro.nome}
            </Text>

            {/* Autor do livro */}
            <Text style={styles.ultimoLivroAutor}>
              - {dados.ultimo_livro.autor}
            </Text>

            {/* Quantidade de páginas lidas na sessão mais recente */}
            <Text style={styles.ultimoLivroPaginas}>
              - {dados.ultimo_livro.paginas_ultima_sessao} páginas na última sessão
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}