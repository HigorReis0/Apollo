import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

// Importando Estilos
import { styles } from './beber_agua.styles';

// Importando Cores
import { colors } from '../../../theme/colors';

// Componentes
import { Header } from '../../../components/Header';
import { CustomButton } from '../../../components/CustomButton';

// --- IMAGENS ---
// @ts-ignore
import imgCopoAgua from '../../../../assets/copodeagua.png';
// @ts-ignore
import imgRefri from '../../../../assets/refrigerantes.png';
// @ts-ignore
import imgRefriZero from '../../../../assets/refrizero.png';
// @ts-ignore
import imgCafe from '../../../../assets/cafe.png';
// @ts-ignore
import imgSuco from '../../../../assets/agua.png';
// @ts-ignore
import imgHidratado from '../../../../assets/iconeHidratado.png';

type BeberAguaScreenProp = StackNavigationProp<RootStackParamList, 'BeberAgua'>;

const DRINK_TYPES = [
  { label: 'Água', icon: imgCopoAgua },
  { label: 'Refri', icon: imgRefri },
  { label: 'Refri Zero', icon: imgRefriZero },
  { label: 'Suco', icon: imgSuco },
  { label: 'Café', icon: imgCafe },
];

const VOLUMES = [150, 200, 600, 1000];

const MOCK_HISTORY = [
  { date: 'Ontem', amount: 2400 },
  { date: '30/11', amount: 1800 },
  { date: '29/11', amount: 2100 },
];

const META_DIARIA = 2000;

export default function BeberAguaScreen() {
  const navigation = useNavigation<BeberAguaScreenProp>();
  
  const [totalConsumido, setTotalConsumido] = useState(0);
  const [pontos, setPontos] = useState(120);
  const [metaBatida, setMetaBatida] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(DRINK_TYPES[0]);
  
  const [volumeSelecionado, setVolumeSelecionado] = useState(200);

  const average = Math.round(
    MOCK_HISTORY.reduce((acc, curr) => acc + curr.amount, 0) / MOCK_HISTORY.length
  );

  const handleAdicionarBebida = () => {
    const novoTotal = totalConsumido + volumeSelecionado;
    setTotalConsumido(novoTotal);
    
    if (!metaBatida && novoTotal >= META_DIARIA) {
      setMetaBatida(true);
      setPontos(prev => prev + 50);
      Alert.alert("🎉 Meta Batida!", "Parabéns! Você atingiu sua meta diária e ganhou +50 pontos!");
    }
  };

  const handleSelectDrink = (drink: any) => {
    setSelectedDrink(drink);
    setIsDropdownOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Header />
        
        {/* REMOVIDO: <View style={styles.headerDivider} /> pois agora está dentro do Header */}

        {/* Card Principal "Macio" */}
        <View style={styles.mainCard}>
          <View style={styles.contentContainer}>
            
            {/* Seção de Gamificação */}
            <View style={styles.gamificationContainer}>
              <Image source={imgHidratado} style={styles.levelIcon} resizeMode="contain" />
              <Text style={styles.levelText}>Nível: Hidratado</Text>
              <Text style={styles.pointsText}>{pontos} XP</Text>
            </View>

            <Text style={styles.title}>Hidratação Diária</Text>
            <Text style={styles.subtitle}>
              Registre o que você bebe para manter o controle.
            </Text>

            {/* Layout Horizontal: Ícone + Contador */}
            <View style={styles.counterRow}>
              <Image 
                source={selectedDrink.icon} 
                style={styles.drinkImage} 
                resizeMode="contain" 
              />

              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>{totalConsumido}</Text>
                <Text style={styles.infoText}>ml / {META_DIARIA}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>O que você vai beber?</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownHeaderText}>{selectedDrink.label}</Text>
                <Text style={{ fontSize: 12 }}>{isDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {DRINK_TYPES.map((drink) => (
                    <TouchableOpacity 
                      key={drink.label} 
                      style={styles.dropdownItem}
                      onPress={() => handleSelectDrink(drink)}
                    >
                      <Text style={[
                        styles.dropdownItemText, 
                        selectedDrink.label === drink.label && { color: colors.primary, fontWeight: 'bold' }
                      ]}>
                        {drink.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Text style={styles.sectionLabel}>Quantidade (ml)</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.selectorScroll}
              contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }}
            >
              {VOLUMES.map((vol) => (
                <TouchableOpacity
                  key={vol}
                  style={[
                    styles.optionButton,
                    volumeSelecionado === vol && styles.optionButtonSelected
                  ]}
                  onPress={() => setVolumeSelecionado(vol)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    volumeSelecionado === vol && styles.optionTextSelected
                  ]}>
                    {vol}ml
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <CustomButton 
              title={`Adicionar +${volumeSelecionado}ml`}
              onPress={handleAdicionarBebida} 
              variant="primary" 
              style={{ marginTop: 15, marginBottom: 5 }}
            />

            <View style={styles.divider} />

            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Histórico Recente</Text>
              <Text style={styles.historyAverage}>Média diária: {average}ml</Text>
              
              <View style={styles.historyList}>
                <View style={styles.historyItem}>
                  <Text style={styles.historyDate}>Hoje</Text>
                  <Text style={styles.historyValue}>{totalConsumido}ml</Text>
                </View>
                
                {MOCK_HISTORY.map((item, index) => (
                  <View key={index} style={[
                    styles.historyItem, 
                    index === MOCK_HISTORY.length - 1 && { borderBottomWidth: 0 }
                  ]}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={styles.historyValue}>{item.amount}ml</Text>
                  </View>
                ))}
              </View>
            </View>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}