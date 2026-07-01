// ============================================================
// IMPORTAÇÕES
// ============================================================

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

import { styles } from './perfil.styles';
import { Header } from '../../components/Header';
import { usePerfil } from './usePerfil';

// @ts-ignore
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

// ============================================================
// COMPONENTE PRINCIPAL: ProfileView
// ============================================================
export default function ProfileView() {
  const {
    perfil,
    isLoading,
    error,
    personalData,
    conquistasDesbloqueadas,
    habitosRecentes,
    editNomeModalVisible,
    setEditNomeModalVisible,
    editNome,
    setEditNome,
    salvarNome,
    abrirModalNome,
    editDadosModalVisible,
    setEditDadosModalVisible,
    editDataNascimento,
    setEditDataNascimento,
    aplicarMascaraData,
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,
    editPerfilModalVisible,
    setEditPerfilModalVisible,
    selectedImage,
    pickImage,
    salvarEdicaoPerfil,
    abrirModalPerfil,
  } = usePerfil();

  // ---- CARREGAMENTO ----
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }

  // ---- ERRO ----
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
  const xpPercentage = perfil && perfil.xp_proximo_nivel
    ? `${(perfil.total_xp / perfil.xp_proximo_nivel) * 100}%` as import('react-native').DimensionValue
    : '0%';

  // ---- FUNÇÃO AUXILIAR PARA AVATAR ----
  const getAvatarSource = () => {
    if (perfil?.avatar_url && typeof perfil.avatar_url === 'string' && perfil.avatar_url.trim() !== '') {
      return { uri: perfil.avatar_url };
    }
    return imgPerfil;
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>

        {/* ---- AVATAR, NOME, XP ---- */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={getAvatarSource()} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{perfil?.nome || 'Usuário'}</Text>
          <Text style={styles.email}>{perfil?.email || ''}</Text>
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
          <TouchableOpacity style={styles.editButton} onPress={abrirModalPerfil}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* ---- DADOS PESSOAIS ---- */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
            <TouchableOpacity onPress={abrirModalDados} style={styles.editIconButton}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataGrid}>
            {personalData.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                <Text style={styles.dataLabel}>{item.label}</Text>
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---- CONQUISTAS ---- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          <View style={styles.achievementsGrid}>
            {conquistasDesbloqueadas.length > 0 ? (
              conquistasDesbloqueadas.map((item, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Image source={item.icon} style={styles.achievementIcon} resizeMode="contain" />
                </View>
              ))
            ) : (
              <Text style={styles.emptyMessage}>
                Continue completando hábitos para desbloquear conquistas!
              </Text>
            )}
          </View>
        </View>

        {/* ---- ÚLTIMOS ACESSOS ---- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Últimos Acessos</Text>
          <View style={styles.habitsList}>
            {habitosRecentes.length > 0 ? (
              habitosRecentes.map((habit, index) => (
                <View key={index} style={styles.habitItemVertical}>
                  <View style={styles.habitInfoVertical}>
                    <Text style={styles.habitLabelVertical}>{habit.label}</Text>
                    <Text style={styles.habitXpVertical}>
                      {habit.mensagem || `+${habit.xp} XP`}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyMessage}>
                Nenhum hábito acessado ainda.
              </Text>
            )}
          </View>
        </View>

        {/* ============================================================
            MODAL 1: EDITAR NOME (antigo)
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
              <TextInput
                style={styles.modalInput}
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
              />
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
            MODAL 2: EDITAR DADOS PESSOAIS
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
              <TextInput
                style={styles.modalInput}
                value={editDataNascimento}
                onChangeText={(text) => setEditDataNascimento(aplicarMascaraData(text))}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
              />
              <TextInput
                style={styles.modalInput}
                value={editPeso}
                onChangeText={setEditPeso}
                placeholder="Peso (kg)"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              <TextInput
                style={styles.modalInput}
                value={editAltura}
                onChangeText={setEditAltura}
                placeholder="Altura (cm)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
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

        {/* ============================================================
            MODAL 3: EDITAR PERFIL (NOME + AVATAR)
            ============================================================ */}
        <Modal
          visible={editPerfilModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditPerfilModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              {/* Seletor de avatar */}
              <TouchableOpacity onPress={pickImage} style={styles.avatarPicker}>
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : perfil?.avatar_url
                      ? { uri: perfil.avatar_url }
                      : imgPerfil
                  }
                  style={styles.avatarPickerImage}
                />
                <Text style={styles.avatarPickerText}>Alterar Foto</Text>
              </TouchableOpacity>

              {/* Campo para editar o nome */}
              <TextInput
                style={styles.modalInput}
                value={editNome}
                onChangeText={setEditNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setEditPerfilModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: '#374151' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={salvarEdicaoPerfil}
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