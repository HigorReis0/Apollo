import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'link';

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
}

export function CustomButton({ title, variant = 'primary', style, ...rest }: Props) {
  let buttonStyle = styles.primaryButton;
  let textStyle = styles.textWhite;

  if (variant === 'secondary') {
    buttonStyle = styles.secondaryButton;
  } else if (variant === 'link') {
    buttonStyle = styles.linkButton;
    textStyle = styles.textLink;
  }

  return (
    <TouchableOpacity
      style={[styles.baseButton, buttonStyle, style]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={[styles.textBase, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center', // Centraliza por padrão
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  textBase: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.success,
  },
  linkButton: {
    backgroundColor: 'transparent',
    height: 'auto',
    marginTop: 10,
    alignItems: 'flex-start', // <--- ADICIONADO: Força o alinhamento à esquerda para links
  },
  textWhite: {
    color: colors.white,
  },
  textLink: {
    color: colors.textLight,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: 'normal',
  },
});