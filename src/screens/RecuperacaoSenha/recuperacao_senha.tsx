import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Ajuste: Subindo 2 níveis para achar a navegação
import { RootStackParamList } from '../../navigation/AppNavigator';

// Importando estilos da mesma pasta
import { styles } from './recuperacao_senha.styles';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
// Ajuste: Subindo 3 níveis para achar assets
import imgRecuperacao from '../../../assets/deitado_computador.png';

type RecuperacaoScreenProp = StackNavigationProp<RootStackParamList, 'RecuperacaoSenha'>;

export default function RecoverPasswordScreen() {
  const navigation = useNavigation<RecuperacaoScreenProp>();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail cadastrado.');
      return;
    }
    Alert.alert('Sucesso', `Um link de redefinição foi enviado para ${email}.`, [
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          <View style={styles.header}>
            <View style={styles.imageContainer}>
              <Image source={imgRecuperacao} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.card}>
            <CustomInput 
              label="Email cadastrado" 
              placeholder="exemplo@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              value={email} 
              onChangeText={setEmail} 
            />

            <View style={styles.buttonRow}>
              {/* Botão Cancelar Transparente */}
              <CustomButton 
                title="Cancelar" 
                onPress={() => navigation.goBack()} 
                variant="link" 
                style={{ width: 'auto', marginRight: 60, marginBottom: 0, marginTop: 0, height: 45 }}
              />
              
              {/* Botão Resetar Azul */}
              <CustomButton 
                title="Resetar Senha" 
                onPress={handleResetPassword} 
                variant="primary"
                style={{ width: 160, marginBottom: 0 }} 
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}