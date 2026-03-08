// Importa os utilitários de criação de estilo e os tipos de estilo do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa as cores do tema global, subindo 3 níveis na estrutura de pastas.
import { colors } from '../../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos deste arquivo.
// Isso ajuda a prevenir erros de digitação e garante que estamos usando as propriedades corretas (View vs Text vs Image).
interface LerStyle {
  safeArea: ViewStyle;          // Estilo da área segura da tela.
  container: ViewStyle;         // Estilo do container principal de rolagem.
  
  // Card Principal
  mainCard: ViewStyle;          // Estilo do cartão branco principal.
  contentContainer: ViewStyle;  // Estilo para o conteúdo dentro do cartão.
  
  // Cabeçalho da Seção
  titleRow: ViewStyle;          // Container (linha) para o ícone e o título.
  iconImage: ImageStyle;        // Estilo da imagem do ícone.
  title: TextStyle;             // Estilo do texto do título.
  subtitle: TextStyle;          // Estilo do texto do subtítulo.

  // Estatísticas (Contador)
  statsContainer: ViewStyle;    // Container para a caixa de estatísticas destacada.
  statsValue: TextStyle;        // Estilo para o número grande (valor).
  statsLabel: TextStyle;        // Estilo para o texto descritivo abaixo do valor.

  // Seção de Formulário
  sectionTitle: TextStyle;      // Estilo para os títulos de seção ("Registrar Leitura", etc.).
  inputContainer: ViewStyle;    // Container que agrupa os inputs.
  
  // Histórico
  divider: ViewStyle;           // Estilo para a linha divisória horizontal.
  historyList: ViewStyle;       // Container para a lista de itens do histórico.
  historyItem: ViewStyle;       // Estilo para cada item individual do histórico.
  bookTitle: TextStyle;         // Estilo para o nome do livro no histórico.
  bookPages: TextStyle;         // Estilo para a informação de páginas e data.
  bookNote: TextStyle;          // Estilo para a nota/reflexão do livro.
}

// Criação e exportação do objeto de estilos.
export const styles = StyleSheet.create<LerStyle>({
  // Garante que a tela ocupe todo o espaço vertical disponível.
  safeArea: {
    flex: 1, 
    backgroundColor: colors.background, // Cor de fundo global (cinza claro).
  },
  // Configuração do ScrollView principal.
  container: {
    flexGrow: 1, // Permite que o conteúdo cresça além da tela para rolar.
    paddingHorizontal: 20, // Espaçamento nas laterais.
    paddingBottom: 40, // Espaço extra no final para não cortar conteúdo.
  },
  
  // --- Card Principal (Estilo "Macio") ---
  mainCard: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 30, // Bordas bem arredondadas.
    padding: 25, // Espaçamento interno.
    marginTop: 10, // Separação do topo.
    // Sombras suaves para dar profundidade (iOS):
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Sombra para Android:
    elevation: 5,
  },
  // Ajuste fino para o container de conteúdo (se necessário).
  contentContainer: {
    marginTop: 0,
  },

  // --- Título e Ícone ---
  titleRow: {
    flexDirection: 'row', // Alinha ícone e texto na horizontal.
    alignItems: 'center', // Centraliza verticalmente.
    marginBottom: 5, // Espaço abaixo do título.
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10, // Espaço entre o ícone e o texto.
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark, // Cor escura para destaque.
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280', // Cinza médio para texto secundário.
    marginBottom: 20, // Espaço maior para separar do bloco de estatísticas.
    lineHeight: 20, // Altura da linha para melhor leitura.
  },

  // --- Contador de Páginas (Destaque) ---
  statsContainer: {
    backgroundColor: '#F0F9FF', // Azul bem claro (fundo do destaque).
    borderRadius: 20,
    padding: 20,
    alignItems: 'center', // Centraliza o texto no meio da caixa.
    marginBottom: 25,
    borderWidth: 2, // Borda para dar destaque.
    borderColor: '#BAE6FD', // Cor da borda (azul claro).
  },
  statsValue: {
    fontSize: 42, // Fonte bem grande para o número.
    fontWeight: '900', // Extra negrito.
    color: colors.primary, // Cor principal (azul).
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 5,
  },

  // --- Formulário ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15, // Espaço entre o título e os inputs.
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 10, // Espaço entre o grupo de inputs e o botão.
  },

  // --- Histórico ---
  divider: {
    height: 2, // Altura da linha.
    backgroundColor: '#F3F4F6', // Cor cinza claro para a linha.
    width: '100%',
    marginVertical: 25, // Espaço acima e abaixo da linha.
    borderRadius: 1,
  },
  historyList: {
    gap: 15, // (Propriedade nova do RN) Espaçamento entre itens da lista.
  },
  historyItem: {
    backgroundColor: '#F9FAFB', // Fundo cinza bem claro para cada item.
    borderRadius: 16,
    padding: 15,
    borderWidth: 1, // Borda fina para definição.
    borderColor: '#E5E7EB',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  bookPages: {
    fontSize: 12,
    color: colors.primary, // Destaque na cor azul.
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookNote: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic', // Texto em itálico para indicar citação/nota.
    lineHeight: 18,
  },
});