const { Leitura, LivrosLidos, Usuario } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// ============================================================
// CONTROLLER: relatorioController
// Responsável por consolidar dados de leitura para análise.
// Utiliza funções de agregação SQL (SUM, COUNT, AVG) —
// conceitos centrais de Análise de Dados (Provost & Fawcett, 2016).
// ============================================================
module.exports = {

  // ============================================================
  // MÉTODO: relatorioLeitura
  // Rota: GET /relatorio/leitura
  // Consolida os dados de leitura do usuário logado:
  // - Total de páginas lidas (SUM)
  // - Total de livros registrados (COUNT DISTINCT)
  // - Total de sessões no mês atual (COUNT)
  // - Média de páginas por sessão (AVG)
  // - Progresso em relação à meta mensal
  // - Último livro lido
  // ============================================================
  async relatorioLeitura(req, res) {
    try {
      const usuario_id = req.usuarioId;

      // No início do método, após validar usuario_id:
      const usuario = await Usuario.findByPk(usuario_id, {
        attributes: ["meta_leitura"]
      });
      // Usa a meta de leitura cadastrada pelo usuário, ou 500 páginas como fallback
      const META_MENSAL = usuario?.meta_leitura || 500;

      // Define o intervalo do mês atual para filtrar sessões
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const fimMes = new Date();
      fimMes.setMonth(fimMes.getMonth() + 1);
      fimMes.setDate(0);
      fimMes.setHours(23, 59, 59, 999);

      // ── CONSULTA 1: Total geral de páginas lidas (SUM) ──
      // Soma todas as páginas de todas as sessões do usuário
      const totalPaginasGeral = await Leitura.sum("pag_lidas", {
        where: { usuario_id }
      }) || 0;

      // ── CONSULTA 2: Total de livros registrados (COUNT) ──
      // Conta quantos livros únicos o usuário cadastrou
      const totalLivros = await LivrosLidos.count({
        where: { usuario_id }
      }) || 0;

      // ── CONSULTA 3: Sessões e páginas do mês atual ──
      // Filtra apenas os registros do mês corrente
      const sessoesDoMes = await Leitura.findAll({
        where: {
          usuario_id,
          data_hora: {
            [Op.between]: [inicioMes, fimMes]
          }
        }
      });

      // Total de sessões no mês (COUNT)
      const totalSessoesMes = sessoesDoMes.length;

      // Total de páginas no mês (SUM manual via reduce)
      const totalPaginasMes = sessoesDoMes.reduce(
        (acc, s) => acc + s.pag_lidas, 0
      );

      // ── CONSULTA 4: Média de páginas por sessão (AVG) ──
      // Calcula a média geral de páginas por sessão
      const todasSessoes = await Leitura.findAll({
        where: { usuario_id }
      });

      const totalTodasPaginas = todasSessoes.reduce(
        (acc, s) => acc + s.pag_lidas, 0
      );

      const mediaPorSessao = todasSessoes.length > 0
        ? Math.round(totalTodasPaginas / todasSessoes.length)
        : 0;

      // ── CONSULTA 5: Último livro lido ──
      // Busca o registro de leitura mais recente com JOIN no livro
      const ultimaSessao = await Leitura.findOne({
        where: { usuario_id },
        order: [["data_hora", "DESC"]],
        include: [{
          model: LivrosLidos,
          as: "livro",
          attributes: ["nome_livro", "autor"]
        }]
      });

      const percentualMeta = Math.min(
        Math.round((totalPaginasMes / META_MENSAL) * 100), 100
      );

      // Retorna todos os dados consolidados para o frontend
      return res.json({
        total_paginas_geral: totalPaginasGeral,
        total_livros:        totalLivros,
        total_sessoes_mes:   totalSessoesMes,
        total_paginas_mes:   totalPaginasMes,
        media_por_sessao:    mediaPorSessao,
        meta_mensal:         META_MENSAL,
        percentual_meta:     percentualMeta,
        ultimo_livro: ultimaSessao?.livro ? {
          nome:  ultimaSessao.livro.nome_livro,
          autor: ultimaSessao.livro.autor || "Autor não informado",
          paginas_ultima_sessao: ultimaSessao.pag_lidas
        } : null
      });

    } catch (error) {
      console.error("[relatorioController] Erro:", error);
      return res.status(500).json({ erro: error.message });
    }
  }
};