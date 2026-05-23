// Importa o construtor nativo StyleSheet e as tipagens de estilo do React Native.
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
// Importa a paleta de cores globais do projeto.
import { colors } from '../../../theme/colors';

// Interface TypeScript para validação estrita das chaves de estilização da tela.
interface MontarRotinaStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  introCard: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  listContainer: ViewStyle;
  habitRow: ViewStyle;
  habitRowActive: ViewStyle;
  habitRowInactive: ViewStyle;
  habitInfo: ViewStyle;
  habitTitle: TextStyle;
  habitCategory: TextStyle;
  checkboxBase: ViewStyle;
  checkboxChecked: ViewStyle;
  checkboxUnchecked: ViewStyle;
  checkboxCheckmark: TextStyle;
  summaryCard: ViewStyle;
  summaryInfo: ViewStyle;
  summaryLabel: TextStyle;
  summaryValue: TextStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
}

export const styles = StyleSheet.create<MontarRotinaStyle>({
  // Ocupa todo o espaço útil e define o fundo com o padrão do app.
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  // Preenchimento interno de 20 pontos para afastar os componentes das bordas.
  container: { 
    padding: 20 
  },
  
  // Margem inferior para afastar o botão de voltar do título.
  backButton: { 
    marginBottom: 15 
  },
  // Estiliza o texto do botão com tom Indigo/Azul corporativo e negrito.
  backButtonText: { 
    color: '#4F46E5', 
    fontWeight: 'bold' 
  },

  // Estilização do card de apresentação superior.
  introCard: { 
    marginBottom: 25 
  },
  // Título em tamanho grande e negrito marcante.
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  // Subtítulo em cinza médio para dar suporte e contexto à tela.
  subtitle: { 
    fontSize: 15, 
    color: '#6B7280', 
    marginTop: 5, 
    lineHeight: 22 
  },

  // Container vertical que agrupa a listagem de hábitos.
  listContainer: { 
    marginBottom: 20 
  },
  // Linha/Card base do hábito. Organiza os lados em linha horizontal.
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  // Estilo específico do card se ele estiver com o status ativo.
  habitRowActive: { 
    backgroundColor: '#EEF2FF', 
    borderColor: '#C7D2FE' 
  },
  // Estilo específico do card se ele estiver desativado.
  habitRowInactive: { 
    backgroundColor: colors.white, 
    borderColor: '#E5E7EB' 
  },
  
  // Agrupador do lado esquerdo (textos do hábito).
  habitInfo: { 
    flex: 1 
  },
  // Título do hábito interno da linha.
  habitTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  // Subtexto indicando a categoria temática e a recompensa em XP.
  habitCategory: { 
    fontSize: 13, 
    color: '#4B5563', 
    marginTop: 4 
  },

  // Base geométrica do quadrado do checkbox customizado.
  checkboxBase: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  // Cores do checkbox quando ativo (Fundo Indigo e borda Indigo).
  checkboxChecked: { 
    backgroundColor: '#4F46E5', 
    borderColor: '#4F46E5' 
  },
  // Cores do checkbox quando desativado (Fundo transparente e borda cinza).
  checkboxUnchecked: { 
    backgroundColor: 'transparent', 
    borderColor: '#D1D5DB' 
  },
  // Formatação do caractere de check (visto) interno do quadrado.
  checkboxCheckmark: { 
    color: colors.white, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },

  // Painel de resumo financeiro/XP posicionado na parte inferior.
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  // Alinha o texto descritivo e o valor do XP acumulado na mesma linha horizontal.
  summaryInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 18 
  },
  // Rótulo descritivo do XP total.
  summaryLabel: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#374151' 
  },
  // Valor do XP em destaque grande e cor ativa Indigo.
  summaryValue: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#4F46E5' 
  },

  // Grande botão de confirmação final da rotina.
  saveButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto interno do botão de confirmação.
  saveButtonText: { 
    color: colors.white, 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});