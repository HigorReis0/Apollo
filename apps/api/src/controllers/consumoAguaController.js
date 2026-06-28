const ConsumoAgua = require("../models/ConsumoAgua");
const XpLog = require("../models/XpLog");
const Motivo = require("../models/Motivo");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

// ============================================================
// CONSTANTES DE DOMÍNIO
// IDs fixos que referenciam registros da tabela tab_motivo.
// Centralizar aqui evita números mágicos espalhados no código
// (princípio Clean Code — Martin, 2008).
// ============================================================
const ID_MOTIVO_REGISTRO_AGUA = 1; // "Registro de Água"     → 20 XP
const ID_MOTIVO_META_DIARIA   = 3; // "Meta Diária Hidratação" → 50 XP
const META_DIARIA_ML          = 2000; // Meta: 2 litros por dia

module.exports = {

  // ============================================================
  // MÉTODO: registrarConsumo
  // Rota: POST /agua/registrar
  // Registra o consumo de água e o XP correspondente de forma
  // atômica usando Transaction ACID do Sequelize + PostgreSQL.
  // Se qualquer etapa falhar, ROLLBACK desfaz tudo — garantindo
  // que nunca haverá consumo sem XP ou XP sem consumo.
  // Princípio: Atomicity do modelo ACID (Gray, 1981).
  // ============================================================
  async registrarConsumo(req, res) {

    // Inicia a transação — todas as operações abaixo fazem parte deste bloco atômico
    const t = await sequelize.transaction();

    try {
      // usuario_id é injetado pelo authMiddleware após validar o JWT
      // Nunca confiamos no ID enviado pelo frontend (Zero Trust)
      const usuario_id = req.usuarioId;

      // Extrai os dados enviados pelo app
      const { tipo_bebida, quantidade_ml } = req.body;

      // Validação Fail Fast: rejeita imediatamente se faltar o campo obrigatório
      if (!quantidade_ml) {
        await t.rollback();
        return res.status(400).json({ erro: "Dados insuficientes (quantidade_ml é obrigatória)." });
      }

      // ── PASSO 1: Registra o consumo na tabela tab_consumo_agua ──
      // Tudo dentro da transaction — se falhar, o ROLLBACK desfaz este INSERT
      const consumo = await ConsumoAgua.create({
        usuario_id,
        tipo_bebida: tipo_bebida || "Água", // Se não informado, assume "Água"
        quantidade_ml
      }, { transaction: t });

      // ── PASSO 2: Busca o motivo de XP no banco ──
      // O servidor busca o xp_padrao — nunca aceitamos o valor vindo do cliente
      // Isso impede que um usuário mal-intencionado envie xp_ganho: 99999
      const motivoRegistro = await Motivo.findByPk(ID_MOTIVO_REGISTRO_AGUA, { transaction: t });
      if (!motivoRegistro) {
        await t.rollback();
        return res.status(404).json({ erro: "Motivo de XP não encontrado. Verifique a tabela tab_motivo." });
      }

      // ── PASSO 3: Registra o XP pelo registro de consumo ──
      // xp_ganho vem do banco (motivoRegistro.xp_padrao), não do frontend
      await XpLog.create({
        usuario_id,
        id_motivo: motivoRegistro.motivo_id,
        xp_ganho:  motivoRegistro.xp_padrao
      }, { transaction: t });

      // ── PASSO 4: Verifica se o usuário atingiu a meta diária ──
      // Define o início do dia atual (meia-noite) para filtrar apenas registros de hoje
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // Soma todos os ml registrados hoje (inclui o consumo que acabou de ser inserido)
      const totalHoje = await ConsumoAgua.sum("quantidade_ml", {
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia } // Op.gte = "greater than or equal" (>=)
        },
        transaction: t
      });

      // Garante que totalHoje nunca seja null (caso seja o primeiro registro do dia)
      const totalComAtual = (totalHoje || 0) + quantidade_ml;
      let bonusMeta = null;
      let motivoMeta = null;

      // Só verifica bônus se o total atual atingiu ou ultrapassou a meta
      if (totalComAtual >= META_DIARIA_ML) {

        // Verifica se o bônus já foi concedido hoje — evita duplicidade
        // data_hora é o nome real da coluna no banco (tab_xp_log)
        const bonusJaConcedido = await XpLog.findOne({
          where: {
            usuario_id,
            id_motivo: ID_MOTIVO_META_DIARIA,
            data_hora: { [Op.gte]: inicioDia } // Filtra apenas registros de hoje
          },
          transaction: t
        });

        // Só concede o bônus se ainda não foi dado hoje (idempotência)
        if (!bonusJaConcedido) {
          motivoMeta = await Motivo.findByPk(ID_MOTIVO_META_DIARIA, { transaction: t });
          if (motivoMeta) {
            bonusMeta = await XpLog.create({
              usuario_id,
              id_motivo: motivoMeta.motivo_id,
              xp_ganho:  motivoMeta.xp_padrao // Bônus de 50 XP vindo do banco
            }, { transaction: t });
          }
        }
      }

      // ── PASSO 5: Commit ──
      // Confirma todas as operações no banco de uma vez
      // Se chegou aqui, tudo deu certo — persiste o consumo + XP + bônus (se houver)
      await t.commit();

      // Retorna resposta com os dados do registro e informações de gamificação
      return res.status(201).json({
        consumo,
        xp_ganho:   motivoRegistro.xp_padrao,
        bonus_meta: bonusMeta && motivoMeta ? motivoMeta.xp_padrao : null,
        mensagem:   bonusMeta
          ? "Meta diária atingida! Bônus de XP concedido."
          : "Consumo registrado com sucesso."
      });

    } catch (error) {
      // ROLLBACK — desfaz todas as operações da transaction em caso de qualquer erro
      // Garante que o banco nunca fique em estado inconsistente
      await t.rollback();
      console.error("ERRO DETALHADO /agua/registrar:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: listarConsumoHoje
  // Rota: GET /agua/hoje
  // Retorna todos os registros de consumo do dia atual junto
  // com o total em ml e o percentual em relação à meta diária.
  // Usado pelo frontend para exibir o progresso na tela.
  // ============================================================
  async listarConsumoHoje(req, res) {
    try {
      const usuario_id = req.usuarioId;

      // Define o início do dia (meia-noite) para filtrar apenas registros de hoje
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // Busca todos os registros de hoje ordenados do mais recente para o mais antigo
      const consumos = await ConsumoAgua.findAll({
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }
        },
        order: [["data_hora", "DESC"]]
      });

      // Calcula o total do dia somando todos os registros (paradigma funcional — reduce)
      const totalMl = consumos.reduce((acc, c) => acc + c.quantidade_ml, 0);

      // Retorna os dados formatados para o frontend renderizar a barra de progresso
      return res.json({
        consumos,
        total_ml:   totalMl,
        meta_ml:    META_DIARIA_ML,
        percentual: Math.min(Math.round((totalMl / META_DIARIA_ML) * 100), 100) // Limitado a 100%
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};