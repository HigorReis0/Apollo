// ============================================================
// IMPORTAÇÕES
// ============================================================

// AsyncStorage: armazenamento persistente local (similar ao localStorage da web).
// Usado para guardar o token JWT entre as sessões do app.
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// CONFIGURAÇÃO DA URL BASE DA API
// ============================================================

// URL do servidor backend.
// - Emulador Android: use "http://10.0.2.2:3000"
// - Dispositivo físico: use o IP da máquina na rede local (obtido via ipconfig/ifconfig).
export const API_URL = "http://192.168.15.15:3000";

// ============================================================
// FUNÇÃO AUXILIAR: getAuthHeaders (para requisições JSON)
// ============================================================

// Busca o token JWT no AsyncStorage e monta os headers HTTP.
// Se o token existir, adiciona "Authorization: Bearer <token>".
// Define Content-Type como application/json (padrão para APIs REST).
// Usada em GET, POST, PUT (JSON) e DELETE.
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('@Apollo:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ============================================================
// FUNÇÃO AUXILIAR: getAuthHeadersFormData (para upload de arquivos)
// ============================================================

// Similar à getAuthHeaders, mas SEM o Content-Type: application/json.
// Quando enviamos arquivos (FormData), o fetch define automaticamente
// o Content-Type com o boundary correto. Se setarmos manualmente,
// o upload de arquivos quebra.
// Usada apenas em putFormData.
const getAuthHeadersFormData = async () => {
  const token = await AsyncStorage.getItem('@Apollo:token');
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ============================================================
// OBJETO "api" – CLIENTE HTTP PERSONALIZADO
// ============================================================

// Este objeto centraliza todas as chamadas HTTP da aplicação.
// Cada método já lida com:
// - Injeção automática do token JWT
// - Serialização/deserialização JSON
// - Tratamento de erros e logs
// - Validação de resposta (status code)
//
// Isso evita repetição de código em todos os hooks/views.
export const api = {

  // ============================================================
  // GET – Buscar dados do servidor
  // ============================================================
  // Uso: await api.get('/usuarios/perfil')
  // Retorna: { data: {...} } ou lança erro
  // ============================================================
  async get(endpoint: string) {
    try {
      // 1. Obtém os headers com o token de autenticação
      const headers = await getAuthHeaders();

      // 2. Faz a requisição GET com fetch nativo
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      // 3. Se a resposta não for bem-sucedida (status 4xx ou 5xx), lança erro
      if (!response.ok) {
        throw new Error(`HTTP Error GET: ${response.status}`);
      }

      // 4. Retorna os dados já convertidos de JSON para objeto JavaScript
      return { data: await response.json() };
    } catch (error) {
      // 5. Log do erro para depuração
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição GET ${endpoint}:`, error);
      // 6. Repassa o erro para quem chamou
      throw error;
    }
  },

  // ============================================================
  // POST – Criar novos recursos no servidor
  // ============================================================
  // Uso: await api.post('/xp/registrar', { id_motivo: 6 })
  // Retorna: { data: {...} } ou lança erro
  // ============================================================
  async post(endpoint: string, body: any) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error POST: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição POST ${endpoint}:`, error);
      throw error;
    }
  },

  // ============================================================
  // PUT – Atualizar recursos existentes (JSON)
  // ============================================================
  // Uso: await api.put('/usuarios/dados-pessoais', { peso: 65, altura: 1.70 })
  // Retorna: { data: {...} } ou lança erro
  // ============================================================
  async put(endpoint: string, body: any) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error PUT: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição PUT ${endpoint}:`, error);
      throw error;
    }
  },

  // ============================================================
  // PUT FormData – Atualizar recursos com upload de arquivo
  // ============================================================
  // Uso: await api.putFormData('/usuarios/123', formData)
  // Retorna: { data: {...} } ou lança erro
  //
  // DIFERENÇA DO PUT NORMAL:
  // - Não define Content-Type: application/json (deixa o fetch definir o boundary)
  // - O corpo é um FormData (contém arquivos + campos de texto)
  // ============================================================
  async putFormData(endpoint: string, formData: FormData) {
    try {
      // Usa os headers SEM Content-Type (deixa o fetch definir)
      const headers = await getAuthHeadersFormData();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP Error PUT (FormData): ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição PUT FormData ${endpoint}:`, error);
      throw error;
    }
  },

  // ============================================================
  // DELETE – Remover recursos do servidor
  // ============================================================
  // Uso: await api.delete('/agua/hoje')
  // Retorna: { data: {...} } ou lança erro
  // ============================================================
  async delete(endpoint: string) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP Error DELETE: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição DELETE ${endpoint}:`, error);
      throw error;
    }
  }
};