import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
// Ajuste no caminho do tema
import { colors } from '../../theme/colors';

interface RecuperacaoStyle {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  card: ViewStyle;
  buttonRow: ViewStyle;
}

export const styles = StyleSheet.create<RecuperacaoStyle>({
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
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: '80%', 
    height: 250, 
    maxWidth: 400,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
});