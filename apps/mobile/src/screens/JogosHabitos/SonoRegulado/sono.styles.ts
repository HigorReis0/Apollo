import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../../theme/colors';

// ============================================================
// INTERFACE: define a tipagem de cada estilo
// ============================================================
interface SonoStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  mainCard: ViewStyle;
  iconHeader: ImageStyle;
  titleRow: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  infoButton: ViewStyle;
  infoText: TextStyle;
  stepperContainer: ViewStyle;
  stepperButton: ViewStyle;
  stepperButtonText: TextStyle;
  stepperValueContainer: ViewStyle;
  stepperValue: TextStyle;
  stepperSub: TextStyle;
  progressContainer: ViewStyle;
  progressRow: ViewStyle;
  progressLabel: TextStyle;
  progressValue: TextStyle;
  progressBarBackground: ViewStyle;
  progressBarFill: ViewStyle;
  // ============================================================
  // NOVOS ESTILOS PARA A SEÇÃO DE INFORMAÇÃO E TABELA DE CICLOS
  // ============================================================
  infoSection: ViewStyle;
  infoTitle: TextStyle;
  table: ViewStyle;
  tableRow: ViewStyle;
  tableRowHighlight: ViewStyle;
  tableCell: TextStyle;
  tableHeader: TextStyle;
  highlightText: TextStyle;
  infoFooter: TextStyle;
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
}

// ============================================================
// EXPORTAÇÃO DOS ESTILOS
// ============================================================
export const styles = StyleSheet.create<SonoStyle>({

  // ============================================================
  // CONTAINER PRINCIPAL
  // ============================================================

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
  },

  // ============================================================
  // BOTÃO DE VOLTAR
  // ============================================================

  backButton: {
    marginBottom: 15,
  },

  backButtonText: {
    color: colors.primary, // Azul padrão (cor consistente)
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // ============================================================
  // CARTÃO PRINCIPAL
  // ============================================================

  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  iconHeader: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },

  // Linha que agrupa título + ícone de informação
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },

  // ============================================================
  // ÍCONE DE INFORMAÇÃO (SOBRE CICLOS DE SONO)
  // ============================================================

  infoButton: {
    marginLeft: 8,
    padding: 4,
  },

  infoText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },

  // ============================================================
  // STEPPER (CICLOS DE 1.5h)
  // ============================================================

  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },

  stepperButton: {
    backgroundColor: '#EF4444', // Vermelho
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  stepperButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  stepperValueContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    minWidth: 80,
  },

  stepperValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  stepperSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // ============================================================
  // BARRA DE PROGRESSO
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
    color: colors.primary,
  },

  progressBarBackground: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary, // Azul consistente com o tema
  },

  // ============================================================
  // SEÇÃO DE INFORMAÇÃO SOBRE CICLOS DE SONO (NOVA)
  // ============================================================

  // Container da seção com tabela explicativa
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Título "Entenda os ciclos de sono"
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },

  // Container da tabela (borda e arredondamento)
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Cada linha da tabela (exceto o cabeçalho)
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  // Linha destacada (5 ciclos = ideal)
  tableRowHighlight: {
    backgroundColor: '#F0F9FF',
  },

  // Cada célula da tabela
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#374151',
  },

  // Cabeçalho da tabela (negrito e fundo cinza)
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
  },

  // Texto em destaque (azul) na linha ideal
  highlightText: {
    fontWeight: 'bold',
    color: '#3B82F6',
  },

  // Rodapé informativo abaixo da tabela
  infoFooter: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // ============================================================
  // BOTÃO DE RESET
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