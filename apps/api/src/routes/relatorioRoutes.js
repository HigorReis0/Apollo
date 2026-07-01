const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");
const verificarToken = require("../middlewares/auth");

// Rota protegida — exige JWT válido
// GET /relatorio/leitura → retorna análise consolidada de leitura
router.get("/leitura", verificarToken, relatorioController.relatorioLeitura);

module.exports = router;