// ============================================================
// IMPORTAÇÕES
// ============================================================

// Importa o React e os componentes básicos do React Native
import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';

// Importa os estilos específicos da tela de Perfil
import { styles } from './perfil.styles';

// Importa o componente Header (cabeçalho reutilizável)
import { Header } from '../../components/Header';

// Importa o hook usePerfil (toda a lógica de estado e chamadas à API)
import { usePerfil } from './usePerfil';

// Imagem de fallback para o avatar (caso o usuário não tenha foto)
// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

// ============================================================
// COMPONENTE PRINCIPAL: ProfileView
// ============================================================

// Este componente renderiza a tela de Perfil, consumindo os dados
// e funções do hook usePerfil. Ele exibe:
// - Avatar, nome, e-mail, barra de progresso do nível
// - Dados pessoais com botão de edição (✎) para abrir modal específico
// - Conquistas desbloqueadas (apenas ícones, sem texto)
// - Últimos 4 hábitos acessados (ou mensagem vazia)
// - Modal para editar o nome (botão "Editar Perfil")
// - Modal para editar dados pessoais (botão ✎) com máscara de data
export default function ProfileView() {
  // Extrai todos os dados e funções do hook
  const {
    perfil,                      // Dados do perfil (nome, email, XP, nível)
    isLoading,                   // Booleano: está carregando?
    error,                       // Mensagem de erro (se houver)
    personalData,                // Dados pessoais formatados para exibição
    conquistasDesbloqueadas,     // Conquistas desbloqueadas (array)
    habitosRecentes,             // Últimos hábitos acessados (array)
    
    // Modal de edição de nome
    editNomeModalVisible,
    setEditNomeModalVisible,
    editNome,
    setEditNome,
    salvarNome,
    abrirModalNome,
    
    // Modal de edição de dados pessoais
    editDadosModalVisible,
    setEditDadosModalVisible,
    editDataNascimento,
    setEditDataNascimento,
    aplicarMascaraData,          // Função para formatar a data com barras
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,
  } = usePerfil();

  // ---- TELA DE CARREGAMENTO ----
  // Exibe um spinner enquanto os dados estão sendo carregados
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }

  // ---- TELA DE ERRO ----
  // Exibe uma mensagem de erro se algo deu errado ao carregar os dados
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={() => {}} style={{ marginTop: 20 }}>
            <Text style={{ color: '#6200ee' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---- BARRA DE PROGRESSO ----
  // Calcula a porcentagem de XP em relação ao próximo nível
  const xpPercentage = perfil && perfil.xp_proximo_nivel
    ? `${(perfil.total_xp / perfil.xp_proximo_nivel) * 100}%` as import('react-native').DimensionValue
    : '0%';

  // ============================================================
  // RENDERIZAÇÃO DA INTERFACE
  // ============================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER – componente reutilizável (título, ícone) */}
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>

        {/* ============================================================
            SEÇÃO: AVATAR, NOME, E-MAIL E BARRA DE XP
            ============================================================ */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            {/* Exibe a foto do perfil (se houver) ou a imagem de fallback */}
            <Image
              source={perfil?.avatar_url ? { uri: perfil.avatar_url } : imgPerfil}
              style={styles.avatar}
            />
          </View>

          {/* Nome e e-mail do usuário */}
          <Text style={styles.name}>{perfil?.nome || 'Usuário'}</Text>
          <Text style={styles.email}>{perfil?.email || ''}</Text>

          {/* Barra de Progresso do Nível */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Nível {perfil?.nivel || 'Iniciante'}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: xpPercentage }]} />
            </View>
            <Text style={styles.xpText}>
              {perfil?.total_xp ?? 0} XP
              {perfil?.xp_proximo_nivel ? ` / ${perfil.xp_proximo_nivel} XP` : ''}
            </Text>
          </View>

          {/* Botão "Editar Perfil" – abre o modal para editar o NOME */}
          <TouchableOpacity style={styles.editButton} onPress={abrirModalNome}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================
            CARTÃO 1: DADOS PESSOAIS (com botão de edição para dados pessoais)
            ============================================================ */}
        <View style={styles.mainCard}>
          {/* Cabeçalho do cartão: título + ícone de lápis */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
            {/* Botão de edição (lápis) – abre o modal de dados pessoais */}
            <TouchableOpacity onPress={abrirModalDados} style={styles.editIconButton}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          
          {/* Grid com os dados pessoais (2 colunas) */}
          <View style={styles.dataGrid}>
            {personalData.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ============================================================
            CARTÃO 2: CONQUISTAS (apenas ícones, sem textos)
            ============================================================ */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {conquistasDesbloqueadas.length > 0 ? (
              // Se houver conquistas desbloqueadas, exibe os ícones
              conquistasDesbloqueadas.map((item, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Image source={item.icon} style={styles.achievementIcon} resizeMode="contain" />
                </View>
              ))
            ) : (
              // Se não houver, exibe uma mensagem informativa
              <Text style={styles.emptyMessage}>
                Continue completando hábitos para desbloquear conquistas!
              </Text>
            )}
          </View>
        </View>

        {/* ============================================================
            CARTÃO 3: ÚLTIMOS ACESSOS (antigo "Meus Hábitos")
            ============================================================ */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Últimos Acessos</Text>
          <View style={styles.habitsGrid}>
            {habitosRecentes.length > 0 ? (
              // Se houver hábitos recentes, exibe em grid (2 colunas)
              habitosRecentes.map((habit, index) => (
                <View key={index} style={styles.habitItem}>
                  <Image
                    source={habit.image ? { uri: habit.image } : require('../../../assets/musculacao.png')}
                    style={styles.habitImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.habitLabel}>{habit.label}</Text>
                </View>
              ))
            ) : (
              // Se não houver, exibe mensagem vazia
              <Text style={styles.emptyMessage}>
                Nenhum hábito acessado ainda.
              </Text>
            )}
          </View>
        </View>

        {/* ============================================================
            MODAL 1: EDITAR NOME
            ============================================================ */}
        <Modal
          visible={editNomeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditNomeModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Nome</Text>
              
              {/* Campo para editar o nome */}
              <TextInput
                style={styles.modalInput}
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
              />
              
              {/* Botões Cancelar / Salvar */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setEditNomeModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: '#374151' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={salvarNome}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ============================================================
            MODAL 2: EDITAR DADOS PESSOAIS (com máscara de data)
            ============================================================ */}
        <Modal
          visible={editDadosModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditDadosModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Dados Pessoais</Text>

              {/* Campo: Data de Nascimento (com máscara DD/MM/AAAA) */}
              <TextInput
                style={styles.modalInput}
                value={editDataNascimento}
                onChangeText={(text) => setEditDataNascimento(aplicarMascaraData(text))}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10} // DD/MM/AAAA tem 10 caracteres
              />
              
              {/* Campo: Peso (kg) */}
              <TextInput
                style={styles.modalInput}
                value={editPeso}
                onChangeText={setEditPeso}
                placeholder="Peso (kg)"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              
              {/* Campo: Altura (em centímetros) */}
              <TextInput
                style={styles.modalInput}
                value={editAltura}
                onChangeText={setEditAltura}
                placeholder="Altura (cm)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />

              {/* Botões Cancelar / Salvar */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setEditDadosModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: '#374151' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={salvarDadosPessoais}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}