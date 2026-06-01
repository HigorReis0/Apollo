import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface PerfilStyle {
  safeArea: ViewStyle;
  container: ViewStyle;
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
  mainCard: ViewStyle;
  cardTitle: TextStyle;
  dataGrid: ViewStyle;
  dataItem: ViewStyle;
  dataLabel: TextStyle;
  dataValue: TextStyle;
  achievementsGrid: ViewStyle;
  achievementIcon: ImageStyle;
  habitsGrid: ViewStyle;
  habitItem: ViewStyle;
  habitImage: ImageStyle;
  habitLabel: TextStyle;
  editButton: ViewStyle;
  editButtonText: TextStyle;
}

export const styles = StyleSheet.create<PerfilStyle>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
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