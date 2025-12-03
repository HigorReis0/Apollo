import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
// Ajuste no caminho do tema (subimos 2 níveis: Cadastro -> screens -> src)
import { colors } from '../../theme/colors';

interface CadastroStyle {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  titleText: TextStyle;
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  card: ViewStyle;
}

export const styles = StyleSheet.create<CadastroStyle>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 40, 
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  imageContainer: {
    width: '40%',
    height: 180,
    minWidth: 120,
    maxWidth: 200,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
});