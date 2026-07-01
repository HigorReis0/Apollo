// ============================================================
// IMPORTAÇÕES
// ============================================================
// useState: hook para gerenciar estado local (flags, valores)
import { useState } from 'react';

// Alert: diálogo nativo do React Native
import { Alert } from 'react-native';

// useNavigation: hook para navegação entre telas
import { useNavigation } from '@react-navigation/native';

// Hook genérico reutilizável para registrar XP
// Evita repetição de código (princípio DRY) — todos os 8+ hábitos usam isso
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useCama
// ============================================================
// Responsabilidade: Gerenciar a lógica da tela "Arrumar a Cama"
// Segue Clean Architecture: este arquivo é a LÓGICA
// O arquivo cama.view.tsx é apenas a INTERFACE
// A lógica de XP é delegada para useRegistrarXP (reutilizável)
export const useCama = () => {
  
  // Hook de navegação (voltar para tela anterior)
  const navigation = useNavigation();

  // Chama o hook genérico de XP
  // Desestruturaça apenas a função registrarXP
  // Este hook cuida de: validação, envio HTTP, recebimento de resposta
  const { registrarXP } = useRegistrarXP();

  // ── ESTADO 1: Cama arrumada? ──
  // true = usuário já registrou o hábito hoje (evita duplo registro)
  // false = ainda não registrou ou é um novo dia
  // Padrão common em apps: "você já completou isso hoje"
  const [estaArrumada, setEstaArrumada] = useState(false);

  // ── ESTADO 2: Loading durante requisição ──
  // true = requisição HTTP em andamento, desabilitar o botão
  // false = requisição concluída, botão habilitado
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FUNÇÃO: handleCheckIn
  // ============================================================
  // Responsabilidades:
  // 1. Validar se já foi feito hoje
  // 2. Chamar hook genérico de XP com o motivo correto
  // 3. Atualizar estado local
  // 4. Exibir alerta com o XP ganho
  const handleCheckIn = async () => {
    
    // Guard Clause: Se já foi feito hoje, mostra aviso e sai
    // Evita duplo registro — importante para segurança de XP
    if (estaArrumada) {
      Alert.alert('Aviso', 'Você já concluiu este hábito hoje!');
      return; // Sai da função aqui
    }

    try {
      // Ativa o loading — desabilita botão durante requisição
      setLoading(true);

      // Chama o hook genérico com o ID do motivo
      // MOTIVOS_XP.ARRUMAR_CAMA = 1 (constante centralizada, nunca hardcoded)
      // O hook retorna: { sucesso: boolean, xp_ganho: number }
      const resultado = await registrarXP(MOTIVOS_XP.ARRUMAR_CAMA);

      // Se a requisição foi bem-sucedida no backend
      if (resultado.sucesso) {
        // Marca como concluído hoje (impede duplo registro)
        setEstaArrumada(true);
        
        // Mostra alerta com o valor exato de XP ganho
        // Exemplo: resultado.xp_ganho = 20
        Alert.alert(
          'Organizado!',
          `Sua primeira vitória do dia! Quarto organizado, mente organizada. +${resultado.xp_ganho} XP registrado!`
        );
      } else {
        // Se a requisição falhou no backend
        Alert.alert(
          'Erro',
          'Não foi possível registrar o XP. Verifique sua conexão e tente novamente.'
        );
      }
    } finally {
      // Desativa o loading (sempre, seja sucesso ou erro)
      setLoading(false);
    }
  };

  // Função simples: voltar à tela anterior
  const handleGoBack = () => navigation.goBack();

  // Função de reset manual (útil para testes ou simular novo dia)
  const handleReset = () => setEstaArrumada(false);

  // ============================================================
  // RETORNO DO HOOK
  // ============================================================
  // A view (cama.view.tsx) desestrututa esses valores
  return {
    estaArrumada,   // Flag: true se já arrumou hoje
    loading,        // Flag: true se requisição em andamento
    handleCheckIn,  // Função: registra o hábito
    handleGoBack,   // Função: volta à tela anterior
    handleReset,    // Função: reseta o estado (testes)
  };
};