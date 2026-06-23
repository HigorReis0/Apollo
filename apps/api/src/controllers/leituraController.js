const Leitura = require("../models/Leitura");
const { Op } = require("sequelize");

// ============================================================
// CONTROLLER: leituraController
// Camada de controle do padrão MVC — responsável por receber
// requisições HTTP, coordenar a lógica de negócio e retornar
// respostas padronizadas (Fowler, "Patterns of EAA", 2002).
// ============================================================
module.exports = {

  // ========= REGISTRAR LEITURA =========
  async registrar(req, res) {
    try {
      // usuario_id injetado com segurança pelo authMiddleware (Zero Trust)
      const usuario_id = req.usuarioId;
      const { nome_livro, paginas_lidas, nota } = req.body;

      // Validação de campos obrigatórios — Fail Fast (Shore, 2004)
      if (!nome_livro || !paginas_lidas) {
        return res.status(400).json({
          erro: "Dados insuficientes (nome_livro e paginas_lidas são obrigatórios)."
        });
      }

      // Validação de domínio: páginas devem ser número positivo
      if (paginas_lidas <= 0) {
        return res.status(400).json({
          erro: "paginas_lidas deve ser um número positivo."
        });
      }

      const leitura = await Leitura.create({
        usuario_id,
        nome_livro,
        paginas_lidas,
        nota: nota || null
      });

      return res.status(201).json(leitura);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= HISTÓRICO + TOTAL DO MÊS =========
  async historico(req, res) {
    try {
      const usuario_id = req.usuarioId;

      // Janela temporal do mês atual para cálculo de total
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      // Busca todos os registros ordenados do mais recente para o mais antigo
      const registros = await Leitura.findAll({
        where: { usuario_id },
        order: [["data_registro", "DESC"]]
      });

      // Calcula total de páginas do mês atual
      const registrosMes = registros.filter(r =>
        new Date(r.data_registro) >= inicioMes
      );

      const totalPaginasMes = registrosMes.reduce(
        (acc, r) => acc + r.paginas_lidas, 0
      );

      return res.json({
        registros,
        total_paginas_mes: totalPaginasMes
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};