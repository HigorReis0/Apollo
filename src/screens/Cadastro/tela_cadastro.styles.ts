// Importa utilitários de estilo e tipos do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Ajuste no caminho do tema (subimos 2 níveis: Cadastro -> screens -> src) para importar as cores.
import { colors } from '../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos deste arquivo.
interface CadastroStyle {
  safeArea: ViewStyle;          // Estilo da área segura da tela.
  keyboardAvoidingView: ViewStyle; // Estilo do componente que evita o teclado.
  container: ViewStyle;         // Estilo do container principal de rolagem.
  header: ViewStyle;            // Estilo do cabeçalho (título e imagem).
  titleText: TextStyle;         // Estilo do texto do título ("APOLLO").
  imageContainer: ViewStyle;    // Estilo do container da imagem.
  illustration: ImageStyle;     // Estilo da imagem em si.
  card: ViewStyle;              // Estilo do cartão que contém o formulário.
}

// Criação e exportação dos estilos.
export const styles = StyleSheet.create<CadastroStyle>({
  // Garante que a tela ocupe todo o espaço vertical disponível e tenha a cor de fundo correta.
  safeArea: {
    flex: 1, 
    backgroundColor: colors.background,
  },
  // Faz com que a view de ajuste de teclado ocupe todo o espaço.
  keyboardAvoidingView: {
    flex: 1,
  },
  // Configuração do container do ScrollView.
  container: {
    flexGrow: 1, // Permite que o conteúdo cresça e seja rolável.
    paddingHorizontal: 20, // Espaçamento nas laterais.
    justifyContent: 'center', // Centraliza o conteúdo verticalmente (se houver espaço).
    paddingTop: 40, // Espaço extra no topo.
    paddingBottom: 20, // Espaço extra na parte inferior.
  },
  // Área superior que agrupa o Título e a Imagem.
  header: {
    alignItems: 'center', // Centraliza verticalmente na linha.
    marginBottom: 30, // Espaço abaixo do cabeçalho.
    width: '100%', // Largura total.
    flexDirection: 'row', // Coloca título e imagem lado a lado.
    justifyContent: 'space-around', // Distribui o espaço entre eles.
    paddingHorizontal: 10, // Espaçamento lateral interno.
  },
  // Estilo do texto "APOLLO".
  titleText: {
    fontSize: 28, // Fonte grande.
    fontWeight: 'bold', // Negrito.
    color: colors.textDark, // Cor do texto escura.
  },
  // Container que limita o tamanho da imagem.
  imageContainer: {
    width: '40%', // Ocupa 40% da largura do header.
    height: 180, // Altura fixa.
    minWidth: 120, // Largura mínima para não ficar muito pequeno.
    maxWidth: 200, // Largura máxima para não ficar muito grande.
  },
  // A imagem em si.
  illustration: {
    width: '100%', // Preenche o container da imagem.
    height: '100%',
  },
  // O cartão escuro que contém o formulário de cadastro.
  card: {
    backgroundColor: colors.cardBackground, // Cor de fundo escura.
    borderRadius: 16, // Bordas arredondadas.
    padding: 24, // Espaçamento interno.
    width: '100%', // Largura total disponível.
    maxWidth: 400, // Trava a largura máxima (bom para tablets).
    alignSelf: 'center', // Centraliza o cartão horizontalmente.
    
    // --- Sombras (iOS) ---
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    
    // --- Sombra (Android) ---
    elevation: 8,
  },
});