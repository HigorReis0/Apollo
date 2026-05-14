const express = require("express");
const router = express.Router();
const xpLogController = require("../controllers/xpLogController");

// Middlewares de Autenticação (Ajuste o caminho conforme o seu projeto)
// Presumo que você tenha um middleware de validação JWT, como no seu UsuarioController
const verificarToken = require("../middlewares/authMiddleware"); 

/* #################### -> ROTAS DE XP LOG <- #################### */

// REGISTRAR XP (Requer validação de segurança para evitar injeção de pontos)
router.post("/registrar", verificarToken, xpLogController.registrar);

// OBTER SALDO DE XP (Single Source of Truth)
router.get("/:usuario_id/saldo", verificarToken, xpLogController.calcularSaldo);

// LISTAR HISTÓRICO DE EVENTOS COM PAGINAÇÃO
router.get("/:usuario_id/historico", verificarToken, xpLogController.listarPorUsuario);

// DELETAR LOG (Apenas para rollback manual - Opcional: Adicionar middleware de validação de Admin)
router.delete("/:id", verificarToken, xpLogController.deletar);

module.exports = router;