// ============================================================
// IMPORTAÇÕES
// ============================================================
// express: framework HTTP
// Router: criador de rotas
const express = require("express");
const routes = express.Router();

// Controller que implementa a lógica dos endpoints
const usuarioController = require("../controllers/usuarioController");

// Middleware de upload: processa FormData com arquivo (avatar)
const upload = require("../config/multer");

// Middleware de autenticação: valida JWT
const authMiddleware = require("../middlewares/auth");

// ============================================================
// ROUTES: USUÁRIOS
// ============================================================
// Responsabilidade: Endpoints para autenticação e gerenciamento de usuários
// Padrão: /usuarios/[ação]
//
// Estrutura:
// 1. Rotas públicas: CREATE (signup), LOGIN, LOGIN_GOOGLE
// 2. Rotas privadas específicas: perfil, meta-leitura, dados-pessoais
// 3. Rotas privadas dinâmicas: /:id (GET, PUT, DELETE)
//
// IMPORTANTE: Rotas estáticas ANTES de rotas dinâmicas!
// Se "/:id" viesse antes de "/perfil", "perfil" seria interpretado como ID

// ============================================================
// ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
// ============================================================

// ============================================================
// POST /usuarios
// ============================================================
// Descrição: Cadastra novo usuário (signup manual)
// Autenticação: NÃO
// Body: FormData { nome, email, senha, avatar: File }
// Resposta: { usuario_id, nome, email, avatar_url, mensagem: "Cadastro realizado!" }
//
// Upload: Aceita arquivo de avatar (imagem)
// - upload.single("avatar") processa FormData
// - Arquivo é enviado para serviço de storage (AWS S3, etc)
// - Retorna avatar_url (URL pública da imagem)
//
// Fluxo:
// 1. Valida email (não existe ainda?)
// 2. Valida senha (força mínima?)
// 3. Faz hash da senha com bcrypt
// 4. Faz upload do avatar (se fornecido)
// 5. INSERT tab_usuario
// 6. Retorna dados do usuário criado
//
// Segurança:
// - Senha armazenada com hash bcrypt (irreversível)
// - Email único no banco (UNIQUE constraint)
// - Validação de entrada
routes.post("/", upload.single("avatar"), usuarioController.criar);

// ============================================================
// POST /usuarios/login
// ============================================================
// Descrição: Autenticação com email + senha
// Autenticação: NÃO
// Body: { email: string, senha: string }
// Resposta: { usuario_id, nome, email, token: JWT }
//
// Fluxo:
// 1. Busca usuário por email
// 2. Compara senha fornecida com hash no banco (bcrypt.compare)
// 3. Se correto: gera JWT com usuario_id
// 4. Retorna token (armazenar no app local para requisições futuras)
//
// JWT (JSON Web Token):
// - Contém usuario_id
// - Válido por tempo limitado (ex: 7 dias)
// - Enviado em header: "Authorization: Bearer <token>"
// - Middleware auth valida em cada requisição privada
//
// Segurança: HTTPS obrigatório (token viaja na rede)
routes.post("/login", usuarioController.login);

// ============================================================
// POST /usuarios/login-google
// ============================================================
// Descrição: Autenticação via Google OAuth2
// Autenticação: NÃO (mas requer token Google válido)
// Body: { google_id: string, nome: string, email: string, avatar_url?: string }
// Resposta: { usuario_id, nome, email, token: JWT }
//
// Fluxo:
// 1. Frontend faz login com Google (via Google SDK)
// 2. Recebe google_id do Google (token verificado pelo Google)
// 3. Envia google_id ao backend
// 4. Backend:
//    a. Busca usuário com este google_id
//    b. Se não existe: cria novo usuário
//    c. Se existe: retorna dados existentes
// 5. Gera JWT e retorna
//
// Vantagem: Sem senha (Google gerencia autenticação)
// Padrão: Federated Authentication (terceiro confiável)
routes.post("/login-google", usuarioController.loginGoogle);

// ============================================================
// ROTAS PRIVADAS — ESPECÍFICAS
// ============================================================
// Devem vir ANTES das rotas dinâmicas /:id
// Motivo: Express processa de cima para baixo
// Se /:id viesse antes, "/perfil" seria lido como id="perfil"

// ============================================================
// GET /usuarios/perfil
// ============================================================
// Descrição: Retorna dados do usuário autenticado
// Autenticação: Requerida
// Parâmetros: Nenhum (usa req.usuarioId do JWT)
// Resposta: { usuario_id, nome, email, avatar_url, data_nascimento, peso, altura }
//
// Caso de uso:
// - Carregar tela de perfil
// - Exibir dados pessoais
// - Pré-preencher formulários de edição
//
// Segurança: Middleware garante que só vê próprios dados
routes.get("/perfil", authMiddleware, usuarioController.perfil);

// ============================================================
// GET /usuarios/meta-leitura
// ============================================================
// Descrição: Retorna meta de leitura do usuário
// Autenticação: Requerida
// Resposta: { meta: number (páginas/mês) }
//
// Padrão: 500 páginas/mês se não informado
// Usado em: tela de relatório (relatorioLeitura.tsx)
//
// Bug fix: Antes, salvarMeta() chamava carregarDados() → refetch servidor
// Resultado: número novo era sobrescrito pelo valor antigo
// Solução: Optimistic Update (atualiza local, confirma em background)
routes.get("/meta-leitura", authMiddleware, usuarioController.obterMetaLeitura);

