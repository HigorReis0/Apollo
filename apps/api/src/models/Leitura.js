const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Leitura = sequelize.define(
  "Leitura",
  {
    id_leitura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_leitura"
    },
    id_livro_lido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tab_livros_lidos",
        key: "id_livro_lido"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tab_usuario",
        key: "usuario_id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    pag_lidas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "pag_lidas"
    },
    nota_leitura: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "nota_leitura"
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "data_hora"
    }
  },
  {
    tableName: "tab_leitura",
    timestamps: false, // O PostgreSQL controla a inserção de datas de forma nativa nesta tabela
  }
);

module.exports = Leitura;