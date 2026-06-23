/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

const XpLog = require("../models/XpLog");
const Usuario = require("../models/Usuario");
const Motivo = require("../models/Motivo");

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ========= CREATE (REGISTRAR NOVO EVENTO DE XP) =========
  async registrar(req, res) {
  try {
    const usuario_id = req.usuarioId;
    const { id_motivo } = req.body;

    // Valida se os dados necessários foram enviados
    if (!usuario_id || !id_motivo) {
      return res.status(400).json({ erro: "Dados insuficientes (Requer: id_motivo no body e Token válido)." });
    }

    // Verifica se o usuário existe
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    if (!usuarioExiste) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Busca o motivo no banco para obter o xp_padrao e o nome
    const motivoEncontrado = await Motivo.findByPk(id_motivo);
    if (!motivoEncontrado) {
      return res.status(404).json({ erro: "Motivo de XP não encontrado." });
    }

    // Cria o log usando os valores vindos do banco, não do frontend
    const log = await XpLog.create({
      usuario_id,
      id_motivo,
      valor_xp: motivoEncontrado.xp_padrao,
      motivo: motivoEncontrado.nome_motivo
    });

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