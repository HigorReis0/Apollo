// ============================================================
// IMPORTAÇÕES
// ============================================================

// Importa os utilitários de estilo do React Native e os tipos
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Importa o tema de cores global do Apollo
import { colors } from '../../theme/colors';

// ============================================================
// INTERFACE – define a tipagem de cada estilo
// Isso garante que cada estilo seja usado no tipo correto (View, Text, Image)
// ============================================================
interface PerfilStyle {
  // ---- CONTAINER PRINCIPAL ----
  safeArea: ViewStyle;          // Área segura da tela (evita barra de status)
  container: ViewStyle;         // Container principal da ScrollView

  // ---- CABEÇALHO DO PERFIL (avatar, nome, barra) ----
  headerContainer: ViewStyle;   // Container do cabeçalho (avatar + nome + barra)
  avatarContainer: ViewStyle;   // Container do avatar (com sombra)
  avatar: ImageStyle;           // Estilo da imagem do avatar
  name: TextStyle;              // Estilo do nome do usuário
  email: TextStyle;             // Estilo do e-mail do usuário
  levelContainer: ViewStyle;    // Container da barra de progresso
  levelText: TextStyle;         // Texto do nível (ex.: "Nível Iniciante")
  progressBarBackground: ViewStyle; // Fundo da barra de progresso
  progressBarFill: ViewStyle;   // Preenchimento da barra de progresso
  xpText: TextStyle;            // Texto do XP (ex.: "250 / 500 XP")
  editButton: ViewStyle;        // Botão "Editar Perfil" (abaixo do avatar)
  editButtonText: TextStyle;    // Texto do botão "Editar Perfil"

  // ---- CARTÕES ----
  mainCard: ViewStyle;          // Estilo base dos cartões brancos
  cardTitle: TextStyle;         // Título dos cartões (ex.: "Dados Pessoais")

  // ---- DADOS PESSOAIS (grid 2 colunas) ----
  dataGrid: ViewStyle;          // Container do grid (flex-wrap)
  dataItem: ViewStyle;          // Cada item do grid (Data de Nascimento, etc.)
  dataLabel: TextStyle;         // Rótulo do dado (ex.: "Peso")
  dataValue: TextStyle;         // Valor do dado (ex.: "62 kg")

  // ---- CONQUISTAS ----
  achievementsGrid: ViewStyle;  // Container do grid de conquistas
  achievementIcon: ImageStyle;  // Ícone da conquista (medalha)

  // ---- MEUS HÁBITOS / ÚLTIMOS ACESSOS ----
  habitsGrid: ViewStyle;        // Container do grid de hábitos
  habitItem: ViewStyle;         // Cada item do hábito
  habitImage: ImageStyle;       // Imagem do hábito
  habitLabel: TextStyle;        // Nome do hábito

  // ============================================================
  // NOVOS ESTILOS ADICIONADOS
  // ============================================================

  // Cabeçalho do cartão (título + ícone de edição)
  cardHeader: ViewStyle;          // Linha que alinha título e botão
  editIconButton: ViewStyle;      // Botão de edição (ícone de lápis)
  editIconText: TextStyle;        // Texto do botão de edição (✎)
  achievementItem: ViewStyle;     // Item individual de conquista (apenas ícone)
  emptyMessage: TextStyle;        // Mensagem para quando não há dados

  // ---- ESTILOS DOS MODAIS ----
  modalContainer: ViewStyle;      // Fundo escuro semi-transparente
  modalContent: ViewStyle;        // Cartão branco do modal
  modalTitle: TextStyle;          // Título do modal
  modalInput: TextStyle;          // Campo de texto do modal
  modalButtons: ViewStyle;        // Container dos botões (Cancelar / Salvar)
  modalButton: ViewStyle;         // Estilo base de cada botão
  modalButtonCancel: ViewStyle;   // Botão "Cancelar" (cinza)
  modalButtonSave: ViewStyle;     // Botão "Salvar" (azul)
  modalButtonText: TextStyle;     // Texto dos botões
}

