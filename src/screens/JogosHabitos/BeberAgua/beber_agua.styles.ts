// Importa utilitários de estilo e tipos para garantir que as propriedades de estilo sejam válidas.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa o objeto de cores do tema global (subindo 3 níveis de diretório).
import { colors } from '../../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos.
// Isso ajuda o editor a sugerir propriedades corretas (ex: não sugerir 'color' para uma ViewStyle).
interface BeberAguaStyle {
  safeArea: ViewStyle;          // Área segura da tela.
  container: ViewStyle;         // Container principal rolável.
  
  // Linha divisória do cabeçalho
  headerDivider: ViewStyle;     // Estilo da linha separadora abaixo do header.

  // Card Principal e Conteúdo
  mainCard: ViewStyle;          // O cartão branco principal.
  contentContainer: ViewStyle;  // Container interno do cartão.
  title: TextStyle;             // Título principal ("Hidratação Diária").
  subtitle: TextStyle;          // Subtítulo explicativo.
  
  // Gamificação (Barra de Nível/XP)
  gamificationContainer: ViewStyle; // Container da pílula de gamificação.
  levelIcon: ImageStyle;            // Ícone do nível (ex: medalha/óculos).
  levelText: TextStyle;             // Texto do nível ("Hidratado").
  pointsText: TextStyle;            // Texto dos pontos (XP).

  // Contador e Ícone
  counterRow: ViewStyle;        // Linha que contém a imagem da bebida e o contador circular.
  counterContainer: ViewStyle;  // O círculo central com o número.
  counterText: TextStyle;       // O número grande (ml consumidos).
  infoText: TextStyle;          // Texto pequeno abaixo do número ("ml / 2000").
  drinkImage: ImageStyle;       // A imagem da bebida (copo, garrafa, etc).

  // Seletores (Dropdown)
  sectionLabel: TextStyle;      // Título das seções ("O que você vai beber?").
  dropdownContainer: ViewStyle; // Container do menu dropdown.
  dropdownHeader: ViewStyle;    // A parte clicável do dropdown (mostra a seleção atual).
  dropdownHeaderText: TextStyle;// Texto dentro do header do dropdown.
  dropdownList: ViewStyle;      // A lista de opções que aparece ao abrir.
  dropdownItem: ViewStyle;      // Cada item clicável da lista.
  dropdownItemText: TextStyle;  // Texto de cada item da lista.

  // Botões de Volume (Scroll Horizontal)
  selectorScroll: ViewStyle;    // O ScrollView horizontal dos botões de volume.
  optionButton: ViewStyle;      // Estilo base do botão de volume.
  optionButtonSelected: ViewStyle; // Estilo extra quando o botão está selecionado.
  optionText: TextStyle;        // Texto base do botão.
  optionTextSelected: TextStyle;// Texto do botão quando selecionado.

  // Histórico
  divider: ViewStyle;           // Linha divisória fina.
  historyContainer: ViewStyle;  // Container da seção de histórico.
  historyTitle: TextStyle;      // Título "Histórico Recente".
  historyAverage: TextStyle;    // Texto da média diária.
  historyList: ViewStyle;       // Container da lista de itens.
  historyItem: ViewStyle;       // Linha de cada item do histórico.
  historyDate: TextStyle;       // Data do histórico.
  historyValue: TextStyle;      // Valor consumido no histórico.
}

