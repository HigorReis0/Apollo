/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

const Usuario = require("../models/Usuario"); 
const bcrypt = require("bcryptjs"); 
const fs = require("fs"); 
const path = require("path"); 
const { OAuth2Client } = require("google-auth-library"); 
const jwt = require("jsonwebtoken"); 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ========= CREATE (CADASTRO MANUAL) =========
  async criar(req, res) {
    try {
      const { nome, email, senha, google_id } = req.body;
      if (!nome || !email || (!senha && !google_id)) {
        return res.status(400).json({ erro: "Dados insuficientes." });
      }
      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(409).json({ erro: "Email já cadastrado" });
      }
      const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
      const avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

      const usuario = await Usuario.create({ nome, email, senha: senhaHash, google_id, avatar_url });
      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.status(201).json(userJSON);
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LOGIN CONVENCIONAL (E-MAIL/SENHA) =========
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(401).json({ erro: "E-mail ou senha inválidos" });

      if (!usuario.senha && usuario.google_id) {
        return res.status(401).json({ erro: "Use o login com Google para esta conta." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ erro: "E-mail ou senha inválidos" });

      const token = jwt.sign({ usuario_id: usuario.usuario_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= LOGIN COM GOOGLE =========
  async loginGoogle(req, res) {
    try {
      const { idToken } = req.body;
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      const { sub: google_id, email, name: nome, picture: avatar_url } = payload;

      let usuario = await Usuario.findOne({ where: { google_id } });
      if (!usuario) {
        usuario = await Usuario.findOne({ where: { email } });
        if (usuario) {
          await usuario.update({ google_id, avatar_url: avatar_url ?? usuario.avatar_url });
        } else {
          usuario = await Usuario.create({ nome, email, google_id, avatar_url, senha: null });
        }
      }

      const token = jwt.sign({ usuario_id: usuario.usuario_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(401).json({ erro: "Token inválido" });
    }
  },

  // ========= LISTAR TODOS =========
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll({ attributes: { exclude: ["senha"] } });
      const baseUrl = `${req.protocol}://${req.get("host")}`;
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

  // ========= BUSCAR POR ID =========
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, { attributes: { exclude: ["senha"] } });
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

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

  // ========= UPDATE =========
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      let novoAvatar = usuario.avatar_url;
      if (req.file) {
        if (usuario.avatar_url) {
          const fotoAntiga = path.join(__dirname, "..", "..", usuario.avatar_url);
          if (fs.existsSync(fotoAntiga)) fs.unlinkSync(fotoAntiga);
        }
        novoAvatar = `/uploads/${req.file.filename}`;
      }
      await usuario.update({
        nome: nome ?? usuario.nome,
        email: email ?? usuario.email,
        senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
        avatar_url: novoAvatar,
      });
      const user = usuario.toJSON();
      delete user.senha;
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ========= PERFIL DO USUÁRIO LOGADO =========
async perfil(req, res) {
  try {
    const usuarioId = req.usuarioId; // Vem do middleware auth
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: { exclude: ["senha"] }
    });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

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

  // ========= DELETE =========
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
      if (usuario.avatar_url) {
        const fotoPath = path.join(__dirname, "..", "..", usuario.avatar_url);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }
      await usuario.destroy();
      return res.json({ sucesso: true, mensagem: "Conta removida" });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

};