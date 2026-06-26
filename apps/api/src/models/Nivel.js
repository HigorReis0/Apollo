const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Nivel = sequelize.define(
  "Nivel",
  {
    nivel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'nivel_id'
    },
    nome_nivel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nome_nivel'
    },
    xp_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'xp_minimo'
    }
  },
  {
    tableName: "tab_nivel",
    timestamps: false,
  }
);

module.exports = Nivel;