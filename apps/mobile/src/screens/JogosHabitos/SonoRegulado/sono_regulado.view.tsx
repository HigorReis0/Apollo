import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { styles } from './sono.styles';
import { Header } from '../../../components/Header';
import { useSonoRegulado } from './useSonoRegulado';

// @ts-ignore
import imgSono from '../../../../assets/sono.png';

// ============================================================
// TIPAGEM: extrai automaticamente o tipo de retorno do hook
// ============================================================
type SonoReguladoViewProps = ReturnType<typeof useSonoRegulado>;

// ============================================================
// COMPONENTE: SonoReguladoView
// Renderiza a tela de sono com:
// - Stepper para ajustar horas em ciclos de 1.5h
// - Ícone de informação sobre ciclos de sono
// - Barra de progresso com meta de 8h
// - Tabela educativa sobre relação entre ciclos, horas e efeito
// - Botão para voltar à tela de hábitos
// ============================================================
export const SonoReguladoView: React.FC<SonoReguladoViewProps> = ({
  horasSono,
  META_DIARIA,
  progresso,
  ajustarHoras,
  mostrarInfoCiclos,
  handleReset,
  handleGoBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho da aplicação */}
        <Header />

        {/* Botão para voltar à tela de Hábitos */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* ============================================================
            CARTÃO PRINCIPAL
            ============================================================ */}
        <View style={styles.mainCard}>
          <Image source={imgSono} style={styles.iconHeader} resizeMode="contain" />
          
          {/* Título com ícone de informação */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Sono Regulado</Text>
            <TouchableOpacity onPress={mostrarInfoCiclos} style={styles.infoButton}>
              <Text style={styles.infoText}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>"O sono é a melhor meditação para o corpo."</Text>

          {/* ============================================================
              SEÇÃO: STEPPER (CICLOS DE 1.5h)
              ============================================================ */}
          <View style={styles.stepperContainer}>
            {/* Botão "-" (diminuir 1.5h) */}
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => ajustarHoras(-1.5)}
            >
              <Text style={styles.stepperButtonText}>−</Text>
            </TouchableOpacity>

            {/* Exibição do total atual */}
            <View style={styles.stepperValueContainer}>
              <Text style={styles.stepperValue}>{horasSono.toFixed(1)}h</Text>
              <Text style={styles.stepperSub}>ciclo de 1.5h</Text>
            </View>

            {/* Botão "+" (aumentar 1.5h) */}
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => ajustarHoras(1.5)}
            >
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* ============================================================
              SEÇÃO: BARRA DE PROGRESSO (meta 8h)
              ============================================================ */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Registro de Descanso</Text>
              <Text style={styles.progressValue}>{horasSono.toFixed(1)}h / {META_DIARIA}h</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* ============================================================
            SEÇÃO: TABELA DE RELAÇÃO ENTRE CICLOS, HORAS E EFEITO
            ============================================================ */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Entenda os ciclos de sono</Text>
          <View style={styles.table}>
            {/* Cabeçalho da tabela */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Ciclos</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Horas</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Efeito</Text>
            </View>
            {/* Linha 1: 4 ciclos (mínimo) */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>4</Text>
              <Text style={styles.tableCell}>6h</Text>
              <Text style={styles.tableCell}>Mínimo para funcionamento básico</Text>
            </View>
            {/* Linha 2: 5 ciclos (ideal) - DESTAQUE */}
            <View style={[styles.tableRow, styles.tableRowHighlight]}>
              <Text style={[styles.tableCell, styles.highlightText]}>5</Text>
              <Text style={[styles.tableCell, styles.highlightText]}>7.5h</Text>
              <Text style={[styles.tableCell, styles.highlightText]}>Ideal para a maioria</Text>
            </View>
            {/* Linha 3: 6 ciclos (maior necessidade) */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>6</Text>
              <Text style={styles.tableCell}>9h</Text>
              <Text style={styles.tableCell}>Para maior necessidade</Text>
            </View>
            {/* Linha 4: 7 ciclos (excepcional) */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>7</Text>
              <Text style={styles.tableCell}>10.5h</Text>
              <Text style={styles.tableCell}>Excepcional (pode ser excessivo)</Text>
            </View>
          </View>
          {/* Rodapé informativo */}
          <Text style={styles.infoFooter}>
            Acordar no final de um ciclo é mais restaurador.
          </Text>
        </View>

        {/* ============================================================
            BOTÃO: RESET (zerar o registro do dia)
            ============================================================ */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Zerar Registro</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};