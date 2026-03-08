// Importa o StyleSheet para gerenciar os estilos da tela.
import { StyleSheet } from 'react-native';
// Importa as cores globais definidas no tema do Apollo.
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // Fundo principal da tela.
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  container: { 
    padding: 20 
  },
  
  // Estilo do link de retorno.
  backButton: { 
    marginBottom: 15 
  },
  backButtonText: { 
    color: '#4F46E5', // Azul profundo/Indigo para o tema noturno.
    fontWeight: 'bold' 
  },

  // Card principal com cantos arredondados e sombra.
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconHeader: { 
    width: 90, 
    height: 90, 
    marginBottom: 15 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 5 
  },

  // Configuração da barra de progresso diário.
  progressContainer: { 
    width: '100%', 
    marginTop: 25 
  },
  progressRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  progressLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#4B5563' 
  },
  progressValue: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#4F46E5' 
  },
  progressBarBackground: { 
    height: 12, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 6, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#4F46E5' 
  },

  // Grid para os botões de ação rápidos.
  gridButtons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  actionButton: { 
    width: '48%', 
    backgroundColor: colors.white, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF' 
  },
  actionButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },

  // Botão de reset no rodapé.
  resetButton: { 
    marginTop: 10, 
    marginBottom: 30, 
    alignItems: 'center' 
  },
  resetButtonText: { 
    color: '#9CA3AF', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  }
});