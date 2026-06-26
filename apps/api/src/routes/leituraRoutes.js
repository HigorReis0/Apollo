const express = require("express");
const router = express.Router();
const leituraController = require("../controllers/leituraController");
const authMiddleware = require("../middlewares/auth"); // Se sua pasta for "middleware", ajuste para "../middleware/auth"

// Protege todas as rotas de leitura exigindo autenticação via JWT
router.use(authMiddleware);

// ============================================================
// ROTAS DE SESSÕES DE LEITURA
// ============================================================

// Registrar uma sessão de leitura (POST /leitura/registrar)
router.post("/registrar", leituraController.registrarSessao);

// Buscar o histórico completo de leituras (GET /leitura/historico)
router.get("/historico", leituraController.obterHistorico);


// ============================================================
// ROTAS DE GERENCIAMENTO DE LIVROS
// ============================================================

// Listar todos os livros cadastrados pelo usuário (GET /leitura/livros)
router.get("/livros", leituraController.listarLivros);

// Cadastrar um novo livro na lista do usuário (POST /leitura/livros)
router.post("/livros", leituraController.cadastrarLivro);

module.exports = router;