// ============================================================
// IMPORTAÇÕES
// ============================================================

// Importa os utilitários de estilo do React Native e os tipos
// ViewStyle: para estilos de View (componentes contêiner)
// TextStyle: para estilos de Text (textos)
// ImageStyle: para estilos de Image (imagens)
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Importa o tema de cores global do Apollo
// Isso mantém a consistência visual com o restante do app
import { colors } from '../../../theme/colors';

// ============================================================
// INTERFACE – define a tipagem de cada estilo
// Isso garante que cada estilo seja usado no tipo correto (View, Text, Image)
// Ajuda a prevenir erros de digitação e facilita a manutenção
// ============================================================
interface LerStyle {
  // ---- CONTAINERS PRINCIPAIS ----
  safeArea: ViewStyle;          // Área segura da tela (evita barra de status)
  container: ViewStyle;         // Container principal da ScrollView

  // ---- CARTÃO PRINCIPAL ----
  mainCard: ViewStyle;          // Cartão branco com sombra e bordas arredondadas
  contentContainer: ViewStyle;  // Container interno do cartão

  // ---- TÍTULO E ÍCONE ----
  titleRow: ViewStyle;          // Linha horizontal com ícone + título
  iconImage: ImageStyle;        // Ícone do livro (imagem)
  title: TextStyle;             // Título "Clube do Livro"
  subtitle: TextStyle;          // Subtítulo descritivo

  // ---- ESTATÍSTICA ----
  statsContainer: ViewStyle;    // Caixa destacada com total de páginas
  statsValue: TextStyle;        // Número grande (ex.: "20")
  statsLabel: TextStyle;        // Texto descritivo ("Páginas lidas este mês")

  // ---- FORMULÁRIO ----
  sectionTitle: TextStyle;      // Título das seções ("Registrar Leitura", etc.)
  inputContainer: ViewStyle;    // Container que agrupa os inputs

  // ---- HISTÓRICO ----
  divider: ViewStyle;           // Linha divisória horizontal
  historyList: ViewStyle;       // Lista de itens do histórico
  historyItem: ViewStyle;       // Cada item do histórico (cartão de leitura)
  bookTitle: TextStyle;         // Nome do livro (negrito)
  bookAuthor: TextStyle;        // Autor do livro (itálico) – NOVO
  bookPages: TextStyle;         // Informação de páginas e data
  bookNote: TextStyle;          // Nota/reflexão (itálico)
  emptyMessage: TextStyle;      // Mensagem quando não há leituras

  // ---- BOTÃO DE VOLTAR ----
  backButton: ViewStyle;        // Botão "← Voltar para Hábitos"
  backButtonText: TextStyle;    // Texto do botão de voltar

  // ============================================================
  // NOVOS ESTILOS: CABEÇALHO DO HISTÓRICO + BOTÃO RELATÓRIO
  // ============================================================
  historyHeader: ViewStyle;     // Linha que alinha título e botão lado a lado
  relatorioButton: ViewStyle;   // Botão "Relatório"
  relatorioButtonText: TextStyle; // Texto do botão "Relatório"
}

