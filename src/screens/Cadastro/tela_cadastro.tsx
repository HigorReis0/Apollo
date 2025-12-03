import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator, // Importado para o efeito de loading
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

// Importando estilos da mesma pasta
import { styles } from './tela_cadastro.styles';
// Importando cores para o spinner
import { colors } from '../../theme/colors';

// Componentes
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
import imgCadastro from '../../../assets/lendo.png';

type CadastroScreenProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function RegisterScreen() {
  const navigation = useNavigation<CadastroScreenProp>();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    // 1. Validação de Campos Vazios
    if (!nome || !senha || !confirmarSenha || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    // 2. Validação de Senha Igual
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // 3. Inicia o Loading
    setIsLoading(true);

    // Simula uma requisição ao servidor (2 segundos)
    setTimeout(() => {
      setIsLoading(false);
      // Redireciona automaticamente após o "cadastro"
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.titleText}>APOLLO</Text>
            <View style={styles.imageContainer}>
              <Image source={imgCadastro} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.card}>
            <CustomInput 
              label="Nome" 
              placeholder="Seu nome completo" 
              value={nome} 
              onChangeText={setNome} 
              autoCapitalize="words" 
              editable={!isLoading} // Bloqueia input durante loading
            />
            <CustomInput 
              label="Email" 
              placeholder="exemplo@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              value={email} 
              onChangeText={setEmail}
              editable={!isLoading}
            />
            <CustomInput 
              label="Senha" 
              placeholder="••••••••••" 
              secureTextEntry 
              value={senha} 
              onChangeText={setSenha}
              editable={!isLoading}
            />
            <CustomInput 
              label="Confirmar Senha" 
              placeholder="••••••••••" 
              secureTextEntry 
              value={confirmarSenha} 
              onChangeText={setConfirmarSenha}
              editable={!isLoading}
            />

            {/* Renderização Condicional: Botão ou Loading */}
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
            
            <CustomButton 
              title="Já tenho cadastro" 
              onPress={() => navigation.goBack()} 
              variant="link" 
              disabled={isLoading} // Evita sair da tela durante o processo
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}