// ============================================================
// EXPORTAÇÃO DOS ESTILOS
// ============================================================
export const styles = StyleSheet.create<PerfilStyle>({

  // ============================================================
  // CONTAINER PRINCIPAL
  // ============================================================

  // SafeAreaView: ocupa toda a tela com fundo do tema
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ScrollView: ocupa todo o espaço disponível
  container: {
    flex: 1,
  },

  // ============================================================
  // CABEÇALHO DO PERFIL (avatar, nome, barra de XP)
  // ============================================================

  // Container centralizado do cabeçalho
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  // Container do avatar com sombra para destaque
  avatarContainer: {
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  // Imagem do avatar: 110x110, circular, com borda branca
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,          // Metade da largura = círculo perfeito
    borderWidth: 4,
    borderColor: colors.white,
  },

  // Nome do usuário: tamanho grande, negrito, cor escura
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },

  // E-mail: tamanho menor, cor cinza
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },

  // Container da barra de progresso do nível
  levelContainer: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    paddingHorizontal: 40,
  },

  // Texto do nível (ex.: "Nível Iniciante")
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 6,
  },

  // Fundo da barra de progresso (trilho cinza)
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },

  // Preenchimento da barra (azul, com bordas arredondadas)
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  // Texto do XP (ex.: "250 / 500 XP")
  xpText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 5,
    fontWeight: '500',
  },

  // ============================================================
  // BOTÃO "EDITAR PERFIL" (abre modal de edição de nome)
  // ============================================================

  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 5,
  },

  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },

  // ============================================================
  // CARTÕES (Dados Pessoais, Conquistas, Últimos Acessos)
  // ============================================================

  // Estilo base do cartão: branco, sombra, bordas arredondadas
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },

  // Título do cartão (ex.: "Dados Pessoais")
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },

  // ============================================================
  // DADOS PESSOAIS – GRID 2 COLUNAS
  // ============================================================

  // Container com flex-wrap para quebrar em 2 colunas
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Cada item do grid: fundo cinza claro, borda, padding
  dataItem: {
    width: '47%',                // Largura para caber 2 itens por linha
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  // Rótulo do dado (ex.: "Peso", "Altura")
  dataLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 5,
    fontWeight: '500',
  },

  // Valor do dado (ex.: "62 kg", "1.68 m")
  dataValue: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: 'bold',
  },

  // ============================================================
  // CONQUISTAS – GRID DE ÍCONES
  // ============================================================

  // Container flexível com espaço entre os ícones
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 15,
  },

  // Ícone da conquista (medalha)
  achievementIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    marginRight: 10,
  },

  // ============================================================
  // MEUS HÁBITOS / ÚLTIMOS ACESSOS – GRID 2 COLUNAS
  // ============================================================

  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Cada item do hábito (imagem + nome)
  habitItem: {
    width: '47%',
    alignItems: 'center',
    marginBottom: 15,
  },

  // Imagem do hábito (60x60)
  habitImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },

  // Nome do hábito (centralizado)
  habitLabel: {
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
  },

  // ============================================================
  // NOVOS ESTILOS ADICIONADOS (CABEÇALHO, ÍCONE DE EDIÇÃO, MODAIS)
  // ============================================================

  // ============================================================
  // CABEÇALHO DO CARTÃO (título + botão de edição)
  // ============================================================

  // Linha que alinha o título à esquerda e o botão à direita
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  // ============================================================
  // BOTÃO DE EDIÇÃO (ícone de lápis)
  // ============================================================

  // Botão circular com fundo azul claro e borda
  editIconButton: {
    padding: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },

  // Texto do botão de edição (✎)
  editIconText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // ============================================================
  // ITEM DE CONQUISTA (apenas ícone, sem texto)
  // ============================================================

  // Container centralizado do ícone da conquista
  achievementItem: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },

  // ============================================================
  // MENSAGEM PARA QUANDO NÃO HÁ DADOS
  // ============================================================

  // Estilo para mensagens de "vazio" (ex.: "Nenhum hábito acessado ainda.")
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    paddingVertical: 10,
  },

  // ============================================================
  // MODAL DE EDIÇÃO (comum para nome e dados pessoais)
  // ============================================================

  // Container do modal: fundo escuro semi-transparente que cobre a tela
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // Cartão branco do modal com sombra
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Título do modal (ex.: "Editar Nome")
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },

  // Campo de texto: fundo cinza claro, borda arredondada
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 15,
  },

  // Container dos botões (Cancelar / Salvar) lado a lado
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },

  // Estilo base de cada botão (ocupa metade da largura)
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  // Botão Cancelar: fundo cinza
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },

  // Botão Salvar: fundo azul (cor primária do tema)
  modalButtonSave: {
    backgroundColor: colors.primary,
  },

  // Texto dos botões: branco para contraste
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});