import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Puxando as cores do nosso tema global pra não ficar digitando hexadecimais na mão
import { colors } from '../../theme/colors';

// Interface do TypeScript: Ajuda o editor a avisar se eu tentar usar um estilo que não existe
interface LoginStyle {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  titleText: TextStyle;
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  loginCard: ViewStyle;
}

export const styles = StyleSheet.create<LoginStyle>({
  // Garante que o fundo ocupe a tela inteira (flex: 1) e tenha a cor certa
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Faz a view que empurra o teclado ocupar todo o espaço disponível
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Container principal do conteúdo: centraliza e dá um respiro nas bordas
  container: {
    flexGrow: 1, // Permite crescer se o conteúdo for maior que a tela
    paddingHorizontal: 20, // Espacinho nas laterais pra não grudar na borda
    alignItems: 'center', // Centraliza itens horizontalmente
    justifyContent: 'center', // Centraliza itens verticalmente
    paddingTop: 50,
    paddingBottom: 20,
  },
  
  // A parte de cima com o Texto e a Imagem
  header: {
    alignItems: 'center',
    marginBottom: 50, // Empurra o cartão de login pra baixo
    width: '100%',
    flexDirection: 'row', // Coloca o texto e a imagem lado a lado
    justifyContent: 'space-around', // Distribui o espaço entre eles
    paddingHorizontal: 10,
  },
  
  // Estilo do texto "APOLLO"
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark, // Puxa o preto do tema
  },
  
  // Caixa que segura a imagem pra ela não ficar gigante
  imageContainer: {
    width: '40%', // Ocupa quase metade da largura
    height: 200, 
    minWidth: 150, // Não deixa ficar muito pequeno
    maxWidth: 250, // Não deixa ficar muito grande
  },
  
  // A imagem em si
  illustration: {
    width: '100%',
    height: '100%',
  },
  
  // O cartão escuro onde ficam os inputs
  loginCard: {
    width: '100%',
    maxWidth: 400, // Trava a largura em telas muito grandes (tablets)
    backgroundColor: colors.cardBackground, // Aquele azul escuro
    borderRadius: 16, // Arredonda os cantos
    padding: 24, // Espaço interno pro conteúdo não grudar na borda
    
    // --- Configuração de Sombra (Funciona bem no iOS) ---
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    
    // --- Sombra pro Android ---
    elevation: 8,
  },
});