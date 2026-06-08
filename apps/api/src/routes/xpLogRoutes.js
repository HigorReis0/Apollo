const express = require("express");
const router = express.Router();
const xpLogController = require("../controllers/xpLogController");
const verificarToken = require("../middlewares/auth");

/* #################### -> ROTAS DE XP LOG <- #################### */

router.post("/registrar", verificarToken, xpLogController.registrar);

// ATUALIZADO: Rota de saldo blindada (Sem ID na URL)
router.get("/saldo", verificarToken, xpLogController.calcularSaldo);

// ATUALIZADO: Rota de histórico blindada (Sem ID na URL)
router.get("/historico", verificarToken, xpLogController.listarPorUsuario);

router.delete("/:id", verificarToken, xpLogController.deletar);

module.exports = router;