const { Leitura, LivrosLidos, XpLog, Motivo, sequelize } = require("../models");

// ID padrão do motivo de XP para Leitura definido no banco (id_motivo = 6)
const MOTIVO_LEITURA_ID = 6;

const leituraController = {
  // ============================================================
  // 1. REGISTRAR SESSÃO DE LEITURA (Com Transação ACID e Ganho de XP)
  // ============================================================
  registrarSessao: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id_livro_lido, pag_lidas, nota_leitura } = req.body;
      const usuarioId = req.usuario?.id || req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ error: "Utilizador não autenticado." });
      }

      if (!id_livro_lido || !pag_lidas) {
        return res.status(400).json({ error: "id_livro_lido e pag_lidas são obrigatórios." });
      }

      // 1. Verifica se o livro existe e pertence ao utilizador
      const livro = await LivrosLidos.findOne({
        where: { id_livro_lido, usuario_id: usuarioId }
      });

      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado ou não pertence a este utilizador." });
      }

      // 2. Insere a sessão de leitura na tabela tab_leitura
      const novaLeitura = await Leitura.create({
        id_livro_lido,
        usuario_id: usuarioId,
        pag_lidas: parseInt(pag_lidas),
        nota_leitura: nota_leitura || null
      }, { transaction: t });

      // 3. Busca o ganho de XP associado ao motivo de Leitura (id_motivo = 6)
      const motivo = await Motivo.findByPk(MOTIVO_LEITURA_ID);
      const xpGanho = motivo ? motivo.xp_padrao : 20; // Fallback seguro de 20 XP

      // 4. Salva o log de XP atomicamente
      await XpLog.create({
        usuario_id: usuarioId,
        id_motivo: MOTIVO_LEITURA_ID,
        xp_ganho: xpGanho
      }, { transaction: t });

      // Comita a transação para persistir no Postgres
      await t.commit();

      return res.status(201).json({
        mensagem: "Leitura registrada e XP atribuído com sucesso!",
        dados: novaLeitura,
        xp_ganho: xpGanho
      });

    } catch (error) {
      await t.rollback();
      console.error("[leituraController] Erro ao registrar sessão de leitura:", error);
      return res.status(500).json({
        error: "Erro interno ao registrar sessão de leitura.",
        detalhe: error.message
      });
    }
  },

  // ============================================================
  // 2. LISTAR OU CADASTRAR LIVROS DO UTILIZADOR (tab_livros_lidos)
  // ============================================================
  listarLivros: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;
      const livros = await LivrosLidos.findAll({
        where: { usuario_id: usuarioId },
        order: [["id_livro_lido", "DESC"]]
      });
      return res.status(200).json(livros);
    } catch (error) {
      console.error("[leituraController] Erro ao listar livros:", error);
      return res.status(500).json({ error: "Erro interno ao listar livros." });
    }
  },

  cadastrarLivro: async (req, res) => {
    try {
      const { nome_livro, autor, total_pag, data_inicio } = req.body;
      const usuarioId = req.usuario?.id || req.usuarioId;

      if (!nome_livro) {
        return res.status(400).json({ error: "O nome do livro é obrigatório." });
      }

      const novoLivro = await LivrosLidos.create({
        usuario_id: usuarioId,
        nome_livro,
        autor: autor || null,
        total_pag: total_pag ? parseInt(total_pag) : null,
        data_inicio: data_inicio || new Date()
      });

      return res.status(201).json({
        mensagem: "Livro cadastrado com sucesso!",
        livro: novoLivro
      });
    } catch (error) {
      console.error("[leituraController] Erro ao cadastrar livro:", error);
      return res.status(500).json({ error: "Erro interno ao cadastrar livro." });
    }
  },

  // ============================================================
  // 3. HISTÓRICO COMPLETO DE LEITURAS (Com inclusão do nome do livro lido)
  // ============================================================
  obterHistorico: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;

      const historico = await Leitura.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: LivrosLidos,
            as: "livro",
            attributes: ["nome_livro", "autor"]
          }
        ],
        order: [["data_hora", "DESC"]]
      });

      return res.status(200).json(historico);
    } catch (error) {
      console.error("[leituraController] Erro ao buscar histórico de leitura:", error);
      return res.status(500).json({
        error: "Erro interno ao buscar histórico.",
        detalhe: error.message
      });
    }
  }
};

module.exports = leituraController;