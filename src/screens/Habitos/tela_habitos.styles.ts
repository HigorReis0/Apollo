import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface HabitosStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  // header, profileImageSmall, progressBar... removidos
  card: ViewStyle;
  cardImage: ImageStyle;
  cardContent: ViewStyle;
  cardTitle: TextStyle;
  cardText: TextStyle;
  decorativeCurve: ViewStyle;
}

export const styles = StyleSheet.create<HabitosStyle>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // --- Cards de Hábitos ---
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  cardContent: {
    flex: 1, 
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '400',
  },
  decorativeCurve: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.textDark,
    opacity: 0.8,
  }
});