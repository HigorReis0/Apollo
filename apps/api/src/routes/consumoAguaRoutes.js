const express = require("express");
const router = express.Router();
const consumoAguaController = require("../controllers/consumoAguaController");
const verificarToken = require("../middlewares/auth"); // Seu middleware padrão

router.post("/registrar", verificarToken, consumoAguaController.registrarConsumo);
router.get("/hoje", verificarToken, consumoAguaController.listarConsumoHoje);

module.exports = router;