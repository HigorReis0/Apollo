const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// ============================================================
// MODEL: Usuario
// Representa a tabela 'tab_usuario' no PostgreSQL.
// Centraliza o mapeamento objeto-relacional dos dados do usuário
// via Sequelize ORM (Fowler, "Patterns of EAA", 2002).
// ============================================================
const Usuario = sequelize.define(
  "Usuario",
  {
    // Chave primária com auto-incremento — gerada pelo banco
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Nome completo do usuário
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // URL da foto de perfil — pode ser null se não enviou avatar
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Email único — usado como identificador de login
    // Constraint UNIQUE garantida no banco e no Sequelize
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    // Senha com hash bcrypt — null para usuários que usam Google OAuth2
    senha: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // ID do Google — preenchido apenas para login via Google OAuth2
    // null para usuários com cadastro manual
    google_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },

    // ============================================================
    // NOVOS CAMPOS DE DADOS PESSOAIS
    // Adicionados via ALTER TABLE na tab_usuario
    // Permitem exibir e editar informações pessoais na tela de perfil
    // ============================================================

    // Data de nascimento — usada para calcular a idade dinamicamente no frontend
    data_nascimento: {
      type: DataTypes.DATEONLY, // Apenas data, sem hora (tipo DATE no PostgreSQL)
      allowNull: true,
    },

    // Peso em kg — armazenado como decimal (ex: 72.5)
    // NUMERIC(5,2) no banco: até 999.99 kg
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    // Altura em metros — armazenado como decimal (ex: 1.75)
    // NUMERIC(4,2) no banco: até 9.99m
    altura: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },
  },
  {
    tableName: "tab_usuario", // nome real da tabela no banco
    timestamps: false,        // sem createdAt/updatedAt automático do Sequelize
  }
);

module.exports = Usuario;