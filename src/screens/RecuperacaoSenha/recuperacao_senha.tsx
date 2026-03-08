// Importa a biblioteca React e o hook useState para gerenciar o estado local (como o email digitado)
import React, { useState } from 'react';
// Importa os componentes visuais nativos do React Native
import {
  View, // Container básico (como uma div)
  SafeAreaView, // Garante que o conteúdo não fique atrás de notches ou barras de status
  ScrollView, // Permite rolagem da tela se o conteúdo for maior que a altura
  Image, // Componente para exibir imagens
  KeyboardAvoidingView, // Ajusta o layout quando o teclado virtual aparece
  Platform, // Utilitário para detectar se é iOS ou Android
  Alert, // Componente para mostrar pop-ups de alerta nativos
} from 'react-native';
// Importa o hook para acessar o objeto de navegação
import { useNavigation } from '@react-navigation/native';
// Importa o tipo para tipar a propriedade de navegação
import { StackNavigationProp } from '@react-navigation/stack';
// Importa a definição das rotas do navegador principal (subindo 2 níveis de pasta)
import { RootStackParamList } from '../../navigation/AppNavigator';

// Importa o arquivo de estilos específico desta tela
import { styles } from './recuperacao_senha.styles';
// Importa o componente de Input customizado reutilizável
import { CustomInput } from '../../components/CustomInput';
// Importa o componente de Botão customizado reutilizável
import { CustomButton } from '../../components/CustomButton';

// Ignora verificação de tipos do TypeScript para a importação de imagens (necessário em alguns setups)
// @ts-ignore
// Importa a imagem de ilustração (subindo 3 níveis para achar a pasta assets)
import imgRecuperacao from '../../../assets/deitado_computador.png';

// Define o tipo específico da prop de navegação para esta tela ('RecuperacaoSenha')
type RecuperacaoScreenProp = StackNavigationProp<RootStackParamList, 'RecuperacaoSenha'>;

// Define e exporta o componente funcional da tela de Recuperação de Senha
export default function RecoverPasswordScreen() {
  // Inicializa o hook de navegação com a tipagem definida acima
  const navigation = useNavigation<RecuperacaoScreenProp>();
  // Cria um estado para armazenar o texto do email, iniciando vazio
  const [email, setEmail] = useState('');

  // Função chamada quando o usuário clica em "Resetar Senha"
  const handleResetPassword = () => {
    // Verifica se o campo de email está vazio
    if (!email) {
      // Se estiver vazio, exibe um alerta pedindo para preencher
      Alert.alert('Atenção', 'Por favor, informe seu e-mail cadastrado.');
      // Interrompe a execução da função aqui
      return;
    }
    // Se tiver email, exibe um alerta de sucesso simulando o envio
    Alert.alert('Sucesso', `Um link de redefinição foi enviado para ${email}.`, [
        // Botão do alerta que, ao ser clicado, volta para a tela anterior (Login)
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  // Renderização da interface (JSX)
  return (
    // SafeAreaView protege o conteúdo das bordas físicas do dispositivo
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView empurra o conteúdo para cima no iOS para o teclado não cobrir o input */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ScrollView permite rolar a tela em dispositivos menores */}
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Container do cabeçalho que segura a imagem */}
          <View style={styles.header}>
            {/* Container específico para dimensionar a imagem */}
            <View style={styles.imageContainer}>
              {/* Exibe a imagem importada, ajustando o modo de redimensionamento */}
              <Image source={imgRecuperacao} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          {/* Cartão escuro que contém o formulário */}
          <View style={styles.card}>
            {/* Campo de entrada para o Email */}
            <CustomInput 
              label="Email cadastrado" // Rótulo do campo
              placeholder="exemplo@exemplo.com" // Texto de dica
              keyboardType="email-address" // Mostra teclado com @ acessível
              autoCapitalize="none" // Não coloca a primeira letra maiúscula (bom para emails)
              value={email} // Liga o valor do input ao estado
              onChangeText={setEmail} // Atualiza o estado quando o texto muda
            />

            {/* Linha que agrupa os botões (Cancelar e Resetar) */}
            <View style={styles.buttonRow}>
              {/* Botão Cancelar: Estilo 'link' (sem fundo), alinhado à esquerda */}
              <CustomButton 
                title="Cancelar" 
                onPress={() => navigation.goBack()} // Volta para a tela anterior
                variant="link" 
                // Estilização inline para ajuste fino de posicionamento e tamanho
                style={{ width: 'auto', marginRight: 60, marginBottom: 0, marginTop: 0, height: 45 }}
              />
              
              {/* Botão Resetar: Estilo 'primary' (azul), alinhado à direita */}
              <CustomButton 
                title="Resetar Senha" 
                onPress={handleResetPassword} // Chama a função de reset
                variant="primary"
                // Estilo inline para definir largura fixa
                style={{ width: 160, marginBottom: 0 }} 
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}