// ============================================================
// IMPORTAÇÕES
// ============================================================

// React é a biblioteca principal para criar interfaces.
import React from 'react';

// Componentes básicos do React Native para construção da interface.
import {
  View,              // Contêiner flexível (como uma div).
  Text,              // Para exibir textos (TODO texto precisa estar dentro de <Text>).
  Image,             // Para exibir imagens (locais ou da internet).
  SafeAreaView,      // Garante que o conteúdo não fique sob a barra de status.
  ScrollView,        // Permite rolagem vertical quando o conteúdo é maior que a tela.
  TouchableOpacity,  // Botão com feedback visual ao toque (opacidade).
  ActivityIndicator, // Ícone de carregamento (spinner).
  Modal,             // Janela flutuante para edição.
  TextInput,         // Campo de entrada de texto.
} from 'react-native';

// Estilos específicos da tela de Perfil (definidos em perfil.styles.ts).
import { styles } from './perfil.styles';

// Componente Header: cabeçalho reutilizável (com o título do app, ícone, etc.).
import { Header } from '../../components/Header';

// Hook usePerfil: contém toda a lógica de negócio (buscar dados, editar, etc.).
// A View é "burra": ela só exibe os dados e chama as funções que vêm do hook.
import { usePerfil } from './usePerfil';

// Imagem de fallback para o avatar (usada quando o usuário não tem foto).
// @ts-ignore (ignora erro de importação de imagem no TypeScript)
import imgPerfil from '../../../assets/imagemExemploPerfil.png';

// ============================================================
// COMPONENTE PRINCIPAL: ProfileView
// ============================================================

/*
  O QUE É ESTE COMPONENTE?
  - É a "tela de Perfil" do usuário.
  - Ele é responsável por RENDERIZAR a interface, ou seja,
    transformar os dados (vindos do hook) em elementos visuais.
  - NÃO contém lógica de negócio (como buscar dados, salvar, etc.) –
    isso fica no hook usePerfil. Esta é uma boa prática de
    separação de responsabilidades (Clean Architecture).

  O QUE ELE EXIBE?
  1. Avatar, nome, e-mail e barra de progresso do nível.
  2. Dados pessoais (data de nascimento, idade, peso, altura) com botão de edição.
  3. Conquistas desbloqueadas (medalhas sem texto).
  4. Últimos 4 hábitos acessados em formato de LISTA VERTICAL (SEM ÍCONES).
  5. Modal para editar o nome (botão "Editar Perfil").
  6. Modal para editar dados pessoais (botão "✎").
*/
export default function ProfileView() {
  // ============================================================
  // EXTRAÇÃO DOS DADOS E FUNÇÕES DO HOOK
  // ============================================================

  const {
    perfil,                      // Dados do perfil (nome, email, XP, nível, etc.)
    isLoading,                   // Booleano: true enquanto carrega os dados
    error,                       // Mensagem de erro (se houver)
    personalData,                // Array com os dados pessoais formatados (exibição)
    conquistasDesbloqueadas,     // Array com as conquistas que o usuário já tem
    habitosRecentes,             // Array com os 4 hábitos mais recentes

    // ---- Modal de edição de nome ----
    editNomeModalVisible,
    setEditNomeModalVisible,
    editNome,
    setEditNome,
    salvarNome,
    abrirModalNome,

    // ---- Modal de edição de dados pessoais ----
    editDadosModalVisible,
    setEditDadosModalVisible,
    editDataNascimento,
    setEditDataNascimento,
    aplicarMascaraData,          // Função que formata a data com barras (DD/MM/AAAA)
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,
  } = usePerfil();

  // ============================================================
  // RENDERIZAÇÃO CONDICIONAL (CARREGAMENTO E ERRO)
  // ============================================================

  // Se os dados ainda estão sendo carregados, exibe um spinner.
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }

  // Se houve erro ao carregar os dados, exibe mensagem e botão para tentar novamente.
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

  // ============================================================
  // CÁLCULOS AUXILIARES
  // ============================================================

  // Calcula a porcentagem de preenchimento da barra de progresso.
  const xpPercentage = perfil && perfil.xp_proximo_nivel
    ? `${(perfil.total_xp / perfil.xp_proximo_nivel) * 100}%` as import('react-native').DimensionValue
    : '0%';

  // ============================================================
  // FUNÇÃO AUXILIAR PARA O AVATAR (EVITA ERROS)
  // ============================================================

  // Retorna a fonte correta para o avatar:
  // - Se o usuário tem uma URL de avatar (string válida), usa ela.
  // - Senão, usa a imagem de fallback local.
  const getAvatarSource = () => {
    if (perfil?.avatar_url && typeof perfil.avatar_url === 'string' && perfil.avatar_url.trim() !== '') {
      return { uri: perfil.avatar_url };
    }
    return imgPerfil;
  };

  // ============================================================
  // RENDERIZAÇÃO PRINCIPAL (INTERFACE DA TELA)
  // ============================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ============================================================
            CABEÇALHO (HEADER)
            ============================================================ */}
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>

        {/* ============================================================
            SEÇÃO 1: AVATAR, NOME, E-MAIL E BARRA DE XP
            ============================================================ */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={getAvatarSource()} style={styles.avatar} />
          </View>

          <Text style={styles.name}>{perfil?.nome || 'Usuário'}</Text>
          <Text style={styles.email}>{perfil?.email || ''}</Text>

          {/* Barra de progresso do nível */}
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
            CARTÃO 1: DADOS PESSOAIS
            ============================================================ */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dados Pessoais</Text>
            {/* Botão de edição (lápis) – abre o modal de dados pessoais */}
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

        {/* ============================================================
            CARTÃO 2: CONQUISTAS
            ============================================================ */}
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

        {/* ============================================================
            CARTÃO 3: ÚLTIMOS ACESSOS (LISTA VERTICAL SEM ÍCONES)
            ============================================================

            POR QUE REMOVER OS ÍCONES?
            - Deixa o layout mais limpo e direto.
            - Foca a atenção do usuário no nome do hábito e no XP ganho.
            - Evita repetição visual (os ícones dos hábitos já aparecem em outras telas).

            O layout agora é:
            - Nome do hábito (em negrito, tamanho 16)
            - XP ganho (em azul, tamanho 14)
            - Cada item ocupa uma linha inteira, com fundo cinza claro e borda arredondada.
        */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Últimos Acessos</Text>
          <View style={styles.habitsList}>
            {habitosRecentes.length > 0 ? (
              // Mapeia cada hábito e renderiza como um item vertical (sem imagem)
              habitosRecentes.map((habit, index) => (
                <View key={index} style={styles.habitItemVertical}>
                  {/* Container das informações (nome + XP) – agora ocupa 100% da largura */}
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

              {/* Campo: Data de Nascimento (com máscara DD/MM/AAAA) */}
              <TextInput
                style={styles.modalInput}
                value={editDataNascimento}
                onChangeText={(text) => setEditDataNascimento(aplicarMascaraData(text))}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
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

              {/* Campo: Altura (cm) */}
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

      </ScrollView>
    </SafeAreaView>
  );
}