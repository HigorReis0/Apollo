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
    // (Nota: Removemos o padding extra do Android porque o Header já cuida disso).
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
    // Configuração de sombra para iOS:
    shadowColor: colors.primary, // Cor da sombra (azul).
    shadowOffset: { width: 0, height: 4 }, // Deslocamento da sombra.
    shadowOpacity: 0.2, // Transparência da sombra.
    shadowRadius: 10, // Difusão da sombra.
    // Configuração de sombra para Android:
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
    marginBottom: 15, // Espaço entre o email e o botão de editar.
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
  // Usado para envolver as seções de Dados, Conquistas e Hábitos.
  mainCard: {
    backgroundColor: colors.white, // Fundo branco.
    borderRadius: 30, // Cantos bem arredondados estilo "cartoon" ou moderno.
    padding: 25, // Espaçamento interno generoso.
    marginHorizontal: 20, // Espaço nas laterais pra não grudar na borda da tela.
    marginBottom: 20, // Espaço entre um cartão e outro.
    
    // Sombra suave para dar o efeito de elevação ("flutuando").
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, // Sombra bem sutil.
    shadowRadius: 15,
    elevation: 4, // Sombra no Android.
  },
  
  // Título que fica DENTRO do cartão (ex: "Dados Pessoais").
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20, // Empurra o conteúdo do cartão pra baixo.
  },

  // --- Grid de Dados Pessoais (Data, Peso, etc) ---
  dataGrid: {
    flexDirection: 'row', // Itens um ao lado do outro.
    flexWrap: 'wrap',     // Permite que os itens quebrem para a linha de baixo se não couberem.
    justifyContent: 'space-between', // Espalha os itens uniformemente.
  },
  
  // Cada quadradinho de informação individual.
  dataItem: {
    width: '47%', // Quase metade da largura (47% + 47% + espaço no meio ~= 100%).
    backgroundColor: '#F9FAFB', // Cinza bem claro pra diferenciar do fundo branco do cartão.
    borderRadius: 16,
    padding: 15,
    marginBottom: 15, // Espaço abaixo de cada item.
    alignItems: 'center', // Centraliza o texto dentro do item.
    borderWidth: 1,
    borderColor: '#F3F4F6', // Borda sutil.
  },
  // Rótulo do dado (ex: "Peso").
  dataLabel: {
    fontSize: 13,
    color: '#9CA3AF', // Cinza claro.
    marginBottom: 5,
    fontWeight: '500',
  },
  // Valor do dado (ex: "62 kg").
  dataValue: {
    fontSize: 16,
    color: colors.textDark, // Preto.
    fontWeight: 'bold', // Destaque para o valor.
  },

  // --- Grid de Conquistas (Medalhas) ---
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Alinha tudo à esquerda (diferente do space-between).
    gap: 15, // Espacinho entre as medalhas (propriedade 'gap' funciona nas versões mais recentes do RN).
  },
  achievementIcon: {
    width: 40,
    height: 40,
    marginBottom: 10, // Espaço entre o ícone e o texto da medalha.
    marginRight: 10, // Margem direita extra (caso o gap não funcione em versões antigas).
  },

  // --- Grid de Hábitos (Resumo no perfil) ---
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Um na esquerda, um na direita.
  },
  habitItem: {
    width: '47%', // Mesmo esquema de largura dos dados pessoais.
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
    textAlign: 'center', // Centraliza o texto caso tenha mais de uma linha.
  },
});