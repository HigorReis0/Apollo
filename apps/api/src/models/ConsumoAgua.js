const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConsumoAgua = sequelize.define(
  "ConsumoAgua",
  {
    id_consumo_agua: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_consumo_agua"
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitindo null conforme o DDL do banco
      field: "usuario_id"
    },
    tipo_bebida: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "tipo_bebida"
    },
    quantidade_ml: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "quantidade_ml"
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "data_hora"
    }
  },
  {
    tableName: "tab_consumo_agua", // Nome estrito no banco
    timestamps: false
  }
);

module.exports = ConsumoAgua;