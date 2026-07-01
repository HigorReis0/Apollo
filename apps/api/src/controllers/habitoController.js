const { Habito, UsuarioHabito } = require("../models");

const habitoController = {
  // ============================================================
  // 1. LISTAR HÁBITOS
  // ============================================================
  listarHabitos: async (req, res) => {
    try {
      // Busca todos os hábitos disponíveis no catálogo
      const habitos = await Habito.findAll();
      
      return res.status(200).json(habitos);
    } catch (error) {
      console.error("[habitoController] Erro detalhado ao buscar hábitos:", error);
      
      return res.status(500).json({ 
        error: "Erro interno ao buscar hábitos.",
        detalhe: error.message
      });
    }
  },

  // ============================================================
  // 2. SALVAR ROTINA DIÁRIA (BULK CREATE)
  // ============================================================
  salvarRotina: async (req, res) => {
    try {
      const { habitos_ids } = req.body;
      
      const usuarioId = req.usuario?.id || req.usuarioId; 

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado ou token inválido." });
      }

      if (!habitos_ids || !Array.isArray(habitos_ids) || habitos_ids.length === 0) {
        return res.status(400).json({ error: "Nenhum hábito válido selecionado." });
      }

      // 1. Limpa a rotina anterior do usuário
      await UsuarioHabito.destroy({ 
        where: { usuario_id: usuarioId } 
      });

      // 2. Prepara a lista de inserção em lote
      const novaRotina = habitos_ids.map(id => ({
        usuario_id: usuarioId,
        habito_id: id,
        concluido: false
      }));

      // 3. Insere todos os hábitos de uma só vez
      await UsuarioHabito.bulkCreate(novaRotina);

      return res.status(201).json({ 
        mensagem: "Rotina salva com sucesso!",
        total_habitos: habitos_ids.length 
      });

    } catch (error) {
      console.error("[habitoController] Erro detalhado ao salvar a rotina:", error);
      
      return res.status(500).json({ 
        error: "Erro interno ao salvar a rotina no banco de dados.",
        detalhe: error.message 
      });
    }
  }
};

module.exports = habitoController;