// ============================================================
// PUT /usuarios/meta-leitura
// ============================================================
// Descrição: Atualiza meta de leitura
// Autenticação: Requerida
// Body: { meta: number }
// Resposta: { mensagem: "Meta atualizada com sucesso!", nova_meta: number }
//
// Validação:
// - meta deve ser número positivo
// - Tipicamente: 200-1000 páginas/mês
//
// Padrão Optimistic Update:
// 1. Frontend: setMeta(novoValor) → UI atualiza IMEDIATAMENTE
// 2. Backend: PUT /usuarios/meta-leitura { meta: novoValor } (background)
// 3. Confirmação: se sucesso, ótimo. Se falhar, rollback local
//
// Resultado: feedback imediato ao usuário (melhor UX)
routes.put("/meta-leitura", authMiddleware, usuarioController.atualizarMetaLeitura);

// ============================================================
// PUT /usuarios/dados-pessoais
// ============================================================
// Descrição: Atualiza dados pessoais do usuário
// Autenticação: Requerida
// Body: { data_nascimento?: DATE, peso?: number, altura?: number }
// Resposta: { mensagem: "Dados atualizados!", usuario }
//
// Campos atualizáveis:
// - data_nascimento: DATE (2000-01-15)
// - peso: DECIMAL(5,2) em kg (ex: 72.5)
// - altura: DECIMAL(4,2) em metros (ex: 1.75)
//
// Caso de uso:
// - Tela de perfil (editar dados pessoais)
// - Validação: altura deve estar entre 1.0 e 2.5m, peso 20-250kg
//
// Cálculos no frontend:
// - IMC = peso / (altura * altura)
// - Idade = hoje - data_nascimento
// - Mostrar ao usuário dinamicamente
routes.put("/dados-pessoais", authMiddleware, usuarioController.atualizarDadosPessoais);

// ============================================================
// GET /usuarios/habitos-recentes
// ============================================================
// Descrição: Retorna últimos 4 hábitos registrados
// Autenticação: Requerida
// Resposta: [{ id_habito_usuario, habito_id, data_execucao, status }, ...]
//
// Limite: 4 últimos (para não ocupar muito espaço na tela)
// Ordenação: DESC (mais recentes primeiro)
//
// Caso de uso:
// - Widget na tela inicial
// - Mostrar "Atividades recentes"
// - Motivação visual (histórico recente)
routes.get("/habitos-recentes", authMiddleware, usuarioController.habitosRecentes);

// ============================================================
// GET /usuarios (lista todos)
// ============================================================
// Descrição: Lista todos os usuários (admin)
// Autenticação: Requerida (verificação se é admin deveria estar aqui)
// Resposta: [{ usuario_id, nome, email, avatar_url }, ...]
//
// AVISO: Endpoint sensível!
// Idealmente teria verificação de permissão (isAdmin)
// Por enquanto: apenas autenticação (qualquer usuário pode listar)
//
// Caso de uso:
// - Dashboard admin
// - Estatísticas
// - Gerenciamento de usuários
routes.get("/", authMiddleware, usuarioController.listar);

// ============================================================
// ROTAS PRIVADAS — DINÂMICAS
// ============================================================
// Devem vir POR ÚLTIMO (após todas as rotas estáticas)

// ============================================================
// GET /usuarios/:id
// ============================================================
// Descrição: Busca um usuário específico pelo ID
// Autenticação: Requerida
// Parâmetros: :id = usuario_id
// Resposta: { usuario_id, nome, email, avatar_url, data_nascimento, peso, altura }
//
// Segurança: Deveria verificar se é o próprio usuário ou admin
// Atualmente: qualquer autenticado pode ver qualquer usuário
//
// Caso de uso:
// - Perfil de outro usuário (social features)
// - Admin buscando detalhes específicos
routes.get("/:id", authMiddleware, usuarioController.buscarPorId);

// ============================================================
// PUT /usuarios/:id
// ============================================================
// Descrição: Atualiza usuário (nome, email, avatar)
// Autenticação: Requerida
// Parâmetros: :id = usuario_id
// Body: FormData { nome?: string, email?: string, avatar: File }
// Resposta: { mensagem: "Usuário atualizado!", usuario }
//
// Upload: FormData com arquivo de avatar
// - Novo arquivo substitui anterior no storage
// - avatar_url atualizado no banco
//
// Segurança: Deveria verificar se é o próprio usuário
// Atualmente: qualquer autenticado pode editar qualquer usuário (BUG!)
//
// Validações:
// - Email único (se mudou)
// - Nome não vazio
// - Avatar é imagem (jpg, png)
routes.put("/:id", authMiddleware, upload.single("avatar"), usuarioController.atualizar);

// ============================================================
// DELETE /usuarios/:id
// ============================================================
// Descrição: Deleta um usuário
// Autenticação: Requerida
// Parâmetros: :id = usuario_id
// Resposta: { mensagem: "Usuário deletado!" }
//
// O que acontece ao deletar:
// - CASCADE: todos os registros relacionados são deletados
//   - tab_xp_log (histórico XP)
//   - tab_consumo_agua (histórico água)
//   - tab_leitura (sessões leitura)
//   - tab_livros_lidos (livros)
//   - etc
//
// Segurança: Deveria verificar se é o próprio usuário
// Atualmente: qualquer autenticado pode deletar qualquer usuário (CRÍTICO!)
//
// Recomendação: Implementar soft-delete (marcar como deletado, não remover)
// Para não perder dados históricos
routes.delete("/:id", authMiddleware, usuarioController.deletar);

// ============================================================
// EXPORTAÇÃO
// ============================================================
// Exporta o router para usar no app.js
// Exemplo: app.use('/usuarios', usuarioRoutes)
module.exports = routes;