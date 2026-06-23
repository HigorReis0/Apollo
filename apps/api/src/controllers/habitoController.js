const { Habito, UsuarioHabito } = require("../models");

const habitoController = {
  // ============================================================
  // 1. LISTAR HÁBITOS ATIVOS
  // ============================================================
  listarHabitos: async (req, res) => {
    try {
      // Busca todos os hábitos que estão com a flag 'ativo' como verdadeira
      const habitos = await Habito.findAll({ 
        where: { ativo: true } 
      });
      
      return res.status(200).json(habitos);
    } catch (error) {
      // Log detalhado para você e o Higor verem o erro exato do PostgreSQL no console
      console.error("[habitoController] Erro detalhado ao buscar hábitos:", error);
      
      return res.status(500).json({ 
        error: "Erro interno ao buscar hábitos.",
        detalhe: error.message // Facilita a depuração na fase de desenvolvimento
      });
    }
  },

  // ============================================================
  // 2. SALVAR ROTINA DIÁRIA (BULK CREATE)
  // ============================================================
  salvarRotina: async (req, res) => {
    try {
      const { habitos_ids } = req.body;
      
      // Captura o ID do usuário de forma segura através do token
      const usuarioId = req.usuario?.id || req.usuarioId; 

      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado ou token inválido." });
      }

      if (!habitos_ids || !Array.isArray(habitos_ids) || habitos_ids.length === 0) {
        return res.status(400).json({ error: "Nenhum hábito válido selecionado." });
      }

      // -----------------------------------------------------------
      // DICA DE OURO PARA HOJE À NOITE:
      // Verifiquem se as tabelas usam snake_case (usuario_id) ou camelCase (usuarioId).
      // Ajustem os mapeamentos abaixo de acordo com as propriedades do Model de vocês!
      // -----------------------------------------------------------

      // 1. Limpa a rotina anterior do usuário para atualizar com os novos hábitos ativos
      await UsuarioHabito.destroy({ 
        where: { usuario_id: usuarioId } 
      });

      // 2. Prepara a lista de inserção em lote (Bulk)
      const novaRotina = habitos_ids.map(id => ({
        usuario_id: usuarioId,
        habito_id: id,
        concluido: false
      }));

      // 3. Insere todos os hábitos de uma só vez para máxima performance
      await UsuarioHabito.bulkCreate(novaRotina);

      return res.status(201).json({ 
        mensagem: "Rotina salva com sucesso!",
        total_habitos: habitos_ids.length 
      });

    } catch (error) {
      // Se der erro de chave estrangeira ou coluna inexistente, este log vai salvar a noite de vocês!
      console.error("[habitoController] Erro detalhado ao salvar a rotina:", error);
      
      return res.status(500).json({ 
        error: "Erro interno ao salvar a rotina no banco de dados.",
        detalhe: error.message 
      });
    }
  }
};

module.exports = habitoController;