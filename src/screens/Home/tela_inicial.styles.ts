// Importa utilitários para criar estilos e tipos do React Native para garantir a tipagem correta.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform, StatusBar } from 'react-native';
// Importa o objeto de cores do tema global.
import { colors } from '../../theme/colors';

// Interface TypeScript que define a estrutura e os tipos dos estilos.
// Isso ajuda a prevenir erros, garantindo que você não use propriedades de Texto em uma View, por exemplo.
interface HomeStyle {
  safeArea: ViewStyle;          // Estilo da área segura da tela.
  container: ViewStyle;         // Estilo do container de rolagem.
  // header, profileImageSmall, progressBar... removidos daqui (agora estão no componente Header.tsx)
  
  // --- Seção Hero (Destaque superior) ---
  heroSection: ViewStyle;       // Container da seção de destaque (título + ovelha).
  heroTitle: TextStyle;         // Estilo do título grande ("Vamos adotar...").
  heroContent: ViewStyle;       // Container que alinha a ovelha e o botão de seta.
  heroImage: ImageStyle;        // Estilo da imagem da ovelha.
  arrowButton: ViewStyle;       // Estilo do botão circular com a seta.
  arrowIcon: ImageStyle;        // Estilo do ícone da seta dentro do botão.
  
  // --- Conteúdo Principal ---
  contentContainer: ViewStyle;  // Container para o restante do conteúdo (Perfil + Hábitos).
  profileCard: ViewStyle;       // Estilo do cartão de perfil.
  cardAvatar: ImageStyle;       // Estilo da foto de perfil no cartão.
  cardTextContainer: ViewStyle; // Container para os textos do cartão de perfil.
  cardName: TextStyle;          // Estilo do nome do usuário.
  cardBio: TextStyle;           // Estilo da biografia do usuário.
  sectionTitle: TextStyle;      // Estilo do título da seção ("Meus Hábitos").
  
  // --- Grid de Hábitos ---
  habitsGrid: ViewStyle;        // Container que organiza os hábitos em grade.
  habitItem: ViewStyle;         // Estilo de cada cartão de hábito individual.
  habitLabel: TextStyle;        // Estilo do texto do hábito ("Beber Água", etc).
  habitImage: ImageStyle;       // Estilo da imagem do ícone do hábito.
}

// Criação e exportação dos estilos.
export const styles = StyleSheet.create<HomeStyle>({
  // Garante que a tela ocupe todo o espaço vertical disponível e define a cor de fundo.
  safeArea: {
    flex: 1, 
    backgroundColor: colors.background,
  },
  // Configuração do container do ScrollView.
  container: {
    flexGrow: 1, // Permite que o conteúdo cresça e seja rolável.
    paddingHorizontal: 20, // Espaçamento nas laterais para não grudar na borda.
    paddingBottom: 40, // Espaço extra no final da rolagem.
  },
  
  // --- Seção Hero ---
  heroSection: {
    marginBottom: 40, // Espaço abaixo da seção Hero para separar do conteúdo.
    alignItems: 'center', // Centraliza os itens horizontalmente.
  },
  heroTitle: {
    fontSize: 26, // Fonte grande para destaque.
    fontWeight: 'bold', // Negrito.
    color: colors.textDark, // Cor do texto escura.
    textAlign: 'center', // Centraliza o texto.
    marginBottom: 20, // Espaço entre o título e a imagem da ovelha.
    paddingHorizontal: 20, // Garante que o texto não encoste nas bordas em telas pequenas.
  },
  heroContent: {
    flexDirection: 'row', // Alinha a ovelha e o botão lado a lado.
    alignItems: 'center', // Centraliza verticalmente.
    justifyContent: 'space-between', // Empurra a ovelha para um lado e o botão para o outro (ou distribui o espaço).
    width: '100%', // Ocupa toda a largura disponível.
    paddingHorizontal: 10, // Pequeno ajuste lateral.
  },
  heroImage: {
    width: 150, // Largura da ovelha.
    height: 120, // Altura da ovelha.
  },
  arrowButton: {
    width: 60, // Largura do botão.
    height: 60, // Altura do botão.
    borderRadius: 30, // Metade da largura/altura faz virar um círculo perfeito.
    borderWidth: 2, // Espessura da borda.
    borderColor: colors.primary, // Cor da borda (azul).
    alignItems: 'center', // Centraliza o ícone horizontalmente.
    justifyContent: 'center', // Centraliza o ícone verticalmente.
    backgroundColor: colors.white, // Fundo branco.
  },
  arrowIcon: {
    width: 24, // Tamanho do ícone.
    height: 24,
    tintColor: colors.primary, // Colore o ícone (que é provavelmente preto ou branco) com a cor primária.
  },
  contentContainer: {
    flex: 1, // Ocupa o espaço restante.
  },
  
  // --- Cartão de Perfil ---
  profileCard: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 20, // Bordas arredondadas.
    padding: 20, // Espaçamento interno.
    flexDirection: 'row', // Foto na esquerda, texto na direita.
    alignItems: 'center', // Alinhamento vertical centralizado.
    // Sombras (iOS):
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Sombra (Android):
    elevation: 2,
    marginBottom: 30, // Espaço abaixo do cartão.
  },
  cardAvatar: {
    width: 50, // Tamanho da foto.
    height: 50,
    borderRadius: 25, // Foto redonda.
  },
  cardTextContainer: {
    flex: 1, // Ocupa o espaço restante ao lado da foto.
    marginLeft: 15, // Espaço entre a foto e o texto.
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4, // Espaço entre o nome e a bio.
  },
  cardBio: {
    fontSize: 12,
    color: '#6B7280', // Cinza médio.
    lineHeight: 18, // Altura da linha para melhor leitura de texto longo.
  },
  
  // --- Título da Seção ---
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20, // Espaço antes do grid de hábitos.
  },
  
  // --- Grid de Hábitos ---
  habitsGrid: {
    flexDirection: 'row', // Itens lado a lado.
    flexWrap: 'wrap', // Permite quebrar para a linha de baixo se não couber.
    justifyContent: 'space-between', // Espalha os itens (um na esq, um na dir).
  },
  habitItem: {
    width: '47%', // Quase metade da tela (deixa um espaço no meio).
    backgroundColor: colors.white, 
    alignItems: 'center', // Centraliza conteúdo do card.
    marginBottom: 20, // Espaço vertical entre as linhas do grid.
    borderRadius: 16,
    paddingVertical: 20, // Espaço interno vertical.
    paddingHorizontal: 10, // Espaço interno horizontal.
    borderWidth: 1, // Borda fina.
    borderColor: '#E5E7EB', // Cor da borda cinza claro.
    // Sombras (iOS):
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Sombra (Android):
    elevation: 3, 
  },
  habitLabel: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 10, // Espaço entre o texto e o ícone.
    fontWeight: '600', // Semi-negrito.
  },
  habitImage: {
    width: 70, // Tamanho do ícone do hábito.
    height: 70,
  },
});