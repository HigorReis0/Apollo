const express = require("express");
const routes = express.Router();

const usuarioController = require("../controllers/usuarioController");
const upload = require("../config/multer");
const authMiddleware = require("../middlewares/auth");

// ============================================================
// ROTAS PÚBLICAS (sem autenticação)
// ============================================================

// Cadastro manual de novo usuário
routes.post("/", upload.single("avatar"), usuarioController.criar);

// Login com e-mail e senha
routes.post("/login", usuarioController.login);

// Login com conta Google (OAuth2)
routes.post("/login-google", usuarioController.loginGoogle);

// ============================================================
// ROTAS PRIVADAS — ESPECÍFICAS (devem vir ANTES das rotas com :id)
// O Express processa rotas de cima para baixo. Se /:id viesse
// antes, "perfil", "dados-pessoais" e "habitos-recentes" seriam
// interpretados como IDs — causando erro 404 ou comportamento errado.
// Princípio: rotas estáticas sempre antes de rotas dinâmicas.
// ============================================================

// Retorna os dados do usuário autenticado (usa req.usuarioId do JWT)
routes.get("/perfil", authMiddleware, usuarioController.perfil);

// Retorna a meta de leitura do usuário logado
routes.get("/meta-leitura", authMiddleware, usuarioController.obterMetaLeitura);

// Atualiza a meta de leitura do usuário logado
routes.put("/meta-leitura", authMiddleware, usuarioController.atualizarMetaLeitura);

// Atualiza peso, altura e data de nascimento do usuário logado
routes.put("/dados-pessoais", authMiddleware, usuarioController.atualizarDadosPessoais);

// Retorna os últimos 4 hábitos registrados pelo usuário logado
routes.get("/habitos-recentes", authMiddleware, usuarioController.habitosRecentes);

// Lista todos os usuários (admin)
routes.get("/", authMiddleware, usuarioController.listar);

// ============================================================
// ROTAS PRIVADAS — DINÂMICAS (com :id — devem vir POR ÚLTIMO)
// ============================================================

// Busca um usuário específico pelo ID
routes.get("/:id", authMiddleware, usuarioController.buscarPorId);

// Atualiza dados de um usuário específico (nome, email, avatar)
routes.put("/:id", authMiddleware, upload.single("avatar"), usuarioController.atualizar);

// Remove um usuário específico
routes.delete("/:id", authMiddleware, usuarioController.deletar);

module.exports = routes;