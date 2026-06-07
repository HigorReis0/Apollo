const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Motivo = sequelize.define(
  "Motivo",
  {
    motivo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "motivo_id"
    },
    nome_motivo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nome_motivo"
    },
    xp_padrao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "xp_padrao"
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "descricao"
    }
  },
  {
    tableName: "tab_motivo",
    timestamps: false
  }
);

module.exports = Motivo;