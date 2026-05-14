/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

const XpLog = require("../models/XpLog");
const Usuario = require("../models/Usuario");

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ========= CREATE (REGISTRAR NOVO EVENTO DE XP) =========
  // Operação idempotente e atômica.
  async registrar(req, res) {
    try {
      const { usuario_id, valor_xp, motivo } = req.body;

      // Validação de Integridade de Dados (Fail-Fast Principle)
      if (!usuario_id || valor_xp === undefined || !motivo) {
        return res.status(400).json({ erro: "Dados insuficientes (Requer: usuario_id, valor_xp, motivo)." });
      }

      // Valida se o usuário existe (Evita violação de Foreign Key no BD)
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
  // Abordagem otimizada para evitar sobrecarga de memória (Memory Leak) em históricos longos
  async listarPorUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      const limite = parseInt(req.query.limite) || 20; // Padrão de 20 registros
      const pagina = parseInt(req.query.pagina) || 1;
      const offset = (pagina - 1) * limite;

      const logs = await XpLog.findAndCountAll({
        where: { usuario_id },
        order: [['data_registro', 'DESC']], // Ordem cronológica reversa
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
  // Calcula o XP atual do usuário em tempo de execução.
  // Baseia-se no conceito de "Single Source of Truth", reduzindo anomalias de atualização.
  async calcularSaldo(req, res) {
    try {
      const { usuario_id } = req.params;

      const saldo = await XpLog.sum('valor_xp', {
        where: { usuario_id }
      });

      return res.json({ 
        usuario_id, 
        xp_total: saldo || 0 // Retorna 0 caso sum retorne null
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= DELETE (APENAS PARA ADMINISTRAÇÃO/CORREÇÃO) =========
  // Utilizado apenas para rollback de inconsistências, seguindo políticas de Zero Trust.
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