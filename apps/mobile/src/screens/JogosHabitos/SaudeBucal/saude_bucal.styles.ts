// Importa o construtor nativo StyleSheet e as tipagens de estilo do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa o dicionário central de cores estruturado no tema do ecossistema Apollo.
import { colors } from '../../../theme/colors';

// Interface TypeScript para validação estrita das chaves de estilização de saúde bucal.
interface SaudeBucalStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  mainCard: ViewStyle;
  iconHeader: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  checklistContainer: ViewStyle;
  checkItem: ViewStyle;
  checkItemDone: ViewStyle;
  checkItemText: TextStyle;
  xpText: TextStyle;
  xpTextDone: TextStyle;
  finalButton: ViewStyle;
  finalButtonText: TextStyle;
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
}

export const styles = StyleSheet.create<SaudeBucalStyle>({
  // Garante o preenchimento total do ecrã e atribui a cor de fundo padrão da aplicação.
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  // Define o espaçamento interno geral de 20 pontos nas quatro direções para o contêiner principal.
  container: { 
    padding: 20 
  },
  
  // Margem inferior aplicada para criar um distanciamento adequado abaixo do atalho de voltar.
  backButton: { 
    marginBottom: 15 
  },
  // Define o peso da fonte em negrito e atribui o Azul Padrão ativo para o texto de retorno.
  backButtonText: { 
    color: colors.primary, 
    fontWeight: 'bold' 
  },

  // Configuração visual do cartão principal superior.
  mainCard: {
    backgroundColor: colors.white, // Atribui a cor branca purificada para o plano de fundo do cartão.
    borderRadius: 30,              // Aplica cantos arredondados suavizados nas extremidades do componente.
    padding: 25,                   // Margem interna para evitar o contacto do conteúdo com as divisórias.
    alignItems: 'center',          // Alinha de forma centralizada todos os elementos filhos no plano horizontal.
    marginBottom: 20,              // Cria espaço vertical de separação em relação ao bloco de checklist abaixo.
    elevation: 4,                  // Projeta sombras reais sob a estrutura do componente em sistemas Android.
    shadowColor: '#000',           // Define a cor preta de referência para sombras em dispositivos Apple iOS.
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,            // Define o nível de opacidade da sombra para ecrãs iOS.
    shadowRadius: 10,              // Determina o espalhamento e suavidade da sombra projetada em iOS.
  },
  // Determina uma dimensão quadrada controlada de 90 pontos para o ícone e uma margem abaixo.
  iconHeader: { 
    width: 90, 
    height: 90, 
    marginBottom: 15 
  },
  // Formata o título com tamanho expandido, peso em negrito e tom escuro padrão do tema.
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: colors.textDark 
  },
  // Centraliza o texto secundário de suporte e formata com um tom cinza de leitura confortável.
  subtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 5, 
    paddingHorizontal: 10 
  },

  // Container estrutural responsável por encapsular verticalmente os cartões do checklist.
  checklistContainer: { 
    marginBottom: 20 
  },
  // Estilo individual base para cada uma das linhas de tarefas clicáveis da lista.
  checkItem: {
    flexDirection: 'row',           // Organiza os itens (Texto e XP) dispostos lado a lado na horizontal.
    justifyContent: 'space-between',// Empurra os elementos internos para as extremidades opostas do componente.
    alignItems: 'center',          // Garante o alinhamento vertical centralizado dos textos dentro da linha.
    backgroundColor: colors.white, // Define o fundo branco para as caixas individuais do checklist.
    padding: 20,                   // Área interna confortável de toque e respiro para o texto.
    borderRadius: 20,              // Aplica curvatura moderna nos quatro cantos das linhas da lista.
    marginBottom: 12,              // Cria uma fresta de separação vertical simétrica entre os blocos.
    borderWidth: 1,                // Define a espessura da linha de contorno.
    borderColor: '#E5E7EB'         // Cor cinza clara neutra para a borda em estado inicial de espera.
  },
  // Altera a cor de contorno e fundo do item da lista para azul suave quando o utilizador marcar a tarefa como feita.
  checkItemDone: { 
    borderColor: '#BAE6FD', 
    backgroundColor: '#F0F9FF' 
  },
  // Formata o texto descritivo da tarefa com tamanho médio e cor sólida escura.
  checkItemText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.textDark 
  },
  // Estiliza o indicador textual numérico de pontos de experiência (XP) em tom cinza inicial.
  xpText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#9CA3AF' 
  },
  // Sobrescreve a cor do indicador de XP para o tom azul do tema quando a tarefa for realizada.
  xpTextDone: { 
    color: colors.primary 
  },

  // Estilo estrutural do grande botão de validação posicionado no rodapé.
  finalButton: {
    width: '100%',                  // Expande o botão para ocupar a totalidade da área útil horizontal.
    backgroundColor: colors.primary, // Aplica a tonalidade Azul Padrão do tema Apollo para consistência de fluxo.
    padding: 18,                   // Espessura robusta gerando excelente ergonomia de clique.
    borderRadius: 20,              // Cantos arredondados acompanhando a linguagem geométrica do app.
    alignItems: 'center',          // Centraliza horizontalmente o texto interno.
    justifyContent: 'center',     // Centraliza verticalmente o texto interno.
    
    // Efeito de sombreamento estético avançado
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4                   // Pequena elevação tridimensional de relevo para realçar o botão no Android.
  },
  // Formata o texto interno do botão final com letra média, aplicação de negrito e cor branca de alto contraste.
  finalButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.white 
  },

  // Alinhamento central para a caixa do botão secundário de limpeza rápida.
  resetButton: { 
    marginTop: 20, 
    marginBottom: 30, 
    alignItems: 'center' 
  },
  // Configura a fonte do link de reset com tom acinzentado discreto e aplicação de sublinhado contínuo.
  resetButtonText: { 
    color: '#9CA3AF', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  }
});