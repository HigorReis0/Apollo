const express = require("express");
const router = express.Router();
const leituraController = require("../controllers/leituraController");
const verificarToken = require("../middlewares/auth");

// Todas as rotas de leitura são privadas (requerem JWT válido)
// Princípio Zero Trust: nunca confiar, sempre verificar (NIST SP 800-207)
router.post("/registrar", verificarToken, leituraController.registrar);
router.get("/historico", verificarToken, leituraController.historico);

module.exports = router;