// ============================================================
// IMPORTAÇÕES: Models e Sequelize
// ============================================================
const { Leitura, LivrosLidos, XpLog, Motivo, sequelize } = require("../models");

// ID fixo do motivo de XP para leitura (deve existir na tabela tab_motivo)
const MOTIVO_LEITURA_ID = 6;

// ============================================================
// CONTROLLER: leituraController
// Gerencia as operações relacionadas à leitura: registrar sessões,
// cadastrar livros, listar histórico, etc.
// ============================================================
const leituraController = {

  // ============================================================
  // 1. REGISTRAR SESSÃO DE LEITURA
  //    - Aceita nome_livro (cria/usa livro automaticamente) ou id_livro_lido
  //    - Transação ACID para garantir integridade (leitura + XP)
  // ============================================================
  registrarSessao: async (req, res) => {
    // Inicia uma transação no banco (tudo ou nada)
    const t = await sequelize.transaction();
    try {
      // Extrai os dados do corpo da requisição
      // O front pode enviar nome_livro (string) OU id_livro_lido (number)
      const { nome_livro, paginas_lidas, nota, id_livro_lido } = req.body;
      console.log('[leituraController] req.body recebido:', req.body);
      
      // Obtém o ID do usuário (vem do middleware de autenticação)
      const usuarioId = req.usuario?.id || req.usuarioId;

      // ============================================================
      // VALIDAÇÕES INICIAIS
      // ============================================================

      // Usuário precisa estar autenticado
      if (!usuarioId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      // Valida se o front enviou pelo menos nome_livro ou id_livro_lido
      if (!id_livro_lido && !nome_livro) {
        return res.status(400).json({ 
          error: "É necessário informar id_livro_lido ou nome_livro." 
        });
      }

      // Valida se as páginas lidas são um número positivo
      const paginas = parseInt(paginas_lidas);
      if (!paginas_lidas || isNaN(paginas) || paginas <= 0) {
        return res.status(400).json({ error: "paginas_lidas deve ser um número positivo." });
      }

      // ============================================================
      // RESOLVE O LIVRO: busca existente ou cria novo
      // ============================================================

      let livroId = id_livro_lido; // Inicialmente, usa o ID enviado (se houver)

      // Caso 1: O front enviou nome_livro (fluxo mais comum)
      if (!livroId && nome_livro) {
        // Tenta encontrar um livro com esse nome para o usuário
        let livro = await LivrosLidos.findOne({
          where: { 
            usuario_id: usuarioId, 
            nome_livro: nome_livro.trim() // Remove espaços extras
          }
        });

        // Se não existir, cria um novo registro na tabela tab_livros_lidos
        if (!livro) {
          livro = await LivrosLidos.create({
            usuario_id: usuarioId,
            nome_livro: nome_livro.trim(),
            autor: null,           // Opcional: pode ser preenchido depois
            total_pag: null,       // Opcional: pode ser atualizado depois
            data_inicio: new Date() // Data atual
          }, { transaction: t });   // Tudo dentro da transação
        }

        livroId = livro.id_livro_lido; // Usa o ID do livro (existente ou novo)
      } 
      // Caso 2: O front enviou id_livro_lido (compatibilidade com versões antigas)
      else if (livroId) {
        // Verifica se o livro existe e pertence ao usuário
        const livroExistente = await LivrosLidos.findOne({
          where: { id_livro_lido: livroId, usuario_id: usuarioId }
        });
        if (!livroExistente) {
          return res.status(404).json({ error: "Livro não encontrado ou não pertence a este usuário." });
        }
      }

      // ============================================================
      // CRIA A SESSÃO DE LEITURA (tab_leitura)
      // ============================================================

      const novaLeitura = await Leitura.create({
        id_livro_lido: livroId,          // Chave estrangeira para o livro
        usuario_id: usuarioId,           // Chave estrangeira para o usuário
        pag_lidas: paginas,              // Número de páginas lidas
        nota_leitura: nota || null       // Nota/reflexão (opcional)
      }, { transaction: t });

      // ============================================================
      // REGISTRA O XP (tab_xp_log)
      // ============================================================

      // Busca o motivo de XP "Leitura" no banco (id = 6)
      const motivo = await Motivo.findByPk(MOTIVO_LEITURA_ID);
      const xpGanho = motivo ? motivo.xp_padrao : 20; // Fallback: 20 XP

      // Cria o log de XP
      await XpLog.create({
        usuario_id: usuarioId,
        id_motivo: MOTIVO_LEITURA_ID,
        xp_ganho: xpGanho
      }, { transaction: t });

      // ============================================================
      // FINALIZA A TRANSAÇÃO (COMMIT)
      // ============================================================

      await t.commit(); // Persiste tudo no banco

      // Retorna sucesso com os dados da leitura e o XP ganho
      return res.status(201).json({
        mensagem: "Leitura registrada e XP atribuído com sucesso!",
        dados: novaLeitura,
        xp_ganho: xpGanho
      });

    } catch (error) {
      // Em caso de erro, desfaz tudo (ROLLBACK)
      await t.rollback();
      console.error("[leituraController] Erro ao registrar sessão:", error);
      return res.status(500).json({
        error: "Erro interno ao registrar sessão de leitura.",
        detalhe: error.message
      });
    }
  },

  // ============================================================
  // 2. LISTAR LIVROS DO USUÁRIO
  // ============================================================
  listarLivros: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;
      const livros = await LivrosLidos.findAll({
        where: { usuario_id: usuarioId },
        order: [["id_livro_lido", "DESC"]] // Mais recentes primeiro
      });
      return res.status(200).json(livros);
    } catch (error) {
      console.error("[leituraController] Erro ao listar livros:", error);
      return res.status(500).json({ error: "Erro interno ao listar livros." });
    }
  },

  // ============================================================
  // 3. CADASTRAR UM NOVO LIVRO
  // ============================================================
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
  // 4. OBTER HISTÓRICO COMPLETO DE LEITURAS
  // ============================================================
  obterHistorico: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id || req.usuarioId;

      const historico = await Leitura.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: LivrosLidos,
            as: "livro",           // Nome do alias definido no model
            attributes: ["nome_livro", "autor"] // Campos que queremos incluir
          }
        ],
        order: [["data_hora", "DESC"]] // Mais recentes primeiro
      });

      return res.status(200).json(historico);
    } catch (error) {
      console.error("[leituraController] Erro ao buscar histórico:", error);
      return res.status(500).json({
        error: "Erro interno ao buscar histórico.",
        detalhe: error.message
      });
    }
  }
};

// Exporta o controller para uso nas rotas
module.exports = leituraController;