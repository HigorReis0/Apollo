// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: XpLog
// ============================================================
// Responsabilidade: Define a tabela tab_xp_log (histórico de gamificação)
//
// O que registra?
// CADA TRANSAÇÃO DE XP É REGISTRADA AQUI
// Nunca é apagado (é um audit trail).
//
// Exemplos:
// | usuario_id | id_motivo | xp_ganho | data_hora |
// |------------|-----------|----------|-----------|
// | 5          | 1         | 20       | 2026-06-30 09:15 |
// | 5          | 6         | 20       | 2026-06-30 14:30 |
// | 5          | 3         | 50       | 2026-06-30 20:00 |
//
// Lógica de pontos:
// - xp_ganho = valor do motivo no banco
// - Nunca confiamos em valor vindo do frontend!
// - xpLogController.registrar() sempre busca Motivo.findByPk()
//
// Time-Series Data:
// Histórico completo permite análise de padrões:
// - "Usuário ganhou mais XP na segunda?"
// - "Qual motivo contribui mais para o total?"
// - "Média de XP por dia"
//
// Relação com outros models:
// - tab_usuario: usuário_id (Foreign Key)
// - tab_motivo: id_motivo (Foreign Key) — define o valor do XP
//
// Crítico: Nunca deletamos registros! (Imutável)
// → Audit trail para compliance
// → Análise histórica
// → Detecção de anomalias
const XpLog = sequelize.define(
  "XpLog",
  {
    // ============================================================
    // id_xp_log: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado
    // Cada transação de XP tem um ID sequencial
    // Serve como referência para auditoria/rollback
    id_xp_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_xp_log'  // Mapeamento direto para a coluna física
    },

    // ============================================================
    // usuario_id: Foreign Key para tab_usuario
    // ============================================================
    // INTEGER no banco (referencia usuario_id em tab_usuario)
    // allowNull: true → conforme DDL (mas idealmente false)
    // De quem é o XP?
    // Permite:
    // 1. Filtrar XP por usuário
    // 2. Calcular saldo total: SUM(xp_ganho) WHERE usuario_id = ?
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tab_usuario',          // Nome da tabela referenciada
        key: 'usuario_id'              // Coluna referenciada
      },
      onUpdate: 'CASCADE',             // Se usuário for atualizado, logs acompanham
      onDelete: 'CASCADE'              // Se usuário for deletado, XP é deletado
    },

    // ============================================================
    // id_motivo: Foreign Key para tab_motivo
    // ============================================================
    // INTEGER no banco (referencia motivo_id em tab_motivo)
    // allowNull: true → conforme DDL (mas idealmente false)
    // QUAL FOI O MOTIVO do XP?
    // Exemplos:
    // - id_motivo=1: "Registro de Água" → 20 XP
    // - id_motivo=6: "Leitura" → 20 XP
    // - id_motivo=3: "Meta Hidratação" → 50 XP
    // Permite:
    // 1. Analytics: "Qual hábito gerou mais XP?"
    // 2. Audit: "Quando foi concedido este XP?"
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tab_motivo',           // Nome da tabela referenciada
        key: 'motivo_id'               // Coluna referenciada
      }
    },

    // ============================================================
    // xp_ganho: Valor do XP registrado
    // ============================================================
    // INTEGER no banco: típicos valores 20, 50, 100, 200
    // OBRIGATÓRIO: sempre deve ter um valor
    // 
    // CRÍTICO: Este valor vem SEMPRE do banco!
    // Fluxo seguro:
    // 1. Frontend envia: POST /xp/registrar { id_motivo: 1 }
    // 2. Backend: Motivo.findByPk(1) → obtém xp_padrao=20
    // 3. Backend: XpLog.create({ ..., xp_ganho: 20 })
    // 4. ✅ Seguro! Cliente não pode enviar xp_ganho: 99999
    //
    // Por que armazenar o valor?
    // → Auditoria: saber exatamente quanto foi concedido
    // → Histórico: se o valor do motivo mudar no futuro, o log não muda
    // → Análise: calcular média/total sem re-queries
    xp_ganho: {
      type: DataTypes.INTEGER,
      allowNull: false,  // OBRIGATÓRIO
      field: 'xp_ganho'  // Alinhado com gamificação do banco
    },

    // ============================================================
    // data_hora: Timestamp de quando foi registrado
    // ============================================================
    // TIMESTAMP no banco
    // Gerado automaticamente pelo banco (DataTypes.NOW)
    // Essencial para:
    // 1. Time-Series Analysis: "quando ganhou XP?"
    // 2. Verificar duplicidade: "já ganhou XP de leitura hoje?"
    // 3. Relatório por período: "XP ganhado este mês"
    // 4. Filtros: "consumo de água nas últimas 24h"
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,    // Hora atual do banco
      field: 'data_hora'              // Timestamp nativo
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_xp_log",                          // Nome EXATO da tabela
    timestamps: false                                  // Não adiciona createdAt/updatedAt
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = XpLog;