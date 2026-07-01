// ============================================================
// IMPORTAÇÕES (Models e Sequelize)
// ============================================================
// Desestrutura múltiplos models de uma só vez
// Leitura: representa tab_leitura (sessões de leitura)
// LivrosLidos: representa tab_livros_lidos (catálogo de livros)
// XpLog: representa tab_xp_log (para registrar XP)
// Motivo: representa tab_motivo (catálogo de XP)
// sequelize: instância do ORM (para transactions)
const { Leitura, LivrosLidos, XpLog, Motivo, sequelize } = require("../models");

// ============================================================
// CONSTANTES
// ============================================================
// ID fixo do motivo de XP para leitura (deve existir em tab_motivo)
// Exemplo: id=6, xp_padrao=20, nome_motivo="Leitura"
const MOTIVO_LEITURA_ID = 6;

// ============================================================
// CONTROLLER: leituraController
// ============================================================
// Responsabilidade: Gerenciar tudo relacionado a leitura
// - Registrar sessões de leitura (+ XP)
// - Cadastrar novos livros
// - Listar livros e histórico do usuário
// - Buscar dados com JOINs (include)
const leituraController = {

  // ============================================================
  // MÉTODO 1: registrarSessao
  // Rota: POST /leitura/registrar
  // ============================================================
  // O que faz:
  // 1. Recebe nome_livro OU id_livro_lido
  // 2. Se nome_livro: busca livro existente, ou cria novo
  // 3. Registra a sessão de leitura (quantas páginas lidas?)
  // 4. Registra o XP (20 XP por padrão)
  // 5. Tudo em uma TRANSACTION ACID
  //
  // Padrão: Auto-criação de recursos
  // Se o livro não existe, criamos automaticamente (conveniente!)
  registrarSessao: async (req, res) => {
    
    // Inicia transação ACID
    const t = await sequelize.transaction();
    
    try {
      // ============================================================
      // EXTRAÇÃO DOS DADOS
      // ============================================================
      const { nome_livro, paginas_lidas, nota, id_livro_lido, autor } = req.body;
      
      // Log para debugging
      console.log('[leituraController] req.body recebido:', req.body);
      
      // Obtém o ID do usuário do middleware de autenticação
      // req.usuario?.id = tentativa com novo padrão, fallback para req.usuarioId
      const usuarioId = req.usuario?.id || req.usuarioId;

      // ============================================================
      // VALIDAÇÃO 1: Usuário autenticado?
      // ============================================================
      if (!usuarioId) {
        return res.status(401).json({ 
          error: "Usuário não autenticado." 
        });
      }

      // ============================================================
      // VALIDAÇÃO 2: nome_livro OU id_livro_lido?
      // ============================================================
      // Pelo menos um deve estar presente
      if (!id_livro_lido && !nome_livro) {
        return res.status(400).json({ 
          error: "É necessário informar id_livro_lido ou nome_livro." 
        });
      }

      // ============================================================
      // VALIDAÇÃO 3: paginas_lidas é válido?
      // ============================================================
      // Converte string para número
      const paginas = parseInt(paginas_lidas);
      // Valida: deve ser número positivo
      if (!paginas_lidas || isNaN(paginas) || paginas <= 0) {
        return res.status(400).json({ 
          error: "paginas_lidas deve ser um número positivo." 
        });
      }

      // ============================================================
      // RESOLVE O LIVRO: busca existente ou cria novo
      // ============================================================
      // Esta lógica permite dois fluxos diferentes:
      // 1. Por nome_livro (frontend envia nome, backend cria se não existir)
      // 2. Por id_livro_lido (livro já existe no banco)
      
      let livroId = id_livro_lido; // Inicialmente, usa o ID enviado (se houver)

      // ── CASO 1: Frontend enviou nome_livro (fluxo mais comum) ──
      if (!livroId && nome_livro) {
        
        // Tenta encontrar um livro com esse nome do usuário
        // SELECT * FROM tab_livros_lidos 
        // WHERE usuario_id = ? AND nome_livro = ?
        let livro = await LivrosLidos.findOne({
          where: { 
            usuario_id: usuarioId, 
            nome_livro: nome_livro.trim()  // Remove espaços extras
          },
          transaction: t  // Executa dentro da transaction
        });

        // Se o livro NÃO existe, cria novo
        if (!livro) {
          // INSERT INTO tab_livros_lidos (usuario_id, nome_livro, autor, total_pag, data_inicio)
          livro = await LivrosLidos.create({
            usuario_id: usuarioId,
            nome_livro: nome_livro.trim(),
            autor: autor || null,            // ✅ NOVO: captura o autor!
            total_pag: null,                 // Opcional: pode ser atualizado depois
            data_inicio: new Date()          // Data atual
          }, { transaction: t });            // Tudo na transaction
        } 
        // Se o livro EXISTE, mas não tem autor
        else {
          // ============================================================
          // ATUALIZA O AUTOR se o livro já existir e não tiver autor
          // ============================================================
          // Padrão: só atualiza se o novo valor não é vazio
          if (autor && autor.trim() && !livro.autor) {
            // UPDATE tab_livros_lidos SET autor = ? WHERE id_livro_lido = ?
            await livro.update(
              { autor: autor.trim() },
              { transaction: t }
            );
          }
        }

        // Usa o ID do livro (novo ou existente)
        livroId = livro.id_livro_lido;
      } 
      
      // ── CASO 2: Frontend enviou id_livro_lido (compatibilidade versão antiga) ──
      else if (livroId) {
        
        // Verifica se o livro existe e pertence ao usuário
        // SELECT * FROM tab_livros_lidos 
        // WHERE id_livro_lido = ? AND usuario_id = ?
        const livroExistente = await LivrosLidos.findOne({
          where: { 
            id_livro_lido: livroId, 
            usuario_id: usuarioId 
          },
          transaction: t
        });
        
        if (!livroExistente) {
          return res.status(404).json({ 
            error: "Livro não encontrado ou não pertence a este usuário." 
          });
        }

        // ============================================================
        // ATUALIZA O AUTOR se for enviado
        // ============================================================
        if (autor && autor.trim() && !livroExistente.autor) {
          await livroExistente.update(
            { autor: autor.trim() },
            { transaction: t }
          );
        }
      }

      // ============================================================
      // CRIA A SESSÃO DE LEITURA (tab_leitura)
      // ============================================================
      // INSERT INTO tab_leitura (id_livro_lido, usuario_id, pag_lidas, nota_leitura, data_hora)
      const novaLeitura = await Leitura.create({
        id_livro_lido: livroId,           // Chave estrangeira → tab_livros_lidos
        usuario_id: usuarioId,            // Chave estrangeira → tab_usuario
        pag_lidas: paginas,               // Páginas lidas nesta sessão
        nota_leitura: nota || null        // Nota/reflexão (opcional)
      }, { transaction: t });

      // ============================================================
      // REGISTRA O XP (tab_xp_log)
      // ============================================================
      // Busca o motivo de leitura no banco
      // SELECT * FROM tab_motivo WHERE motivo_id = 6
      const motivo = await Motivo.findByPk(MOTIVO_LEITURA_ID, { transaction: t });
      
      // xp_ganho do banco, com fallback para 20 se motivo não existir
      const xpGanho = motivo ? motivo.xp_padrao : 20;

      // INSERT INTO tab_xp_log (usuario_id, id_motivo, xp_ganho)
      await XpLog.create({
        usuario_id: usuarioId,
        id_motivo: MOTIVO_LEITURA_ID,     // ID do motivo "Leitura"
        xp_ganho: xpGanho                 // 20 XP (ou valor do banco)
      }, { transaction: t });

      // ============================================================
      // COMMIT: Tudo deu certo!
      // ============================================================
      // Persiste: leitura + XP + livro (se criado)
      await t.commit();

      // Retorna sucesso com os dados
      return res.status(201).json({
        mensagem: "Leitura registrada e XP atribuído com sucesso!",
        dados: novaLeitura,
        xp_ganho: xpGanho
      });

    } catch (error) {
      // ROLLBACK em caso de erro
      await t.rollback();
      console.error("[leituraController] Erro ao registrar sessão:", error);
      return res.status(500).json({
        error: "Erro interno ao registrar sessão de leitura.",
        detalhe: error.message
      });
    }
  },

  // ============================================================
  // MÉTODO 2: listarLivros
  // Rota: GET /leitura/livros
  // ============================================================
  // O que faz: Retorna todos os livros cadastrados do usuário
  listarLivros: async (req, res) => {
    try {
      // usuario_id do middleware
      const usuarioId = req.usuario?.id || req.usuarioId;
      
      // SELECT * FROM tab_livros_lidos WHERE usuario_id = ?
      // ORDER BY id_livro_lido DESC (mais recentes primeiro)
      const livros = await LivrosLidos.findAll({
        where: { usuario_id: usuarioId },
        order: [["id_livro_lido", "DESC"]]  // Mais recentes primeiro
      });
      
      return res.status(200).json(livros);
      
    } catch (error) {
      console.error("[leituraController] Erro ao listar livros:", error);
      return res.status(500).json({ 
        error: "Erro interno ao listar livros." 
      });
    }
  },

  // ============================================================
  // MÉTODO 3: cadastrarLivro
  // Rota: POST /leitura/livro
  // ============================================================
  // O que faz: Cadastra um novo livro manualmente (sem sessão de leitura)
  cadastrarLivro: async (req, res) => {
    try {
      // Dados do livro
      const { nome_livro, autor, total_pag, data_inicio } = req.body;
      const usuarioId = req.usuario?.id || req.usuarioId;

      // Validação: nome é obrigatório
      if (!nome_livro) {
        return res.status(400).json({ 
          error: "O nome do livro é obrigatório." 
        });
      }

      // INSERT INTO tab_livros_lidos (usuario_id, nome_livro, autor, total_pag, data_inicio)
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
      return res.status(500).json({ 
        error: "Erro interno ao cadastrar livro." 
      });
    }
  },

  // ============================================================
  // MÉTODO 4: obterHistorico
  // Rota: GET /leitura/historico
  // ============================================================
  // O que faz:
  // Retorna todas as sessões de leitura com os dados do livro inclusos
  // Usa INCLUDE (JOIN) para trazer dados do livro na mesma query
  // Paradigma SQL: SELECT * FROM tab_leitura 
  //               JOIN tab_livros_lidos ON ...
  //               WHERE usuario_id = ?
  obterHistorico: async (req, res) => {
    try {
      // usuario_id do middleware
      const usuarioId = req.usuario?.id || req.usuarioId;

      // Busca todas as leituras com os dados do livro inclusos
      // include: realizar um JOIN com LivrosLidos
      // as: "livro" = alias definido no model Leitura (define a chave no retorno)
      // attributes: campos específicos que queremos do livro (evita trazer tudo)
      const historico = await Leitura.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: LivrosLidos,               // Modelo para fazer JOIN
            as: "livro",                      // Alias (usado na resposta JSON)
            attributes: ["nome_livro", "autor"]  // Campos específicos
          }
        ],
        order: [["data_hora", "DESC"]]       // Mais recentes primeiro
      });

      // Retorna o histórico com dados dos livros inclusos
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

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o controller para usar nas rotas
// Exemplo: routes.post('/leitura/registrar', leituraController.registrarSessao)
module.exports = leituraController;