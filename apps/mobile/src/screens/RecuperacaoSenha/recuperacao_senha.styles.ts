// Importa utilitários de estilização e tipos do React Native para TypeScript
import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
// Ajuste no caminho do tema para importar a paleta de cores global
import { colors } from '../../theme/colors';

// Interface que define a estrutura dos estilos, garantindo tipagem forte
interface RecuperacaoStyle {
  safeArea: ViewStyle;          // Estilo para a área segura da tela
  keyboardAvoidingView: ViewStyle; // Estilo para o componente que evita o teclado
  container: ViewStyle;         // Estilo do container principal (ScrollView)
  header: ViewStyle;            // Estilo do cabeçalho (onde fica a imagem)
  imageContainer: ViewStyle;    // Estilo do container da imagem (para controle de tamanho)
  illustration: ImageStyle;     // Estilo da imagem em si
  card: ViewStyle;              // Estilo do cartão central (fundo escuro)
  buttonRow: ViewStyle;         // Estilo da linha onde ficam os botões
}

// Criação do objeto de estilos utilizando a interface definida acima
export const styles = StyleSheet.create<RecuperacaoStyle>({
  // Garante que a tela ocupe todo o espaço disponível e tenha a cor de fundo correta
  safeArea: {
    flex: 1, // Ocupa 100% da altura
    backgroundColor: colors.background, // Usa a cor de fundo definida no tema (cinza claro)
  },
  // Faz com que a view de ajuste de teclado também ocupe todo o espaço
  keyboardAvoidingView: {
    flex: 1,
  },
  // Container principal dentro do ScrollView
  container: {
    flexGrow: 1, // Permite que o conteúdo cresça e seja rolável se necessário
    paddingHorizontal: 20, // Espaçamento lateral para não colar nas bordas
    justifyContent: 'center', // Centraliza o conteúdo verticalmente na tela
    paddingTop: 40, // Espaço extra no topo
    paddingBottom: 20, // Espaço extra na parte inferior
  },
  // Área superior que contém a imagem
  header: {
    alignItems: 'center', // Centraliza os itens horizontalmente
    marginBottom: 30, // Dá um espaço entre a imagem e o cartão de formulário
    width: '100%', // Garante largura total
    paddingHorizontal: 10,
  },
  // Container que limita o tamanho da imagem
  imageContainer: {
    width: '80%', // Ocupa 80% da largura do pai
    height: 250, // Altura fixa
    maxWidth: 400, // Impede que fique gigante em tablets
  },
  // A imagem em si
  illustration: {
    width: '100%', // Preenche a largura do container
    height: '100%', // Preenche a altura do container
    // Nota: O 'resizeMode="contain"' geralmente é passado como prop no componente Image, não aqui.
  },
  // O cartão que envolve o input e os botões
  card: {
    backgroundColor: colors.cardBackground, // Cor de fundo escura (do tema)
    borderRadius: 16, // Bordas arredondadas
    padding: 24, // Espaçamento interno para o conteúdo não colar na borda
    width: '100%', // Largura total disponível (respeitando o padding do container pai)
    maxWidth: 400, // Limite de largura para telas grandes
    alignSelf: 'center', // Garante que o cartão fique centralizado
    
    // --- Configuração de Sombra para iOS ---
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    
    // --- Configuração de Sombra para Android ---
    elevation: 8,
  },
  // Linha que organiza os botões (Cancelar e Resetar)
  buttonRow: {
    flexDirection: 'row', // Coloca os itens lado a lado
    justifyContent: 'flex-end', // Alinha tudo à direita
    alignItems: 'center', // Centraliza verticalmente
    marginTop: 10, // Espaço acima dos botões
  },
});