// Importa o React e o hook useState para gerenciar o estado dos inputs e do loading
import React, { useState } from 'react';
// Importa componentes visuais do React Native
import {
  View, // Container flexível
  Text, // Para exibir texto
  SafeAreaView, // Garante que o conteúdo não invada o notch/status bar
  ScrollView, // Permite rolagem vertical
  Image, // Exibição de imagens
  KeyboardAvoidingView, // Ajusta o layout quando o teclado abre
  Platform, // Detecta se é iOS ou Android
  Alert, // Popups nativos
  ActivityIndicator, // Indicador de carregamento (spinner)
} from 'react-native';
// Hooks de navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Definição das rotas
import { RootStackParamList } from '../../navigation/AppNavigator';

// Estilos específicos desta tela
import { styles } from './tela_cadastro.styles';
// Cores globais do tema
import { colors } from '../../theme/colors';

// Componentes customizados para input e botão
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// Importa a imagem de ilustração (ignorando verificação de tipo do TS)
// @ts-ignore
import imgCadastro from '../../../assets/lendo.png';

// Define o tipo de navegação específico para a tela de Cadastro
type CadastroScreenProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function RegisterScreen() {
  // Inicializa o hook de navegação
  const navigation = useNavigation<CadastroScreenProp>();
  
  // Estados para armazenar os valores dos campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estado para controlar o status de carregamento da requisição
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada ao clicar no botão Registrar
  const handleRegister = () => {
    // 1. Validação de Campos Vazios
    if (!nome || !senha || !confirmarSenha || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    // 2. Validação de Senha Igual (confirmação)
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // 3. Inicia o Loading (mostra o spinner e bloqueia inputs)
    setIsLoading(true);

    // Simula uma requisição ao servidor com delay de 2 segundos
    setTimeout(() => {
      setIsLoading(false); // Para o loading
      // Redireciona automaticamente para a tela Home após o "sucesso"
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    // Área segura da tela
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView ajusta a tela para que o teclado não cubra os campos */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView permite rolar caso o teclado ocupe muito espaço */}
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Cabeçalho com Título e Imagem */}
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image source={imgCadastro} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          {/* Cartão principal com o formulário */}
          <View style={styles.card}>
            {/* Input Nome */}
            <CustomInput 
              label="Nome" 
              placeholder="Seu nome completo" 
              value={nome} 
              onChangeText={setNome} 
              autoCapitalize="words" // Capitaliza a primeira letra de cada palavra
              editable={!isLoading} // Bloqueia input durante loading
            />
            
            {/* Input Email */}
            <CustomInput 
              label="Email" 
              placeholder="exemplo@exemplo.com" 
              keyboardType="email-address" // Teclado otimizado para email
              autoCapitalize="none" 
              value={email} 
              onChangeText={setEmail}
              editable={!isLoading}
            />
            
            {/* Input Senha */}
            <CustomInput 
              label="Senha" 
              placeholder="••••••••••" 
              secureTextEntry // Mascara a senha
              value={senha} 
              onChangeText={setSenha}
              editable={!isLoading}
            />
            
            {/* Input Confirmar Senha */}
            <CustomInput 
              label="Confirmar Senha" 
              placeholder="••••••••••" 
              secureTextEntry 
              value={confirmarSenha} 
              onChangeText={setConfirmarSenha}
              editable={!isLoading}
            />

            {/* Renderização Condicional: Mostra Spinner ou Botão Registrar */}
            {isLoading ? (
              <View style={{ marginTop: 10, height: 50, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <CustomButton 
                title="Registrar" 
                onPress={handleRegister} 
                variant="primary" 
                style={{ marginTop: 10 }} 
              />
            )}
            
            {/* Botão para voltar ao login se já tiver cadastro */}
            <CustomButton 
              title="Já tenho cadastro" 
              onPress={() => navigation.goBack()} // Volta para a tela anterior
              variant="link" 
              disabled={isLoading} // Evita sair da tela durante o processo
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}