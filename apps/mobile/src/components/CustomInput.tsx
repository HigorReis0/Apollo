import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
}

export function CustomInput({ label, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBackground,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: colors.inputBackground,
  },
});