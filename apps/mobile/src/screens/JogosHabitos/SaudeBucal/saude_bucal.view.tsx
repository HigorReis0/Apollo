import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { styles } from './saude_bucal.styles';
import { Header } from '../../../components/Header';
import { useSaudeBucal } from './useSaudeBucal';

// @ts-ignore
import imgSaudeBucal from '../../../../assets/dentes.png';

type SaudeBucalViewProps = ReturnType<typeof useSaudeBucal>;

export const SaudeBucalView: React.FC<SaudeBucalViewProps> = ({
  escovacao,
  fioDental,
  enxaguante,
  alternarEscovacao,
  alternarFioDental,
  alternarEnxaguante,
  verificarRotinaCompleta,
  handleReset,
  handleGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Header />

        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Bloco central do cartão de destaque */}
        <View style={styles.mainCard}>
          <Image source={imgSaudeBucal} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Saúde Bucal</Text>
          <Text style={styles.subtitle}>"Um sorriso bonito começa com uma higiene cuidada todos os dias."</Text>
        </View>

        {/* Secção do Checklist */}
        <View style={styles.checklistContainer}>
          
          {/* Item 1: Escovagem */}
          <TouchableOpacity 
            style={[styles.checkItem, escovacao && styles.checkItemDone]} 
            onPress={alternarEscovacao}
          >
            <Text style={styles.checkItemText}>
              {escovacao ? "Dentes Escovados" : "○ Escovar os Dentes"}
            </Text>
            <Text style={[styles.xpText, escovacao && styles.xpTextDone]}>+20 XP</Text>
          </TouchableOpacity>

          {/* Item 2: Fio Dentário */}
          <TouchableOpacity 
            style={[styles.checkItem, fioDental && styles.checkItemDone]} 
            onPress={alternarFioDental}
          >
            <Text style={styles.checkItemText}>
              {fioDental ? "Fio Dental Utilizado" : "○ Fio Dental"}
            </Text>
            <Text style={[styles.xpText, fioDental && styles.xpTextDone]}>+15 XP</Text>
          </TouchableOpacity>

          {/* Item 3: Elixir Bucal */}
          <TouchableOpacity 
            style={[styles.checkItem, enxaguante && styles.checkItemDone]} 
            onPress={alternarEnxaguante}
          >
            <Text style={styles.checkItemText}>
              {enxaguante ? "Enxaguante Bucal Utilizado" : "○ Enxaguante Bucal"}
            </Text>
            <Text style={[styles.xpText, enxaguante && styles.xpTextDone]}>+15 XP</Text>
          </TouchableOpacity>

        </View>

        {/* Botão de validação geral */}
        <TouchableOpacity style={styles.finalButton} onPress={verificarRotinaCompleta}>
          <Text style={styles.finalButtonText}>Finalizar Rotina Diária</Text>
        </TouchableOpacity>

        {/* Botão secundário para zerar progresso */}
        {(escovacao || fioDental || enxaguante) && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Zerar Progresso de Hoje</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};