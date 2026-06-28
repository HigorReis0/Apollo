/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

// Importa o model Usuario para interagir com a tabela tab_usuario
const Usuario = require("../models/Usuario");

// bcryptjs: biblioteca para hash de senhas (segurança)
const bcrypt = require("bcryptjs");

// fs e path: manipulação de arquivos (para upload de avatar)
const fs = require("fs");
const path = require("path");

// Google OAuth2: autenticação com Google
const { OAuth2Client } = require("google-auth-library");

// jwt: geração de tokens de autenticação
const jwt = require("jsonwebtoken");

// Inicializa o cliente do Google com o Client ID do .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Diretório onde os avatars serão salvos
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// Cria o diretório se ele não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ========= CREATE (CADASTRO MANUAL) =========
  // Rota: POST /usuarios
  // Cria um novo usuário com nome, email, senha e avatar (opcional)
  async criar(req, res) {
    try {
      // Extrai os dados enviados pelo frontend
      const { nome, email, senha, google_id } = req.body;

      // Validação: nome, email e ao menos uma forma de autenticação são obrigatórios
      if (!nome || !email || (!senha && !google_id)) {
        return res.status(400).json({ erro: "Dados insuficientes." });
      }

      // Verifica se o email já está cadastrado (evita duplicidade)
      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        // Se veio um arquivo de avatar, remove do disco para não acumular lixo
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({ erro: "Email já cadastrado" });
      }

      // Gera o hash da senha com bcrypt (salt de 10 rounds)
      const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;

      // Se o usuário enviou uma foto, salva o caminho relativo
      const avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

      // Cria o usuário no banco
      const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        google_id,
        avatar_url
      });

      // Gera o token JWT (permite login automático após cadastro)
      const token = jwt.sign(
        { usuario_id: usuario.usuario_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove a senha do objeto antes de retornar (segurança)
      const userJSON = usuario.toJSON();
      delete userJSON.senha;

      // Retorna o usuário criado + token
      return res.status(201).json({ usuario: userJSON, token });

    } catch (error) {
      // Em caso de erro, remove o avatar enviado (se houver)
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LOGIN CONVENCIONAL (E-MAIL/SENHA) =========
  // Rota: POST /usuarios/login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário pelo email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(401).json({ erro: "E-mail ou senha inválidos" });

      // Se o usuário tem apenas login com Google, avisa
      if (!usuario.senha && usuario.google_id) {
        return res.status(401).json({ erro: "Use o login com Google para esta conta." });
      }

      // Compara a senha fornecida com o hash armazenado
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ erro: "E-mail ou senha inválidos" });

      // Gera o token JWT
      const token = jwt.sign(
        { usuario_id: usuario.usuario_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove a senha do objeto retornado
      const userJSON = usuario.toJSON();
      delete userJSON.senha;

      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LOGIN COM GOOGLE =========
  // Rota: POST /usuarios/login-google
  async loginGoogle(req, res) {
    try {
      const { idToken } = req.body;

      // Verifica o token do Google
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const { sub: google_id, email, name: nome, picture: avatar_url } = payload;

      // Procura o usuário pelo google_id
      let usuario = await Usuario.findOne({ where: { google_id } });

      if (!usuario) {
        // Se não encontrou, tenta pelo email (vincula a conta existente)
        usuario = await Usuario.findOne({ where: { email } });
        if (usuario) {
          // Vincula o google_id à conta existente
          await usuario.update({ google_id, avatar_url: avatar_url ?? usuario.avatar_url });
        } else {
          // Cria um novo usuário com os dados do Google
          usuario = await Usuario.create({
            nome,
            email,
            google_id,
            avatar_url,
            senha: null // sem senha, pois login é via Google
          });
        }
      }

      // Gera o token JWT
      const token = jwt.sign(
        { usuario_id: usuario.usuario_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove a senha (se existir) e retorna
      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(401).json({ erro: "Token inválido" });
    }
  },

  // ========= LISTAR TODOS OS USUÁRIOS =========
  // Rota: GET /usuarios (protegida)
  async listar(req, res) {
    try {
      // Busca todos os usuários, excluindo o campo senha
      const usuarios = await Usuario.findAll({ attributes: { exclude: ["senha"] } });

      // Constrói a URL base para os avatars
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      // Mapeia os usuários para incluir a URL completa do avatar
      const resultado = usuarios.map(u => {
        const user = u.toJSON();
        if (user.avatar_url && !user.avatar_url.startsWith("http")) {
          user.avatar_url = `${baseUrl}${user.avatar_url}`;
        }
        return user;
      });
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= BUSCAR USUÁRIO POR ID =========
  // Rota: GET /usuarios/:id (protegida)
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      // Busca o usuário pelo ID, excluindo a senha
      const usuario = await Usuario.findByPk(id, { attributes: { exclude: ["senha"] } });
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      // Adiciona a URL completa do avatar
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const user = usuario.toJSON();
      if (user.avatar_url && !user.avatar_url.startsWith("http")) {
        user.avatar_url = `${baseUrl}${user.avatar_url}`;
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= ATUALIZAR USUÁRIO (nome, email, senha, avatar) =========
  // Rota: PUT /usuarios/:id (protegida)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      // Busca o usuário
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Se veio um novo avatar, substitui o antigo
      let novoAvatar = usuario.avatar_url;
      if (req.file) {
        if (usuario.avatar_url) {
          const fotoAntiga = path.join(__dirname, "..", "..", usuario.avatar_url);
          if (fs.existsSync(fotoAntiga)) fs.unlinkSync(fotoAntiga);
        }
        novoAvatar = `/uploads/${req.file.filename}`;
      }

      // Atualiza os campos fornecidos
      await usuario.update({
        nome: nome ?? usuario.nome,
        email: email ?? usuario.email,
        senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
        avatar_url: novoAvatar,
      });

      // Remove a senha e retorna
      const user = usuario.toJSON();
      delete user.senha;
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= PERFIL DO USUÁRIO LOGADO =========
  // Rota: GET /usuarios/perfil (protegida)
  // Retorna os dados do usuário autenticado (sem senha)
  async perfil(req, res) {
    try {
      // O ID do usuário vem do middleware auth (req.usuarioId)
      const usuarioId = req.usuarioId;

      // Busca o usuário, excluindo a senha
      const usuario = await Usuario.findByPk(usuarioId, {
        attributes: { exclude: ["senha"] }
      });
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Adiciona a URL completa do avatar
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const user = usuario.toJSON();
      if (user.avatar_url && !user.avatar_url.startsWith("http")) {
        user.avatar_url = `${baseUrl}${user.avatar_url}`;
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // ENDPOINT: ATUALIZAR DADOS PESSOAIS
  // Rota: PUT /usuarios/dados-pessoais (protegida)
  // ============================================================
  async atualizarDadosPessoais(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { data_nascimento, peso, altura } = req.body;

      // Busca o usuário
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Validação do formato da data (YYYY-MM-DD)
      if (data_nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) {
        return res.status(400).json({ erro: "Formato de data inválido. Use AAAA-MM-DD." });
      }

      // Atualiza apenas os campos fornecidos
      await usuario.update({
        data_nascimento: data_nascimento || null,
        peso: peso !== undefined && peso !== null ? parseFloat(peso) : null,
        altura: altura !== undefined && altura !== null ? parseFloat(altura) : null,
      });

      // Recarrega o usuário atualizado (sem senha)
      const usuarioAtualizado = await Usuario.findByPk(usuarioId, {
        attributes: { exclude: ["senha"] }
      });

      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error("[atualizarDadosPessoais] Erro:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // ENDPOINT: BUSCAR HÁBITOS RECENTES (ÚLTIMOS 4 CONCLUÍDOS)
  // Rota: GET /usuarios/habitos-recentes (protegida)
  // ============================================================
  // ATENÇÃO: Agora filtra apenas hábitos com status = 'concluido'
  // Isso garante que apareçam apenas os hábitos em que o usuário
  // realmente atingiu a meta, não apenas registros intermediários.
  async habitosRecentes(req, res) {
    try {
      const usuarioId = req.usuarioId;

      // Importa os models relacionados
      const { UsuarioHabito, Habito } = require("../models");

      // Busca os últimos 4 registros de hábitos CONCLUÍDOS
      // Filtra por usuario_id e status = 'concluido'
      const registros = await UsuarioHabito.findAll({
        where: {
          usuario_id: usuarioId,
          status: 'concluido'    // <-- FILTRO ADICIONADO: apenas hábitos concluídos (meta batida)
        },
        include: [
          {
            model: Habito,
            as: 'habito',
            attributes: ['habito_id', 'nome', 'icone_url']
          }
        ],
        order: [['data_execucao', 'DESC']], // Mais recentes primeiro
        limit: 4                            // Apenas os 4 últimos
      });

      // Mapeia os resultados para o formato esperado pelo frontend
      const habitos = registros.map(r => ({
        id: r.habito?.habito_id || 0,
        label: r.habito?.nome || 'Hábito',
        image: r.habito?.icone_url || null
      }));

      return res.json(habitos);
    } catch (error) {
      console.error('[habitosRecentes] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= DELETE =========
  // Rota: DELETE /usuarios/:id (protegida)
  // Remove o usuário (e seu avatar do disco)
  async deletar(req, res) {
    try {
      const { id } = req.params;

      // Busca o usuário
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      // Remove o avatar do disco (se existir)
      if (usuario.avatar_url) {
        const fotoPath = path.join(__dirname, "..", "..", usuario.avatar_url);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }

      // Remove o usuário do banco
      await usuario.destroy();
      return res.json({ sucesso: true, mensagem: "Conta removida" });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

};