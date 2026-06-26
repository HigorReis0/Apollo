const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LivrosLidos = sequelize.define(
  "LivrosLidos",
  {
    id_livro_lido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_livro_lido"
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
    nome_livro: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "nome_livro"
    },
    autor: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "autor"
    },
    total_pag: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "total_pag"
    },
    data_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "data_inicio"
    },
    data_fim: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "data_fim"
    },
    nota_livro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "nota_livro"
    }
  },
  {
    tableName: "tab_livros_lidos",
    timestamps: false, // O PostgreSQL controla a inserção de datas manualmente nesta tabela
  }
);

module.exports = LivrosLidos;