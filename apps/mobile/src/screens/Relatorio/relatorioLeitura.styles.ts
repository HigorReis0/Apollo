import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

// ============================================================
// ESTILOS DA TELA DE RELATÓRIO DE LEITURA (TEMA CLARO)
// ============================================================
export const styles = StyleSheet.create({

  // ---- CONTAINER PRINCIPAL ----
  container: {
    flex: 1,
    backgroundColor: colors.background, // Fundo claro (tema Apollo)
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  // ---- CABEÇALHO ----
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 24,
    fontWeight: '600',
  },

  // ---- CARDS (grid 2 colunas) ----
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcone: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },

  // ---- META MENSAL ----
  metaContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  metaPercentual: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981', // Verde
  },
  barraFundo: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barraPreenchida: {
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  metaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaTexto: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // ---- EDIÇÃO DA META ----
  editarMetaButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
  },
  editarMetaButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  editarMetaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editarMetaInput: {
    width: 80,
    height: 32,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  editarMetaSalvar: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  editarMetaSalvarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  editarMetaCancelar: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  editarMetaCancelarText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  // ---- ÚLTIMO LIVRO ----
  ultimoLivro: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ultimoLivroTitulo: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  ultimoLivroNome: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  ultimoLivroAutor: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
    fontWeight: '600',
  },
  ultimoLivroPaginas: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // ---- BOTÃO DE VOLTAR ----
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // ---- DADOS VAZIOS ----
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  botaoIrLer: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoIrLerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ---- ERRO ----
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});