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
// O TypeScript no editor às vezes não reconhece imagens fora da pasta src.
// O caminho '../..' é necessário porque este arquivo está em 'src/screens/'.
import telaLogin from '../../assets/homem_sentado_login.png';

// Interface para tipagem dos estilos.
// Ajuda o TypeScript a verificar se todas as chaves de estilo estão corretas.
interface Style {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  titleText: TextStyle;
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  loginCard: ViewStyle;
  label: TextStyle;
  spacingTop: ViewStyle;
  input: TextStyle;
  button: ViewStyle;
  secondaryButton: ViewStyle; // Estilo para o botão de Cadastro (verde)
  buttonText: TextStyle;
  forgotPasswordText: TextStyle;
}

export default function LoginScreen() {
  // Estados para controlar os inputs do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função de Login (Simulação)
  const handleLogin = () => {
    if (email && password) {
      // Em um app real, aqui faríamos a requisição para o Backend.
      Alert.alert('Sucesso', `Login simulado para: ${email}`);
    } else {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha para continuar.');
    }
  };

  // Função para redirecionar para o Cadastro (Simulação)
  const handleSignUpRedirect = () => {
    Alert.alert('Navegação', 'Indo para a tela de cadastro...');
  };

  const handleForgotPassword = () => {
    Alert.alert('Funcionalidade', 'Aqui você seria redirecionado para a tela de recuperação.');
  };

  return (
    // SafeAreaView: Garante que o conteúdo não fique escondido atrás do "notch" ou barra de status
    <SafeAreaView style={styles.safeArea}>
      
      {/* KeyboardAvoidingView: Ajusta a tela automaticamente quando o teclado virtual sobe */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Seção Superior: Identidade Visual (APOLLO e Imagem) */}
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image
                source={telaLogin}
                style={styles.illustration}
                resizeMode="contain"
                onError={() => console.warn("Erro: Imagem não carregada")}
              />
            </View>
          </View>

          {/* Seção Principal: Formulário */}
          <View style={styles.loginCard}>
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@exemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, styles.spacingTop]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Botão Entrar (Principal) */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Botão Cadastrar (Secundário - Verde) */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSignUpRedirect}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Definição de Cores
const colors = {
  background: '#F9FAFB',
  cardBackground: '#1F2937',
  primary: '#4F68C4',
  success: '#10B981', // Cor verde para o botão de cadastro
  inputBackground: '#FFFFFF',
  white: '#FFFFFF',
  textLight: '#E5E7EB',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  imageContainer: {
    width: '40%', 
    height: 200, 
    minWidth: 150, 
    maxWidth: 250, 
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
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
  spacingTop: {
    marginTop: 20,
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
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10, // Espaço entre o botão principal e o secundário
  },
  secondaryButton: {
    backgroundColor: colors.success,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Espaço antes do link de texto
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: colors.textLight,
    fontSize: 14,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
});