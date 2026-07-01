// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const router = express.Router();

// Controller que implementa a lógica dos endpoints
const relatorioController = require("../controllers/relatorioController");

// Middleware de autenticação: valida JWT antes de executar
const verificarToken = require("../middlewares/auth");

// ============================================================
// ROUTES: RELATÓRIOS
// ============================================================
// Responsabilidade: Endpoints para gerar relatórios e análises
// Padrão: /relatorio/[tipo]
//
// Relatórios são read-only: apenas GET
// Agregações e cálculos complexos acontecem aqui

// ============================================================
// GET /relatorio/leitura
// ============================================================
// Descrição: Retorna análise consolidada de leitura
// Autenticação: Requerida (JWT)
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: RelatorioLeitura (interface complexa com múltiplas agregações)
//
// Exemplo de resposta (conceitual):
// {
//   "meta": 500,                          // Meta de páginas/mês (do usuário)
//   "total_paginas_geral": 2345,          // Total histórico
//   "total_livros": 8,                    // Quantidade livros lidos
//   "total_sessoes_mes": 12,              // Sessões no mês atual
//   "total_paginas_mes": 342,             // Páginas lidas no mês
//   "media_por_sessao": 28.5,             // Média de pag/sessão
//   "percentual_meta": 68.4,              // 342 / 500 * 100
//   "ultimo_livro": {                     // Último livro lido
//     "id_livro_lido": 15,
//     "nome_livro": "1984",
//     "autor": "George Orwell",
//     "pag_lidas": 32
//   }
// }
//
// Cálculos complexos:
// 1. meta: SELECT meta_leitura FROM tab_usuario (fallback 500 se null)
// 2. total_paginas_geral: SUM(pag_lidas) de todo histórico
// 3. total_livros: COUNT(DISTINCT id_livro_lido)
// 4. total_sessoes_mes: COUNT(*) WHERE mês = atual
// 5. total_paginas_mes: SUM(pag_lidas) WHERE mês = atual
// 6. media_por_sessao: AVG(pag_lidas) WHERE mês = atual
// 7. percentual_meta: MIN((total_paginas_mes / meta) * 100, 100)
// 8. ultimo_livro: JOIN com LivrosLidos, ORDER BY data_hora DESC LIMIT 1
//
// Caso de uso:
// - Tela de Relatório de Leitura
// - Exibir progresso mensal (barra visual)
// - Mostrar metadados (livro atual, média)
// - Exibir último livro lido
router.get("/leitura", verificarToken, relatorioController.relatorioLeitura);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/relatorio', relatorioRoutes)
module.exports = router;