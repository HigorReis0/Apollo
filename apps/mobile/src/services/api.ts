import { Platform } from 'react-native';

/**
 * Endereço IP da sua máquina na rede local.
 */
export const API_URL = "http://192.168.1.44:3000";

// Objeto cliente utilizando a API nativa Fetch do Expo
export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP GET: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      // Impede o crash da aplicação interceptando o erro de rede (I/O)
      console.error(`[API CLIENT ERROR] Falha de comunicação em GET ${endpoint}:`, error);
      throw error; 
    }
  },

  async post(endpoint: string, body: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP POST: ${response.status}`);
      }
      return { data: await response.json() };
    } catch (error) {
      console.error(`[API CLIENT ERROR] Falha de comunicação em POST ${endpoint}:`, error);
      throw error;
    }
  }
};