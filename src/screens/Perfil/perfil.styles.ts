import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform, StatusBar } from 'react-native';
// Puxando as cores do nosso tema global
import { colors } from '../../theme/colors';

// Interface do TypeScript pra garantir que não erramos os nomes dos estilos
interface PerfilStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  
  // Cabeçalho do Perfil
  headerContainer: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  name: TextStyle;
  email: TextStyle;
  
  // Estilo genérico para todos os cartões (Dados, Conquistas, Hábitos)
  mainCard: ViewStyle;
  cardTitle: TextStyle; 
  
  // Grid de Dados Pessoais
  dataGrid: ViewStyle;
  dataItem: ViewStyle;
  dataLabel: TextStyle;
  dataValue: TextStyle;
  
  // Conquistas
  achievementsGrid: ViewStyle;
  achievementIcon: ImageStyle;

  // Hábitos no Perfil
  habitsGrid: ViewStyle;
  habitItem: ViewStyle;
  habitImage: ImageStyle;
  habitLabel: TextStyle;
  
  // Botão de Editar
  editButton: ViewStyle;
  editButtonText: TextStyle;
}

export const styles = StyleSheet.create<PerfilStyle>({
  // Garante que o fundo ocupe a tela inteira e tenha a cor certa
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    // (Nota: Removemos o padding extra do Android porque o Header já cuida disso)
  },
  
  // Container principal do ScrollView
  container: {
    flex: 1,
  },
  
  // --- Cabeçalho (Onde fica a foto e o nome) ---
  headerContainer: {
    alignItems: 'center', // Centraliza tudo horizontalmente
    marginTop: 10,
    marginBottom: 20,
  },
  
  // Container da foto só pra aplicar a sombra (Sombra em imagem direta às vezes buga no Android)
  avatarContainer: {
    marginBottom: 15,
    // Sombra suave colorida (azul)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8, // Sombra pro Android
  },
  
  // A foto redonda em si
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55, // Metade da largura faz virar um círculo perfeito
    borderWidth: 4, // Borda branca grossa pra destacar do fundo
    borderColor: colors.white,
  },
  
  // Tipografia do Nome
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  
  // Tipografia do Email
  email: {
    fontSize: 14,
    color: '#6B7280', // Cinza médio
    marginBottom: 15,
  },
  
  // Botãozinho de "Editar Perfil"
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#E0F2FE', // Azul bem clarinho
    borderRadius: 20, // Borda bem redonda (Pílula)
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },

  // --- Cartão Genérico (Aquele fundo branco "macio") ---
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30, // Cantos bem arredondados estilo "cartoon"
    padding: 25,
    marginHorizontal: 20, // Espaço nas laterais pra não grudar na borda da tela
    marginBottom: 20, // Espaço entre um cartão e outro
    
    // Sombra pra dar o efeito de que o cartão está flutuando
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  
  // Título que fica DENTRO do cartão (ex: "Dados Pessoais")
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20, // Empurra o conteúdo do cartão pra baixo
  },

  // --- Grid de Dados Pessoais (Data, Peso, etc) ---
  dataGrid: {
    flexDirection: 'row', // Itens um ao lado do outro
    flexWrap: 'wrap',     // Se não couber, quebra pra linha de baixo
    justifyContent: 'space-between', // Espalha os itens
  },
  
  // Cada quadradinho de informação
  dataItem: {
    width: '47%', // Quase metade (47% + 47% + espaço no meio = 100%)
    backgroundColor: '#F9FAFB', // Cinza bem claro pra diferenciar do fundo branco
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6', // Borda sutil
  },
  dataLabel: {
    fontSize: 13,
    color: '#9CA3AF', // Cinza claro para o rótulo
    marginBottom: 5,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: 'bold', // Destaque para o valor
  },

  // --- Grid de Conquistas (Medalhas) ---
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Alinha tudo à esquerda
    gap: 15, // Espacinho entre as medalhas (funciona nas versões novas do RN)
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