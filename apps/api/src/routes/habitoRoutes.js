const express = require("express");
const routes = express.Router();

const habitoController = require("../controllers/habitoController");
const authMiddleware = require("../middlewares/auth"); // Usando o mesmo de usuarioRoutes

/* #################### -> ROTAS DE HÁBITOS <- #################### */

// GET /habitos -> Para o front carregar a lista de hábitos do PostgreSQL
routes.get("/", authMiddleware, habitoController.listarHabitos);

// POST /habitos/rotina -> Para o front salvar os hábitos ativos do dia
routes.post("/rotina", authMiddleware, habitoController.salvarRotina);

module.exports = routes;