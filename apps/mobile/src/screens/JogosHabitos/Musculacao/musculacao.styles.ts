import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';

interface MusculacaoStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  mainCard: ViewStyle;
  iconHeader: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  metaContainer: ViewStyle;
  metaLabel: TextStyle;
  metaRow: ViewStyle;
  metaInput: TextStyle;
  metaButton: ViewStyle;
  metaButtonText: TextStyle;
  metaAtual: TextStyle;
  metaAlcancada: TextStyle;
  progressContainer: ViewStyle;
  progressRow: ViewStyle;
  progressLabel: TextStyle;
  progressValue: TextStyle;
  progressBarBackground: ViewStyle;
  progressBarFill: ViewStyle;
  sectionCard: ViewStyle;
  sectionTitle: TextStyle;
  chipContainer: ViewStyle;
  chip: ViewStyle;
  chipActive: ViewStyle;
  chipText: TextStyle;
  chipTextActive: TextStyle;
  gridButtons: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
}

export const styles = StyleSheet.create<MusculacaoStyle>({

  // Container principal
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
  },

  // Card principal
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  iconHeader: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },

  // Meta personalizada
  metaContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    width: '100%',
  },

  metaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  metaInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },

  metaButton: {
    backgroundColor: colors.primary, // AZUL PADRÃO
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  metaButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },

  metaAtual: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },

  metaAlcancada: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary, // AGORA AZUL (padrão)
    marginTop: 8,
    textAlign: 'center',
  },

  // Progresso
  progressContainer: {
    width: '100%',
    marginTop: 10,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },

  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary, // AZUL
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary, // AZUL
  },

  // Grupo muscular
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 15,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  chipActive: {
    backgroundColor: colors.primary, // AZUL
    borderColor: colors.primary,     // AZUL
  },

  chipText: {
    fontSize: 12,
    color: '#6B7280',
  },

  chipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Botões de registro
  gridButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionButton: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  resetButton: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  resetButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'underline',
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