// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const router = express.Router();

// Controller que implementa a lógica dos endpoints
const leituraController = require("../controllers/leituraController");

// Middleware de autenticação: valida JWT antes de executar
const authMiddleware = require("../middlewares/auth");

// ============================================================
// ROUTES: LEITURA
// ============================================================
// Responsabilidade: Endpoints para gerenciar sessões de leitura e livros
// Padrão: /leitura/[ação]
//
// Configuração: router.use(authMiddleware)
// → Todas as rotas abaixo REQUEREM autenticação (JWT válido)
// → Não precisa repetir verificarToken em cada rota

// Aplica autenticação em TODAS as rotas deste router
router.use(authMiddleware);

// ============================================================
// POST /leitura/registrar
// ============================================================
// Descrição: Registra uma sessão de leitura + ganha XP
// Autenticação: Requerida (JWT)
// Body: { nome_livro?: string, id_livro_lido?: number, pag_lidas: number, nota?: string, autor?: string }
// Resposta: { mensagem, dados, xp_ganho }
//
// Exemplo de requisição:
// {
//   "nome_livro": "O Hobbit",
//   "pag_lidas": 45,
//   "nota": "Adorando a história!",
//   "autor": "J.R.R. Tolkien"
// }
//
// Fluxo dentro de TRANSACTION ACID:
// 1. Resolve o livro (busca existente ou cria novo)
//    a. SELECT LivrosLidos WHERE usuario_id AND nome_livro
//    b. Se não existe: INSERT com nome + autor
//    c. Se existe mas sem autor: UPDATE com autor (se fornecido)
// 2. INSERT tab_leitura (id_livro, usuario_id, pag_lidas, nota)
// 3. INSERT tab_xp_log (id_motivo=6, xp_ganho=20)
// 4. COMMIT (tudo) ou ROLLBACK (nada)
//
// Padrões:
// - Auto-criação: livros criados conforme necessário
// - Captura de autor: novo campo agora suportado
// - Transação ACID: consistência garantida
//
// Campos opcionais:
// - nota_leitura: reflexão do usuário (opcional)
// - autor: autor do livro (opcional, preenchido depois se não informado)
router.post("/registrar", leituraController.registrarSessao);

// ============================================================
// GET /leitura/historico
// ============================================================
// Descrição: Retorna todas as sessões de leitura com dados do livro
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: [{ id_leitura, usuario_id, pag_lidas, nota, data_hora, livro: { nome_livro, autor } }, ...]
//
// Exemplo de resposta:
// [
//   {
//     "id_leitura": 45,
//     "usuario_id": 5,
//     "pag_lidas": 45,
//     "nota_leitura": "Adorando!",
//     "data_hora": "2026-06-30T14:30:00Z",
//     "livro": {
//       "nome_livro": "O Hobbit",
//       "autor": "J.R.R. Tolkien"
//     }
//   }
// ]
//
// Padrão SQL: INCLUDE (JOIN)
// - Fetch: Leitura + LivrosLidos em uma única query
// - Alias: "livro" (nome chave na resposta JSON)
// - Colunas: apenas nome_livro e autor do livro
//
// Ordenação: DESC (mais recente primeiro)
// Time-Series padrão: visualizar histórico cronológico
router.get("/historico", leituraController.obterHistorico);

// ============================================================
// GET /leitura/livros
// ============================================================
// Descrição: Retorna todos os livros cadastrados
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: [{ id_livro_lido, usuario_id, nome_livro, autor, total_pag, data_inicio, data_fim, nota_livro }, ...]
//
// Exemplo de resposta:
// [
//   {
//     "id_livro_lido": 12,
//     "usuario_id": 5,
//     "nome_livro": "O Hobbit",
//     "autor": "J.R.R. Tolkien",
//     "total_pag": 310,
//     "data_inicio": "2026-01-15",
//     "data_fim": "2026-02-10",
//     "nota_livro": 5
//   }
// ]
//
// Ordenação: DESC (mais recentes primeiro)
// Caso de uso:
// - Listar "Meus Livros" na tela de perfil
// - Selecionar livro para registrar nova sessão
// - Analytics: contar livros lidos (onde data_fim != null)
router.get("/livros", leituraController.listarLivros);

// ============================================================
// POST /leitura/livros
// ============================================================
// Descrição: Cadastra um novo livro manualmente
// Autenticação: Requerida (JWT)
// Body: { nome_livro: string, autor?: string, total_pag?: number, data_inicio?: string }
// Resposta: { mensagem, livro }
//
// Exemplo de requisição:
// {
//   "nome_livro": "1984",
//   "autor": "George Orwell",
//   "total_pag": 328,
//   "data_inicio": "2026-02-15"
// }
//
// Quando usar:
// - Adicionar livro à lista ANTES de começar a ler
// - Criar catálogo de livros a ler (wishlist)
//
// Diferença com registrarSessao():
// - registrarSessao(): Registra LEITURA + cria livro automaticamente
// - cadastrarLivro(): Cria APENAS o livro (sem sessão de leitura)
//
// Campos obrigatórios: nome_livro
// Campos opcionais: autor, total_pag, data_inicio
router.post("/livros", leituraController.cadastrarLivro);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/leitura', leituraRoutes)
module.exports = router;