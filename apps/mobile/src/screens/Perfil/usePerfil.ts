// ============================================================
// IMPORTAÇÕES
// ============================================================

// Hooks do React para gerenciar estado e efeitos colaterais.
// - useState: guarda os dados do perfil, loading, erros, etc.
// - useEffect: carrega os dados automaticamente ao abrir a tela.
import { useState, useEffect } from 'react';

// Cliente HTTP personalizado (com get, post, put, delete).
// Centraliza todas as chamadas à API, injetando token automaticamente.
import { api } from '../../services/api';

// Alert para exibir mensagens ao usuário (pop-ups).
import { Alert } from 'react-native';

// NOTA: O ImagePicker NÃO é importado estaticamente.
// Usamos require com fallback dentro da função pickImage para evitar erros de undefined.
// Isso garante que o módulo seja carregado no momento da execução.

// ============================================================
// IMAGENS DOS HÁBITOS (FALLBACK)
// ============================================================

// Caso o backend não retorne uma imagem, usamos estas como fallback.
// Cada imagem é importada como um asset local.
// @ts-ignore (ignora erro de tipo do TypeScript para importação de imagem)
import imgLeitura from '../../../assets/leitura.png';
// @ts-ignore
import imgMusculacao from '../../../assets/musculacao.png';
// @ts-ignore
import imgAgua from '../../../assets/agua.png';
// @ts-ignore
import imgCorrendo from '../../../assets/correndo.png';

// ============================================================
// IMAGENS DAS CONQUISTAS (MEDALHAS)
// ============================================================

// Essas imagens são exibidas quando o usuário desbloqueia uma conquista.
// São fixas e não dependem do backend.
// @ts-ignore
import imgDezDias from '../../../assets/dezDias.png';
// @ts-ignore
import imgCinquentaDias from '../../../assets/cinquentaDias.png';
// @ts-ignore
import imgCemDias from '../../../assets/cemDias.png';

// ============================================================
// INTERFACES (TIPAGEM DOS DADOS)
// ============================================================

/*
  Interfaces definem a estrutura dos objetos.
  Ajudam o TypeScript a verificar se estamos usando os campos corretos.
  Facilitam a manutenção e evitam erros de digitação.
*/

// Dados principais do perfil – representa o usuário logado.
interface PerfilData {
  usuario_id: number;          // ID único do usuário (chave primária no banco)
  nome: string;                // Nome completo do usuário
  email: string;               // E-mail (usado para login)
  avatar_url?: string;         // URL da foto de perfil (opcional, pode ser null)
  total_xp: number;            // Total de XP acumulado (soma de todas as conquistas)
  nivel: string;               // Nível atual (ex.: "Iniciante", "Aprendiz", etc.)
  xp_proximo_nivel: number | null; // XP necessário para alcançar o próximo nível
  data_nascimento?: string;    // Data de nascimento (formato ISO: YYYY-MM-DD)
  peso?: number;               // Peso em quilogramas
  altura?: number;             // Altura em metros (no banco), mas exibimos em cm
}

// Hábito recente – usado na seção "Últimos Acessos" do Perfil.
interface HabitoRecente {
  id: number;                  // ID do hábito (vem do banco)
  label: string;               // Nome do hábito (ex.: "Corrida", "Leitura")
  xp: number;                  // XP ganho neste registro específico
  image: string | null;        // URL da imagem (pode ser null, e então usamos fallback)
  mensagem?: string;           // Mensagem personalizada (ex.: descrição do motivo)
}

// ============================================================
// HOOK PRINCIPAL: usePerfil
// ============================================================

