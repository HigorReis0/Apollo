// ============================================================
// IMPORTAÇÕES
// ============================================================

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../theme/colors';

// ============================================================
// INTERFACE – define a tipagem de cada estilo
// ============================================================
interface PerfilStyle {
  // ---- CONTAINER PRINCIPAL ----
  safeArea: ViewStyle;
  container: ViewStyle;

  // ---- CABEÇALHO DO PERFIL ----
  headerContainer: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  name: TextStyle;
  email: TextStyle;
  levelContainer: ViewStyle;
  levelText: TextStyle;
  progressBarBackground: ViewStyle;
  progressBarFill: ViewStyle;
  xpText: TextStyle;
  editButton: ViewStyle;
  editButtonText: TextStyle;

  // ---- CARTÕES ----
  mainCard: ViewStyle;
  cardTitle: TextStyle;

  // ---- DADOS PESSOAIS ----
  dataGrid: ViewStyle;
  dataItem: ViewStyle;
  dataLabel: TextStyle;
  dataValue: TextStyle;

  // ---- CONQUISTAS ----
  achievementsGrid: ViewStyle;
  achievementIcon: ImageStyle;

  // ---- ÚLTIMOS ACESSOS (LISTA VERTICAL SEM ÍCONES) ----
  habitsList: ViewStyle;               // Container da lista (coluna)
  habitItemVertical: ViewStyle;        // Cada item (apenas texto)
  habitInfoVertical: ViewStyle;        // Container das informações (nome + XP)
  habitLabelVertical: TextStyle;       // Nome do hábito (maior)
  habitXpVertical: TextStyle;          // XP ganho (maior)

  // ---- NOVOS ESTILOS ----
  cardHeader: ViewStyle;
  editIconButton: ViewStyle;
  editIconText: TextStyle;
  achievementItem: ViewStyle;
  emptyMessage: TextStyle;

  // ---- MODAIS ----
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  modalInput: TextStyle;
  modalButtons: ViewStyle;
  modalButton: ViewStyle;
  modalButtonCancel: ViewStyle;
  modalButtonSave: ViewStyle;
  modalButtonText: TextStyle;

  // ============================================================
  // NOVOS ESTILOS PARA SELETOR DE AVATAR (UPLOAD DE FOTO)
  // ============================================================
  avatarPicker: ViewStyle;             // Container do seletor de avatar (botão + imagem)
  avatarPickerImage: ImageStyle;       // Imagem do avatar (prévia) no seletor
  avatarPickerText: TextStyle;         // Texto "Alterar Foto" abaixo da imagem
}

// ============================================================
// EXPORTAÇÃO DOS ESTILOS
// ============================================================
export const styles = StyleSheet.create<PerfilStyle>({

  // ============================================================
  // CONTAINER PRINCIPAL
  // ============================================================

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },

  // ============================================================
  // CABEÇALHO DO PERFIL
  // ============================================================

  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  levelContainer: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    paddingHorizontal: 40,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 6,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  xpText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 5,
    fontWeight: '500',
  },
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
  // CARTÕES
  // ============================================================

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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },

  // ============================================================
  // DADOS PESSOAIS
  // ============================================================

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

  // ============================================================
  // CONQUISTAS
  // ============================================================

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

  // ============================================================
  // ÚLTIMOS ACESSOS – LISTA VERTICAL SEM ÍCONES
  // ============================================================

  habitsList: {
    flexDirection: 'column',
    width: '100%',
  },
  habitItemVertical: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  habitInfoVertical: {
    flexDirection: 'column',
    width: '100%',
  },
  habitLabelVertical: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  habitXpVertical: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // ============================================================
  // NOVOS ESTILOS ADICIONADOS (CABEÇALHO, ÍCONE DE EDIÇÃO, ETC.)
  // ============================================================

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editIconButton: {
    padding: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editIconText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  achievementItem: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    paddingVertical: 10,
  },

  // ============================================================
  // MODAIS
  // ============================================================

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  // ============================================================
  // ESTILOS DO SELETOR DE AVATAR (UPLOAD DE FOTO) – NOVOS
  // ============================================================

  // Container que agrupa a imagem e o texto "Alterar Foto"
  // Centraliza os elementos e adiciona espaçamento inferior.
  avatarPicker: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // Imagem do avatar no seletor: 100x100, circular, com borda azul.
  // Se o usuário já tiver uma foto, mostra a foto atual; senão, mostra o fallback.
  avatarPickerImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Metade da largura = círculo perfeito
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 10,
  },

  // Texto "Alterar Foto" abaixo da imagem.
  // Estilizado como link (sublinhado, cor primária) para indicar clicabilidade.
  avatarPickerText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});