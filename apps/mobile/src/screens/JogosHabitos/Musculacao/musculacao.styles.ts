// Importa o construtor nativo StyleSheet e as tipagens de estilo do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa o arquivo centralizado de cores do tema.
import { colors } from '../../../theme/colors';

// Interface TypeScript para validação estrita das chaves de estilização da musculação.
interface MusculacaoStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  mainCard: ViewStyle;
  iconHeader: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
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
}

export const styles = StyleSheet.create<MusculacaoStyle>({
  // Fundo principal da tela respeitando a cor do tema.
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  // Espaçamento interno das bordas da tela.
  container: { 
    padding: 20 
  },
  
  // Estilo do card branco flutuante principal.
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4, // Sombra para Android.
    shadowColor: '#000', // Sombra para iOS.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  // Tamanho do ícone central.
  iconHeader: { 
    width: 80, 
    height: 80, 
    marginBottom: 15 
  },
  // Título em destaque.
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  // Frase motivacional.
  subtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 5 
  },

  // Container que organiza a barra de progresso.
  progressContainer: { 
    width: '100%', 
    marginTop: 25 
  },
  // Alinha o rótulo e o valor numérico em extremidades opostas.
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
    color: colors.primary 
  },
  // Trilho da barra de progresso.
  progressBarBackground: { 
    height: 12, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 6, 
    overflow: 'hidden' 
  },
  // Preenchimento da barra (usando vermelho para diferenciar de 'água').
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#EF4444' 
  },

  // Estilo do cartão da seção de grupos musculares.
  sectionCard: { 
    backgroundColor: colors.white, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.textDark, 
    marginBottom: 15 
  },
  // Organiza os chips um ao lado do outro com propriedade gap para espaçamento nativo.
  chipContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  // Estilo padrão do chip desativado.
  chip: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: '#F3F4F6', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  // Estilo do chip quando está selecionado.
  chipActive: { 
    backgroundColor: '#EF4444', 
    borderColor: '#EF4444' 
  },
  chipText: { 
    fontSize: 12, 
    color: '#6B7280' 
  },
  chipTextActive: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },

  // Grid para os botões de ação (2 por linha).
  gridButtons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  // Estilo individual do botão de adicionar minutos.
  actionButton: { 
    width: '48%', 
    backgroundColor: colors.white, 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  actionButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },

  // Botão de reset no final da tela.
  resetButton: { 
    marginTop: 10, 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  resetButtonText: { 
    color: '#9CA3AF', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  }
});