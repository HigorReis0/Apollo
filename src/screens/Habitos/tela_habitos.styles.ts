// Importa utilitários de estilo e tipos do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa as cores do tema global (subindo 2 níveis na estrutura de pastas).
import { colors } from '../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos.
interface HabitosStyle {
  safeArea: ViewStyle;          // Estilo da área segura da tela.
  container: ViewStyle;         // Estilo do container de rolagem.
  // header, profileImageSmall, progressBar... removidos (agora no componente Header).
  card: ViewStyle;              // Estilo do cartão de cada hábito.
  cardImage: ImageStyle;        // Estilo da imagem/ícone do hábito.
  cardContent: ViewStyle;       // Container para o texto dentro do cartão.
  cardTitle: TextStyle;         // Estilo do título do hábito.
  cardText: TextStyle;          // Estilo do texto descritivo do hábito.
  decorativeCurve: ViewStyle;   // Estilo do elemento decorativo no canto do cartão.
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
  }
});