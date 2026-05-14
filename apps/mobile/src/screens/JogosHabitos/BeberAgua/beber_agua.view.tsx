import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './beber_agua.styles';
import { colors } from '../../../theme/colors';
import { Header } from '../../../components/Header';
import { CustomButton } from '../../../components/CustomButton';

// Hook types e constantes importados para uso na View
import { useBeberAgua, META_DIARIA, VOLUMES, DRINK_TYPES, MOCK_HISTORY } from './useBeberAgua';

// @ts-ignore
import imgHidratado from '../../../../assets/iconeHidratado.png';

// Tipagem dinâmica: extrai automaticamente o tipo de retorno do Custom Hook
type BeberAguaViewProps = ReturnType<typeof useBeberAgua>;

export const BeberAguaView: React.FC<BeberAguaViewProps> = ({
  totalConsumido,
  pontos,
  isDropdownOpen,
  selectedDrink,
  volumeSelecionado,
  average,
  handleAdicionarBebida,
  handleSelectDrink,
  toggleDropdown,
  setVolumeSelecionado,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header />
        
        <View style={styles.mainCard}>
          <View style={styles.contentContainer}>
            
            {/* Gamificação */}
            <View style={styles.gamificationContainer}>
              <Image source={imgHidratado} style={styles.levelIcon} resizeMode="contain" />
              <Text style={styles.levelText}>Nível: Hidratado</Text>
              <Text style={styles.pointsText}>{pontos} XP</Text>
            </View>

            <Text style={styles.title}>Hidratação Diária</Text>
            <Text style={styles.subtitle}>
              Registre o que você bebe para manter o controle.
            </Text>

            {/* Contador Circular */}
            <View style={styles.counterRow}>
              <Image source={selectedDrink.icon} style={styles.drinkImage} resizeMode="contain" />
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>{totalConsumido}</Text>
                <Text style={styles.infoText}>ml / {META_DIARIA}</Text>
              </View>
            </View>

            {/* Dropdown de Seleção */}
            <Text style={styles.sectionLabel}>O que você vai beber?</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={toggleDropdown}
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

            {/* Seletor de Volume */}
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

            {/* Histórico */}
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
};