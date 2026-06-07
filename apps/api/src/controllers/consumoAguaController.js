const ConsumoAgua = require("../models/ConsumoAgua");
const { Op } = require("sequelize");

module.exports = {
  // ========= REGISTRAR CONSUMO DE ÁGUA =========
  async registrarConsumo(req, res) {
    try {
      const usuario_id = req.usuarioId; // Injetado de forma segura pelo seu auth.js
      const { tipo_bebida, quantidade_ml } = req.body;

      if (!quantidade_ml) {
        return res.status(400).json({ erro: "Dados insuficientes (quantidade_ml é obrigatória)." });
      }

      const consumo = await ConsumoAgua.create({
        usuario_id,
        tipo_bebida: tipo_bebida || "Água",
        quantidade_ml
      });

      return res.status(201).json(consumo);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LISTAR CONSUMO DO DIA DE HOJE =========
  async listarConsumoHoje(req, res) {
    try {
      const usuario_id = req.usuarioId;

      // Cria a janela de tempo do dia de hoje (00:00:00 até o momento atual)
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      const consumos = await ConsumoAgua.findAll({
        where: {
          usuario_id,
          data_hora: {
            [Op.gte]: inicioDia
          }
        },
        order: [["data_hora", "DESC"]]
      });

      return res.json(consumos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};