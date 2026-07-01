// ============================================================
// IMPORTAÇÕES (Models e configuração)
// ============================================================
// Model ConsumoAgua: representa a tabela tab_consumo_agua
const ConsumoAgua = require("../models/ConsumoAgua");

// Model XpLog: representa a tabela tab_xp_log (para registrar XP)
const XpLog = require("../models/XpLog");

// Model Motivo: representa a tabela tab_motivo (catálogo de XP)
const Motivo = require("../models/Motivo");

// Instância do Sequelize (conexão com PostgreSQL)
// Usado aqui para criar TRANSACTIONS ACID
const sequelize = require("../config/database");

// Operadores Sequelize para queries complexas
// Op.gte = "greater than or equal" (>=)
const { Op } = require("sequelize");

// ============================================================
// CONSTANTES DE DOMÍNIO
// ============================================================
// Nunca hardcoded! Valores são centralizados para fácil manutenção
// Referem-se aos IDs na tabela tab_motivo

// ID do motivo "Registro de Água" (20 XP base)
const ID_MOTIVO_REGISTRO_AGUA = 2;

// ID do motivo "Meta Hidratação Batida" (50 XP bônus)
const ID_MOTIVO_META_DIARIA = 3;

// Meta diária de hidratação em mililitros (2 litros)
const META_DIARIA_ML = 2000;

