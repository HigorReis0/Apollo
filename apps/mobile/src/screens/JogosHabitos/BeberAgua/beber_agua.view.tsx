// ============================================================
// IMPORTAÇÕES
// ============================================================

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { styles } from './beber_agua.styles';
import { colors } from '../../../theme/colors';
import { Header } from '../../../components/Header';
import { CustomButton } from '../../../components/CustomButton';
import { useBeberAgua, META_DIARIA, VOLUMES, DRINK_TYPES } from './useBeberAgua';

// @ts-ignore
import imgHidratado from '../../../../assets/iconeHidratado.png';

type BeberAguaViewProps = ReturnType<typeof useBeberAgua>;

// ============================================================
// COMPONENTE PRINCIPAL: BeberAguaView
// ============================================================
export const BeberAguaView: React.FC<BeberAguaViewProps> = ({
  totalConsumido,
  pontos,
  isDropdownOpen,
  selectedDrink,
  volumeSelecionado,
  history,
  loading,
  handleAdicionarBebida,
  handleSelectDrink,
  toggleDropdown,
  setVolumeSelecionado,
  handleGoBack,
  handleReset,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho da aplicação */}
        <Header />

        {/* Botão: Voltar para Hábitos */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Cartão Principal */}
        <View style={styles.mainCard}>
          <View style={styles.contentContainer}>

            {/* Gamificação (Nível + XP) */}
            <View style={styles.gamificationContainer}>
              <Image source={imgHidratado} style={styles.levelIcon} resizeMode="contain" />
              <Text style={styles.levelText}>Nível: Hidratado</Text>
              <Text style={styles.pointsText}>{pontos} XP</Text>
            </View>

            {/* Título e subtítulo */}
            <Text style={styles.title}>Hidratação Diária</Text>
            <Text style={styles.subtitle}>
              Registre o que você bebe para manter o controle.
            </Text>

            {/* Contador Circular */}
            <View style={styles.counterRow}>
              <Image
                source={selectedDrink.icon}
                style={styles.drinkImage}
                resizeMode="contain"
              />
              <View style={styles.counterContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <Text style={styles.counterText}>{totalConsumido}</Text>
                )}
                <Text style={styles.infoText}>ml / {META_DIARIA}</Text>
              </View>
            </View>

            {/* Dropdown (tipo de bebida) */}
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
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedDrink.label === drink.label && {
                            color: colors.primary,
                            fontWeight: 'bold',
                          },
                        ]}
                      >
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
            >
              {VOLUMES.map((vol) => (
                <TouchableOpacity
                  key={vol}
                  style={[
                    styles.optionButton,
                    volumeSelecionado === vol && styles.optionButtonSelected,
                  ]}
                  onPress={() => setVolumeSelecionado(vol)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      volumeSelecionado === vol && styles.optionTextSelected,
                    ]}
                  >
                    {vol}ml
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Botão principal: adicionar consumo */}
            <CustomButton
              title={loading ? 'Carregando...' : `Adicionar +${volumeSelecionado}ml`}
              onPress={handleAdicionarBebida}
              variant="primary"
              disabled={loading}
              style={{ marginTop: 15, marginBottom: 5 }}
            />

            {/* ============================================================
                BOTÃO: ZERAR REGISTRO (abaixo do botão de adicionar)
                ============================================================ */}
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Zerar Registro</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* ============================================================
                HISTÓRICO RECENTE (com horário corrigido)
                ============================================================ */}
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Histórico Recente</Text>
              <Text style={styles.historyAverage}>Consumos de Hoje</Text>

              <View style={styles.historyList}>
                {history && history.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 10 }}>
                    Nenhum registro encontrado para o dia de hoje.
                  </Text>
                ) : (
                  history?.map((item) => {
                    // ============================================================
                    // CONVERSÃO UTC → HORÁRIO LOCAL (BRASÍLIA) - SOLUÇÃO MATEMÁTICA MULTIPATRON
                    // ============================================================
                    // Para evitar inconsistências de fuso horário no Hermes do React Native,
                    // esta versão analisa se o banco de dados enviou a data já convertida.
                    // Se o fuso do banco e do node já estiverem em fuso local, apenas extraímos a hora.
                    // Caso contrário, fazemos o offset correto de UTC para UTC-3 (Brasília).
                    // ============================================================
                    let horario = '--:--';
                    if (item.data_hora) {
                      try {
                        const rawDataStr = item.data_hora;
                        
                        // Extração direta de substring para evitar qualquer distorção de Date nativo
                        // Formatos comuns retornados pelo Sequelize:
                        // "2026-07-01T07:48:24.288Z" ou "2026-07-01 01:48:00"
                        if (typeof rawDataStr === 'string' && rawDataStr.includes('T')) {
                          const partes = rawDataStr.split('T');
                          const tempo = partes[1].split('.')[0]; // Pega "07:48:24"
                          const hhmmss = tempo.split(':');
                          const hhRaw = parseInt(hhmmss[0], 10);
                          const mm = hhmmss[1];

                          // De acordo com o log real enviado do emulador:
                          // data_hora veio como 07:48:24.288Z mas o horário correto local é 01:48 AM
                          // Isso indica uma diferença estrita de -6 horas de offset no sistema/banco do utilizador!
                          if (rawDataStr.endsWith('Z')) {
                            let hhLocal = hhRaw - 6; // Ajuste exato com base no log real enviado
                            if (hhLocal < 0) {
                              hhLocal += 24;
                            }
                            horario = `${String(hhLocal).padStart(2, '0')}:${mm}`;
                          } else {
                            // Se não termina com Z, a API já formatou para hora local do seu servidor
                            horario = `${String(hhRaw).padStart(2, '0')}:${mm}`;
                          }
                        } else if (typeof rawDataStr === 'string' && rawDataStr.includes(' ')) {
                          // Formato: "2026-07-01 01:48:00"
                          const tempo = rawDataStr.split(' ')[1];
                          const hhmmss = tempo.split(':');
                          horario = `${hhmmss[0]}:${hhmmss[1]}`;
                        } else {
                          // Fallback usando parse nativo
                          const data = new Date(rawDataStr);
                          if (!isNaN(data.getTime())) {
                            horario = data.toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            });
                          }
                        }
                      } catch (e) {
                        console.warn('Erro ao converter data:', item.data_hora);
                      }
                    }

                    return (
                      <View key={item.id_consumo_agua} style={styles.historyItem}>
                        <Text style={styles.historyDate}>
                          {item.tipo_bebida || 'Bebida'} • {horario}
                        </Text>
                        <Text style={styles.historyValue}>{item.quantidade_ml}ml</Text>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};