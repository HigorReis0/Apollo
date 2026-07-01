import React from 'react';
import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './tela_login.styles';
import { colors } from '../../theme/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

// @ts-ignore
import telaLoginImage from '../../../assets/homem_sentado_login.png';

interface LoginViewProps {
  auth: ReturnType<typeof import('./useLogin').useLogin>;
}

export const LoginView = ({ auth }: LoginViewProps) => {
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
              <Image source={telaLoginImage} style={styles.illustration} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.loginCard}>
            <CustomInput 
              label="Email"
              value={auth.email}
              onChangeText={auth.setEmail}
              editable={!auth.isLoading}
            />
            <CustomInput 
              label="Password"
              secureTextEntry
              value={auth.password}
              onChangeText={auth.setPassword}
              editable={!auth.isLoading}
            />

            {auth.isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <>
                <CustomButton title="Entrar" onPress={auth.handleLogin} variant="primary" />
                <CustomButton 
                  title="Entrar com Google" 
                  onPress={auth.handleGoogleLogin} 
                  variant="secondary"
                  disabled={!auth.requestReady}
                />
              </>
            )}
            
            <View style={{ marginTop: 10 }}>
              <CustomButton title="Cadastrar" onPress={auth.navigateToCadastro} variant="link" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};