// ============================================================
// CONTROLLER: consumoAguaController
// ============================================================
// Responsabilidade: Gerenciar hidratação com gamificação
// Registra consumos e concede XP de forma ATÔMICA
module.exports = {

  // ============================================================
  // MÉTODO: registrarConsumo
  // Rota: POST /agua/registrar
  // ============================================================
  // O que faz:
  // 1. Registra um consumo de bebida atomicamente
  // 2. Concede XP pelo registro (20 XP)
  // 3. Verifica se atingiu meta (2000ml?)
  // 4. Se sim, concede bônus (50 XP) — mas apenas UMA VEZ por dia
  //
  // POR QUE TRANSACTION ACID?
  // Imagine um servidor que FALHA no meio:
  // - Consumo registrado, mas XP não 
  // - Resultado: usuário vê consumo, mas XP não apareceu!
  //
  // Com Transaction:
  // - Tudo registra (commit) OU nada registra (rollback)
  // - Garantia ACID: Atomicity
  async registrarConsumo(req, res) {

    // ============================================================
    // INICIA TRANSACTION ACID
    // ============================================================
    // Todas as operações SQL abaixo executam em um "bloco" atômico
    // Se qualquer falhar, o ROLLBACK desfaz TUDO
    const t = await sequelize.transaction();

    try {
      // ============================================================
      // EXTRAÇÃO DE DADOS
      // ============================================================
      // usuario_id: vem do middleware de autenticação (JWT validado)
      // Nunca confiamos no ID enviado pelo frontend (Zero Trust)
      const usuario_id = req.usuarioId;

      // tipo_bebida: tipo de bebida (ex: "Água", "Café", "Refrigerante")
      // quantidade_ml: quantidade em mililitros (ex: 200)
      const { tipo_bebida, quantidade_ml } = req.body;

      // ============================================================
      // VALIDAÇÃO FAIL FAST
      // ============================================================
      // Rejeita imediatamente se faltar quantidade_ml
      // É antes do banco, mas ainda dentro da transaction
      if (!quantidade_ml) {
        // Cancela a transaction se a validação falhar
        await t.rollback();
        return res.status(400).json({ 
          erro: "Dados insuficientes (quantidade_ml é obrigatória)." 
        });
      }

      // ============================================================
      // PASSO 1: Registra o consumo na tabela tab_consumo_agua
      // ============================================================
      // INSERT INTO tab_consumo_agua (usuario_id, tipo_bebida, quantidade_ml, data_hora)
      // { transaction: t } = executa DENTRO da transaction
      // Se algum passo abaixo falhar, este INSERT será desfeito
      const consumo = await ConsumoAgua.create({
        usuario_id,
        tipo_bebida: tipo_bebida || "Água",    // Default para "Água" se não informado
        quantidade_ml                           // Quantidade em ml
      }, { transaction: t });                  // ← Executa na transaction!

      // ============================================================
      // PASSO 2: Busca o motivo de XP no banco
      // ============================================================
      // O servidor decide o valor do XP, não o cliente!
      // SELECT * FROM tab_motivo WHERE motivo_id = 1
      // Resultado: { motivo_id: 1, xp_padrao: 20, nome_motivo: "Registro de Água" }
      const motivoRegistro = await Motivo.findByPk(ID_MOTIVO_REGISTRO_AGUA, { 
        transaction: t 
      });
      
      // Validação: motivo existe?
      if (!motivoRegistro) {
        await t.rollback();  // Desfaz o consumo que foi inserido acima
        return res.status(404).json({ 
          erro: "Motivo de XP não encontrado. Verifique a tabela tab_motivo." 
        });
      }

      // ============================================================
      // PASSO 3: Registra o XP na tabela tab_xp_log
      // ============================================================
      // INSERT INTO tab_xp_log (usuario_id, id_motivo, xp_ganho, data_hora)
      // xp_ganho = motivoRegistro.xp_padrao (20, decidido pelo servidor!)
      await XpLog.create({
        usuario_id,
        id_motivo: motivoRegistro.motivo_id,  // ID do motivo
        xp_ganho: motivoRegistro.xp_padrao    // Valor do banco (20 XP)
      }, { transaction: t });                 // ← Executa na transaction!

      // ============================================================
      // PASSO 4: Verifica se o usuário atingiu a meta diária
      // ============================================================
      // Define o início do dia (00:00:00) para filtrar apenas HOJE
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // Soma todos os ml registrados HOJE (INCLUINDO o que acabou de ser inserido)
      // SUM(quantidade_ml) WHERE usuario_id = ? AND data_hora >= 2026-06-30 00:00:00
      const totalHoje = await ConsumoAgua.sum("quantidade_ml", {
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }  // >= hoje meia-noite
        },
        transaction: t
      });

      // Se não há registros, totalHoje é null — fallback para 0
      // CORREÇÃO CRÍTICA: Forçar conversão para número pois Postgres SUM retorna string em bigint/decimal.
      // O consumo atual já está inserido no banco de dados e computado no totalHoje da query acima!
      const totalComAtual = Number(totalHoje) || 0;
      
      // Variáveis para armazenar dados do bônus
      let bonusMeta = null;     // Valor do bônus (null se não concedeu)
      let motivoMeta = null;    // Motivo do bônus (null se não concedeu)
      let bonusConcedidoAgora = false; // Flag de controle explícita para o frontend

      // ============================================================
      // PASSO 5: Se atingiu a meta, concede bônus (UMA VEZ por dia)
      // ============================================================
      // Só processa se o total atingiu ou ultrapassou 2000ml
      if (totalComAtual >= META_DIARIA_ML) {

        // Verifica se o bônus já foi concedido HOJE
        // SELECT * FROM tab_xp_log 
        // WHERE usuario_id = ? AND id_motivo = 3 AND data_hora >= 2026-06-30 00:00:00
        const bonusJaConcedido = await XpLog.findOne({
          where: {
            usuario_id,
            id_motivo: ID_MOTIVO_META_DIARIA,  // ID do motivo bônus
            data_hora: { [Op.gte]: inicioDia }  // Filtra apenas de hoje
          },
          transaction: t
        });

        // Se o bônus ainda NÃO foi concedido hoje, concede agora!
        // Princípio: Idempotência (não fazer 2x o mesmo bônus)
        if (!bonusJaConcedido) {
          
          // Busca o motivo do bônus no banco
          motivoMeta = await Motivo.findByPk(ID_MOTIVO_META_DIARIA, { 
            transaction: t 
          });
          
          // Se o motivo existe, registra o bônus
          if (motivoMeta) {
            // INSERT INTO tab_xp_log (usuario_id, id_motivo, xp_ganho)
            bonusMeta = await XpLog.create({
              usuario_id,
              id_motivo: motivoMeta.motivo_id,   // ID do motivo bônus (3)
              xp_ganho: motivoMeta.xp_padrao     // 50 XP (valor do banco!)
            }, { transaction: t });

            bonusConcedidoAgora = true;
          }
        }
      }

      // ============================================================
      // COMMIT: Tudo deu certo!
      // ============================================================
      // Confirma TODAS as operações acima:
      // - INSERT consumo
      // - INSERT xp_log (registro)
      // - INSERT xp_log (bônus, se aplicável)
      // Tudo persiste no PostgreSQL de uma vez
      await t.commit();

      // ============================================================
      // RETORNO: Sucesso com informações de gamificação
      // ============================================================
      return res.status(201).json({
        consumo,                                           // Consumo registrado
        xp_ganho: motivoRegistro.xp_padrao,               // 20 XP base
        bonus_concedido: bonusConcedidoAgora,             // Flag booleana explícita adicionada
        bonus_meta: bonusMeta && motivoMeta 
          ? motivoMeta.xp_padrao                          // 50 XP bônus (ou null)
          : null,
        mensagem: bonusMeta
          ? "Meta diária atingida! Bônus de XP concedido."
          : "Consumo registrado com sucesso."
      });

    } catch (error) {
      // ============================================================
      // ROLLBACK: Algo deu errado!
      // ============================================================
      // Desfaz TODAS as operações da transaction
      // O banco volta ao estado ANTERIOR a este registrarConsumo
      //
      // Exemplo: Se falhar no PASSO 5:
      // - Consumo inserido no PASSO 1? Desfeito
      // - XP inserido no PASSO 3? Desfeito
      // - Bônus inserido no PASSO 5? Desfeito 
      // Resultado: banco limpo, como se nada tivesse acontecido
      await t.rollback();
      
      // Log detalhado do erro (para debugging)
      console.error("ERRO DETALHADO /agua/registrar:", error);
      
      // Retorna erro para o frontend
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: listarConsumoHoje
  // Rota: GET /agua/hoje
  // ============================================================
  // O que faz:
  // Retorna TODOS os consumos do dia atual + total + percentual
  // Usado pelo frontend para renderizar o histórico e a barra de progresso
  async listarConsumoHoje(req, res) {
    try {
      // usuario_id do middleware de autenticação
      const usuario_id = req.usuarioId;

      // ============================================================
      // Define o início do dia (00:00:00)
      // ============================================================
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // ============================================================
      // Busca todos os consumos de HOJE
      // ============================================================
      // SELECT * FROM tab_consumo_agua 
      // WHERE usuario_id = ? AND data_hora >= 2026-06-30 00:00:00
      // ORDER BY data_hora DESC
      const consumos = await ConsumoAgua.findAll({
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }  // >= hoje meia-noite
        },
        order: [["data_hora", "DESC"]]         // Mais recente primeiro
      });

      // ============================================================
      // Calcula o total do dia (paradigma funcional — reduce)
      // ============================================================
      // reduce: agrega array em um valor único
      // acc = acumulador (começa em 0)
      // c = consumo atual
      // Exemplo: [200, 150, 600] → 950 ml
      const totalMl = consumos.reduce((acc, c) => acc + c.quantidade_ml, 0);

      // ============================================================
      // Retorna os dados formatados para o frontend
      // ============================================================
      return res.json({
        consumos,                                              // Array de consumos
        total_ml: totalMl,                                     // Total em ml
        meta_ml: META_DIARIA_ML,                               // Meta (2000ml)
        percentual: Math.min(                                  // Percentual 0-100%
          Math.round((totalMl / META_DIARIA_ML) * 100),       // Cálculo
          100                                                  // Limitado a 100%
        )
      });

    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: deletarConsumosHoje (NOVO)
  // Rota: DELETE /agua/hoje
  // ============================================================
  /*
    O QUE FAZ?
    - Remove TODOS os consumos de água do dia atual para o usuário.
    - Usado pelo frontend na função "Zerar Registro".
    - Não afeta os logs de XP (apenas os consumos).

    POR QUE ISSO É IMPORTANTE?
    - O "Zerar Registro" no frontend deve ser persistente.
    - Antes, apenas limpava o estado local, mas os dados
      permaneciam no banco.
    - Agora, deleta os registros reais do dia.

    BOA PRÁTICA:
    - Usa o mesmo filtro de data que o listarConsumoHoje.
    - Retorna a quantidade de registros deletados.
  */
  async deletarConsumosHoje(req, res) {
    try {
      const usuario_id = req.usuarioId;

      // Define o início do dia (00:00:00)
      const inicioDia = new Date();
      inicioDia.setHours(0, 0, 0, 0);

      // Deleta todos os consumos de hoje
      const deletados = await ConsumoAgua.destroy({
        where: {
          usuario_id,
          data_hora: { [Op.gte]: inicioDia }
        }
      });

      return res.status(200).json({
        mensagem: `${deletados} registro(s) removido(s) do dia.`,
        deletados
      });
    } catch (error) {
      console.error('[deletarConsumosHoje] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },
};