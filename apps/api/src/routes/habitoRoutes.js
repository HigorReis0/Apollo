// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const routes = express.Router();

// Controller que implementa a lógica dos endpoints
const habitoController = require("../controllers/habitoController");

// Middleware de autenticação: valida JWT antes de executar
const authMiddleware = require("../middlewares/auth");

// ============================================================
// ROUTES: HÁBITOS
// ============================================================
// Responsabilidade: Endpoints para gerenciar hábitos e rotinas
// Padrão: /habitos/[ação]
//
// Fluxo típico:
// 1. Frontend chama GET /habitos → lista catálogo disponível
// 2. Usuário seleciona quais quer fazer hoje
// 3. Frontend chama POST /habitos/rotina → salva seleção
// 4. Durante o dia: usuário conclui hábitos (registra XP via /xp/registrar)

// ============================================================
// GET /habitos
// ============================================================
// Descrição: Lista todos os hábitos disponíveis no catálogo
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum
// Resposta: [{ habito_id, nome, descricao, xp_base, icone_url }, ...]
//
// Exemplo de resposta:
// [
//   { habito_id: 1, nome: "Arrumar Cama", descricao: "Começar o dia bem", xp_base: 10, icone_url: "..." },
//   { habito_id: 2, nome: "Beber Água", descricao: "Manter hidratação", xp_base: 10, icone_url: "..." },
//   { habito_id: 3, nome: "Meditar", descricao: "Cuidar da saúde mental", xp_base: 10, icone_url: "..." }
// ]
//
// Caso de uso:
// - Tela de seleção de hábitos
// - Renderizar lista de opções
// - Exibir ícone + descrição de cada hábito
//
// Nota: xp_base é informativo
// O XP real vem de tab_motivo, usando ID específico do hábito
routes.get("/", authMiddleware, habitoController.listarHabitos);

// ============================================================
// POST /habitos/rotina
// ============================================================
// Descrição: Salva a rotina de hábitos do usuário para o dia
// Autenticação: Requerida (JWT)
// Body: { habitos: [{ habito_id: number }, ...] }
// Resposta: { mensagem: "Rotina salva com sucesso!" }
//
// Exemplo de requisição:
// {
//   "habitos": [
//     { "habito_id": 1 },  // Arrumar Cama
//     { "habito_id": 2 },  // Beber Água
//     { "habito_id": 3 }   // Meditar
//   ]
// }
//
// O que acontece:
// 1. Deleta hábitos antigos do usuário para hoje
// 2. Insere novos registros em tab_habito_usuario
// 3. Marca cada como status="planejado" (não concluído ainda)
//
// Fluxo do usuário:
// 1. Seleciona hábitos na tela (checkboxes)
// 2. Clica "Salvar Rotina" → POST /habitos/rotina
// 3. Recebe confirmação
// 4. Durante o dia: concluir hábitos (via /xp/registrar com motivo correto)
//
// Nota sobre rotina:
// - Rotina é flexível: pode mudar a qualquer momento
// - Hábitos concluídos no dia anterior não afetam nova rotina
// - XP é registrado via tabela tab_xp_log, não via rotina
routes.post("/rotina", authMiddleware, habitoController.salvarRotina);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/habitos', habitoRoutes)
module.exports = routes;