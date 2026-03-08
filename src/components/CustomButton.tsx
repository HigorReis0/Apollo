// Importa o React para criar componentes funcionais.
import React from 'react';
// Importa componentes nativos e utilitários de tipagem do React Native.
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
// Importa as cores do tema global.
import { colors } from '../theme/colors';

// Define um tipo personalizado para as variantes de estilo do botão.
// Isso restringe os valores possíveis para 'primary', 'secondary' ou 'link'.
type ButtonVariant = 'primary' | 'secondary' | 'link';

// Interface das propriedades do componente.
// Estende TouchableOpacityProps para herdar tudo o que um botão nativo já aceita (onPress, disabled, etc).
interface Props extends TouchableOpacityProps {
  title: string;       // Texto que aparecerá no botão.
  variant?: ButtonVariant; // Variante de estilo (opcional, padrão será 'primary').
}

// Componente funcional do botão customizado.
export function CustomButton({ title, variant = 'primary', style, ...rest }: Props) {
  // Define os estilos padrão (botão primário).
  let buttonStyle = styles.primaryButton;
  let textStyle = styles.textWhite;

  // Lógica para alternar estilos com base na variante escolhida.
  if (variant === 'secondary') {
    buttonStyle = styles.secondaryButton;
  } else if (variant === 'link') {
    // Se for link, muda o container e a cor do texto.
    buttonStyle = styles.linkButton;
    textStyle = styles.textLink;
  }

  return (
    // TouchableOpacity é a área clicável que fornece feedback visual (reduz opacidade).
    <TouchableOpacity
      // Combina o estilo base, o estilo da variante e quaisquer estilos extras passados via props.
      style={[styles.baseButton, buttonStyle, style]}
      // Define a opacidade ao clicar (0.8 = 80%).
      activeOpacity={0.8}
      // Espalha as outras props (como onPress) para o componente nativo.
      {...rest}
    >
      {/* Exibe o texto do botão combinando estilo base e estilo da variante */}
      <Text style={[styles.textBase, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Definição dos estilos locais.
const styles = StyleSheet.create({
  // Estilo base comum a todos os botões (exceto links, que sobrescrevem algumas coisas).
  baseButton: {
    height: 50, // Altura fixa para boa área de toque.
    borderRadius: 8, // Bordas arredondadas.
    alignItems: 'center', // Centraliza o texto horizontalmente (padrão).
    justifyContent: 'center', // Centraliza o texto verticalmente.
    width: '100%', // Ocupa toda a largura disponível.
    marginBottom: 10, // Espaço abaixo do botão.
  },
  // Estilo base do texto (tamanho e peso).
  textBase: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Cor de fundo para o botão primário (Azul).
  primaryButton: {
    backgroundColor: colors.primary,
  },
  // Cor de fundo para o botão secundário (Verde/Sucesso).
  secondaryButton: {
    backgroundColor: colors.success,
  },
  // Estilo específico para botões do tipo "link" (sem fundo).
  linkButton: {
    backgroundColor: 'transparent', // Fundo invisível.
    height: 'auto', // Altura automática (se ajusta ao texto).
    marginTop: 10, // Espaço extra no topo.
    alignItems: 'flex-start', // Alinha o texto à esquerda (diferente do centro padrão).
  },
  // Cor do texto para botões com fundo sólido (Branco).
  textWhite: {
    color: colors.white,
  },
  // Estilo do texto para botões do tipo link.
  textLink: {
    color: colors.textLight, // Cor mais clara/cinza.
    fontSize: 14, // Fonte menor.
    textDecorationLine: 'underline', // Sublinhado.
    fontWeight: 'normal', // Peso normal (não negrito).
  },
});