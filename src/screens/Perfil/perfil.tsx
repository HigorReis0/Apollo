// Importa o React, fundamental para criar componentes.
import React, { useState } from 'react'; // Adicionado useState para gerenciar o XP
// Importa componentes visuais do React Native: View (container), Text (texto), Image (imagens), SafeAreaView (área segura), ScrollView (rolagem) e TouchableOpacity (botão com feedback de toque).
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
// Importa os estilos definidos no arquivo 'perfil.styles' para manter o código organizado.
import { styles } from './perfil.styles';
// Reutiliza o componente Header (cabeçalho) que já foi criado, para manter a consistência em todo o app.
import { Header } from '../../components/Header';

// --- Imagens ---
// @ts-ignore: Ignora erros de tipagem do TypeScript para imagens (o RN lida bem com isso, mas o TS pode reclamar).
// Importa a imagem de perfil do usuário.
import imgPerfil from '../../../assets/imagemExemploPerfil.png';
// Importa a imagem do ícone de leitura.
import imgLeitura from '../../../assets/leitura.png';
// Importa a imagem do ícone de musculação.
import imgMusculacao from '../../../assets/musculacao.png';
// Importa a imagem do ícone de água.
import imgAgua from '../../../assets/agua.png';
// Importa a imagem do ícone de corrida.
import imgCorrendo from '../../../assets/correndo.png';

// --- Novas Imagens de Conquistas (Medalhas) ---
// @ts-ignore
// Importa a imagem da medalha de 10 dias.
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
// Importa a imagem da medalha de 50 dias.
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
// Importa a imagem da medalha de 100 dias.
import imgCemDias from '../../../assets/cemDias.png';

// Define e exporta o componente funcional ProfileScreen (Tela de Perfil).
export default function ProfileScreen() {
  
  // --- Estados de Gamificação ---
  // XP total acumulado (Inicia com um valor de exemplo para visualização)
  const [xp, setXp] = useState(750); 
  // Lógica de Nível: Cada 500 XP sobe um nível.
  const nivelAtual = Math.floor(xp / 500) + 1;
  // Calcula quanto da barra deve ser preenchida (0 a 100%).
  const progressoPorcentagem = (xp % 500) / 500 * 100;

  // Array com os dados pessoais do usuário para renderização dinâmica.
  // Em um app real, esses dados viriam de uma API ou banco de dados.
  const personalData = [
    { label: 'Data de Nascimento', value: '15/04/1995' },
    { label: 'Idade', value: '28 anos' },
    { label: 'Peso', value: '62 kg' },
    { label: 'Altura', value: '1.68 m' },
  ];

  // Lista de conquistas (Medalhas) que o usuário ganhou.
  const achievements = [
    { title: '10 Dias', icon: imgDezDias },
    { title: '50 Dias', icon: imgCinquentaDias },
    { title: '100 Dias', icon: imgCemDias },
  ];

  // Lista de hábitos que o usuário pratica, para exibir um resumo no perfil.
  const myHabits = [
    { label: 'Musculação', image: imgMusculacao },
    { label: 'Leitura', image: imgLeitura },
    { label: 'Beber Água', image: imgAgua },
    { label: 'Correr', image: imgCorrendo },
  ];

  return (
    // SafeAreaView garante que o conteúdo não seja cortado pelo notch ou barras de sistema.
    // Aplica o estilo 'safeArea' definido no arquivo de estilos.
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView permite que o conteúdo seja rolado verticalmente.
          showsVerticalScrollIndicator={false} esconde a barra de rolagem. */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Adiciona um padding horizontal para que o Header não fique colado nas bordas laterais. */}
        <View style={{ paddingHorizontal: 20 }}>
          <Header />
        </View>
        
        {/* --- Seção de Identificação (Avatar + Nome) --- */}
        {/* Container para o cabeçalho do perfil (avatar e informações básicas). */}
        <View style={styles.headerContainer}>
          {/* Container para o avatar (pode ser usado para estilização adicional, bordas, sombras). */}
          <View style={styles.avatarContainer}>
            {/* Exibe a imagem de perfil do usuário. */}
            <Image source={imgPerfil} style={styles.avatar} />
          </View>
          
          {/* Exibe o nome do usuário. */}
          <Text style={styles.name}>Beatriz Santos</Text>
          {/* Exibe o email do usuário. */}
          <Text style={styles.email}>beatriz.santos@email.com</Text>

          {/* --- NOVA SEÇÃO: Gamificação (XP e Barra de Progresso) --- */}
          <View style={styles.xpSection}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lvl {nivelAtual}</Text>
            </View>
            <View style={styles.xpBarContainer}>
              <View style={styles.xpInfoRow}>
                <Text style={styles.xpText}>Evolução Apollo</Text>
                <Text style={styles.xpValuesText}>{xp % 500} / 500 XP</Text>
              </View>
              {/* Barra de Fundo (Trilho cinza) */}
              <View style={styles.progressBarBackground}>
                {/* Barra de Progresso (Parte que enche em azul) */}
                <View style={[styles.progressBarFill, { width: `${progressoPorcentagem}%` }]} />
              </View>
            </View>
          </View>

          {/* Botão para editar o perfil (atualmente apenas visual). */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* --- Cartão 1: Dados Pessoais --- */}
        {/* Usando o estilo 'mainCard' para dar a aparência de um cartão (fundo branco, sombra, bordas arredondadas). */}
        <View style={styles.mainCard}>
          {/* Título da seção dentro do cartão. */}
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          
          {/* Grid para organizar os dados pessoais em colunas/linhas. */}
          <View style={styles.dataGrid}>
            {/* Mapeia o array personalData para criar os itens de dados dinamicamente. */}
            {personalData.map((item, index) => (
              <View key={index} style={styles.dataItem}>
                {/* Rótulo do dado (ex: Data de Nascimento). */}
                <Text style={styles.dataLabel}>{item.label}</Text>
                {/* Valor do dado (ex: 15/04/1995). */}
                <Text style={styles.dataValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- Cartão 2: Conquistas --- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Conquistas</Text>
          
          {/* Grid para as conquistas (medalhas). */}
          <View style={styles.achievementsGrid}>
            {/* Mapeia o array achievements para criar os itens de conquista dinamicamente. */}
            {achievements.map((item, index) => (
              // Container individual para alinhar a medalha e o título.
              <View key={index} style={{ alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
                {/* Ícone da medalha. */}
                <Image 
                  source={item.icon} 
                  style={styles.achievementIcon} 
                  resizeMode="contain" // Garante que a imagem caiba no espaço sem distorcer.
                />
                {/* Título da conquista (ex: 10 Dias). */}
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4B5563' }}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- Cartão 3: Meus Hábitos (Resumo) --- */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Meus Hábitos</Text>
          
          {/* Grid para os hábitos. */}
          <View style={styles.habitsGrid}>
            {/* Mapeia o array myHabits para criar os itens de hábito dinamicamente. */}
            {myHabits.map((habit, index) => (
              <View key={index} style={styles.habitItem}>
                {/* Ícone do hábito. */}
                <Image 
                  source={habit.image} 
                  style={styles.habitImage} 
                  resizeMode="contain" 
                />
                {/* Nome do hábito. */}
                <Text style={styles.habitLabel}>{habit.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}