import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';

// ============================================================
// INTERFACE: define a tipagem de cada estilo
// Cada propriedade é tipada como ViewStyle, TextStyle ou ImageStyle
// para garantir que usamos as propriedades corretas em cada elemento.
// ============================================================
interface BeberAguaStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  headerDivider: ViewStyle;
  mainCard: ViewStyle;
  contentContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  gamificationContainer: ViewStyle;
  levelIcon: ImageStyle;
  levelText: TextStyle;
  pointsText: TextStyle;
  counterRow: ViewStyle;
  counterContainer: ViewStyle;
  counterText: TextStyle;
  infoText: TextStyle;
  drinkImage: ImageStyle;
  sectionLabel: TextStyle;
  dropdownContainer: ViewStyle;
  dropdownHeader: ViewStyle;
  dropdownHeaderText: TextStyle;
  dropdownList: ViewStyle;
  dropdownItem: ViewStyle;
  dropdownItemText: TextStyle;
  selectorScroll: ViewStyle;
  optionButton: ViewStyle;
  optionButtonSelected: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
  divider: ViewStyle;
  historyContainer: ViewStyle;
  historyTitle: TextStyle;
  historyAverage: TextStyle;
  historyList: ViewStyle;
  historyItem: ViewStyle;
  historyDate: TextStyle;
  historyValue: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  // ============================================================
  // NOVOS ESTILOS: botão de reset
  // ============================================================
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
}

// ============================================================
// EXPORTAÇÃO DOS ESTILOS
// ============================================================
export const styles = StyleSheet.create<BeberAguaStyle>({

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
  // LINHA DIVISÓRIA (abaixo do header)
  // ============================================================

  headerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginTop: -25,   // Compensa o espaço do Header
    marginBottom: 15,
  },

  // ============================================================
  // CARTÃO PRINCIPAL
  // ============================================================

  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    marginTop: 0,
    // Sombra para iOS
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Sombra para Android
    elevation: 5,
  },

  // Container interno (reservado para ajustes)
  contentContainer: {
    marginTop: 0,
  },

  // ============================================================
  // TÍTULOS
  // ============================================================

  // Título principal (ex.: "Hidratação Diária")
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 5,
    textAlign: 'left',
  },

  // Subtítulo explicativo
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 22,
  },

  // ============================================================
  // GAMIFICAÇÃO (pílula de nível e XP)
  // ============================================================

  gamificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'flex-start',  // Não estica, fica do tamanho do conteúdo
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },

  levelIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },

  levelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 10,
  },

  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    backgroundColor: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // ============================================================
  // CONTADOR E ÍCONE
  // ============================================================

  counterRow: {
    flexDirection: 'row-reverse', // Inverte: ícone à esquerda, contador à direita
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    width: '100%',
  },

  drinkImage: {
    width: 90,
    height: 90,
    marginLeft: 25, // Espaço entre o ícone e o círculo
  },

  // Círculo central com o total consumido
  counterContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Metade da largura = círculo perfeito
    backgroundColor: colors.white,
    borderWidth: 6,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra com efeito "glow"
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  counterText: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.primary,
  },

  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },

  // ============================================================
  // RÓTULOS DE SEÇÃO
  // ============================================================

  sectionLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 5,
  },

  // ============================================================
  // DROPDOWN DE BEBIDAS
  // ============================================================

  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 10, // Fica acima de outros elementos
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
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
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // ============================================================
  // SELETOR DE VOLUME (horizontal)
  // ============================================================

  selectorScroll: {
    width: '100%',
    marginBottom: 15,
  },

  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: colors.white,
    marginRight: 10,
  },

  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  optionTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },

  // ============================================================
  // DIVISÓRIA
  // ============================================================

  divider: {
    height: 2,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 25,
    borderRadius: 1,
  },

  // ============================================================
  // HISTÓRICO
  // ============================================================

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
    backgroundColor: '#F0F9FF',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontWeight: '600',
  },

  historyList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 15,
    borderWidth: 0,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    color: colors.primary,
  },

  // ============================================================
  // BOTÃO DE VOLTAR PARA HÁBITOS
  // Cor azul padrão (colors.primary) para consistência visual.
  // ============================================================

  backButton: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start', // Alinhado à esquerda
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary, // Azul padrão
    textDecorationLine: 'underline',
  },

  // ============================================================
  // BOTÃO DE RESET (zerar registro)
  // ============================================================

  resetButton: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },

  resetButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

});