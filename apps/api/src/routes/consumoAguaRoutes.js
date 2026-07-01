// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const router = express.Router();

// Controller que implementa a lógica dos endpoints
const consumoAguaController = require("../controllers/consumoAguaController");

// Middleware de autenticação: valida JWT antes de executar
const verificarToken = require("../middlewares/auth");

// ============================================================
// ROUTES: CONSUMO DE ÁGUA
// ============================================================
// Responsabilidade: Endpoints para hidratação e gamificação
// Padrão: /agua/[ação]
//
// Todos os endpoints requerem autenticação (JWT válido)
// O middleware extrai usuario_id do token e injeta em req.usuarioId

// ============================================================
// POST /agua/registrar
// ============================================================
// Descrição: Registra consumo de água + XP
// Autenticação: Requerida (JWT)
// Body: { tipo_bebida?: string, quantidade_ml: number }
// Resposta: { consumo, xp_ganho, bonus_meta, mensagem }
//
// Exemplo de requisição:
// {
//   "tipo_bebida": "Água",
//   "quantidade_ml": 200
// }
//
// Exemplo de resposta:
// {
//   "consumo": { id_consumo_agua: 123, usuario_id: 5, quantidade_ml: 200, data_hora: "..." },
//   "xp_ganho": 20,
//   "bonus_meta": null,
//   "mensagem": "Consumo registrado com sucesso."
// }
//
// Fluxo dentro de TRANSACTION ACID:
// 1. INSERT tab_consumo_agua (tipo_bebida, quantidade_ml)
// 2. INSERT tab_xp_log (id_motivo=1, xp_ganho=20)
// 3. SUM(quantidade_ml) WHERE usuario_id AND data_hora >= hoje
// 4. Se total >= 2000ml:
//    a. Verifica se bônus já foi dado hoje
//    b. Se não: INSERT tab_xp_log (id_motivo=3, xp_ganho=50)
// 5. COMMIT (tudo persiste) ou ROLLBACK (nada persiste)
//
// Padrões:
// - Otimismo: frontend atualiza UI ANTES de confirmar servidor
// - Transação ACID: consistência garantida
// - Gamificação: 20 XP + 50 XP bônus
router.post("/registrar", verificarToken, consumoAguaController.registrarConsumo);

router.delete("/hoje", verificarToken, consumoAguaController.deletarConsumosHoje);

// ============================================================
// GET /agua/hoje
// ============================================================
// Descrição: Retorna consumo de água de hoje + progresso
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: { consumos[], total_ml, meta_ml, percentual }
//
// Exemplo de resposta:
// {
//   "consumos": [
//     { id_consumo_agua: 123, tipo_bebida: "Água", quantidade_ml: 200, data_hora: "09:15" },
//     { id_consumo_agua: 124, tipo_bebida: "Café", quantidade_ml: 150, data_hora: "14:30" }
//   ],
//   "total_ml": 350,
//   "meta_ml": 2000,
//   "percentual": 17  // 350 / 2000 * 100 = 17.5% → arredonda para 17
// }
//
// Cálculos:
// - total_ml: SUM(quantidade_ml) para registros de hoje
// - percentual: Math.min(round(total / meta * 100), 100)
// - Limitado a 100% para não ultrapassar visualmente
//
// Filtro de data:
// - Apenas registros com data_hora >= 00:00:00 do dia atual
// - Permite reset diário automático
//
// Caso de uso:
// - Renderizar barra de progresso no app
// - Mostrar histórico de consumos
// - Atualizar em tempo real (re-fetch após cada consumo)
router.get("/hoje", verificarToken, consumoAguaController.listarConsumoHoje);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/agua', consumoAguaRoutes)
module.exports = router;