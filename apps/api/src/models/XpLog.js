const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const XpLog = sequelize.define(
  "XpLog",
  {
    id_xp_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_xp_log' // Mapeamento direto para a coluna física no PostgreSQL
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tab_usuario',
        key: 'usuario_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tab_motivo',
        key: 'motivo_id'
      },
    },
    xp_ganho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'xp_ganho' // Alinhado com o campo de gamificação do banco de dados
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'data_hora' // Timestamp nativo controlado pelo PostgreSQL
    }
  },
  {
    tableName: "tab_xp_log",
    timestamps: false, // Evita a criação automática de colunas createdAt/updatedAt pelo Sequelize
  }
);

module.exports = XpLog;