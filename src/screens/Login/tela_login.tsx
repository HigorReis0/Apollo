// Importa o React e o hook useState para gerenciar o estado local (como email, senha e loading)
import React, { useState } from 'react';
// Importa componentes essenciais do React Native para construção da interface
import {
  View, // Container básico
  Text, // Exibição de texto
  SafeAreaView, // Garante que o layout respeite as áreas seguras (notches)
  ScrollView, // Permite rolagem da tela
  Image, // Exibição de imagens
  KeyboardAvoidingView, // Comportamento para evitar que o teclado cubra os inputs
  Platform, // Detecção da plataforma (iOS/Android)
  Alert, // Popups nativos de alerta
  ActivityIndicator, // Indicador de carregamento (spinner)
} from 'react-native';
// Hooks de navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Tipagem das rotas
import { RootStackParamList } from '../../navigation/AppNavigator';

// Estilos locais e cores globais
import { styles } from './tela_login.styles';
import { colors } from '../../theme/colors';

// Componentes customizados para padronizar inputs e botões
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// Importa a imagem de ilustração (ignorando erro de tipo do TS)
// @ts-ignore
import telaLoginImage from '../../../assets/homem_sentado_login.png';

// Define o tipo da propriedade de navegação especificamente para a tela de Login
type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  // Inicializa o hook de navegação
  const navigation = useNavigation<LoginScreenProp>();
  
  // Estados para armazenar os valores dos inputs e o status de carregamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função principal de Login
  const handleLogin = () => {
    // Validação simples: verifica se algum campo está vazio
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha para continuar.');
      return; // Interrompe a função se inválido
    }
    // Ativa o estado de carregamento (mostra o spinner e bloqueia inputs)
    setIsLoading(true);

    // Simula uma requisição ao backend (API) com um delay de 2 segundos
    setTimeout(() => {
      setIsLoading(false); // Desativa o carregamento após o tempo passar

      // Lógica de autenticação "Hardcoded" (apenas para fins de protótipo/teste)
      // Verifica se o email e senha batem com os valores predefinidos
      if (email.trim().toLowerCase() === 'admin@gmail.com' && password === 'admin') {
        navigation.navigate('Home'); // Sucesso: navega para a tela inicial
      } else {
        Alert.alert('Erro de Acesso', 'E-mail ou senha incorretos.'); // Falha: exibe alerta
      }
    }, 2000);
  };

  // Redireciona para a tela de cadastro
  const handleSignUpRedirect = () => {
    navigation.navigate('Cadastro');
  };

  // Redireciona para a tela de recuperação de senha
  const handleForgotPassword = () => {
    navigation.navigate('RecuperacaoSenha');
  };

  return (
    // SafeAreaView protege o conteúdo das bordas físicas do dispositivo
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView ajusta o layout quando o teclado aparece */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Comportamento específico por plataforma
      >
        {/* ScrollView permite rolar a tela em dispositivos menores ou quando o teclado sobe */}
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Cabeçalho: Título "APOLLO" e Imagem */} 
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image
                source={telaLoginImage}
                style={styles.illustration}
                resizeMode="contain" // Mantém a proporção da imagem
              />
            </View>
          </View>

          {/* Cartão contendo o formulário de login */}
          <View style={styles.loginCard}>
            
            {/* Input de Email */}
            <CustomInput 
              label="Email"
              placeholder="exemplo@exemplo.com"
              keyboardType="email-address" // Teclado otimizado para emails
              autoCapitalize="none" // Não capitaliza a primeira letra automaticamente
              value={email}
              onChangeText={setEmail} // Atualiza o estado ao digitar
              editable={!isLoading} // Bloqueia edição se estiver carregando
              />

            {/* Input de Senha */}
            <CustomInput 
              label="Password"
              placeholder="••••••••••"
              secureTextEntry // Mascara os caracteres da senha
              autoCapitalize="none" // Não capitaliza a primeira letra automaticamente
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            {/* Renderização Condicional: Spinner ou Botão Entrar */}
            {isLoading ? (
              // Se estiver carregando, mostra o indicador de atividade
              <View style={{ marginTop: 30, marginBottom: 10, height: 50, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              // Se não estiver carregando, mostra o botão de login normal
              <CustomButton 
                title="Entrar" 
                onPress={handleLogin} 
                variant="primary" 
              />
            )}

            {/* Botão secundário para Cadastro */}
            <CustomButton 
              title="Cadastrar" 
              onPress={handleSignUpRedirect} 
              variant="secondary" // Estilo visual diferente (ex: verde)
              disabled={isLoading} // Desabilita o clique durante o carregamento
            />

            {/* Link para Recuperação de Senha */}
            <CustomButton 
              title="Esqueceu a senha?" 
              onPress={handleForgotPassword} 
              variant="link" // Estilo visual de link (sem fundo)
              disabled={isLoading} 
            />

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}