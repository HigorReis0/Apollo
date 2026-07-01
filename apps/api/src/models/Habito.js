const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// ============================================================
// MODEL: Habito
// Representa a tabela 'tab_habito' no PostgreSQL.
// Armazena o catálogo global de hábitos disponíveis no app —
// são os hábitos que o usuário pode selecionar para sua rotina.
// Padrão de projeto: Repository (Fowler, 2002) — centraliza
// o acesso aos dados de hábitos via Sequelize ORM.
// ============================================================
const Habito = sequelize.define(
  "Habito",
  {
    // Chave primária com auto-incremento — gerada pelo banco
    habito_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Nome do hábito exibido na interface (ex: "Beber Água", "Meditar")
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Descrição detalhada do hábito — exibida na tela de seleção
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // XP base concedido ao concluir este hábito
    // Valor padrão de 10 XP definido no banco
    xp_base: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    // URL do ícone do hábito — exibido na interface mobile
    icone_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // Timestamp de criação do hábito no catálogo
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "tab_habito", // nome real da tabela no banco
    timestamps: false,       // gerenciado manualmente via created_at
  }
);

module.exports = Habito;