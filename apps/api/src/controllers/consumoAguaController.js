const ConsumoAgua = require("../models/ConsumoAgua");
const XpLog = require("../models/XpLog");
const Motivo = require("../models/Motivo");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// IDs fixos da tabela tab_motivo — devem bater com os registros inseridos no banco
const ID_MOTIVO_REGISTRO_AGUA = 1;
const ID_MOTIVO_META_DIARIA   = 2;
const META_DIARIA_ML          = 2000;

module.exports = {

  // ========= REGISTRAR CONSUMO + XP (OPERAÇÃO ATÔMICA) =========
  async registrarConsumo(req, res) {
    // Inicia a transaction — garante atomicidade (princípio ACID)
    const t = await sequelize.transaction();

    try {
      const usuario_id = req.usuarioId;
      const { tipo_bebida, quantidade_ml } = req.body;

      if (!quantidade_ml) {
        await t.rollback();
        return res.status(400).json({ erro: "Dados insuficientes (quantidade_ml é obrigatória)." });
      }

      // PASSO 1: Registra o consumo de água dentro da transaction
      const consumo = await ConsumoAgua.create({
        usuario_id,
        tipo_bebida: tipo_bebida || "Água",
        quantidade_ml
      }, { transaction: t });

      // PASSO 2: Busca o motivo de registro de água no banco
      const motivoRegistro = await Motivo.findByPk(ID_MOTIVO_REGISTRO_AGUA, { transaction: t });
      if (!motivoRegistro) {
        await t.rollback();
        return res.status(404).json({ erro: "Motivo de XP não encontrado. Verifique a tabela tab_motivo." });
      }

      // PASSO 3: Registra o XP pelo registro de água
      await XpLog.create({
        usuario_id,
        id_motivo: motivoRegistro.motivo_id,
        valor_xp:  motivoRegistro.xp_padrao,
        motivo:    motivoRegistro.nome_motivo
      }, { transaction: t });

      // PASSO 4: Verifica se o usuário bateu a meta diária de 2000ml
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      const totalHoje = await ConsumoAgua.sum("quantidade_ml", {
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }
        },
        transaction: t
      });

      // Total inclui o consumo que acabou de ser inserido
      const totalComAtual = (totalHoje || 0) + quantidade_ml;
      let bonusMeta = null;

      if (totalComAtual >= META_DIARIA_ML) {
        // Verifica se já ganhou o bônus hoje para não duplicar
        const bonusJaConcedido = await XpLog.findOne({
          where: {
            usuario_id,
            id_motivo: ID_MOTIVO_META_DIARIA,
            data_registro: { [Op.gte]: inicioDia }
          },
          transaction: t
        });

        if (!bonusJaConcedido) {
          const motivoMeta = await Motivo.findByPk(ID_MOTIVO_META_DIARIA, { transaction: t });
          if (motivoMeta) {
            bonusMeta = await XpLog.create({
              usuario_id,
              id_motivo: motivoMeta.motivo_id,
              valor_xp:  motivoMeta.xp_padrao,
              motivo:    motivoMeta.nome_motivo
            }, { transaction: t });
          }
        }
      }

      // PASSO 5: Commit — confirma todas as operações no banco
      await t.commit();

      return res.status(201).json({
        consumo,
        xp_ganho:   motivoRegistro.xp_padrao,
        bonus_meta: bonusMeta ? motivoMeta.xp_padrao : null,
        mensagem:   bonusMeta ? "Meta diária atingida! Bônus de XP concedido." : "Consumo registrado com sucesso."
      });

    } catch (error) {
      // Rollback — desfaz tudo se qualquer passo falhar
      await t.rollback();
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LISTAR CONSUMO DO DIA DE HOJE =========
  async listarConsumoHoje(req, res) {
    try {
      const usuario_id = req.usuarioId;

      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      const consumos = await ConsumoAgua.findAll({
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }
        },
        order: [["data_hora", "DESC"]]
      });

      // Calcula o total do dia para o frontend exibir o progresso
      const totalMl = consumos.reduce((acc, c) => acc + c.quantidade_ml, 0);

      return res.json({
        consumos,
        total_ml:    totalMl,
        meta_ml:     META_DIARIA_ML,
        percentual:  Math.min(Math.round((totalMl / META_DIARIA_ML) * 100), 100)
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};