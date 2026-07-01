// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: ConsumoAgua
// ============================================================
// Responsabilidade: Define a tabela tab_consumo_agua (histórico de hidratação)
//
// O que registra?
// Cada vez que o usuário bebe água (ou outra bebida), um registro é criado.
// Exemplos:
// | usuario_id | tipo_bebida | quantidade_ml | data_hora |
// |------------|-------------|---------------|-----------|
// | 5          | Água        | 200           | 09:15 |
// | 5          | Refrigerante| 350           | 14:30 |
// | 5          | Suco        | 150           | 18:45 |
//
// Por que tipo_bebida?
// → Rastreabilidade: distinguir água de outros líquidos
// → Analytics: descobrir padrões de consumo
// → Gamificação: possibilita bonus específicos por tipo (futuro)
//
// Fluxo de uso:
// 1. Frontend envia POST /agua/registrar { tipo_bebida, quantidade_ml }
// 2. consumoAguaController.registrarConsumo() dentro de TRANSACTION:
//    a. INSERT tab_consumo_agua
//    b. INSERT tab_xp_log (20 XP)
//    c. Verifica se atingiu 2000ml → INSERT tab_xp_log (50 XP bonus)
// 3. Frontend consulta GET /agua/hoje para renderizar progresso
const ConsumoAgua = sequelize.define(
  "ConsumoAgua",
  {
    // ============================================================
    // id_consumo_agua: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado
    // Cada consumo tem um ID sequencial
    id_consumo_agua: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_consumo_agua"
    },

    // ============================================================
    // usuario_id: Foreign Key para tab_usuario
    // ============================================================
    // INTEGER no banco (referencia usuario_id em tab_usuario)
    // allowNull: true → conforme DDL original, mas idealmente seria false
    // Identifica de quem é o consumo
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "usuario_id"
    },

    // ============================================================
    // tipo_bebida: Tipo da bebida consumida
    // ============================================================
    // VARCHAR(50) no banco
    // Exemplos: "Água", "Café", "Refrigerante", "RefriZero", "Suco"
    // allowNull: true → pode ser null se não especificado (default "Água")
    // Usado em analytics e gamificação futura
    tipo_bebida: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "tipo_bebida"
    },

    // ============================================================
    // quantidade_ml: Quantidade consumida em mililitros
    // ============================================================
    // INTEGER no banco: típicos valores 150, 200, 600, 1000
    // OBRIGATÓRIO: sempre deve ter um valor
    // Usado em:
    // 1. SUM(quantidade_ml) para calcular total do dia
    // 2. Verificar se atingiu meta (2000ml)
    quantidade_ml: {
      type: DataTypes.INTEGER,
      allowNull: false,  // OBRIGATÓRIO
      field: "quantidade_ml"
    },

    // ============================================================
    // data_hora: Timestamp de quando foi consumido
    // ============================================================
    // TIMESTAMP no banco
    // Gerado automaticamente pelo banco (DataTypes.NOW)
    // Essencial para:
    // 1. Time-Series Analysis (padrão de consumo ao longo do dia)
    // 2. Filtrar apenas registros "de hoje" na rota GET /agua/hoje
    // 3. Validar "meta diária" (entre 00:00 e 23:59 do mesmo dia)
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,  // Hora atual do banco
      field: "data_hora"
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_consumo_agua",  // Nome EXATO da tabela
    timestamps: false                // Não adiciona createdAt/updatedAt
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = ConsumoAgua;