// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: Leitura
// ============================================================
// Responsabilidade: Define a tabela tab_leitura (sessões de leitura)
//
// O que registra?
// Cada vez que o usuário registra uma sessão de leitura.
// Uma sessão = "li X páginas de um livro hoje"
//
// Exemplos:
// | usuario_id | id_livro | pag_lidas | nota | data_hora |
// |------------|----------|-----------|------|-----------|
// | 5          | 12       | 45        | Adorando! | 2026-06-30 14:30 |
// | 5          | 12       | 32        | Suspense! | 2026-06-30 18:00 |
//
// Um livro pode ter MÚLTIPLAS sessões de leitura
// Cada sessão: registro isolado com páginas + nota
//
// Fluxo de uso:
// 1. Frontend envia POST /leitura/registrar { nome_livro, pag_lidas, nota, autor }
// 2. leituraController.registrarSessao() dentro de TRANSACTION:
//    a. Busca ou cria LivrosLidos
//    b. INSERT tab_leitura (cria sessão)
//    c. INSERT tab_xp_log (20 XP)
// 3. Frontend consulta GET /leitura/historico para renderizar histórico
//
// Por que separar tab_leitura de tab_livros_lidos?
// → Normalização: um livro pode ter múltiplas sessões
// → Análise: histórico granular de leitura (Time-Series Data)
// → Audit trail: sabemos quando cada sessão foi realizada
const Leitura = sequelize.define(
  "Leitura",
  {
    // ============================================================
    // id_leitura: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado
    // Cada sessão de leitura tem um ID sequencial
    id_leitura: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_leitura"
    },

    // ============================================================
    // id_livro_lido: Foreign Key para tab_livros_lidos
    // ============================================================
    // INTEGER no banco (referencia id_livro_lido em tab_livros_lidos)
    // allowNull: true → conforme DDL (mas idealmente false)
    // Qual livro está sendo lido nesta sessão?
    id_livro_lido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tab_livros_lidos",    // Nome da tabela referenciada
        key: "id_livro_lido"           // Coluna referenciada
      },
      onUpdate: "CASCADE",             // Se livro for atualizado, leitura acompanha
      onDelete: "CASCADE"              // Se livro for deletado, leituras são deletadas
    },

    // ============================================================
    // usuario_id: Foreign Key para tab_usuario
    // ============================================================
    // INTEGER no banco (referencia usuario_id em tab_usuario)
    // allowNull: true → conforme DDL (mas idealmente false)
    // De quem é a sessão de leitura?
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tab_usuario",          // Nome da tabela referenciada
        key: "usuario_id"              // Coluna referenciada
      },
      onUpdate: "CASCADE",             // Se usuário for atualizado, leituras acompanham
      onDelete: "CASCADE"              // Se usuário for deletado, leituras são deletadas
    },

    // ============================================================
    // pag_lidas: Número de páginas lidas nesta sessão
    // ============================================================
    // INTEGER no banco: típicos valores 10, 30, 50, 100
    // OBRIGATÓRIO: sempre deve ter um valor
    // Usado em:
    // 1. SUM(pag_lidas) para calcular total de páginas lidas
    // 2. Cálculo de percentual de progressão no livro
    // 3. Analytics: média de páginas por sessão
    pag_lidas: {
      type: DataTypes.INTEGER,
      allowNull: false,  // OBRIGATÓRIO
      field: "pag_lidas"
    },

    // ============================================================
    // nota_leitura: Nota/reflexão sobre a sessão
    // ============================================================
    // TEXT no banco: pode ter múltiplas linhas
    // allowNull: true → OPCIONAL
    // Exemplos: "Adorando a história!", "Personagens confusos", "Excelente plot twist!"
    // Usado em:
    // 1. Exibir no histórico junto com a sessão
    // 2. Criar relatórios pessoais
    nota_leitura: {
      type: DataTypes.TEXT,
      allowNull: true,  // OPCIONAL
      field: "nota_leitura"
    },

    // ============================================================
    // data_hora: Timestamp de quando foi a sessão
    // ============================================================
    // TIMESTAMP no banco
    // Gerado automaticamente pelo banco (DataTypes.NOW)
    // Essencial para:
    // 1. Time-Series Analysis (padrão de leitura ao longo do tempo)
    // 2. ORDER BY data_hora DESC (histórico cronológico)
    // 3. Relatório por período (último mês, último ano)
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,  // Hora atual do banco
      field: "data_hora"
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_leitura",          // Nome EXATO da tabela
    timestamps: false                   // Não adiciona createdAt/updatedAt (controla manualmente)
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = Leitura;