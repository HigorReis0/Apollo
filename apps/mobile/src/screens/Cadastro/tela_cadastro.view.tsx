import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { styles } from './tela_cadastro.styles';
import { colors } from '../../theme/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
import imgCadastro from '../../../assets/lendo.png';

// Definimos uma interface para as props que a View recebe
interface CadastroViewProps {
  form: ReturnType<typeof import('./useCadastro').useCadastro>;
}

export const CadastroView = ({ form }: CadastroViewProps) => {
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
              value={form.nome} 
              onChangeText={form.setNome} 
              autoCapitalize="words" 
              editable={!form.isLoading} 
            />
            
            <CustomInput 
              label="Email" 
              placeholder="exemplo@exemplo.com" 
              keyboardType="email-address" 
              autoCapitalize="none" 
              value={form.email} 
              onChangeText={form.setEmail}
              editable={!form.isLoading}
            />
            
            <CustomInput 
              label="Senha" 
              placeholder="••••••••••" 
              secureTextEntry 
              value={form.senha} 
              onChangeText={form.setSenha}
              editable={!form.isLoading}
            />
            
            <CustomInput 
              label="Confirmar Senha" 
              placeholder="••••••••••" 
              secureTextEntry 
              value={form.confirmarSenha} 
              onChangeText={form.setConfirmarSenha}
              editable={!form.isLoading}
            />

            {form.isLoading ? (
              <View style={{ marginTop: 10, height: 50, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <CustomButton 
                title="Registrar" 
                onPress={form.handleRegister} 
                variant="primary" 
                style={{ marginTop: 10 }} 
              />
            )}
            
            <CustomButton 
              title="Já tenho cadastro" 
              onPress={form.goBack} 
              variant="link" 
              disabled={form.isLoading} 
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};