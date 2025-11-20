import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

// @ts-ignore
// O caminho ../../ assume que o arquivo está em src/screens/
import imgRecuperacao from '../../assets/deitado_computador.png';

// Interface para tipagem dos estilos.
interface Style {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  card: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  buttonRow: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  buttonText: TextStyle;
  secondaryButtonText: TextStyle;
}

export default function RecoverPasswordScreen() {
  // Estado para armazenar o email
  const [email, setEmail] = useState('');

  // Função para simular o envio do link de recuperação
  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail cadastrado.');
      return;
    }
    Alert.alert('Sucesso', `Um link de redefinição foi enviado para ${email}.`);
  };

  // Função para simular o cancelamento
  const handleCancel = () => {
    Alert.alert('Navegação', 'Voltando para a tela de Login...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Cabeçalho: Apenas a Ilustração (Maior) */}
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              <Image
                source={imgRecuperacao}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Card Escuro de Recuperação */}
          <View style={styles.card}>
            
            <Text style={styles.label}>Email cadastrado</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@exemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Linha de Botões: Cancelar e Resetar Senha */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResetPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Resetar Senha</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const colors = {
  background: '#F9FAFB',
  cardBackground: '#1F2937',
  primary: '#4F68C4', 
  inputBackground: '#FFFFFF',
  textLight: '#E5E7EB',
  white: '#FFFFFF',
};

const styles = StyleSheet.create<Style>({
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBackground,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    marginBottom: 30, 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha o grupo à direita
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    width: 160, 
    backgroundColor: colors.primary,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    maxWidth: 100, 
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Aumentei drasticamente a margem para 60 para forçar a visualização da mudança
    marginRight: 40, 
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
  },
});