// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const router = express.Router();

// Controller que implementa a lógica dos endpoints
const xpLogController = require("../controllers/xpLogController");

// Middleware de autenticação: valida JWT antes de executar
const verificarToken = require("../middlewares/auth");

// ============================================================
// ROUTES: XP LOG
// ============================================================
// Responsabilidade: Endpoints para gamificação
// Padrão: /xp/[ação]
//
// Todos os endpoints requerem autenticação (JWT válido)
// O middleware extrai usuario_id do token e injeta em req.usuarioId

// ============================================================
// POST /xp/registrar
// ============================================================
// Descrição: Registra uma transação de XP
// Autenticação: Requerida (JWT)
// Body: { id_motivo: number }
// Resposta: { id_xp_log, usuario_id, id_motivo, xp_ganho, data_hora }
//
// Fluxo:
// 1. Frontend envia id_motivo (ex: 1 = Arrumar Cama)
// 2. Backend:
//    a. Busca Motivo.findByPk(1) → xp_padrao=20
//    b. Valida usuario_id (já extraído do JWT)
//    c. Registra XpLog com xp_ganho=20 (valor do banco!)
// 3. Frontend recebe confirmação + XP ganho
//
// Padrão de Segurança: Security by Design
// → XP_PADRAO decidido pelo servidor
// → Cliente não pode enviar xp_ganho (seria ignorado)
// → Impede cheat: usuário não pode dar 99999 XP a si mesmo
router.post("/registrar", verificarToken, xpLogController.registrar);

// ============================================================
// GET /xp/saldo
// ============================================================
// Descrição: Retorna saldo de XP + nível atual
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: { total_xp, nivel_atual, nivel_id, xp_proximo_nivel }
//
// Exemplo de resposta:
// {
//   "total_xp": 1500,
//   "nivel_atual": "Dedicado",
//   "nivel_id": 4,
//   "xp_proximo_nivel": 2000
// }
//
// Cálculos:
// - total_xp: SUM(xp_ganho) de todo histórico
// - nivel_atual: maior xp_minimo <= total_xp (Op.lte)
// - xp_proximo_nivel: menor xp_minimo > total_xp (Op.gt)
//
// Motivo de "blindagem" (sem ID na URL):
// → Evita que usuário A veja XP de usuário B
// → Security by Design: sempre usa req.usuarioId do JWT
router.get("/saldo", verificarToken, xpLogController.calcularSaldo);

// ============================================================
// GET /xp/historico
// ============================================================
// Descrição: Retorna histórico de XP (todos os logs)
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: [{ id_xp_log, usuario_id, id_motivo, xp_ganho, data_hora }, ...]
//
// Exemplo de resposta:
// [
//   { id_xp_log: 45, usuario_id: 5, id_motivo: 1, xp_ganho: 20, data_hora: "2026-06-30T09:15:00Z" },
//   { id_xp_log: 44, usuario_id: 5, id_motivo: 6, xp_ganho: 20, data_hora: "2026-06-30T14:30:00Z" }
// ]
//
// Ordenação: DESC (mais recente primeiro)
// Time-Series padrão: visualizar histórico cronológico
//
// Padrão de Segurança: sem ID na URL
// → Não expõe estrutura interna
// → Usa JWT para autenticação
// → Retorna apenas XP do usuário autenticado
router.get("/historico", verificarToken, xpLogController.listarPorUsuario);

// ============================================================
// DELETE /xp/:id
// ============================================================
// Descrição: Deleta um log de XP específico (para corrigir erros)
// Autenticação: Requerida (JWT)
// Parâmetros: :id = id_xp_log (qual registro deletar?)
// Resposta: { mensagem: "Log removido com sucesso." }
//
// Exemplo:
// DELETE /xp/45 → remove o log com id_xp_log=45
//
// Quando usar:
// → Correção de erros (registrou 2x por engano)
// → Admin removendo registros suspeitos
// → Ajuste de dados históricos
//
// Cuidado: Deletar não recalcula nível automaticamente!
// Frontend deve fazer re-fetch de saldo após deletar
router.delete("/:id", verificarToken, xpLogController.deletar);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/xp', xpLogRoutes)
module.exports = router;