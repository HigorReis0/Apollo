import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Platform, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';

interface HomeStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
  // header, profileImageSmall, progressBar... removidos daqui
  heroSection: ViewStyle;
  heroTitle: TextStyle;
  heroContent: ViewStyle;
  heroImage: ImageStyle;
  arrowButton: ViewStyle;
  arrowIcon: ImageStyle;
  contentContainer: ViewStyle;
  profileCard: ViewStyle;
  cardAvatar: ImageStyle;
  cardTextContainer: ViewStyle;
  cardName: TextStyle;
  cardBio: TextStyle;
  sectionTitle: TextStyle;
  habitsGrid: ViewStyle;
  habitItem: ViewStyle;
  habitLabel: TextStyle;
  habitImage: ImageStyle;
}

export const styles = StyleSheet.create<HomeStyle>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // --- Seção Hero ---
  heroSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  heroImage: {
    width: 150,
    height: 120,
  },
  arrowButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  cardBio: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitItem: {
    width: '47%', 
    backgroundColor: colors.white, 
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3, 
  },
  habitLabel: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 10,
    fontWeight: '600',
  },
  habitImage: {
    width: 70,
    height: 70,
  },
});