// ============================================================
// EXPORTAÇÃO DOS ESTILOS
// ============================================================
export const styles = StyleSheet.create<LerStyle>({

  // ============================================================
  // CONTAINER PRINCIPAL
  // ============================================================

  // SafeAreaView: ocupa toda a tela com fundo definido no tema
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ScrollView: espaçamento lateral e inferior para rolagem
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ============================================================
  // CARTÃO PRINCIPAL (branco, com sombra e bordas arredondadas)
  // ============================================================

  mainCard: {
    backgroundColor: colors.white,        // Fundo branco
    borderRadius: 30,                     // Bordas bem arredondadas
    padding: 25,                          // Espaçamento interno
    marginTop: 10,                        // Separação do topo
    // Sombras para iOS
    shadowColor: colors.primary,          // Cor da sombra (azul)
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Sombra para Android
    elevation: 5,
  },

  // Container interno (reservado para ajustes futuros)
  contentContainer: {
    marginTop: 0,
  },

  // ============================================================
  // TÍTULO E ÍCONE
  // ============================================================

  // Linha horizontal com ícone e título lado a lado
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  // Ícone do livro (imagem)
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  // Título principal "Clube do Livro"
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  // Subtítulo descritivo
  subtitle: {
    fontSize: 14,
    color: '#6B7280',             // Cinza médio
    marginBottom: 20,
    lineHeight: 20,
  },

  // ============================================================
  // ESTATÍSTICA – total de páginas no mês
  // ============================================================

  // Caixa destacada com fundo azul claro
  statsContainer: {
    backgroundColor: '#F0F9FF',    // Azul bem claro
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#BAE6FD',        // Borda azul claro
  },

  // Número grande em destaque
  statsValue: {
    fontSize: 42,
    fontWeight: '900',            // Extra negrito
    color: colors.primary,
  },

  // Texto descritivo abaixo do número
  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 5,
  },

  // ============================================================
  // FORMULÁRIO DE REGISTRO
  // ============================================================

  // Título de cada seção
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15,
    marginTop: 10,
  },

  // Container que agrupa os campos de entrada
  inputContainer: {
    marginBottom: 10,
  },

  // ============================================================
  // DIVISÓRIA E HISTÓRICO
  // ============================================================

  // Linha divisória horizontal (separador visual)
  divider: {
    height: 2,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 25,
    borderRadius: 1,
  },

  // Container da lista de leituras (com espaçamento entre itens)
  historyList: {
    gap: 15,                      // Espaçamento entre os itens (React Native 0.70+)
  },

  // Cada item do histórico (cartão cinza claro com borda)
  historyItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Nome do livro (em negrito, cor escura)
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },

  // ============================================================
  // NOVO ESTILO: AUTOR DO LIVRO (exibido no histórico)
  // ============================================================

  /*
    bookAuthor: estilo para exibir o nome do autor no histórico.
    - Fonte em itálico para diferenciar do título
    - Cor cinza escuro (#4B5563) para contraste suave
    - Margem inferior pequena para separar do próximo elemento
  */
  bookAuthor: {
    fontSize: 13,
    color: '#4B5563',
    fontStyle: 'italic',          // Itálico para destacar que é o autor
    marginBottom: 4,
  },

  // ============================================================
  // INFORMAÇÕES ADICIONAIS DO HISTÓRICO
  // ============================================================

  // Informações: páginas e data (em azul, destaque)
  bookPages: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  // Nota/reflexão (itálico, cinza)
  bookNote: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Mensagem exibida quando não há leituras registradas
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },

  // ============================================================
  // BOTÃO: VOLTAR PARA HÁBITOS (padrão Apollo)
  // ============================================================

  // Container do botão (alinhado à esquerda)
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',       // Alinha o botão à esquerda
  },

  // Texto do botão (azul, sublinhado)
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,         // Azul padrão do tema
    textDecorationLine: 'underline',
  },

  // ============================================================
  // NOVOS ESTILOS: CABEÇALHO DO HISTÓRICO + BOTÃO RELATÓRIO
  // ============================================================

  /*
    historyHeader: linha que alinha o título "Últimas Leituras" e o botão
    "Relatório" lado a lado, com espaçamento entre eles.
  */
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Título à esquerda, botão à direita
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },

  /*
    relatorioButton: botão estilizado para acessar o relatório de leitura.
    - Fundo azul claro (#E0F2FE) com borda azul
    - Cantos arredondados (pílula)
    - Feedback visual com borda para destacar interatividade
  */
  relatorioButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E0F2FE',      // Azul claro
    borderRadius: 20,                // Cantos arredondados (pílula)
    borderWidth: 1,
    borderColor: '#BAE6FD',          // Borda azul
  },

  /*
    relatorioButtonText: texto do botão "Relatório".
    - Cor azul primária (colors.primary)
    - Peso sem negrito (600), tamanho 14
  */
  relatorioButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

});