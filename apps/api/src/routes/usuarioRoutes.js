const express = require("express");
const routes = express.Router();

// 1. IMPORTAÇÕES (Precisam estar ativas!)
const usuarioController = require("../controllers/usuarioController");
const upload = require("../config/multer");
const authMiddleware = require("../middlewares/auth");

/**
 * --- ROTAS PÚBLICAS ---
 */
routes.post("/", upload.single("avatar"), usuarioController.criar);
routes.post("/login", usuarioController.login);
routes.post("/login-google", usuarioController.loginGoogle);

/**
 * --- ROTAS PRIVADAS (PROTEGIDAS) ---
 */
// O authMiddleware garante que só usuários logados acessem estas rotas
routes.get("/perfil", authMiddleware, usuarioController.perfil);
routes.get("/", authMiddleware, usuarioController.listar);
routes.get("/:id", authMiddleware, usuarioController.buscarPorId);
routes.put("/:id", authMiddleware, upload.single("avatar"), usuarioController.atualizar);
routes.delete("/:id", authMiddleware, usuarioController.deletar);

module.exports = routes;