// Importa o React e o hook useState para gerenciar o progresso da distância.
import React, { useState } from 'react'; 
// Importa os componentes do React Native necessários para construir a interface.
import { 
  View, // Container para agrupar elementos.
  Text, // Para exibição de rótulos e valores.
  TouchableOpacity, // Componente de botão com feedback visual.
  SafeAreaView, // Garante que o conteúdo não fique sob o "notch" do aparelho.
  ScrollView, // Permite rolagem caso o conteúdo exceda o tamanho da tela.
  Image, // Para exibir o ícone da atividade.
  Alert // Para disparar avisos e recompensas.
} from 'react-native';
// Importa os estilos específicos para esta tela.
import { styles } from './corrida.styles';
// Hook para gerenciar a navegação entre as telas.
import { useNavigation } from '@react-navigation/native';
// Componente de cabeçalho padrão reutilizável.
import { Header } from '../../../components/Header';

// @ts-ignore - Ignora erro de tipagem na importação direta da imagem de asset.
import imgCorrida from '../../../../assets/correndo.png';

export default function CorridaScreen() {
  // Inicializa o objeto de navegação.
  const navigation = useNavigation();
  
  // Estado que armazena a distância percorrida (inicia em 0 km).
  const [distancia, setDistancia] = useState(0);
  // Define a meta diária para o hábito (5 quilômetros).
  const META_DIARIA = 5.0; 

  // Calcula a porcentagem do progresso para a largura da barra visual.
  const progresso = (distancia / META_DIARIA) * 100;

  // Função disparada ao clicar nos botões de incremento de distância.
  const adicionarDistancia = (km: number) => {
    // Calcula o novo total garantindo precisão de uma casa decimal.
    const novoTotal = Number((distancia + km).toFixed(1)); 
    setDistancia(novoTotal); // Atualiza o estado.

    // Verifica se o usuário atingiu ou ultrapassou a meta agora.
    if (novoTotal >= META_DIARIA && distancia < META_DIARIA) {
      Alert.alert("🏃‍♂️ Meta Alcançada!", "Você completou seus 5km de hoje! +150 XP");
    }
  };

  return (
    // Área segura para evitar interferência com elementos do sistema (StatusBar/Notch).
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView configurado para não mostrar a barra de rolagem lateral. */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Renderiza o componente de cabeçalho. */}
        <Header />

        {/* Link de navegação para retornar à tela anterior. */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar para Hábitos</Text>
        </TouchableOpacity>

        {/* Card Principal: Exibe o ícone, título e a barra de progresso. */}
        <View style={styles.mainCard}>
          <Image source={imgCorrida} style={styles.iconHeader} resizeMode="contain" />
          <Text style={styles.title}>Corrida</Text>
          <Text style={styles.subtitle}>"Não importa a velocidade, o importante é não parar."</Text>

          {/* Seção da Barra de Progresso Dinâmica. */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progresso Diário</Text>
              <Text style={styles.progressValue}>{distancia} / {META_DIARIA} km</Text>
            </View>
            {/* Fundo cinza da barra (trilho). */}
            <View style={styles.progressBarBackground}>
              {/* Preenchimento colorido que cresce conforme o estado 'distancia'. */}
              <View style={[styles.progressBarFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Grid de botões rápidos para adicionar quilometragem. */}
        <View style={styles.gridButtons}>
          {[0.5, 1.0, 2.0, 5.0].map((valor) => (
            <TouchableOpacity 
              key={valor} 
              style={styles.actionButton} 
              onPress={() => adicionarDistancia(valor)}
            >
              <Text style={styles.actionButtonText}>+{valor} km</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão secundário para resetar os dados do dia. */}
        <TouchableOpacity style={styles.resetButton} onPress={() => setDistancia(0)}>
          <Text style={styles.resetButtonText}>Zerar Percurso</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}