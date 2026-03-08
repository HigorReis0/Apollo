// Importa utilitários de estilo e tipos do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa as cores do tema global (subindo 2 níveis na estrutura de pastas).
import { colors } from '../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos.
interface HabitosStyle {
  safeArea: ViewStyle;          // Estilo da área segura da tela.
  container: ViewStyle;         // Estilo do container de rolagem.
  card: ViewStyle;              // Estilo do cartão de cada hábito.
  cardImage: ImageStyle;        // Estilo da imagem/ícone do hábito.
  cardContent: ViewStyle;       // Container para o texto dentro do cartão.
  cardTitle: TextStyle;         // Estilo do título do hábito.
  cardText: TextStyle;          // Estilo do texto descritivo do hábito.
  decorativeCurve: ViewStyle;   // Estilo do elemento decorativo no canto do cartão.
  addCard: ViewStyle;           // Estilo do cartão tracejado para adicionar hábito.
  addCardTitle: TextStyle;      // Estilo do título no cartão de adição.
  addCardSub: TextStyle;        // Estilo do subtítulo no cartão de adição.
  modalOverlay: ViewStyle;      // Fundo escurecido atrás do modal.
  modalContent: ViewStyle;      // Container branco do modal.
  modalHeader: TextStyle;       // Título dentro do modal.
  input: ViewStyle;             // Campo de entrada de texto.
  modalButtons: ViewStyle;      // Container para os botões do modal.
  btn: ViewStyle;               // Estilo base dos botões.
  btnCancel: ViewStyle;         // Botão de cancelar (vermelho).
  btnSave: ViewStyle;           // Botão de salvar (cor do tema).
  btnText: TextStyle;           // Estilo do texto dentro dos botões.
}

// Criação e exportação dos estilos.
export const styles = StyleSheet.create<HabitosStyle>({
  // Garante que a tela ocupe todo o espaço vertical disponível.
  safeArea: {
    flex: 1, 
    backgroundColor: colors.background, // Cor de fundo cinza claro.
  },
  // Configuração do ScrollView.
  container: {
    flexGrow: 1, // Permite que o conteúdo cresça e role se necessário.
    paddingHorizontal: 20, // Espaçamento nas laterais.
    paddingBottom: 40, // Espaço extra no final da lista.
  },
  
  // --- Cards de Hábitos ---
  card: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 20, // Bordas arredondadas.
    padding: 15, // Espaçamento interno.
    marginBottom: 20, // Espaço entre um cartão e outro.
    flexDirection: 'row', // Organiza imagem e texto lado a lado.
    alignItems: 'center', // Centraliza verticalmente.
    // Sombras (iOS):
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Sombra (Android):
    elevation: 2,
    position: 'relative', // Necessário para posicionar o 'decorativeCurve' de forma absoluta dentro dele.
    overflow: 'hidden', // Garante que a curva decorativa não saia das bordas arredondadas do cartão.
  },
  cardImage: {
    width: 80, // Largura da imagem.
    height: 80, // Altura da imagem.
    marginRight: 15, // Espaço entre a imagem e o texto.
  },
  cardContent: {
    flex: 1, // Ocupa o restante do espaço disponível na linha.
    justifyContent: 'center', // Centraliza o conteúdo verticalmente.
  },
  cardTitle: {
    fontSize: 16, // Tamanho da fonte do título.
    fontWeight: 'bold', // Negrito.
    color: colors.textDark, // Cor escura.
    marginBottom: 4, // Espaço abaixo do título.
  },
  cardText: {
    fontSize: 13, // Tamanho da fonte da descrição.
    color: '#4B5563', // Cinza escuro.
    lineHeight: 18, // Altura da linha para melhor legibilidade.
    fontWeight: '400', // Peso normal da fonte.
  },
  // Elemento decorativo (meio círculo/borda) no canto inferior direito.
  decorativeCurve: {
    position: 'absolute', // Posicionamento absoluto em relação ao 'card'.
    bottom: -10, // Posiciona um pouco para fora da parte inferior.
    right: -10, // Posiciona um pouco para fora da parte direita.
    width: 30, // Largura do elemento.
    height: 30, // Altura do elemento.
    borderRadius: 15, // Metade da largura/altura para criar um círculo.
    borderWidth: 3, // Espessura da borda.
    borderColor: colors.textDark, // Cor da borda.
    opacity: 0.8, // Transparência.
  },

  // --- Estilos para o Card de Adição e Modal ---
  addCard: {
    borderStyle: 'dashed', // Estilo da borda tracejada.
    borderWidth: 2, // Espessura da borda.
    borderColor: colors.textDark, // Cor da borda tracejada.
    backgroundColor: 'rgba(0,0,0,0.02)', // Fundo sutil.
    justifyContent: 'center', // Centraliza o conteúdo verticalmente.
    alignItems: 'center', // Centraliza o conteúdo horizontalmente.
    padding: 20, // Espaçamento interno.
    borderRadius: 20, // Bordas arredondadas.
    marginBottom: 30, // Espaçamento final.
  },
  addCardTitle: {
    color: colors.textDark, // Cor do texto.
    fontWeight: 'bold', // Negrito.
    fontSize: 16, // Tamanho da fonte.
  },
  addCardSub: {
    color: '#6B7280', // Cor cinza médio.
    fontSize: 12, // Tamanho da fonte menor.
    marginTop: 4, // Espaço acima.
  },
  modalOverlay: {
    flex: 1, // Ocupa toda a tela.
    backgroundColor: 'rgba(0,0,0,0.6)', // Fundo escuro transparente.
    justifyContent: 'center', // Centraliza o modal verticalmente.
    alignItems: 'center', // Centraliza o modal horizontalmente.
  },
  modalContent: {
    width: '85%', // Largura do modal.
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 25, // Bordas bem arredondadas.
    padding: 25, // Espaçamento interno.
    elevation: 10, // Sombra no Android.
  },
  modalHeader: {
    fontSize: 20, // Tamanho do título.
    fontWeight: 'bold', // Negrito.
    color: colors.textDark, // Cor escura.
    marginBottom: 20, // Espaço abaixo.
    textAlign: 'center', // Texto centralizado.
  },
  input: {
    width: '100%', // Ocupa toda a largura interna.
    height: 55, // Altura do campo.
    backgroundColor: '#F3F4F6', // Fundo cinza bem claro.
    borderRadius: 15, // Bordas arredondadas.
    paddingHorizontal: 15, // Espaço interno lateral.
    fontSize: 16, // Tamanho da fonte.
    color: colors.textDark, // Cor do texto digitado.
    marginBottom: 25, // Espaço abaixo.
  },
  modalButtons: {
    flexDirection: 'row', // Botões um ao lado do outro.
    justifyContent: 'space-between', // Espaço entre eles.
  },
  btn: {
    flex: 0.48, // Quase metade da largura para cada botão.
    height: 50, // Altura do botão.
    borderRadius: 15, // Bordas arredondadas.
    justifyContent: 'center', // Centraliza texto verticalmente.
    alignItems: 'center', // Centraliza texto horizontalmente.
  },
  btnCancel: {
    backgroundColor: '#EF4444', // Vermelho para cancelar.
  },
  btnSave: {
    backgroundColor: colors.textDark, // Cor do tema para salvar.
  },
  btnText: {
    color: colors.white, // Texto branco.
    fontWeight: 'bold', // Negrito.
    fontSize: 16, // Tamanho da fonte.
  }
});