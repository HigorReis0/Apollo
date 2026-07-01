import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistrarXP, MOTIVOS_XP } from '../../../hooks/useRegistrarXP';

// ============================================================
// HOOK: useSonoRegulado
// Responsabilidade: controlar o registro de horas de sono,
// registrar XP ao atingir a meta diária (8h) e gerenciar
// ajustes em incrementos de 1.5h (ciclos de sono).
// ============================================================
export const useSonoRegulado = () => {
  const navigation = useNavigation();
  const { registrarXP } = useRegistrarXP();

  // Total de horas de sono registradas (inicia em 0)
  const [horasSono, setHorasSono] = useState(0);

  // Protege contra duplo bônus de meta no mesmo dia
  const [metaBatida, setMetaBatida] = useState(false);

  // Loading durante requisição ao backend
  const [loading, setLoading] = useState(false);

  // Meta diária recomendada: entre 6 e 10.5h (literatura científica)
  const META_DIARIA = 6; // Meta mínima para efeito restaurador

  // Percentual de progresso para a barra visual (limitado a 100%)
  const progresso = Math.min((horasSono / META_DIARIA) * 100, 100);

  // ============================================================
  // FUNÇÃO: ajustarHoras
  // Ajusta as horas de sono em incrementos de 1.5h (ciclos de sono).
  // Não permite valores negativos nem acima de 24h.
  // ============================================================
  const ajustarHoras = (incremento: number) => {
    const novoTotal = horasSono + incremento;

    // Invariante de domínio: não permite valores negativos
    if (novoTotal < 0) {
      Alert.alert('Aviso', 'O total de horas não pode ser negativo.');
      return;
    }

    // Invariante de domínio: limite máximo de 24h por dia
    if (novoTotal > 24) {
      Alert.alert('Aviso', 'O dia possui apenas 24 horas!');
      return;
    }

    // Atualiza o total de horas
    setHorasSono(novoTotal);

    // Se o total cair abaixo da meta, permite que o bônus seja registrado novamente
    if (novoTotal < META_DIARIA) {
      setMetaBatida(false);
    }

    // Verifica se bateu a meta agora e ainda não ganhou o bônus
    verificarMeta(novoTotal);
  };

  // ============================================================
  // FUNÇÃO: verificarMeta
  // Verifica se o total atual bateu a meta e se o bônus já foi concedido.
  // ============================================================
  const verificarMeta = async (total: number) => {
    if (total >= META_DIARIA && !metaBatida) {
      setMetaBatida(true);
      setLoading(true);

      try {
        // Registra XP no backend — servidor decide o valor (Security by Design)
        const resultado = await registrarXP(MOTIVOS_XP.SONO_REGULADO);

        if (resultado.sucesso) {
          Alert.alert(
            'Descanso Merecido!',
            `Você atingiu a meta ideal de sono! Seu cérebro agradece. +${resultado.xp_ganho} XP registrado!`
          );
        } else {
          Alert.alert(
            'Meta atingida!',
            'Você dormiu bem, mas não foi possível registrar o XP. Verifique sua conexão.'
          );
        }
      } catch (error: any) {
        Alert.alert('Erro', 'Não foi possível registrar o XP. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  // ============================================================
  // FUNÇÃO: mostrarInfoCiclos
  // Exibe um alerta explicativo sobre os ciclos de sono.
  // ============================================================
  const mostrarInfoCiclos = () => {
    Alert.alert(
      'Ciclos de Sono',
      'O sono é dividido em ciclos de aproximadamente 90 minutos (1h30).\n\n' +
      'Cada ciclo possui fases de sono leve, profundo e REM.\n' +
      'Acordar no final de um ciclo (ou múltiplos) faz você se sentir mais descansado.\n\n' +
      'A meta ideal para adultos é de:\n' +
      '• 5 ciclos = 7.5h\n' +
      '• 6 ciclos = 9.0h\n\n' +
      'Regule seu sono de acordo com os ciclos!',
      [{ text: 'Entendi', style: 'default' }]
    );
  };

  // ============================================================
  // RESET (para testes ou novo dia)
  // ============================================================
  const handleReset = () => {
    setHorasSono(0);
    setMetaBatida(false);
  };

  // ============================================================
  // NAVEGAÇÃO: voltar para a tela de hábitos
  // ============================================================
  const handleGoBack = () => navigation.goBack();

  // ============================================================
  // RETORNO: expõe estados e funções para a View
  // ============================================================
  return {
    horasSono,
    META_DIARIA,
    progresso,
    loading,
    metaBatida,
    ajustarHoras,
    mostrarInfoCiclos,
    handleReset,
    handleGoBack,
  };
};