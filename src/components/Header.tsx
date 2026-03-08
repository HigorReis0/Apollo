// Importa o React, o hook useState (para estado) e useRef (para referências que não causam re-render).
import React, { useState, useRef } from 'react';
// Importa componentes visuais e utilitários de animação do React Native.
import { 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Animated, // Biblioteca de animação
  Easing,   // Curvas de velocidade para animação
  TouchableWithoutFeedback // Detecta toques sem feedback visual
} from 'react-native';
// Hooks e tipos para navegação.
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// Cores do tema.
import { colors } from '../theme/colors';

// Importação das imagens (ignorando TS errors).
// @ts-ignore
import imgPerfil from '../../assets/imagemExemploPerfil.png';
// @ts-ignore
import imgMenu from '../../assets/iconeMenu.png';

// Define o tipo de navegação para o Header (pode navegar para qualquer rota da RootStack).
type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

export function Header() {
  // Inicializa o hook de navegação.
  const navigation = useNavigation<HeaderNavigationProp>();
  // Estado para controlar se o menu está visível ou não.
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Cria uma referência animada que persiste entre renderizações.
  // Valor 0 representa "fechado" e 1 representa "aberto".
  const animationController = useRef(new Animated.Value(0)).current;

  // Função para alternar a visibilidade do menu com animação.
  const toggleMenu = () => {
    if (menuVisible) {
      // Se está aberto, vamos fechar.
      Animated.timing(animationController, {
        toValue: 0, // Anima para 0 (fechado)
        duration: 200, // Duração em ms
        easing: Easing.out(Easing.ease), // Curva de desaceleração suave
        useNativeDriver: true, // Usa o driver nativo para performance
      }).start(() => setMenuVisible(false)); // Só muda o estado para false APÓS a animação terminar
    } else {
      // Se está fechado, vamos abrir.
      setMenuVisible(true); // Primeiro torna visível para renderizar
      Animated.timing(animationController, {
        toValue: 1, // Anima para 1 (aberto)
        duration: 300,
        easing: Easing.out(Easing.back(1.5)), // Efeito elástico (vai um pouco além e volta)
        useNativeDriver: true,
      }).start();
    }
  };

  // Função auxiliar que fecha o menu e depois navega.
  const navigateTo = (screen: keyof RootStackParamList) => {
    toggleMenu(); // Fecha com animação
    setTimeout(() => {
      navigation.navigate(screen); // Navega após um pequeno delay para a animação fluir
    }, 200); 
  };

  // -- Interpolações: Mapeiam o valor animado (0 a 1) para propriedades de estilo --

  // Translação Y: Menu desliza de cima (-20px) para baixo (10px).
  const menuTranslateY = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 10], 
  });

  // Opacidade: Vai de transparente (0) a opaco (1).
  const menuOpacity = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Escala: Aumenta ligeiramente de tamanho (zoom in) ao abrir.
  const menuScale = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    // Container principal do Header.
    <View style={styles.container}>
      
      {/* BACKDROP: Se o menu estiver aberto, renderiza uma View invisível gigante.
        Isso serve para detectar cliques fora do menu e fechá-lo.
      */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {/* Conteúdo visível do cabeçalho (Barra superior) */}
      <View style={styles.headerContent}>
        {/* Botão do Menu (Hambúrguer) */}
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.menuButton} 
          onPress={toggleMenu}
        >
          <Image source={imgMenu} style={styles.menuIcon} resizeMode="contain" />
        </TouchableOpacity>

        {/* Barra de Progresso (Visual apenas) */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Foto de Perfil (Botão) */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => navigation.navigate('Perfil')}
        >
          <Image source={imgPerfil} style={styles.profileImageSmall} />
        </TouchableOpacity>
      </View>

      {/* Linha Divisória abaixo do header */}
      <View style={styles.headerDivider} />

      {/* MENU DROPDOWN ANIMADO 
        Só renderiza se menuVisible for true.
        Usa Animated.View para aplicar as transformações de estilo.
      */}
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
          {/* Triângulo decorativo ("setinha" do balão) */}
          <View style={styles.arrowUp} />

          {/* Opção: Perfil */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Perfil')}>
            <Text style={styles.menuItemText}>👤 Perfil</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          {/* Opção: Início */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
            <Text style={styles.menuItemText}>🏠 Início</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          {/* Opção: Hábitos */}
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
    zIndex: 1000, // Garante que o Header (e o menu) fiquem sobre todo o resto da tela.
    width: '100%',
    position: 'relative', // Contexto de posicionamento para o menu absoluto.
  },
  // Backdrop invisível gigante para fechar o menu ao clicar fora.
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000, // Estende para baixo para cobrir a tela inteira.
    height: 2000,
    width: '100%',
    zIndex: 1, // Fica abaixo do conteúdo do header mas acima do resto do app.
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32, // Espaço para a barra de status.
    marginBottom: 15,
    zIndex: 2, // Fica acima do backdrop para ser clicável.
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
    flex: 1, // Ocupa o espaço restante entre o menu e o perfil.
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginRight: 15,
  },
  progressBarFill: {
    width: '45%', // Simula 45% de progresso.
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  profileImageSmall: {
    width: 45,
    height: 45,
    borderRadius: 22.5, // Redondo.
    borderWidth: 2,
    borderColor: colors.white,
  },

  // --- ESTILOS DO MENU ---
  dropdownMenu: {
    position: 'absolute', // Flutua sobre a tela.
    top: 60, // Posiciona logo abaixo do botão de menu.
    left: 10,
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    zIndex: 1001, // Acima de tudo (inclusive do backdrop).
    // Sombra bonita para dar profundidade:
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  // Triângulo decorativo apontando para cima (feito com bordas transparentes).
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
    borderBottomColor: colors.white, // Cor do triângulo (mesma do menu).
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
    marginLeft: 26, 
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
});