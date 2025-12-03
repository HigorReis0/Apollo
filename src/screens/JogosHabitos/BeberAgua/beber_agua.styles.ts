import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';

interface BeberAguaStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  
  // Linha divisória do cabeçalho
  headerDivider: ViewStyle;

  mainCard: ViewStyle;
  contentContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  
  // Gamificação
  gamificationContainer: ViewStyle;
  levelIcon: ImageStyle;
  levelText: TextStyle;
  pointsText: TextStyle;

  // Contador e Ícone
  counterRow: ViewStyle;
  counterContainer: ViewStyle;
  counterText: TextStyle;
  infoText: TextStyle;
  drinkImage: ImageStyle;

  // Seletores
  sectionLabel: TextStyle;
  dropdownContainer: ViewStyle;
  dropdownHeader: ViewStyle;
  dropdownHeaderText: TextStyle;
  dropdownList: ViewStyle;
  dropdownItem: ViewStyle;
  dropdownItemText: TextStyle;

  // Botões de Volume
  selectorScroll: ViewStyle;
  optionButton: ViewStyle;
  optionButtonSelected: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;

  // Histórico
  divider: ViewStyle;
  historyContainer: ViewStyle;
  historyTitle: TextStyle;
  historyAverage: TextStyle;
  historyList: ViewStyle;
  historyItem: ViewStyle;
  historyDate: TextStyle;
  historyValue: TextStyle;
}

export const styles = StyleSheet.create<BeberAguaStyle>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // --- Linha Divisória Superior (Ajustada) ---
  headerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    // Aumentei a margem negativa de -10 para -25.
    // Isso puxa a linha bem para cima, compensando quase todo o marginBottom do Header.
    marginTop: -25, 
    marginBottom: 15,
  },

  // --- Card Principal ---
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30, 
    padding: 25,
    marginTop: 0,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  contentContainer: {
    marginTop: 0,
  },
  title: {
    fontSize: 26, 
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 5,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 22,
  },

  // --- Gamificação ---
  gamificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50, 
    marginBottom: 20,
    alignSelf: 'flex-start',
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
  
  // --- Contador e Ícone ---
  counterRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 35,
    width: '100%',
  },
  drinkImage: {
    width: 90,
    height: 90,
    marginLeft: 25,
  },
  counterContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.white,
    borderWidth: 6, 
    borderColor: '#BAE6FD', 
    alignItems: 'center',
    justifyContent: 'center',
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

  // --- Seletores ---
  sectionLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 5,
  },
  
  // Dropdown
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 10,
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
    borderWidth: 0,
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

  // Botões de Volume
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

  // --- Histórico ---
  divider: {
    height: 2, 
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 25,
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
});