// Importa DataTypes para tipagem rigorosa das colunas (Sequelize ORM)
const { DataTypes } = require("sequelize");
// Conexão Singleton com o banco — Padrão de Projeto GoF (Gamma et al., 1994)
const sequelize = require("../config/database");

// ============================================================
// MODEL: Leitura
// Representa a tabela 'tab_leitura' no PostgreSQL.
// Mapeamento Objeto-Relacional via Sequelize ORM —
// abstração da camada de persistência (Fowler, 2002).
// ============================================================
const Leitura = sequelize.define(
  "Leitura",
  {
    id_leitura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Foreign Key — integridade referencial com tab_usuario
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_usuario',
        key: 'usuario_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Ao deletar usuário, remove seus registros de leitura
    },

    // Nome do livro lido
    nome_livro: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // Quantidade de páginas lidas na sessão
    paginas_lidas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Nota/observação opcional sobre a leitura
    nota: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Timestamp do registro — Time-Series Data para análise futura
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "tab_leitura",
    timestamps: false, // Gerenciado manualmente via data_registro
  }
);

module.exports = Leitura;