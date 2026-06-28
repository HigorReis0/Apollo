import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // Fundo principal.
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  
  // Estilo do link de retorno.
  backButton: { marginBottom: 15 },
  backButtonText: { color: colors.primary, fontWeight: 'bold' },

  // Card principal.
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconHeader: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textDark },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 10, lineHeight: 20 },

  // Indicador de status (Pendente/Concluído).
  statusBadge: {
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6'
  },
  statusText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },

  // Botão de Ação Principal.
  actionButton: { 
    width: '100%', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 2
  },
  buttonActive: { backgroundColor: colors.primary },
  buttonDone: { backgroundColor: '#D1D5DB' },
  actionButtonText: { fontSize: 18, fontWeight: 'bold', color: colors.white },

  // Botão de reset.
  resetButton: { marginTop: 20, alignItems: 'center' },
  resetButtonText: { color: '#9CA3AF', fontSize: 14, textDecorationLine: 'underline' }
});