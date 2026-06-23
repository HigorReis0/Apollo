// Importa a classe DataTypes para tipagem rigorosa das colunas
const { DataTypes } = require("sequelize");
// Conexão Singleton com o banco de dados (Padrão de Projeto: Singleton)
const sequelize = require("../config/database");

// Define o modelo "XpLog", representando a tabela de log de gamificação
const XpLog = sequelize.define(
  "XpLog",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'log_id'
    },
    
    // Foreign Key implícita na declaração, estabelecendo a relação estrutural
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_usuario', // Refere-se fisicamente à tabela no banco
        key: 'usuario_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Integridade referencial: se o usuário sumir, os logs somem
    },

    // Descrição da ação que gerou o XP (ex: "Bebeu 2L de água")
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tab_motivo', // Refere-se fisicamente à tabela no banco
        key: 'motivo_id'
      },
    },

    // Quantidade de XP transacionada (pode ser positiva para ganhos ou negativa para penalidades)
    valor_xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    motivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // Timestamp da ocorrência. Crucial para ordenação temporal de eventos (Time-Series Data)
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    }
  },
  {
    tableName: "tb_xp_log", // Mapeamento estrito para o banco relacional
    timestamps: false,      // Desabilitado, pois já gerenciamos via data_registro
  }
);

/* 
 * NOTA DE ASSOCIAÇÃO:
 * Em um arquivo central de relacionamentos (ex: models/index.js), você deve declarar:
 * Usuario.hasMany(XpLog, { foreignKey: 'usuario_id' });
 * XpLog.belongsTo(Usuario, { foreignKey: 'usuario_id' });
 */

module.exports = XpLog;