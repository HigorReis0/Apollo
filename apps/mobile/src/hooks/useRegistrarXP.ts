import { useCallback } from 'react';
import { api } from '../services/api';

// ============================================================
// MAPA DE MOTIVOS DE XP
// Centraliza os IDs da tabela tab_motivo do PostgreSQL.
// Se um ID mudar no banco, muda só aqui — não em 7 arquivos.
// Princípio DRY (Hunt & Thomas, 1999).
// ============================================================
export const MOTIVOS_XP = {
  ARRUMAR_CAMA:       1,
  REGISTRO_AGUA:      2,
  META_AGUA:          3,
  CORRIDA:            4,
  META_CORRIDA:       5,
  LEITURA:            6,
  MEDITACAO:          7,
  MUSCULACAO:         8,
  META_MUSCULACAO:    9,
  SAUDE_BUCAL:        10,
  SAUDE_BUCAL_COMPLETA: 11,
  SONO_REGULADO:      12,
} as const;

// Tipo derivado automaticamente das chaves do objeto acima
// Garante type-safety: só aceita IDs válidos — nunca um número arbitrário
export type MotivoXP = typeof MOTIVOS_XP[keyof typeof MOTIVOS_XP];

// ============================================================
// HOOK: useRegistrarXP
// Responsabilidade única (SRP — SOLID): encapsula a comunicação
// com o endpoint POST /xp/registrar.
// Retorna um callback estável via useCallback para evitar
// re-renders desnecessários nos componentes filhos.
// 
// ATUALIZAÇÃO: agora retorna um objeto { sucesso, xp_ganho }
// para que os hooks consumidores possam exibir o valor exato de XP.
// ============================================================
export const useRegistrarXP = () => {

  const registrarXP = useCallback(async (id_motivo: MotivoXP): Promise<{ sucesso: boolean; xp_ganho?: number }> => {
    try {
      // Envia o id_motivo ao backend — o servidor decide quanto XP vale
      // (Security by Design: cliente nunca define o valor de XP)
      const response = await api.post('/xp/registrar', { id_motivo });

      // O backend deve retornar o xp_ganho no corpo da resposta
      return { 
        sucesso: true, 
        xp_ganho: response.data?.xp_ganho || 0 
      };
    } catch (error: any) {
      console.error(
        '[useRegistrarXP] Falha ao registrar XP:',
        error?.response?.data || error.message
      );
      return { sucesso: false }; // Falha — o hook que consome decide como tratar
    }
  }, []); // Sem dependências: função estável durante todo o ciclo de vida

  return { registrarXP };
};