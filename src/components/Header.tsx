import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Animated,
  Easing,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';

// @ts-ignore
import imgPerfil from '../../assets/imagemExemploPerfil.png';
// @ts-ignore
import imgMenu from '../../assets/iconeMenu.png';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

export function Header() {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Valor animado (0 = fechado, 1 = aberto)
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      // Fechar
      Animated.timing(animationController, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      // Abrir
      setMenuVisible(true);
      Animated.timing(animationController, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)), // Efeito elástico sutil
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    toggleMenu(); // Fecha com animação
    setTimeout(() => {
      navigation.navigate(screen);
    }, 200); // Espera a animação terminar um pouco
  };

  // Interpolações para a animação
  const menuTranslateY = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 10], // Começa 20px acima e desce para 10px abaixo
  });

  const menuOpacity = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuScale = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <View style={styles.container}>
      
      {/* Se o menu estiver aberto, criamos uma área transparente para fechar ao clicar fora */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Conteúdo do Cabeçalho */}
      <View style={styles.headerContent}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.menuButton} 
          onPress={toggleMenu}
        >
          <Image source={imgMenu} style={styles.menuIcon} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => navigation.navigate('Perfil')}
        >
          <Image source={imgPerfil} style={styles.profileImageSmall} />
        </TouchableOpacity>
      </View>

      {/* LINHA DIVISÓRIA */}
      <View style={styles.headerDivider} />

      {/* MENU DROPDOWN ANIMADO */}
      {menuVisible && (
        <Animated.View 
          style={[
            styles.dropdownMenu, 
            { 
              opacity: menuOpacity,
              transform: [
                { translateY: menuTranslateY },
                { scale: menuScale }
              ] 
            }
          ]}
        >
          {/* Seta do Menu (Triângulo) */}
          <View style={styles.arrowUp} />

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Perfil')}>
            <Text style={styles.menuItemText}>👤 Perfil</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
            <Text style={styles.menuItemText}>🏠 Início</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Habitos')}>
            <Text style={styles.menuItemText}>📋 Hábitos</Text>
          </TouchableOpacity>

        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000, // Altíssima prioridade para ficar sobre tudo
    width: '100%',
    position: 'relative', // Necessário para o absolute funcionar dentro
  },
  // Backdrop invisível que cobre a tela inteira para detectar clique fora
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000, // Cobre bastante espaço para baixo
    height: 2000,
    width: '100%',
    zIndex: 1, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 15,
    zIndex: 2, // Fica acima do backdrop
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB', 
    width: '100%',
    marginBottom: 20, 
  },
  menuButton: {
    padding: 5,
    marginRight: 15,
  },
  menuIcon: {
    width: 28,
    height: 28,
    tintColor: colors.textDark,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginRight: 15,
  },
  progressBarFill: {
    width: '45%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  profileImageSmall: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: colors.white,
  },

  // --- ESTILOS DO MENU ---
  dropdownMenu: {
    position: 'absolute',
    top: 60, // Posiciona logo abaixo do botão de menu
    left: 10,
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    zIndex: 1001, // Acima de tudo
    // Sombra bonita
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  // Triângulo decorativo apontando para cima
  arrowUp: {
    position: 'absolute',
    top: -10,
    left: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white, // Cor do triângulo
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  menuSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    marginLeft: 26, // Alinha com o texto, ignorando o emoji
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
});