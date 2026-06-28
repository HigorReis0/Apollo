// Importa o construtor otimizado StyleSheet da biblioteca principal do React Native.
import { StyleSheet } from 'react-native';
// Importa as constantes do mapa global de cores definidas no escopo de design system do Apollo.
import { colors } from '../../../theme/colors';

// Instancia e exporta as definições de CSS adaptadas para o ecossistema mobile.
export const styles = StyleSheet.create({
  // Ocupa 100% do espaço vertical/horizontal da tela e pinta o fundo com a tonalidade padrão do aplicativo.
  safeArea: { flex: 1, backgroundColor: colors.background },
  // Aplica uma margem interna de 20 pontos nas quatro direções para afastar o conteúdo físico das bordas do dispositivo.
  container: { padding: 20 },
  
  // Define uma distância de separação abaixo do botão voltar para dar respiro ao layout.
  backButton: { marginBottom: 15 },
  // NOVO: Aplica o tom de cor Azul Padrão do tema Apollo para manter a consistência de navegação e define peso de fonte em negrito.
  backButtonText: { color: colors.primary, fontWeight: 'bold' },

  // Objeto de estilo responsável por formatar o contêiner central em formato de bloco flutuante.
  mainCard: {
    backgroundColor: colors.white, // Atribui a cor branca purificada para o fundo do cartão.
    borderRadius: 30,              // Aplica bordas arredondadas marcantes nas extremidades do componente.
    padding: 30,                   // Gera espaço de preenchimento interno para que o conteúdo não encoste nas divisórias do card.
    alignItems: 'center',          // Centraliza de forma estrita todos os seus componentes filhos no plano horizontal.
    marginBottom: 20,              // Aplica margem inferior para empurrar os seletores horizontais de tempo para baixo.
    elevation: 4,                  // Comando nativo para gerar projeção de sombras físicas reais em sistemas Android.
    shadowColor: '#000',           // Especifica a cor preta como base de sombra em ecossistemas Apple iOS.
    shadowOpacity: 0.1,            // Define a opacidade controlada da sombra para sistemas iOS.
    shadowRadius: 10,              // Determina a suavização/espalhamento da sombra em dispositivos iOS.
  },
  // Define largura e altura idênticas de 95 pontos para o ícone e adiciona margem inferior.
  iconHeader: { width: 95, height: 95, marginBottom: 15 },
  // Formata o título em fonte grande, aplicação de negrito pesado e cor escura padrão de leitura do projeto.
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textDark },
  // Centraliza o texto explicativo, adiciona espaçamento interno e define uma altura fixa para travar e impedir o card de se mover na tela.
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 5, paddingHorizontal: 15, height: 45 },

  // Regras de design específicas para o visor numérico principal do temporizador.
  timerText: { 
    fontSize: 54,                 // Determina um tamanho de fonte massivo e de leitura instantânea.
    fontWeight: '300',            // Atribui uma espessura fina e minimalista para a fonte numérica.
    color: colors.primary,        // NOVO: Aplica a cor de identidade global do aplicativo (Azul Padrão).
    marginTop: 20,                // Cria distância em relação aos blocos de texto posicionados logo acima.
    fontVariant: ['tabular-nums'] // ATENÇÃO: Faz com que cada caractere numérico possua exatamente a mesma largura, impedindo que o layout trema a cada segundo.
  },

  // Alinha os elementos internos horizontalmente lado a lado com distribuição simétrica de espaço vazio entre eles.
  durationRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  // Configura a caixa de cada seletor de minuto para preencher igualmente as lacunas com bordas sutis acinzentadas.
  durationButton: { 
    flex: 1, 
    backgroundColor: colors.white, 
    paddingVertical: 12, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  // NOVO: Sobrescreve as definições visuais pintando o fundo com o Azul Padrão e adiciona efeito Glow igual ao Beber Água.
  durationButtonSelected: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  // Determina fonte firme e cor escura padrão para os textos internos dos botões de minutos.
  durationButtonText: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  // Força a alteração da cor da fonte para branca para manter a legibilidade quando o fundo do componente ficar escuro.
  durationButtonTextSelected: { color: colors.white, fontWeight: 'bold' },

  // ============================================================
  // SEÇÃO: TEMPO PERSONALIZADO (campo + botão)
  // ============================================================

  // Container que agrupa o campo de texto e o botão "Definir" lado a lado.
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },

  // Campo de entrada para o usuário digitar o tempo em minutos.
  customInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },

  // Botão "Definir" (estado desabilitado / inativo)
  customButton: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },

  // Botão "Definir" (estado ativo / habilitado)
  customButtonActive: {
    backgroundColor: colors.primary,
  },

  // Texto do botão "Definir" (branco para contraste)
  customButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Estilo estrutural do botão de controle central que liga/desliga o cronômetro.
  controlButton: { 
    width: '100%',                // Expande o botão para preencher toda a largura útil horizontal disponível na tela.
    padding: 18,                  // Garante uma boa espessura e área física de clique confortável para os dedos.
    borderRadius: 20,             // Bordas arredondadas combinando com a linguagem visual de cartões do app.
    alignItems: 'center',         // Centraliza o texto interno horizontalmente.
    justifyContent: 'center',     // Centraliza o texto interno verticalmente.
    elevation: 4,                 // Sombra leve para destacar a camada de prioridade de toque do botão de comando.
  },
  // NOVO: Define o fundo com a cor característica do app (Azul Padrão) e adiciona efeito Glow ao iniciar.
  buttonStart: { 
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  // Define o fundo com a cor de atenção (Laranja) quando a ação disponível no momento for pausar.
  buttonPause: { backgroundColor: '#EA580C' },
  // Formata o texto de comando com tamanho médio, negrito ativado e cor branca pura para contraste.
  controlButtonText: { fontSize: 18, fontWeight: 'bold', color: colors.white },

  // Centraliza horizontalmente a caixa do botão secundário de reinicialização.
  resetButton: { marginTop: 20, alignItems: 'center' },
  // Configura o texto secundário com tom acinzentado discreto e adiciona o sublinhado típico de links web.
  resetButtonText: { color: '#9CA3AF', fontSize: 14, textDecorationLine: 'underline' }
});