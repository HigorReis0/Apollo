// Importa o React e o hook useState para gerenciar o estado da tela (ex: total de água, bebida selecionada)
import React, { useState } from 'react';
// Importa componentes visuais do React Native
import {
  View, // Container básico
  Text, // Exibição de texto
  SafeAreaView, // Garante que o conteúdo não invada o notch/status bar
  ScrollView, // Permite rolagem vertical
  Alert, // Exibe popups de alerta
  TouchableOpacity, // Botão com feedback de toque (opacidade)
  Image, // Exibição de imagens
} from 'react-native';
// Hooks e tipos para navegação
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Definição das rotas
import { RootStackParamList } from '../../../navigation/AppNavigator';

// Importando Estilos específicos desta tela
import { styles } from './beber_agua.styles';

// Importando Cores globais do tema
import { colors } from '../../../theme/colors';

// Componentes customizados
import { Header } from '../../../components/Header';
import { CustomButton } from '../../../components/CustomButton';

// --- IMAGENS (Ignorando verificação de tipos do TS) ---
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

// Define o tipo de navegação para esta tela
type BeberAguaScreenProp = StackNavigationProp<RootStackParamList, 'BeberAgua'>;

// Lista de opções de bebidas para o Dropdown
const DRINK_TYPES = [
  { label: 'Água', icon: imgCopoAgua },
  { label: 'Refri', icon: imgRefri },
  { label: 'Refri Zero', icon: imgRefriZero },
  { label: 'Suco', icon: imgSuco },
  { label: 'Café', icon: imgCafe },
];

// Opções de volume predefinidas para os botões de seleção rápida
const VOLUMES = [150, 200, 600, 1000];

// Dados simulados (Mock) para o histórico de consumo
const MOCK_HISTORY = [
  { date: 'Ontem', amount: 2400 },
  { date: '30/11', amount: 1800 },
  { date: '29/11', amount: 2100 },
];

// Constante que define a meta diária em ml
const META_DIARIA = 2000;

// Componente principal da tela
export default function BeberAguaScreen() {
  // Inicializa a navegação
  const navigation = useNavigation<BeberAguaScreenProp>();
  
  // --- Estados da Aplicação ---
  const [totalConsumido, setTotalConsumido] = useState(0); // Contador de ml consumidos hoje
  const [pontos, setPontos] = useState(120); // Pontos de gamificação (XP)
  const [metaBatida, setMetaBatida] = useState(false); // Flag para saber se a meta já foi atingida
  
  // Estados para o Dropdown de seleção de bebida
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla se a lista está visível
  const [selectedDrink, setSelectedDrink] = useState(DRINK_TYPES[0]); // Armazena a bebida escolhida (padrão: Água)
  
  // Estado para o botão de volume selecionado
  const [volumeSelecionado, setVolumeSelecionado] = useState(200); // Padrão: 200ml

  // Calcula a média de consumo com base no histórico mockado
  const average = Math.round(
    MOCK_HISTORY.reduce((acc, curr) => acc + curr.amount, 0) / MOCK_HISTORY.length
  );

  // Função para adicionar o consumo
  const handleAdicionarBebida = () => {
    // Calcula o novo total
    const novoTotal = totalConsumido + volumeSelecionado;
    // Atualiza o estado visual
    setTotalConsumido(novoTotal);
    
    // Lógica de Gamificação: Se a meta for atingida pela primeira vez...
    if (!metaBatida && novoTotal >= META_DIARIA) {
      setMetaBatida(true); // Marca como batida para não pontuar duas vezes
      setPontos(prev => prev + 50); // Adiciona XP
      // Feedback visual para o usuário
      Alert.alert("🎉 Meta Batida!", "Parabéns! Você atingiu sua meta diária e ganhou +50 pontos!");
    }
  };

  // Função auxiliar para selecionar uma bebida no dropdown
  const handleSelectDrink = (drink: any) => {
    setSelectedDrink(drink); // Atualiza a bebida selecionada
    setIsDropdownOpen(false); // Fecha o menu
  };

  return (
    // Área segura da tela
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho do App */}
        <Header />
        
        {/* Container principal do cartão (Fundo branco) */}
        <View style={styles.mainCard}>
          <View style={styles.contentContainer}>
            
            {/* --- Seção de Gamificação (Topo) --- */}
            <View style={styles.gamificationContainer}>
              <Image source={imgHidratado} style={styles.levelIcon} resizeMode="contain" />
              <Text style={styles.levelText}>Nível: Hidratado</Text>
              <Text style={styles.pointsText}>{pontos} XP</Text>
            </View>

            {/* Títulos */}
            <Text style={styles.title}>Hidratação Diária</Text>
            <Text style={styles.subtitle}>
              Registre o que você bebe para manter o controle.
            </Text>

            {/* --- Contador Circular e Ícone da Bebida --- */}
            <View style={styles.counterRow}>
              {/* Imagem dinâmica baseada na bebida selecionada */}
              <Image 
                source={selectedDrink.icon} 
                style={styles.drinkImage} 
                resizeMode="contain" 
              />

              {/* Círculo com o total consumido */}
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>{totalConsumido}</Text>
                <Text style={styles.infoText}>ml / {META_DIARIA}</Text>
              </View>
            </View>

            {/* --- Dropdown de Seleção de Bebida --- */}
            <Text style={styles.sectionLabel}>O que você vai beber?</Text>
            <View style={styles.dropdownContainer}>
              {/* Botão que abre/fecha o dropdown */}
              <TouchableOpacity 
                style={styles.dropdownHeader} 
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownHeaderText}>{selectedDrink.label}</Text>
                {/* Seta indicadora (muda se estiver aberto ou fechado) */}
                <Text style={{ fontSize: 12 }}>{isDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {/* Lista de opções (renderização condicional) */}
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {DRINK_TYPES.map((drink) => (
                    <TouchableOpacity 
                      key={drink.label} 
                      style={styles.dropdownItem}
                      onPress={() => handleSelectDrink(drink)}
                    >
                      {/* Texto da opção (fica azul e negrito se selecionado) */}
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

            {/* --- Seletor Horizontal de Volume --- */}
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
                  // Estilo condicional: muda a cor e sombra se estiver selecionado
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

            {/* Botão de Ação Principal */}
            <CustomButton 
              title={`Adicionar +${volumeSelecionado}ml`}
              onPress={handleAdicionarBebida} 
              variant="primary" 
              style={{ marginTop: 15, marginBottom: 5 }}
            />

            {/* Linha Divisória */}
            <View style={styles.divider} />

            {/* --- Seção de Histórico --- */}
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Histórico Recente</Text>
              <Text style={styles.historyAverage}>Média diária: {average}ml</Text>
              
              <View style={styles.historyList}>
                {/* Item fixo para o dia de hoje */}
                <View style={styles.historyItem}>
                  <Text style={styles.historyDate}>Hoje</Text>
                  <Text style={styles.historyValue}>{totalConsumido}ml</Text>
                </View>
                
                {/* Mapeamento dos itens do histórico mockado */}
                {MOCK_HISTORY.map((item, index) => (
                  <View key={index} style={[
                    styles.historyItem, 
                    // Remove a borda inferior do último item para ficar bonito visualmente
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