// Criação e exportação dos estilos.
export const styles = StyleSheet.create<BeberAguaStyle>({
  // Garante que a tela ocupe todo o espaço e tenha o fundo cinza claro.
  safeArea: {
    flex: 1, 
    backgroundColor: colors.background,
  },
  // Configuração do ScrollView principal.
  container: {
    flexGrow: 1, // Permite que o container cresça para permitir rolagem.
    paddingHorizontal: 20, // Espaçamento nas laterais da tela.
    paddingBottom: 40, // Espaço extra no final para não cortar conteúdo.
  },
  
  // --- Linha Divisória Superior (Ajustada) ---
  headerDivider: {
    height: 1, // Altura de 1 pixel (linha fina).
    backgroundColor: '#E5E7EB', // Cor cinza claro.
    width: '100%', // Ocupa toda a largura.
    // Margem negativa para puxar a linha para cima, compensando o espaço do Header.
    marginTop: -25, 
    marginBottom: 15, // Espaço abaixo da linha.
  },

  // --- Card Principal ---
  mainCard: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 30, // Bordas bem arredondadas.
    padding: 25, // Espaçamento interno.
    marginTop: 0,
    // Sombras (iOS):
    shadowColor: colors.primary, // Sombra azulada.
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Sombra (Android):
    elevation: 5,
  },
  contentContainer: {
    marginTop: 0,
  },
  title: {
    fontSize: 26, 
    fontWeight: 'bold', // Negrito forte.
    color: colors.textDark, // Preto.
    marginBottom: 5,
    textAlign: 'left', // Alinhado à esquerda.
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280', // Cinza médio.
    textAlign: 'left',
    marginBottom: 30, // Espaço grande antes do contador.
    lineHeight: 22, // Altura da linha para melhor leitura.
  },

  // --- Gamificação ---
  gamificationContainer: {
    flexDirection: 'row', // Ícone e texto lado a lado.
    alignItems: 'center', // Centraliza verticalmente.
    backgroundColor: '#F0F9FF', // Fundo azul bem claro.
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50, // Bordas totalmente arredondadas (pílula).
    marginBottom: 20,
    alignSelf: 'flex-start', // O container ocupa apenas o espaço necessário (não estica).
    borderWidth: 2,
    borderColor: '#BAE6FD', // Borda azul claro.
  },
  levelIcon: {
    width: 35,
    height: 35,
    marginRight: 10, // Espaço entre ícone e texto.
  },
  levelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary, // Texto azul.
    marginRight: 10,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    backgroundColor: colors.white, // Fundo branco para destacar o XP.
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden', // Garante que o fundo respeite o borderRadius.
  },
  
  // --- Contador e Ícone ---
  counterRow: {
    flexDirection: 'row-reverse', // Inverte a ordem: [Contador] [Imagem] -> [Imagem] [Contador].
    alignItems: 'center', // Centraliza verticalmente.
    justifyContent: 'center', // Centraliza horizontalmente.
    marginBottom: 35,
    width: '100%',
  },
  drinkImage: {
    width: 90,
    height: 90,
    marginLeft: 25, // Espaço à esquerda (que na verdade separa do contador devido ao row-reverse ou ordem visual).
  },
  counterContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Metade da largura/altura = Círculo perfeito.
    backgroundColor: colors.white,
    borderWidth: 6, // Borda grossa.
    borderColor: '#BAE6FD', // Cor da borda azul claro.
    alignItems: 'center', // Centraliza o texto dentro do círculo.
    justifyContent: 'center',
    // Sombra do círculo:
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 }, // Sombra centralizada (glow).
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  counterText: {
    fontSize: 40, // Número bem grande.
    fontWeight: '900', // Extra negrito (Black).
    color: colors.primary,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },

  // --- Seletores ---
  sectionLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    alignSelf: 'flex-start', // Alinha à esquerda.
    marginBottom: 12,
    marginTop: 5,
  },
  
  // Dropdown
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 10, // Garante que o dropdown fique sobre outros elementos se eles se sobrepuserem.
  },
  dropdownHeader: {
    flexDirection: 'row', // Texto e setinha lado a lado.
    justifyContent: 'space-between', // Espalha (texto na esq, seta na dir).
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Fundo cinza claro.
    borderRadius: 16, 
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 0, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  dropdownList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 8, // Espaço entre o header e a lista.
    overflow: 'hidden', // Garante que os itens não vazem das bordas arredondadas.
    borderWidth: 0,
    // Sombra da lista aberta:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1, // Linha separadora entre itens.
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Botões de Volume
  selectorScroll: {
    width: '100%',
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30, // Formato de pílula.
    borderWidth: 2, 
    borderColor: '#E5E7EB', // Borda cinza padrão.
    backgroundColor: colors.white,
    marginRight: 10, // Espaço entre os botões.
  },
  // Estilo aplicado quando o botão está selecionado:
  optionButtonSelected: {
    backgroundColor: colors.primary, // Fundo azul.
    borderColor: colors.primary, // Borda azul.
    // Sombra colorida para destaque:
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280', // Texto cinza padrão.
  },
  // Texto quando selecionado:
  optionTextSelected: {
    color: colors.white, // Texto branco.
    fontWeight: 'bold',
  },

  // --- Histórico ---
  divider: {
    height: 2, 
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 25, // Espaçamento vertical generoso.
    borderRadius: 1,
  },
  historyContainer: {
    width: '100%',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  historyAverage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    backgroundColor: '#F0F9FF', // Destaque azul claro.
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontWeight: '600',
  },
  historyList: {
    backgroundColor: '#F9FAFB', // Fundo cinza para a lista inteira.
    borderRadius: 20,
    padding: 15,
    borderWidth: 0,
  },
  historyItem: {
    flexDirection: 'row', // Data na esq, valor na dir.
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1, // Linha separadora.
    borderBottomColor: '#E5E7EB',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  historyValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary, // Valor em destaque (azul).
  },
});