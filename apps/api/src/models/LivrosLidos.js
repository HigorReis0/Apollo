// ============================================================
// IMPORTAÇÕES
// ============================================================
// DataTypes: tipos de dados suportados pelo Sequelize
const { DataTypes } = require("sequelize");

// Instância do Sequelize (conexão com PostgreSQL)
const sequelize = require("../config/database");

// ============================================================
// MODEL: LivrosLidos
// ============================================================
// Responsabilidade: Define a tabela tab_livros_lidos (catálogo de livros)
//
// O que registra?
// Cada livro que o usuário começou (ou deseja) a ler.
// É o "catálogo pessoal" de livros do usuário.
//
// Exemplos:
// | id_livro | usuario_id | nome_livro | autor | total_pag | data_inicio | data_fim |
// |----------|------------|------------|-------|-----------|-------------|----------|
// | 12       | 5          | O Hobbit   | Tolkien | 310 | 2026-01-15 | 2026-02-10 |
// | 13       | 5          | 1984       | Orwell | 328 | 2026-02-15 | null |
//
// Relação com tab_leitura:
// Um livro (LivrosLidos) pode ter MÚLTIPLAS sessões de leitura (Leitura)
// Exemplo: "O Hobbit" tem 10 sessões de leitura diferentes
//
// Novo campo: autor
// → Capturado automaticamente ao registrar primeira sessão
// → Permite pesquisa e sorting por autor
// → Enriquece o perfil do usuário
//
// Fluxo de criação:
// 1. Frontend POST /leitura/registrar { nome_livro, pag_lidas, autor }
// 2. leituraController verifica: LivrosLidos.findOne({nome_livro})
// 3. Se não existe:
//    a. INSERT tab_livros_lidos com nome_livro + autor
//    b. INSERT tab_leitura (sessão)
//    c. INSERT tab_xp_log (20 XP)
// 4. Se existe mas sem autor:
//    a. UPDATE tab_livros_lidos SET autor = ?
//
// Por que separar de tab_leitura?
// → Normalização: 1 livro N sessões
// → Metadados: armazenar título, autor, páginas totais
// → Analytics: "quantos livros leu em 2026?"
const LivrosLidos = sequelize.define(
  "LivrosLidos",
  {
    // ============================================================
    // id_livro_lido: Chave primária
    // ============================================================
    // ID numérico único, auto-incrementado
    // Cada livro no catálogo tem um ID sequencial
    id_livro_lido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_livro_lido"
    },

    // ============================================================
    // usuario_id: Foreign Key para tab_usuario
    // ============================================================
    // INTEGER no banco (referencia usuario_id em tab_usuario)
    // allowNull: true → conforme DDL (mas idealmente false)
    // Garante que cada livro pertence a um usuário
    // Impede "vazamento" de dados entre contas
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tab_usuario",          // Nome da tabela referenciada
        key: "usuario_id"              // Coluna referenciada
      },
      onUpdate: "CASCADE",             // Se usuário for atualizado, livros acompanham
      onDelete: "CASCADE"              // Se usuário for deletado, livros são deletados
    },

    // ============================================================
    // nome_livro: Título do livro
    // ============================================================
    // VARCHAR(255) no banco: espaço para títulos longos
    // OBRIGATÓRIO: sempre deve ter um título
    // Exemplos: "O Hobbit", "1984", "O Senhor dos Anéis"
    // Usado em:
    // 1. Exibição para o usuário
    // 2. Búsca: LivrosLidos.findOne({nome_livro})
    // 3. Relatório: listar livros lidos
    nome_livro: {
      type: DataTypes.STRING(255),
      allowNull: false,  // OBRIGATÓRIO
      field: "nome_livro"
    },

    // ============================================================
    // autor: Autor do livro (NOVO CAMPO)
    // ============================================================
    // VARCHAR(100) no banco
    // allowNull: true → OPCIONAL (pode ser preenchido depois)
    // Exemplos: "J.R.R. Tolkien", "George Orwell"
    // Novo em leituraController: agora capturam o autor!
    // Usado em:
    // 1. Exibição junto com o livro
    // 2. Analytics: "livros de qual autor li mais?"
    // 3. Sorting: "livros do mesmo autor"
    autor: {
      type: DataTypes.STRING(100),
      allowNull: true,  // OPCIONAL
      field: "autor"
    },

    // ============================================================
    // total_pag: Total de páginas do livro
    // ============================================================
    // INTEGER no banco
    // allowNull: true → OPCIONAL (pode não saber o total)
    // Exemplos: 310, 328, 512
    // Usado em:
    // 1. Calcular percentual de progresso: pag_lidas / total_pag
    // 2. Indicar quando o livro foi concluído
    total_pag: {
      type: DataTypes.INTEGER,
      allowNull: true,  // OPCIONAL
      field: "total_pag"
    },

    // ============================================================
    // data_inicio: Data que começou a ler
    // ============================================================
    // DATE (apenas data, sem hora) no banco
    // allowNull: true → OPCIONAL
    // Gerado ao criar o livro
    // Usado em:
    // 1. Calcular "quanto tempo levou para ler"
    // 2. Analytics: "quando começou este livro?"
    data_inicio: {
      type: DataTypes.DATEONLY,  // DATE, não TIMESTAMP
      allowNull: true,  // OPCIONAL
      field: "data_inicio"
    },

    // ============================================================
    // data_fim: Data que terminou de ler
    // ============================================================
    // DATE (apenas data, sem hora) no banco
    // allowNull: true → OPCIONAL (pode ainda estar lendo)
    // Preenchido manualmente ou inferido quando atinge total_pag
    // Usado em:
    // 1. Marcar livros "concluídos"
    // 2. Analytics: "quantos livros terminou em 2026?"
    data_fim: {
      type: DataTypes.DATEONLY,  // DATE, não TIMESTAMP
      allowNull: true,  // OPCIONAL
      field: "data_fim"
    },

    // ============================================================
    // nota_livro: Avaliação/nota do livro
    // ============================================================
    // INTEGER no banco: tipicamente 1-5 (estrelas)
    // allowNull: true → OPCIONAL
    // Exemplos: 5 (excelente), 3 (ok), 1 (não recomendo)
    // Usado em:
    // 1. Sistema de recomendação (livros com nota >= 4)
    // 2. Exibição ao usuário
    nota_livro: {
      type: DataTypes.INTEGER,
      allowNull: true,  // OPCIONAL
      field: "nota_livro"
    }
  },
  {
    // Configurações do modelo
    tableName: "tab_livros_lidos",     // Nome EXATO da tabela
    timestamps: false                   // Não adiciona createdAt/updatedAt
  }
);

// ============================================================
// EXPORTAÇÃO
// ============================================================
module.exports = LivrosLidos;