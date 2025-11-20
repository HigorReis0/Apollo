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
// Importando a imagem 'lendo.png'.
import imgCadastro from '../../assets/lendo.png';

// Interface de estilos atualizada com o titleText
interface Style {
  safeArea: ViewStyle;
  keyboardAvoidingView: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  titleText: TextStyle; 
  imageContainer: ViewStyle;
  illustration: ImageStyle;
  card: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  spacingTop: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  linkText: TextStyle; // Novo estilo para o link "Já tenho cadastro"
}

export default function RegisterScreen() {
  // Estados atualizados: 'usuario' mudou para 'nome'
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [email, setEmail] = useState('');

  // Função de Cadastro (Simulação)
  const handleRegister = () => {
    // Validação básica
    if (!nome || !senha || !confirmarSenha || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação de senha
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Sucesso (Simulado)
    Alert.alert('Sucesso', `Cadastro realizado para: ${nome}!`);
    console.log('Dados do cadastro:', { nome, email });
  };

  // Função para simular ir para o Login
  const handleLoginRedirect = () => {
    Alert.alert('Navegação', 'Redirecionando para a tela de Login...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Cabeçalho com Título "APOLLO" e Ilustração lado a lado */}
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image
                source={imgCadastro}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Card Escuro de Cadastro */}
          <View style={styles.card}>
            
            {/* Campo: Nome (Alterado de Usuário) */}
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words" // Capitaliza a primeira letra de cada palavra
            />

            {/* Campo: Email */}
            <Text style={[styles.label, styles.spacingTop]}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@exemplo.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Campo: Senha */}
            <Text style={[styles.label, styles.spacingTop]}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {/* Campo: Confirmar Senha */}
            <Text style={[styles.label, styles.spacingTop]}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            {/* Botão Registrar */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            {/* Link "Já tenho cadastro" */}
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.linkText}>Já tenho cadastro</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Cores do tema
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
    height: 180,
    minWidth: 120,
    maxWidth: 200,
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
  },
  spacingTop: {
    marginTop: 16,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilo do novo link, similar ao da tela de login
  linkText: {
    color: colors.textLight,
    fontSize: 14,
    textAlign: 'center', // Centralizado fica melhor no final do form
    textDecorationLine: 'underline',
    marginTop: 20, // Espaço entre o botão e o texto
  },
});