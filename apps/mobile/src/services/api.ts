// ============================================================
// IMPORTAÇÕES
// ============================================================

// AsyncStorage: armazenamento persistente local (similar ao localStorage da web)
// Usado para guardar o token JWT entre as sessões do app.
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// CONFIGURAÇÃO DA URL BASE DA API
// ============================================================

// URL do servidor backend. Precisa ser o IP da máquina onde o servidor está rodando.
// Se estiver no emulador Android, use "http://10.0.2.2:3000"
// Se estiver em dispositivo físico, use o IP da máquina na rede local.
export const API_URL = "http://192.168.15.15:3000";

// ============================================================
// FUNÇÃO AUXILIAR: getAuthHeaders
// ============================================================

// Busca o token JWT armazenado no AsyncStorage e monta os headers HTTP
// com o Authorization: Bearer <token> (se o token existir).
// Essa função é usada em todas as requisições para autenticar o usuário.
const getAuthHeaders = async () => {
  // Tenta recuperar o token salvo com a chave '@Apollo:token'
  const token = await AsyncStorage.getItem('@Apollo:token');
  
  // Retorna os headers padrão (Content-Type: application/json)
  // e, se houver token, adiciona o cabeçalho de autorização.
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ============================================================
// OBJETO "api" – CLIENTE HTTP PERSONALIZADO
// ============================================================

// Este objeto centraliza todas as chamadas HTTP da aplicação.
// Cada método (get, post, put, delete) já lida com:
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
      // Obtém os headers com o token de autenticação
      const headers = await getAuthHeaders();

      // Faz a requisição GET com fetch nativo
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      // Se a resposta não for bem-sucedida (status 4xx ou 5xx), lança erro
      if (!response.ok) {
        throw new Error(`HTTP Error GET: ${response.status}`);
      }

      // Retorna os dados já convertidos de JSON para objeto JavaScript
      return { data: await response.json() };
    } catch (error) {
      // Log do erro para depuração
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição GET ${endpoint}:`, error);
      // Repassa o erro para quem chamou
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
        // Converte o corpo da requisição para string JSON
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
  // PUT – Atualizar recursos existentes
  // ============================================================
  // Uso: await api.put('/usuarios/dados-pessoais', { peso: 65, altura: 1.70 })
  // Retorna: { data: {...} } ou lança erro
  // ============================================================
  async put(endpoint: string, body: any) {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',      // Método HTTP para atualização completa
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
        // DELETE geralmente não tem corpo (body)
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