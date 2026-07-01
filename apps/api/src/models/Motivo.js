// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: Motivo
// ============================================================
// Responsabilidade: Define a tabela tab_motivo (catálogo de XP)
//
// O que é um Motivo?
// Um motivo é o "por quê" o usuário ganhou XP
// Exemplos:
// - ID 1: "Registro de Água" → 20 XP
// - ID 2: "Arrumar Cama" → 20 XP
// - ID 3: "Meta Hidratação" → 50 XP (bônus)
// - ID 6: "Leitura" → 20 XP
//
// Padrão Arquitetural: Repository (Fowler, 2002)
// Centraliza acesso aos dados de motivos via Sequelize ORM
//
// Por que usar tabela separada?
// → Separação de responsabilidades: XP pode mudar sem alterar logs históricos
// → Auditoria: sabemos exatamente qual era o XP_PADRAO quando foi registrado
// → Manutenção fácil: alterar valor futuro não afeta registros passados
const Motivo = sequelize.define(
  "Motivo",
  {
    // ============================================================
    // motivo_id: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado pelo PostgreSQL
    // Usualmente: 1, 2, 3, 6, 7, etc (não é sequencial devido a deletes)
    // Referenced by: XpLog.id_motivo (Foreign Key)
    motivo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "motivo_id"  // Nome exato na coluna do banco
    },

    // ============================================================
    // nome_motivo: Nome descritivo (texto)
    // ============================================================
    // Exemplos: "Registro de Água", "Leitura", "Meditação"
    // VARCHAR(100) no banco
    // Exibido em logs e relatórios para o usuário
    nome_motivo: {
      type: DataTypes.STRING(100),
      allowNull: false,  // OBRIGATÓRIO
      field: "nome_motivo"
    },

    // ============================================================
    // xp_padrao: Valor de XP padrão para este motivo
    // ============================================================
    // INTEGER no banco: valores típicos 20, 50, 100
    // Quando xpLogController.registrar() é chamado:
    // 1. Recebe id_motivo (ex: 1)
    // 2. Busca Motivo.findByPk(1)
    // 3. Obtém xp_padrao (ex: 20)
    // 4. Registra XpLog com xp_ganho=20
    // NUNCA confia no xp_ganho vindo do frontend!
    xp_padrao: {
      type: DataTypes.INTEGER,
      allowNull: false,  // OBRIGATÓRIO
      field: "xp_padrao"
    },

    // ============================================================
    // descricao: Descrição opcional
    // ============================================================
    // TEXT no banco: pode ter muitas linhas
    // Usado para exibir ao usuário "Por que ganhei XP?"
    // Exemplo: "Por completar sua meta diária de 2 litros de água"
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,  // OPCIONAL
      field: "descricao"
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_motivo",   // Nome EXATO da tabela no PostgreSQL
    timestamps: false           // Não adiciona createdAt/updatedAt (gerenciado manualmente)
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = Motivo;