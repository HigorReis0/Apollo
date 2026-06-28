import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';

interface LerStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  mainCard: ViewStyle;
  contentContainer: ViewStyle;
  titleRow: ViewStyle;
  iconImage: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  statsContainer: ViewStyle;
  statsValue: TextStyle;
  statsLabel: TextStyle;
  sectionTitle: TextStyle;
  inputContainer: ViewStyle;
  divider: ViewStyle;
  historyList: ViewStyle;
  historyItem: ViewStyle;
  bookTitle: TextStyle;
  bookPages: TextStyle;
  bookNote: TextStyle;
  emptyMessage: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
}

export const styles = StyleSheet.create<LerStyle>({

  // Container principal
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Card principal
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },

  contentContainer: {
    marginTop: 0,
  },

  // Título e ícone
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },

  // Estatística
  statsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },

  statsValue: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
  },

  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 5,
  },

  // Formulário
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15,
    marginTop: 10,
  },

  inputContainer: {
    marginBottom: 10,
  },

  // Divisória e histórico
  divider: {
    height: 2,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 25,
    borderRadius: 1,
  },

  historyList: {
    gap: 15,
  },

  historyItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
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
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  bookNote: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },

  // ============================================================
  // BOTÃO DE VOLTAR (cor azul padrão)
  // ============================================================
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary, // Azul padrão
    textDecorationLine: 'underline',
  },

});