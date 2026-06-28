// Importa o StyleSheet e os tipos de estilo do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa a paleta de cores centralizada do tema.
import { colors } from '../../../theme/colors';

// Interface TypeScript que define estritamente o tipo de cada propriedade de estilo
interface CorridaStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
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
  gridButtons: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
}

export const styles = StyleSheet.create<CorridaStyle>({
  // Estilo para o fundo total da tela.
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Espaçamento interno do container de rolagem.
  container: {
    padding: 20,
  },

  // ============================================================
  // BOTÃO DE VOLTAR (PADRÃO AZUL)
  // ============================================================
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: colors.primary, // Azul padrão
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // Estilo do card branco centralizado com sombra.
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4, // Sombra para Android.
    shadowColor: '#000', // Sombra para iOS.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // Dimensões do ícone da atividade.
  iconHeader: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },
  // Estilo do título principal da tela.
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  // Estilo para a frase motivacional abaixo do título.
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },

  // ============================================================
  // SEÇÃO: META PERSONALIZADA (PADRÃO CINZA)
  // ============================================================

  metaContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F3F4F6', // Cinza claro (padrão)
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

  // Botão "Salvar" em azul padrão
  metaButton: {
    backgroundColor: colors.primary, // Azul padrão
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

  // Mensagem de meta alcançada (ALTERADO: agora é AZUL)
  metaAlcancada: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary, // Azul padrão (antes era verde)
    marginTop: 8,
    textAlign: 'center',
  },

  // ============================================================
  // BARRA DE PROGRESSO (PADRÃO AZUL)
  // ============================================================

  progressContainer: {
    width: '100%',
    marginTop: 25,
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
    color: colors.primary, // Azul padrão
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary, // Azul padrão
  },

  // ============================================================
  // GRID DE BOTÕES (+KM) - PADRÃO CINZA
  // ============================================================

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
    borderColor: '#E5E7EB', // Cinza padrão
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  // ============================================================
  // BOTÃO DE RESET (PADRÃO CINZA)
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