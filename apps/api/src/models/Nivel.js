// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: Nivel
// ============================================================
// Responsabilidade: Define a tabela tab_nivel (sistema de progressão)
//
// O que é um Nível?
// Um nível é um marco de progressão. Quando o usuário atinge certo
// total de XP, sobe de nível.
//
// Exemplo de níveis (8 no total):
// | Nível | XP Mínimo | Descrição |
// |-------|-----------|-----------|
// | 1     | 0         | Iniciante |
// | 2     | 200       | Aprendiz |
// | 3     | 500       | Praticante |
// | 4     | 1000      | Dedicado |
// | 5     | 2000      | Mestre |
// | 6     | 5000      | Lendário |
//
// Como usar para calcular o nível do usuário?
// No xpLogController.calcularSaldo():
// - Soma XP total: 1500
// - Busca: Maior nivel.xp_minimo <= 1500 → xp_minimo=1000 (Dedicado)
// - Próximo: Menor nivel.xp_minimo > 1500 → xp_minimo=2000 (faltam 500 XP)
//
// Padrão Arquitetural: Repository (Fowler, 2002)
const Nivel = sequelize.define(
  "Nivel",
  {
    // ============================================================
    // nivel_id: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado
    // Sequência: 1, 2, 3, ..., 8 (número de níveis no sistema)
    nivel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'nivel_id'
    },

    // ============================================================
    // nome_nivel: Nome do nível (texto descritivo)
    // ============================================================
    // VARCHAR(50) no banco
    // Exemplos: "Iniciante", "Aprendiz", "Praticante", "Dedicado", "Mestre", "Lendário"
    // Exibido na tela de perfil para mostrar ao usuário seu nível
    nome_nivel: {
      type: DataTypes.STRING(50),
      allowNull: false,  // OBRIGATÓRIO
      field: 'nome_nivel'
    },

    // ============================================================
    // xp_minimo: XP necessário para atingir este nível
    // ============================================================
    // INTEGER no banco
    // Valores típicos: 0, 200, 500, 1000, 2000, 5000
    // CRÍTICO: Deve ser único e ordenado crescente!
    // Sem ORDER: queries ficam lentas e podem retornar nível errado
    //
    // Usado em:
    // 1. xpLogController.calcularSaldo() com Op.lte (nível atual)
    // 2. xpLogController.calcularSaldo() com Op.gt (próximo nível)
    xp_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,  // OBRIGATÓRIO
      field: 'xp_minimo'
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_nivel",      // Nome EXATO da tabela no PostgreSQL
    timestamps: false             // Não adiciona createdAt/updatedAt
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = Nivel;