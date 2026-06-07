/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

const XpLog = require("../models/XpLog");
const Usuario = require("../models/Usuario");

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ========= CREATE (REGISTRAR NOVO EVENTO DE XP) =========
  async registrar(req, res) {
    try {
      // Extrai o ID protegido do Token (req.usuarioId) e os dados do body
      const usuario_id = req.usuarioId; 
      const { valor_xp, motivo } = req.body;

      if (!usuario_id || valor_xp === undefined || !motivo) {
        return res.status(400).json({ erro: "Dados insuficientes (Requer: valor_xp, motivo no body e Token válido)." });
      }

      const usuarioExiste = await Usuario.findByPk(usuario_id);
      if (!usuarioExiste) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const log = await XpLog.create({ usuario_id, valor_xp, motivo });
      return res.status(201).json(log);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LISTAR LOGS DE UM USUÁRIO (COM PAGINAÇÃO) =========
  async listarPorUsuario(req, res) {
    try {
      // Extrai da requisição autenticada, ignorando req.params
      const usuario_id = req.usuarioId;
      if (!usuario_id) return res.status(401).json({ erro: "Acesso não autorizado." });

      const limite = parseInt(req.query.limite) || 20; 
      const pagina = parseInt(req.query.pagina) || 1;
      const offset = (pagina - 1) * limite;

      const logs = await XpLog.findAndCountAll({
        where: { usuario_id },
        order: [['data_registro', 'DESC']], 
        limit: limite,
        offset: offset
      });

      return res.json({
        total_registros: logs.count,
        total_paginas: Math.ceil(logs.count / limite),
        pagina_atual: pagina,
        dados: logs.rows
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= CÁLCULO DE SALDO TOTAL (AGGREGATION) =========
  async calcularSaldo(req, res) {
    try {
      // PONTO DO ERRO 500: Agora lemos o req.usuarioId do auth.js
      const usuario_id = req.usuarioId;

      if (!usuario_id) return res.status(401).json({ erro: "Acesso não autorizado." });

      const saldo = await XpLog.sum('valor_xp', {
        where: { usuario_id }
      });

      return res.json({ 
        usuario_id, 
        xp_total: saldo || 0 
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= DELETE =========
  async deletar(req, res) {
    try {
      const { id } = req.params;
      
      const log = await XpLog.findByPk(id);
      if (!log) {
        return res.status(404).json({ erro: "Log de XP não encontrado." });
      }

      await log.destroy();
      return res.json({ sucesso: true, mensagem: "Registro de XP revertido com sucesso." });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

};