/*
  O QUE É UM HOOK?
  - Um hook é uma função que encapsula lógica com estado e efeitos.
  - Ele permite que componentes reutilizem lógica sem duplicar código.
  - Este hook é a "fonte única de verdade" para os dados da tela de Perfil.

  PRINCÍPIOS APLICADOS:
  - Single Responsibility: cuida apenas dos dados do perfil.
  - Separation of Concerns: lógica separada da UI (view).
  - DRY (Don't Repeat Yourself): centraliza chamadas à API.
*/
export const usePerfil = () => {
  // ---- ESTADOS PRINCIPAIS ----
  // Estado que armazena todos os dados do perfil (inicia como null)
  const [perfil, setPerfil] = useState<PerfilData | null>(null);

  // Estado de carregamento: usado para exibir um spinner enquanto os dados são buscados
  const [isLoading, setIsLoading] = useState(true);

  // Estado de erro: armazena mensagem de erro caso a requisição falhe
  const [error, setError] = useState<string | null>(null);

  // Estado que armazena os hábitos recentes (últimos 4) vindos do backend
  const [habitosRecentes, setHabitosRecentes] = useState<HabitoRecente[]>([]);

  // ---- ESTADOS DOS MODAIS DE EDIÇÃO ----

  // Modal de edição de NOME (botão "Editar Perfil" antigo)
  const [editNomeModalVisible, setEditNomeModalVisible] = useState(false);
  const [editNome, setEditNome] = useState('');

  // Modal de edição de DADOS PESSOAIS (data, peso, altura)
  const [editDadosModalVisible, setEditDadosModalVisible] = useState(false);
  const [editDataNascimento, setEditDataNascimento] = useState('');
  const [editPeso, setEditPeso] = useState('');
  const [editAltura, setEditAltura] = useState('');

  // ---- ESTADOS PARA UPLOAD DE AVATAR ----
  // selectedImage: URL temporária da imagem selecionada (usada para prévia no modal)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // imageFile: o objeto completo da imagem (contém uri, type, fileName, etc.)
  // É usado para construir o FormData e enviar ao backend.
  const [imageFile, setImageFile] = useState<any>(null);

  // Modal de edição de PERFIL (nome + avatar) – unifica nome e foto
  const [editPerfilModalVisible, setEditPerfilModalVisible] = useState(false);

  // ============================================================
  // FUNÇÃO: carregarDados
  // Busca todas as informações do perfil (perfil + XP + hábitos)
  // ============================================================

  /*
    Esta é a função principal que busca todos os dados do perfil.
    Ela é chamada ao montar o componente (useEffect) e após cada atualização bem-sucedida.

    POR QUE USAR Promise.all?
    - Faz duas requisições em paralelo (perfil e XP), reduzindo o tempo de espera.
    - É mais eficiente do que fazer uma requisição após a outra.
  */
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Busca os dados do perfil (nome, email, avatar, dados pessoais)
      //    e o saldo de XP (total, nível, próximo nível) em paralelo
      const [perfilResponse, xpResponse] = await Promise.all([
        api.get('/usuarios/perfil'),
        api.get('/xp/saldo')
      ]);

      // Atualiza o estado com os dados do perfil
      setPerfil({
        usuario_id: perfilResponse.data.usuario_id || 0,
        nome: perfilResponse.data.nome || 'Usuário',
        email: perfilResponse.data.email || '',
        avatar_url: perfilResponse.data.avatar_url,
        total_xp: xpResponse.data.total_xp ?? 0,
        nivel: xpResponse.data.nivel_atual || 'Iniciante',
        xp_proximo_nivel: xpResponse.data.xp_proximo_nivel ?? null,
        data_nascimento: perfilResponse.data.data_nascimento || '',
        peso: perfilResponse.data.peso || null,
        altura: perfilResponse.data.altura || null,
      });

      // 2. Busca os hábitos recentes (últimos 4)
      await carregarHabitosRecentes();

    } catch (err: any) {
      // Em caso de erro, exibe mensagem e mantém dados mínimos (fallback)
      console.error('Erro ao carregar perfil:', err);
      setError('Não foi possível carregar os dados do perfil.');
      setPerfil({
        usuario_id: 0,
        nome: 'Usuário',
        email: '',
        total_xp: 0,
        nivel: '--',
        xp_proximo_nivel: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: carregarHabitosRecentes
  // Busca os 4 últimos hábitos que o usuário concluiu (bateu a meta)
  // ============================================================

  /*
    Chama o endpoint /usuarios/habitos-recentes.
    O backend retorna os 4 hábitos mais recentes, sem duplicatas e sem metas (bônus).
    Mapeamos os dados para o formato esperado pela View.
  */
  const carregarHabitosRecentes = async () => {
    try {
      const res = await api.get('/usuarios/habitos-recentes');

      const dados = res.data.map((h: any) => ({
        id: h.id || h.habito_id || 0,
        label: h.label || h.nome || 'Hábito',
        xp: h.xp || 0,
        image: h.image || h.icone_url || getImagemFallback(h.label || h.nome),
        mensagem: h.mensagem || `+${h.xp || 0} XP`
      }));
      setHabitosRecentes(dados);
    } catch (error) {
      console.error('Erro ao carregar hábitos recentes:', error);
      setHabitosRecentes([]);
    }
  };

  // ============================================================
  // FUNÇÃO AUXILIAR: getImagemFallback
  // Retorna uma imagem local com base no nome do hábito
  // ============================================================

  /*
    Usamos um mapa (objeto) para associar cada nome de hábito a uma imagem local.
    Se o nome não estiver no mapa, retorna a imagem de musculação como padrão.
  */
  const getImagemFallback = (label: string) => {
    const map: Record<string, any> = {
      'Musculação': imgMusculacao,
      'Leitura': imgLeitura,
      'Beber Água': imgAgua,
      'Corrida': imgCorrendo,
      'Correr': imgCorrendo,
    };
    return map[label] || imgMusculacao;
  };

  // ============================================================
  // LÓGICA DAS CONQUISTAS (baseada no nível atual)
  // ============================================================

  /*
    CONQUISTAS: Como funcionam?
    - As conquistas são desbloqueadas automaticamente quando o usuário atinge um determinado nível.
    - Por exemplo: ao chegar no nível "Aprendiz", a medalha "10 Dias" é desbloqueada.
    - A lista de níveis é ordenada do mais baixo para o mais alto.
    - O código verifica se o nível atual do usuário é maior ou igual ao nível mínimo da conquista.
  */

  // Lista ordenada dos níveis (do mais baixo para o mais alto)
  const niveisOrdenados = ['Iniciante', 'Aprendiz', 'Praticante', 'Dedicado', 'Mestre', 'Lendário'];

  // Índice do nível atual do usuário (0 = Iniciante)
  const nivelAtual = perfil?.nivel || 'Iniciante';
  const nivelIndex = niveisOrdenados.indexOf(nivelAtual);

  // Definição das conquistas com o nível mínimo necessário para desbloquear
  const todasConquistas = [
    { icon: imgDezDias, nivelMinimo: 'Aprendiz' },      // Desbloqueia no nível Aprendiz
    { icon: imgCinquentaDias, nivelMinimo: 'Praticante' }, // Desbloqueia no nível Praticante
    { icon: imgCemDias, nivelMinimo: 'Dedicado' },       // Desbloqueia no nível Dedicado
  ];

  // Filtra apenas as conquistas que o usuário já pode ter (baseado no nível)
  const conquistasDesbloqueadas = todasConquistas.filter(c => {
    const nivelMinIndex = niveisOrdenados.indexOf(c.nivelMinimo);
    return nivelIndex >= nivelMinIndex;
  });

  // ============================================================
  // FUNÇÃO: calcularIdade
  // Calcula a idade a partir da data de nascimento (formato YYYY-MM-DD)
  // ============================================================

  /*
    A lógica leva em conta se a pessoa já fez aniversário este ano.
    Se não fez, subtrai 1 da idade.
  */
  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '--';
    const nasc = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  // ============================================================
  // FUNÇÕES DE FORMATAÇÃO E CONVERSÃO
  // ============================================================

  /*
    POR QUE CONVERTER FORMATOS?
    - O banco de dados armazena a data no formato ISO (YYYY-MM-DD).
    - No Brasil, exibimos a data no formato DD/MM/AAAA.
    - O usuário digita no formato brasileiro, mas o backend espera ISO.
    - Portanto, precisamos converter de um formato para o outro.
  */

  // Converte data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/AAAA)
  const formatarDataBR = (dataISO: string) => {
    if (!dataISO) return 'Não definida';
    try {
      const partes = dataISO.split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch {
      return dataISO;
    }
  };

  // Converte data brasileira (DD/MM/AAAA) para ISO (YYYY-MM-DD)
  const converterDataParaISO = (dataBR: string) => {
    if (!dataBR) return null;
    const partes = dataBR.split('/');
    if (partes.length !== 3) return null;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  };

  /*
    MÁSCARA DE DATA:
    - Enquanto o usuário digita, o código aplica automaticamente as barras.
    - Exemplo: "15041995" → "15/04/1995"
    - Isso melhora a experiência do usuário, pois ele não precisa digitar as barras.
    - A função também limita a 8 dígitos (DDMMAAAA).
  */
  const aplicarMascaraData = (texto: string) => {
    let numeros = texto.replace(/\D/g, '');
    if (numeros.length > 8) numeros = numeros.slice(0, 8);

    let formatado = '';
    if (numeros.length <= 2) {
      formatado = numeros;
    } else if (numeros.length <= 4) {
      formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else {
      formatado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    }
    return formatado;
  };

  // Converte metros para centímetros (ex.: 1.68 → 168)
  const metrosParaCm = (metros: number | null | undefined) => {
    if (!metros) return '';
    return Math.round(metros * 100).toString();
  };

  // Converte centímetros para metros (ex.: 168 → 1.68)
  const cmParaMetros = (cm: string) => {
    if (!cm) return null;
    const valor = parseFloat(cm);
    if (isNaN(valor) || valor <= 0) return null;
    return valor / 100;
  };

  // ============================================================
  // DADOS PESSOAIS FORMATADOS PARA EXIBIÇÃO
  // ============================================================

  /*
    Este array é usado na View para exibir os dados pessoais em um grid.
    Cada item tem um label (ex.: "Peso") e um value (ex.: "62 kg").
    As conversões de formato já são aplicadas aqui.
  */
  const personalData = [
    {
      label: 'Data de Nascimento',
      value: perfil?.data_nascimento ? formatarDataBR(perfil.data_nascimento) : 'Não definida'
    },
    {
      label: 'Idade',
      value: perfil?.data_nascimento ? calcularIdade(perfil.data_nascimento) : '--'
    },
    {
      label: 'Peso',
      value: perfil?.peso ? `${perfil.peso} kg` : '--'
    },
    {
      label: 'Altura',
      value: perfil?.altura ? `${metrosParaCm(perfil.altura)} cm` : '--'
    },
  ];

  // ============================================================
  // FUNÇÃO: salvarNome (edita apenas o nome)
  // ============================================================

  /*
    Salva o novo nome no backend e recarrega os dados.
    - Valida se o nome não está vazio.
    - Usa o endpoint PUT /usuarios/:id (que já existe).
    - Após salvar, recarrega os dados para atualizar a UI.
  */
  const salvarNome = async () => {
    if (!editNome.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }
    try {
      setIsLoading(true);
      await api.put(`/usuarios/${perfil?.usuario_id}`, { nome: editNome.trim() });
      await carregarDados();
      setEditNomeModalVisible(false);
      Alert.alert('Sucesso', 'Nome atualizado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: salvarDadosPessoais (edita data, peso, altura)
  // ============================================================

  /*
    Salva os dados pessoais no backend (convertendo formatos).
    - Converte a data de DD/MM/AAAA para YYYY-MM-DD.
    - Converte a altura de cm para metros.
    - Valida o formato da data.
  */
  const salvarDadosPessoais = async () => {
    const dataISO = converterDataParaISO(editDataNascimento);
    const alturaMetros = cmParaMetros(editAltura);
    if (editDataNascimento && !dataISO) {
      Alert.alert('Erro', 'Formato de data inválido. Use DD/MM/AAAA (ex.: 15/04/1995).');
      return;
    }
    try {
      setIsLoading(true);
      await api.put('/usuarios/dados-pessoais', {
        data_nascimento: dataISO || null,
        peso: editPeso ? parseFloat(editPeso) : null,
        altura: alturaMetros,
      });
      await carregarDados();
      setEditDadosModalVisible(false);
      Alert.alert('Sucesso', 'Dados pessoais atualizados!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÃO: pickImage (SELECIONAR FOTO DA GALERIA)
  // ============================================================

  /*
    O QUE FAZ?
    - Abre a galeria do dispositivo para o usuário escolher uma foto.
    - Se o usuário der permissão, seleciona a imagem e armazena:
      - selectedImage: a URL local para prévia (exibe no modal)
      - imageFile: o objeto da imagem (usado para converter em base64)

    POR QUE USAR require EM VEZ DE import?
    - Em alguns ambientes Expo, a importação estática pode causar undefined.
    - Usar require dentro da função garante que o módulo seja carregado no momento certo.
    - Também temos um fallback para o objeto global Expo (se disponível).

    CONTÉM LOGS DE DEPURAÇÃO:
    - Para identificar onde o processo falha, caso aconteça.
  */
  const pickImage = async () => {
    console.log('pickImage chamado!');

    try {
      // ============================================================
      // CARREGA O IMAGEPICKER DINAMICAMENTE (require)
      // ============================================================
      let ImagePicker;
      try {
        // Tenta carregar o módulo com require
        const module = require('expo-image-picker');
        // O módulo pode estar em module.default ou diretamente
        ImagePicker = module.default || module;
        console.log('ImagePicker carregado via require');
      } catch (e) {
        console.log('require falhou, tentando Expo global...');
        // Fallback: usar o objeto global Expo (se disponível)
        // @ts-ignore
        if (typeof Expo !== 'undefined' && Expo.ImagePicker) {
          // @ts-ignore
          ImagePicker = Expo.ImagePicker;
          console.log('ImagePicker carregado via Expo global');
        } else {
          throw new Error('Não foi possível carregar o ImagePicker.');
        }
      }

      // Verifica se o ImagePicker foi carregado
      if (!ImagePicker || typeof ImagePicker.requestMediaLibraryPermissionsAsync !== 'function') {
        throw new Error('ImagePicker não tem a função requestMediaLibraryPermissionsAsync');
      }

      // 1. Solicita permissão para acessar a galeria (no Android/iOS)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Status da permissão:', status);

      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria para escolher uma foto.');
        return;
      }

      // 2. Abre a galeria com as opções de edição
      console.log('Abrindo galeria...');
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,        // Permite cortar a imagem
        aspect: [1, 1],             // Proporção 1:1 (quadrado, ideal para avatar)
        quality: 0.8,               // Qualidade da imagem (0.8 = 80%)
      });
      console.log('Resultado do picker:', result);

      // 3. Se o usuário não cancelou, salva a imagem
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);   // URL local para prévia
        setImageFile(asset);           // Objeto completo para conversão base64
        console.log('Imagem selecionada:', asset.uri);
      } else {
        console.log('Usuário cancelou ou não selecionou imagem.');
      }
    } catch (error) {
      // Captura qualquer erro (ex: falta de permissão, problema no emulador, etc.)
      console.error('Erro no pickImage:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria. Tente novamente.');
    }
  };

  // ============================================================
  // FUNÇÃO: salvarEdicaoPerfil (NOME + AVATAR em base64 via JSON)
  // ============================================================

  /*
    O QUE FAZ?
    - Envia o nome + avatar (se houver) para o backend.
    - Converte a imagem selecionada para base64 e envia dentro do JSON.
    - O backend salva a imagem como arquivo (usando fs.writeFileSync).

    POR QUE USAR BASE64 EM VEZ DE FORMDATA?
    - O FormData estava causando erro "Network request failed" no ambiente Expo.
    - Enviar a imagem como base64 dentro do JSON é mais confiável e evita problemas
      com headers de Content-Type e boundaries.
    - O backend já foi adaptado para receber o campo avatar_base64.

    FLUXO:
    1. Valida o nome (não pode estar vazio).
    2. Se o usuário selecionou uma imagem (imageFile), converte para base64.
    3. Envia o payload { nome, avatar_base64 } via PUT /usuarios/:id.
    4. Recarrega os dados do perfil para exibir o novo avatar.
    5. Fecha o modal e limpa os estados.
  */
  const salvarEdicaoPerfil = async () => {
    // Validação: nome não pode estar vazio
    if (!editNome.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }

    try {
      setIsLoading(true);

      // Cria o payload com o nome
      const payload: any = {
        nome: editNome.trim()
      };

      // Se o usuário selecionou uma imagem, converte para base64
      if (imageFile) {
        try {
          // Lê a imagem como base64
          const response = await fetch(imageFile.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          payload.avatar_base64 = base64; // Envia a imagem em base64
          console.log('Imagem convertida para base64 (tamanho: ' + base64.length + ' caracteres)');
        } catch (err) {
          console.error('Erro ao converter imagem para base64:', err);
          Alert.alert('Erro', 'Não foi possível processar a imagem.');
          return;
        }
      } else {
        console.log('Nenhuma imagem selecionada, enviando apenas nome.');
      }

      // Envia como JSON (NÃO é FormData) – usa o método put normal
      await api.put(`/usuarios/${perfil?.usuario_id}`, payload);

      // Recarrega os dados para mostrar o novo avatar
      await carregarDados();

      // Fecha o modal e limpa os estados
      setEditPerfilModalVisible(false);
      setSelectedImage(null);
      setImageFile(null);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // FUNÇÕES PARA ABRIR OS MODAIS
  // ============================================================

  // Abre o modal de edição de nome (antigo)
  const abrirModalNome = () => {
    setEditNome(perfil?.nome || '');
    setEditNomeModalVisible(true);
  };

  // Abre o modal de edição de dados pessoais (data, peso, altura)
  const abrirModalDados = () => {
    setEditDataNascimento(
      perfil?.data_nascimento ? formatarDataBR(perfil.data_nascimento) : ''
    );
    setEditPeso(perfil?.peso ? String(perfil.peso) : '');
    setEditAltura(perfil?.altura ? metrosParaCm(perfil.altura) : '');
    setEditDadosModalVisible(true);
  };

  // Abre o modal de edição de perfil (nome + avatar) – unificado
  const abrirModalPerfil = () => {
    setEditNome(perfil?.nome || '');
    // Limpa a imagem selecionada anterior (para não mostrar prévia antiga)
    setSelectedImage(null);
    setImageFile(null);
    setEditPerfilModalVisible(true);
  };

  // ============================================================
  // CARREGAR DADOS AO MONTAR O COMPONENTE
  // ============================================================

  /*
    useEffect é executado quando o componente é montado (array vazio de dependências).
    Isso garante que os dados sejam carregados assim que a tela de Perfil for aberta.
  */
  useEffect(() => {
    carregarDados();
  }, []);

  // ============================================================
  // RETORNO DO HOOK (tudo que a View precisa)
  // ============================================================

  /*
    Este hook retorna um objeto com todos os dados, estados e funções
    que a View (perfil.view.tsx) precisa para renderizar a tela.
    A View não precisa se preocupar com a lógica de busca ou formatação.
  */
  return {
    // ---- Dados principais ----
    perfil,                      // Objeto com todos os dados do perfil
    isLoading,                   // Booleano: está carregando?
    error,                       // Mensagem de erro (se houver)
    personalData,                // Dados pessoais formatados para exibição
    conquistasDesbloqueadas,     // Lista de conquistas desbloqueadas
    habitosRecentes: habitosRecentes.length > 0 ? habitosRecentes : [], // Últimos hábitos

    // ---- Modal de edição de nome (antigo) ----
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
    aplicarMascaraData,          // Função para aplicar máscara no campo de data
    editPeso,
    setEditPeso,
    editAltura,
    setEditAltura,
    salvarDadosPessoais,
    abrirModalDados,

    // ---- Upload de avatar (NOVO) ----
    editPerfilModalVisible,
    setEditPerfilModalVisible,
    selectedImage,                // URL da imagem selecionada (prévia)
    imageFile,                    // Objeto da imagem (para conversão base64)
    pickImage,                    // Função para abrir a galeria
    salvarEdicaoPerfil,           // Função para salvar nome + avatar (base64)
    abrirModalPerfil,             // Função para abrir o modal de perfil
  };
};