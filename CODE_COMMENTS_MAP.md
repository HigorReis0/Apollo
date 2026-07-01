```
APOLLO - CÓDIGO COMENTADO LINHA POR LINHA
═════════════════════════════════════════════════════════

📊 TOTAL: 18 arquivos | 3,500+ linhas comentadas | Pronto para apresentação

FRONTEND (5/11 hooks)
───────────────────────────────────────────────────────────
  ✅ screens/Relatorio/
     └── useRelatorioLeitura.ts (250+ linhas)
         │ Otimistic Update pattern, estados complexos
         │ → bug fix principal: meta de leitura

  ✅ screens/JogosHabitos/
     ├── Arrumar Cama/useCama.ts (120+ linhas)
     │   │ DRY principle, guard clauses
     │   │ → padrão simples reutilizável
     │
     ├── BeberAgua/useBeberAgua.ts (450+ linhas)
     │   │ 8 states, otimismo, meta + bonus
     │   │ → hidratação com gamificação
     │
     └── Meditar/useMeditar.ts (280+ linhas)
         │ useRef + cleanup, previne memory leak
         │ → timer regressivo com XP

  ✅ screens/Relatorio/
     └── relatorioLeitura.view.tsx
         │ View pura, sem lógica
         │ → renderização clean


BACKEND CONTROLLERS (3/6)
───────────────────────────────────────────────────────────
  ✅ xpLogController.js (200+ linhas)
     │ Security by Design: servidor decide XP
     │ registrar() → busca Motivo.xp_padrao (não confia cliente)
     │ calcularSaldo() → SUM/Op.lte/Op.gt para nível
     │ listarPorUsuario() → time-series descending
     │ deletar() → remove log específico

  ✅ consumoAguaController.js (280+ linhas)
     │ ACID Transactions: 5 passos atômicos
     │ registrarConsumo() → INSERT consumo + XP + check meta + BONUS
     │ listarConsumoHoje() → SUM/percentual para barra
     │ → Gamificação com transações seguras

  ✅ leituraController.js (360+ linhas)
     │ Auto-criação de livros
     │ registrarSessao() → busca/cria LivrosLidos + Leitura + XP
     │ listarLivros() → todas as obras do usuário
     │ obterHistorico() → INCLUDE/JOIN com LivrosLidos
     │ cadastrarLivro() → adiciona livro manualmente
     │ → Novo: suporte a campo "autor"

  ⏳ usuarioController.js
  ⏳ habitoController.js
  ⏳ relatorioController.js


BACKEND MODELS (8/8 - 100%)
───────────────────────────────────────────────────────────
  ✅ Motivo.js (120+ linhas)
     │ Catálogo: id_motivo → xp_padrao
     │ Exemplos: 1=Água/20XP, 3=Meta/50XP, 6=Leitura/20XP
     │ Sem motivo no banco = Security by Design

  ✅ Nivel.js (90+ linhas)
     │ Progressão: xp_minimo → nome_nivel
     │ Exemplos: 0=Iniciante, 200=Aprendiz, 2000=Mestre, 5000=Lendário
     │ Usado em calcularSaldo() com Op.lte/Op.gt

  ✅ ConsumoAgua.js (140+ linhas)
     │ Histórico: usuario_id + tipo_bebida + quantidade_ml + data_hora
     │ SUM(quantidade_ml) WHERE data >= hoje 00:00
     │ Filtrado por dia para reset automático

  ✅ Leitura.js (150+ linhas)
     │ Sessões: id_livro_lido + pag_lidas + nota + data_hora
     │ Many-to-One: 1 livro → N sessões
     │ CASCADE DELETE: se livro deletado, sessões são deletadas

  ✅ LivrosLidos.js (200+ linhas)
     │ Catálogo pessoal: nome_livro + AUTOR + total_pag + data_fim
     │ Novo campo: autor (capturado automaticamente ao registrar)
     │ Auto-criação: frontend envia nome → backend cria automaticamente

  ✅ XpLog.js (160+ linhas)
     │ Audit trail: usuario_id + id_motivo + xp_ganho + data_hora
     │ IMUTÁVEL: nunca deletado (compliance + histórico)
     │ Security by Design: xp_ganho do banco, não do cliente

  ✅ Usuario.js
     │ Perfil: nome + email + meta_leitura + dados pessoais
     │ Novos campos: data_nascimento, peso, altura

  ✅ UsuarioHabito.js
     │ Junction table: usuario_id + habito_id + data_execucao


BACKEND ROUTES (6/6 - 100%)
───────────────────────────────────────────────────────────
  ✅ xpLogRoutes.js (140+ linhas)
     │ POST /xp/registrar
     │   → { id_motivo } → servidor retorna { xp_ganho, ...}
     │ GET  /xp/saldo
     │   → { total_xp, nivel_atual, xp_proximo_nivel }
     │ GET  /xp/historico
     │   → [{ id_xp_log, xp_ganho, data_hora }, ...] DESC
     │ DELETE /xp/:id
     │   → remove log específico

  ✅ consumoAguaRoutes.js (110+ linhas)
     │ POST /agua/registrar { tipo_bebida, quantidade_ml }
     │   → TRANSACTION: consumo + XP + verificar meta + bonus
     │ GET  /agua/hoje
     │   → { consumos[], total_ml, percentual } do dia

  ✅ leituraRoutes.js (180+ linhas)
     │ POST /leitura/registrar { nome_livro, pag_lidas, autor }
     │   → cria/busca livro + sessão + XP
     │ GET  /leitura/historico
     │   → com INCLUDE livro (nome + autor)
     │ GET  /leitura/livros
     │   → todos os livros do usuário
     │ POST /leitura/livros
     │   → cadastra livro manualmente

  ✅ habitoRoutes.js (90+ linhas)
     │ GET  /habitos
     │   → [{ habito_id, nome, descricao, xp_base }, ...]
     │ POST /habitos/rotina { habitos: [{ habito_id }, ...] }
     │   → salva rotina do dia

  ✅ relatorioRoutes.js (80+ linhas)
     │ GET /relatorio/leitura
     │   → { meta, total_paginas, total_livros, percentual, ultimo_livro }
     │   → agregações: SUM, COUNT, AVG, JOIN

  ✅ usuarioRoutes.js (340+ linhas)
     │ PÚBLICAS:
     │   POST   /usuarios              { nome, email, senha, avatar }
     │   POST   /usuarios/login        { email, senha }
     │   POST   /usuarios/login-google { google_id, ... }
     │
     │ PRIVADAS (específicas):
     │   GET    /usuarios/perfil
     │   GET    /usuarios/meta-leitura
     │   PUT    /usuarios/meta-leitura { meta }
     │   PUT    /usuarios/dados-pessoais
     │   GET    /usuarios/habitos-recentes
     │   GET    /usuarios              (lista todos)
     │
     │ PRIVADAS (dinâmicas):
     │   GET    /usuarios/:id
     │   PUT    /usuarios/:id
     │   DELETE /usuarios/:id


PADRÕES ARQUITETURAIS DOCUMENTADOS
───────────────────────────────────────────────────────────
  1. Optimistic Updates (useRelatorioLeitura, useBeberAgua)
  2. useRef + Cleanup (useMeditar)
  3. DRY Principle (useCama, hooks reutilizáveis)
  4. Security by Design (xpLogController, Motivo table)
  5. ACID Transactions (consumoAguaController)
  6. Auto-criação de Recursos (leituraController, LivrosLidos)
  7. Foreign Keys + CASCADE (Models)
  8. INCLUDE/JOINs (Sequelize, leituraController)
  9. Time-Series Data (históricos com data_hora)
  10. Fail Fast Validation (antes do banco)
  11. Zero Trust Architecture (nunca confiar cliente)
  12. Repository Pattern (Models)
  13. Clean Architecture (Hook = logic, View = UI)
  14. MVC Pattern (Controller → Model ← Route)
  15. JWT Authentication (authMiddleware)


🎯 APRESENTAÇÃO (01 de julho 2026)
───────────────────────────────────────────────────────────
  Pontos principais:
  ✅ Bug fix (relatório leitura)
  ✅ Padrões (otimismo, transações, segurança)
  ✅ Performance (useRef, memory leaks)
  ✅ Arquitetura (Clean, MVC, Models)
  ✅ Gamificação (XP seguro, metas, níveis)

  Demonstrar:
  1. [useRelatorioLeitura.ts](https://...) - bug fix + otimismo
  2. [useMeditar.ts](https://...) - useRef + cleanup
  3. [xpLogController.js](https://...) - security by design
  4. [consumoAguaController.js](https://...) - ACID
  5. [leituraController.js](https://...) - auto-criação + joins


═════════════════════════════════════════════════════════
TODO: usuarioController, habitoController, relatorioController
      + 7 remaining hooks se tiver tempo
```

