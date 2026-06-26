import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = "http://192.168.15.15:3000";

// Função utilitária seguindo o Clean Code para evitar repetição
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('@Apollo:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(endpoint: string) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error GET: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[NETWORK CLIENT ERROR] Falha na requisição GET ${endpoint}:`, error);
      throw error;
    }
  },

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
  }
};