const XpLog = require("../models/XpLog");
const Usuario = require("../models/Usuario");
const Motivo = require("../models/Motivo");

// ============================================================
// CONTROLLER: xpLogController
// Camada de controle do padrão MVC responsável pela
// gamificação — registra, consulta e gerencia o XP dos
// usuários. Segue o princípio Fail Fast (Shore, 2004):
// valida entradas antes de qualquer operação no banco.
// ============================================================
module.exports = {

  // ========= REGISTRAR XP =========
  // Recebe id_motivo do frontend, busca o xp_padrao no banco
  // e cria o log — o cliente NUNCA define o valor do XP
  // (Security by Design / Zero Trust Architecture)
  async registrar(req, res) {
    try {
      const usuario_id = req.usuarioId; // injetado pelo authMiddleware
      const { id_motivo } = req.body;

      // Validação Fail Fast — rejeita antes de tocar o banco
      if (!usuario_id || !id_motivo) {
        return res.status(400).json({
          erro: "Dados insuficientes (id_motivo no body e Token válido são obrigatórios)."
        });
      }

      // Verifica existência do usuário — integridade referencial
      const usuarioExiste = await Usuario.findByPk(usuario_id);
      if (!usuarioExiste) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      // Busca o motivo no banco para obter o xp_padrao
      // O servidor decide o valor — nunca o cliente
      const motivoEncontrado = await Motivo.findByPk(id_motivo);
      if (!motivoEncontrado) {
        return res.status(404).json({
          erro: "Motivo de XP não encontrado. Verifique a tabela tab_motivo."
        });
      }

      // Cria o registro usando xp_ganho (nome real da coluna no banco)
      const log = await XpLog.create({
        usuario_id,
        id_motivo: motivoEncontrado.motivo_id,
        xp_ganho: motivoEncontrado.xp_padrao, // valor vem do banco, não do frontend
      });

      return res.status(201).json(log);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= CALCULAR SALDO DE XP COM NÍVEL =========
async calcularSaldo(req, res) {
  try {
    const usuarioId = req.usuarioId; // Vem do middleware auth

    // 1. Soma total de XP
    const totalXp = await XpLog.sum('xp_ganho', {
      where: { usuario_id: usuarioId }
    }) || 0;

    // 2. Buscar modelo Nivel (precisa ser importado)
    const Nivel = require('../models/Nivel');
    const { Op } = require('sequelize');

    // 3. Nível atual (maior xp_minimo <= totalXp)
    const nivelAtual = await Nivel.findOne({
      where: {
        xp_minimo: { [Op.lte]: totalXp }
      },
      order: [['xp_minimo', 'DESC']],
      attributes: ['nivel_id', 'nome_nivel', 'xp_minimo']
    });

    // 4. Próximo nível (menor xp_minimo > totalXp)
    const proximoNivel = await Nivel.findOne({
      where: {
        xp_minimo: { [Op.gt]: totalXp }
      },
      order: [['xp_minimo', 'ASC']],
      attributes: ['xp_minimo']
    });

    return res.json({
      total_xp: totalXp,
      nivel_atual: nivelAtual ? nivelAtual.nome_nivel : 'Iniciante',
      nivel_id: nivelAtual ? nivelAtual.nivel_id : null,
      xp_proximo_nivel: proximoNivel ? proximoNivel.xp_minimo : null
    });

  } catch (error) {
    console.error('Erro ao calcular saldo:', error);
    return res.status(500).json({ erro: error.message });
  }
},

  // ========= HISTÓRICO PAGINADO =========
  // Retorna os logs ordenados do mais recente para o mais antigo
  async listarPorUsuario(req, res) {
    try {
      const { usuario_id } = req.params;

      const logs = await XpLog.findAll({
        where: { usuario_id },
        order: [["data_hora", "DESC"]], // Time-Series: mais recente primeiro
      });

      return res.json(logs);

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= DELETAR LOG =========
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const log = await XpLog.findByPk(id);
      if (!log) {
        return res.status(404).json({ erro: "Log não encontrado." });
      }

      await log.destroy();
      return res.status(200).json({ mensagem: "Log removido com sucesso." });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};