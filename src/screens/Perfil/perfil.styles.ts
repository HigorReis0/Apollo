// Importa utilitários de estilo e tipos do React Native.
import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform, StatusBar } from 'react-native';
// Importa as cores do tema global do aplicativo.
import { colors } from '../../theme/colors';

// Define a interface TypeScript para garantir que os nomes dos estilos usados no código correspondam aos definidos aqui.
interface PerfilStyle {
  safeArea: ViewStyle;          // Estilo para a área segura (evita notch/status bar)
  container: ViewStyle;         // Estilo para o container principal (ScrollView)
  
  // Cabeçalho do Perfil
  headerContainer: ViewStyle;   // Container para o cabeçalho (avatar, nome, botão)
  avatarContainer: ViewStyle;   // Container específico para a imagem de perfil (sombra)
  avatar: ImageStyle;           // Estilo da imagem de perfil (redonda, borda)
  name: TextStyle;              // Estilo do texto do nome do usuário
  email: TextStyle;             // Estilo do texto do email
  
  // --- NOVOS: Estilos de Gamificação (XP e Nível) ---
  xpSection: ViewStyle;         // Container da barra de XP
  levelBadge: ViewStyle;        // Emblema do nível (Lvl X)
  levelBadgeText: TextStyle;    // Texto do emblema do nível
  xpBarContainer: ViewStyle;    // Container que segura a barra e info de XP
  xpInfoRow: ViewStyle;         // Linha com o texto "Evolução" e os valores numéricos
  xpText: TextStyle;            // Texto "Evolução Apollo"
  xpValuesText: TextStyle;      // Texto com o valor numérico (ex: 250 / 500 XP)
  progressBarBackground: ViewStyle; // O trilho cinza da barra
  progressBarFill: ViewStyle;       // A parte azul que enche a barra
  
  // Estilo genérico para todos os cartões (Dados, Conquistas, Hábitos)
  mainCard: ViewStyle;          // Estilo base para os cartões brancos com sombra
  cardTitle: TextStyle;         // Estilo para o título dentro de cada cartão
  
  // Grid de Dados Pessoais
  dataGrid: ViewStyle;          // Container para organizar os dados em grid
  dataItem: ViewStyle;          // Estilo de cada item de dado (quadradinho cinza)
  dataLabel: TextStyle;         // Estilo do rótulo do dado (ex: "Idade")
  dataValue: TextStyle;         // Estilo do valor do dado (ex: "28 anos")
  
  // Conquistas
  achievementsGrid: ViewStyle;  // Container para a lista de medalhas
  achievementIcon: ImageStyle;  // Estilo da imagem da medalha

  // Hábitos no Perfil
  habitsGrid: ViewStyle;        // Container para a lista de hábitos
  habitItem: ViewStyle;         // Estilo de cada item de hábito
  habitImage: ImageStyle;       // Estilo da imagem do hábito
  habitLabel: TextStyle;        // Estilo do texto do hábito
  
  // Botão de Editar
  editButton: ViewStyle;        // Estilo do botão "Editar Perfil"
  editButtonText: TextStyle;    // Estilo do texto dentro do botão
}

// Cria e exporta o objeto de estilos usando a interface definida.
export const styles = StyleSheet.create<PerfilStyle>({
  // Garante que o fundo ocupe a tela inteira e tenha a cor certa do tema.
  safeArea: {
    flex: 1, // Ocupa todo o espaço vertical disponível.
    backgroundColor: colors.background, // Define a cor de fundo (cinza claro).
  },
  
  // Container principal do ScrollView.
  container: {
    flex: 1, // Permite que o conteúdo cresça e role.
  },
  
  // --- Cabeçalho (Onde fica a foto e o nome) ---
  headerContainer: {
    alignItems: 'center', // Centraliza tudo horizontalmente (avatar, nome, email).
    marginTop: 10, // Espaço acima do avatar.
    marginBottom: 20, // Espaço abaixo do botão de editar.
  },
  
  // Container da foto só pra aplicar a sombra (Sombra em imagem direta às vezes buga no Android).
  avatarContainer: {
    marginBottom: 15, // Espaço entre a foto e o nome.
    shadowColor: colors.primary, // Cor da sombra (azul).
    shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra.
    shadowOpacity: 0.2, // Transparência da sombra.
    shadowRadius: 10, // Difusão da sombra.
    elevation: 8, 
  },
  
  // A foto redonda em si.
  avatar: {
    width: 110, // Largura da imagem.
    height: 110, // Altura da imagem.
    borderRadius: 55, // Metade da largura/altura faz virar um círculo perfeito.
    borderWidth: 4, // Borda grossa pra destacar do fundo.
    borderColor: colors.white, // Cor da borda (branca).
  },
  
  // Tipografia do Nome.
  name: {
    fontSize: 22, // Tamanho da fonte grande.
    fontWeight: 'bold', // Negrito.
    color: colors.textDark, // Cor do texto (preto).
    marginBottom: 2, // Pequeno espaço entre o nome e o email.
  },
  
  // Tipografia do Email.
  email: {
    fontSize: 14, // Tamanho da fonte menor.
    color: '#6B7280', // Cinza médio para texto secundário.
    marginBottom: 10, // Ajustado para dar espaço à barra de XP.
  },

  // --- NOVOS: Estilos da Gamificação (XP e Barra) ---
  xpSection: {
    width: '90%',
    backgroundColor: '#F3F4F6', // Cinza clarinho para destacar o dashboard.
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  levelBadge: {
    backgroundColor: colors.primary, // Azul do tema Apollo.
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 15,
    elevation: 3,
  },
  levelBadgeText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  xpBarContainer: {
    flex: 1,
  },
  xpInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  xpText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  xpValuesText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary, // A cor que representa o progresso.
  },
  
  // Botãozinho de "Editar Perfil".
  editButton: {
    paddingVertical: 8, // Espaçamento interno vertical.
    paddingHorizontal: 20, // Espaçamento interno horizontal.
    backgroundColor: '#E0F2FE', // Fundo azul bem clarinho.
    borderRadius: 20, // Borda bem redonda (estilo pílula).
    borderWidth: 1, // Borda fina.
    borderColor: '#BAE6FD', // Cor da borda (azul claro).
  },
  // Texto do botão de editar.
  editButtonText: {
    color: colors.primary, // Texto na cor primária (azul).
    fontWeight: '600', // Semi-negrito.
    fontSize: 12, // Fonte pequena.
  },

  // --- Cartão Genérico (Aquele fundo branco "macio") ---
  mainCard: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 30, // Cantos bem arredondados estilo moderno.
    padding: 25, // Espaçamento interno generoso.
    marginHorizontal: 20, // Espaço nas laterais.
    marginBottom: 20, // Espaço entre um cartão e outro.
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4, // Sombra no Android.
  },
  
  // Título que fica DENTRO do cartão (ex: "Dados Pessoais").
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },

  // --- Grid de Dados Pessoais ---
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dataLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 5,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: 'bold',
  },

  // --- Grid de Conquistas (Medalhas) ---
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 15,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    marginRight: 10,
  },

  // --- Grid de Hábitos (Resumo no perfil) ---
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitItem: {
    width: '47%',
    alignItems: 'center',
    marginBottom: 15,
  },
  habitImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  habitLabel: {
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
  },
});