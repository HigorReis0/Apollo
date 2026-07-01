const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// ============================================================
// MODEL: UsuarioHabito
// Representa a tabela 'tab_habito_usuario' no PostgreSQL.
// É a tabela de junção (Junction Table) entre tab_usuario e
// tab_habito — registra quais hábitos cada usuário executou
// e quando. Padrão Many-to-Many (Silberschatz et al., 2019).
// ============================================================
const UsuarioHabito = sequelize.define(
  "UsuarioHabito",
  {
    // Chave primária com auto-incremento — gerada pelo banco
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Foreign Key para tab_usuario — identifica o usuário
    // onDelete CASCADE: se o usuário for deletado, seus registros somem
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'tab_usuario', key: 'usuario_id' },
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },

    // Foreign Key para tab_habito — identifica o hábito executado
    // onDelete CASCADE: se o hábito for removido do catálogo, os registros somem
    habito_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'tab_habito', key: 'habito_id' },
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },

    // Timestamp de quando o hábito foi executado
    // Essencial para análise de séries temporais (Time-Series Data)
    data_execucao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },

    // Status da execução — padrão 'concluido' conforme definido no banco
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'concluido',
    }
  },
  {
    tableName: "tab_habito_usuario", // nome real da tabela no banco
    timestamps: false,               // gerenciado manualmente via data_execucao
  }
);

module.exports = UsuarioHabito;