// Importa o React para criar componentes funcionais.
import React from 'react';
// Importa componentes nativos e utilitários de tipagem/estilo do React Native.
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
// Importa as cores do tema global.
import { colors } from '../theme/colors';

// Define a interface para as propriedades do componente.
// 'extends TextInputProps' herda todas as propriedades padrão de um TextInput (como onChangeText, value, keyboardType, etc.),
// permitindo que o CustomInput seja usado quase como um TextInput nativo.
interface Props extends TextInputProps {
  label: string; // Adiciona uma propriedade obrigatória 'label' para o título do campo.
}

// ATENÇÃO: Tem que ser 'export function', sem o 'default', para forçar a importação por nome { CustomInput }.
export function CustomInput({ label, style, ...rest }: Props) {
  return (
    // Container que envolve o label e o input.
    <View style={styles.container}>
      {/* Exibe o texto do rótulo acima do campo */}
      <Text style={styles.label}>{label}</Text>
      
      {/* Componente de entrada de texto nativo */}
      <TextInput
        // Mescla o estilo padrão 'styles.input' com qualquer estilo extra passado via props ('style').
        style={[styles.input, style]}
        // Define a cor do texto de placeholder (dica) usando o tema.
        placeholderTextColor={colors.placeholder}
        // Espalha todas as outras propriedades recebidas (onChangeText, value, secureTextEntry, etc.) para o TextInput.
        {...rest}
      />
    </View>
  );
}

// Definição dos estilos locais.
const styles = StyleSheet.create({
  // Container do componente (ocupa largura total e tem margem inferior).
  container: {
    width: '100%',
    marginBottom: 20,
  },
  // Estilo do rótulo (label).
  label: {
    fontSize: 14,
    fontWeight: '600', // Semi-negrito.
    color: colors.textLight, // Cor clara para contrastar (se o fundo for escuro) ou cinza.
    marginBottom: 8, // Espaço entre o label e a caixa de texto.
  },
  // Estilo da caixa de entrada de texto.
  input: {
    backgroundColor: colors.inputBackground, // Cor de fundo do input (geralmente branco).
    height: 50, // Altura fixa para uma boa área de toque.
    borderRadius: 8, // Bordas levemente arredondadas.
    paddingHorizontal: 16, // Espaçamento interno lateral para o texto não colar na borda.
    fontSize: 16, // Tamanho da fonte legível.
    color: '#374151', // Cor do texto digitado (cinza escuro).
    borderWidth: 1, // Borda fina.
    borderColor: colors.inputBackground, // Cor da borda (inicialmente igual ao fundo).
  },
});