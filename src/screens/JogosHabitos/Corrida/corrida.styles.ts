// Importa o StyleSheet para criação de regras de estilo CSS-in-JS.
import { StyleSheet } from 'react-native';
// Importa a paleta de cores centralizada do tema.
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // Estilo para o fundo total da tela.
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  // Espaçamento interno do container de rolagem.
  container: { 
    padding: 20 
  },
  
  // Estilo do botão de navegação "Voltar".
  backButton: { 
    marginBottom: 15 
  },
  backButtonText: { 
    color: '#F59E0B', // Tom de laranja para diferenciar da musculação/água.
    fontWeight: 'bold' 
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
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // Dimensões do ícone da atividade.
  iconHeader: { 
    width: 90, 
    height: 90, 
    marginBottom: 15 
  },
  // Estilo do título principal da tela.
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  // Estilo para a frase motivacional abaixo do título.
  subtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 5, 
    paddingHorizontal: 10 
  },

  // Container para a barra de progresso.
  progressContainer: { 
    width: '100%', 
    marginTop: 25 
  },
  // Alinha os textos da meta horizontalmente (esquerda/direita).
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
    color: '#F59E0B' 
  },
  // Estilo do trilho (fundo) da barra de progresso.
  progressBarBackground: { 
    height: 12, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 6, 
    overflow: 'hidden' 
  },
  // Estilo da cor de preenchimento da barra.
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#F59E0B' 
  },

  // Organiza os botões em formato de grade (2 colunas).
  gridButtons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  // Estilo individual dos botões de ação (+KM).
  actionButton: { 
    width: '48%', 
    backgroundColor: colors.white, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FEF3C7' // Borda em tom de laranja suave.
  },
  actionButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },

  // Botão de reset no rodapé da tela.
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