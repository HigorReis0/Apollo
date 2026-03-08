// Importa utilitários para criar estilos e tipos do React Native para garantir a tipagem correta.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Importa o objeto de cores do tema global para manter a consistência visual do app.
import { colors } from '../../theme/colors';

// Interface do TypeScript: Define a estrutura do objeto de estilos.
// Isso ajuda o editor (VS Code) a sugerir autocompletar e avisar se você tentar usar um estilo que não foi definido aqui.
interface LoginStyle {
  safeArea: ViewStyle;          // Estilo para o container principal de segurança (SafeAreaView)
  keyboardAvoidingView: ViewStyle; // Estilo para o componente que gerencia o teclado
  container: ViewStyle;         // Estilo para o container de conteúdo rolável
  header: ViewStyle;            // Estilo para o cabeçalho (Título + Imagem)
  titleText: TextStyle;         // Estilo para o texto do título "APOLLO"
  imageContainer: ViewStyle;    // Estilo para o container que limita o tamanho da imagem
  illustration: ImageStyle;     // Estilo para a imagem em si
  loginCard: ViewStyle;         // Estilo para o cartão escuro de login
}

// Criação e exportação dos estilos usando a interface definida acima.
export const styles = StyleSheet.create<LoginStyle>({
  // Garante que a tela ocupe todo o espaço disponível e tenha a cor de fundo correta.
  safeArea: {
    flex: 1, // Faz o componente crescer para preencher todo o espaço vertical.
    backgroundColor: colors.background, // Usa a cor de fundo definida no tema (cinza claro).
  },
  
  // Faz a view que empurra o teclado ocupar todo o espaço disponível.
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Container principal do conteúdo (dentro do ScrollView).
  container: {
    flexGrow: 1, // Permite que o container cresça se o conteúdo for maior que a tela (importante para ScrollView).
    paddingHorizontal: 20, // Adiciona um espaçamento nas laterais para que o conteúdo não encoste nas bordas.
    alignItems: 'center', // Centraliza os itens horizontalmente (no eixo cruzado).
    justifyContent: 'center', // Centraliza os itens verticalmente (no eixo principal).
    paddingTop: 50, // Espaço extra no topo.
    paddingBottom: 20, // Espaço extra na parte inferior.
  },
  
  // Área superior que agrupa o Título e a Imagem.
  header: {
    alignItems: 'center', // Centraliza os filhos verticalmente dentro da linha.
    marginBottom: 50, // Empurra o cartão de login para baixo, criando separação.
    width: '100%', // Garante que o header ocupe toda a largura disponível.
    flexDirection: 'row', // Organiza os filhos (Texto e Imagem) lado a lado.
    justifyContent: 'space-around', // Distribui o espaço disponível ao redor dos itens.
    paddingHorizontal: 10, // Pequeno espaçamento interno lateral.
  },
  
  // Estilização do texto "APOLLO".
  titleText: {
    fontSize: 28, // Tamanho da fonte grande.
    fontWeight: 'bold', // Texto em negrito.
    color: colors.textDark, // Cor do texto (preto/escuro).
  },
  
  // Caixa que envolve a imagem para controlar suas dimensões e proporção.
  imageContainer: {
    width: '40%', // Ocupa 40% da largura do pai (header).
    height: 200, // Altura fixa.
    minWidth: 150, // Garante que não fique menor que 150px em telas pequenas.
    maxWidth: 250, // Garante que não fique maior que 250px em telas grandes.
  },
  
  // Estilo aplicado diretamente ao componente Image.
  illustration: {
    width: '100%', // A imagem ocupa 100% da largura do seu container (imageContainer).
    height: '100%', // A imagem ocupa 100% da altura do seu container.
  },
  
  // O cartão escuro onde ficam os inputs e botões.
  loginCard: {
    width: '100%', // Tenta ocupar toda a largura disponível (respeitando o padding do container pai).
    maxWidth: 400, // Trava a largura máxima para que não fique "esticado" em tablets/telas grandes.
    backgroundColor: colors.cardBackground, // Cor de fundo escura (azul escuro).
    borderRadius: 16, // Arredonda os cantos do cartão.
    padding: 24, // Espaçamento interno para que os inputs não fiquem colados na borda do cartão.
    
    // --- Configuração de Sombra para iOS ---
    // (O React Native usa propriedades específicas para sombra no iOS)
    shadowColor: '#000', // Cor da sombra.
    shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra (vertical).
    shadowOpacity: 0.1, // Transparência da sombra.
    shadowRadius: 5, // O quão "espalhada" é a sombra.
    
    // --- Configuração de Sombra para Android ---
    // (O Android usa a propriedade 'elevation' para criar sombras materiais)
    elevation: 8,
  },
});