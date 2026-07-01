/* #################### -> IMPORTAÇÕES E CONFIGS INICIAIS <- #################### */

// Importa o model Usuario para interagir com a tabela tab_usuario
const Usuario = require("../models/Usuario");

// bcryptjs: biblioteca para hash de senhas (segurança)
const bcrypt = require("bcryptjs");

// fs e path: manipulação de arquivos (para upload de avatar)
const fs = require("fs");
const path = require("path");

// Google OAuth2: autenticação com Google (login social)
const { OAuth2Client } = require("google-auth-library");

// jwt: geração de tokens de autenticação (JSON Web Tokens)
const jwt = require("jsonwebtoken");

// Operadores do Sequelize (para consultas avançadas, como Op.notIn)
const { Op } = require("sequelize");

// Inicializa o cliente do Google com o Client ID do .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Diretório onde os avatars serão salvos (uploads/)
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// Cria o diretório se ele não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* #################### -> INÍCIO DO MÓDULO DE EXPORTAÇÃO <- #################### */

module.exports = {

  // ============================================================
  // MÉTODO: criar (CADASTRO MANUAL)
  // Rota: POST /usuarios
  // ============================================================
  /*
    O QUE FAZ?
    - Cria um novo usuário com nome, email, senha e avatar (opcional).
    - Gera um token JWT automaticamente, para o usuário já entrar logado.
    - Remove a senha do objeto retornado para não expor o hash.

    POR QUE ISSO É IMPORTANTE?
    - Evita que o usuário precise fazer login após o cadastro (melhor UX).
    - A senha é hasheada com bcrypt antes de salvar (segurança).

    BOA PRÁTICA:
    - "Fail Fast": validamos os dados antes de qualquer operação.
    - Removemos a senha do objeto retornado.
  */
  async criar(req, res) {
    try {
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

  // ============================================================
  // MÉTODO: login (E-MAIL/SENHA)
  // Rota: POST /usuarios/login
  // ============================================================
  /*
    O QUE FAZ?
    - Autentica o usuário com email e senha.
    - Retorna um token JWT se as credenciais estiverem corretas.

    POR QUE ISSO É IMPORTANTE?
    - O token JWT é usado para autorizar o usuário em todas as rotas protegidas.
    - A comparação de senha usa bcrypt.compare (seguro contra ataques de timing).

    BOA PRÁTICA:
    - Mensagem genérica de erro para evitar enumeração de usuários.
  */
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

      const token = jwt.sign(
        { usuario_id: usuario.usuario_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: loginGoogle (LOGIN COM GOOGLE)
  // Rota: POST /usuarios/login-google
  // ============================================================
  /*
    O QUE FAZ?
    - Autentica o usuário via Google OAuth2.
    - Se o usuário já existe, vincula o Google ID à conta.
    - Se não existe, cria uma nova conta com os dados do Google.

    POR QUE ISSO É IMPORTANTE?
    - Oferece uma alternativa de login sem senha (melhor UX).
    - Integra com a conta Google do usuário.

    BOA PRÁTICA:
    - Verificamos o ID token com o cliente Google (evita tokens falsos).
  */
  async loginGoogle(req, res) {
    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const { sub: google_id, email, name: nome, picture: avatar_url } = payload;

      let usuario = await Usuario.findOne({ where: { google_id } });

      if (!usuario) {
        usuario = await Usuario.findOne({ where: { email } });
        if (usuario) {
          await usuario.update({ google_id, avatar_url: avatar_url ?? usuario.avatar_url });
        } else {
          usuario = await Usuario.create({
            nome,
            email,
            google_id,
            avatar_url,
            senha: null
          });
        }
      }

      const token = jwt.sign(
        { usuario_id: usuario.usuario_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const userJSON = usuario.toJSON();
      delete userJSON.senha;
      return res.json({ usuario: userJSON, token });
    } catch (error) {
      return res.status(401).json({ erro: "Token inválido" });
    }
  },

  // ============================================================
  // MÉTODO: listar (LISTAR TODOS OS USUÁRIOS)
  // Rota: GET /usuarios (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Retorna todos os usuários cadastrados (excluindo senhas).
    - Constrói URLs completas para os avatars.

    POR QUE ISSO É IMPORTANTE?
    - Útil para administração ou para listar amigos.

    BOA PRÁTICA:
    - Excluímos o campo senha (segurança).
    - Adicionamos a URL completa do avatar.
  */
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

  // ============================================================
  // MÉTODO: buscarPorId (BUSCAR USUÁRIO POR ID)
  // Rota: GET /usuarios/:id (protegida)
  // ============================================================
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

  // ============================================================
  // MÉTODO: atualizar (ATUALIZAR USUÁRIO – COM SUPORTE A BASE64)
  // Rota: PUT /usuarios/:id (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Atualiza nome, email, senha e avatar do usuário.
    - Agora suporta duas formas de envio de avatar:
      a) Via FormData (multer) → usa req.file (upload tradicional)
      b) Via JSON → usa avatar_base64 (enviado como string base64)
    - Substitui o avatar antigo pelo novo (remove do disco).

    BOA PRÁTICA:
    - Se o avatar for atualizado, remove o arquivo antigo para não acumular lixo.
    - Compatível com ambas as abordagens (FormData e JSON).
  */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      // Extrai os campos do corpo da requisição (incluindo avatar_base64)
      const { nome, email, senha, avatar_base64 } = req.body;

      // Busca o usuário
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        // Se veio um arquivo de avatar, remove do disco (limpeza)
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Inicializa o novo avatar com o valor atual (para manter se não for alterado)
      let novoAvatar = usuario.avatar_url;

      // ============================================================
      // 1. SUPORTE A AVATAR VIA BASE64 (enviado pelo frontend no JSON)
      // ============================================================
      if (avatar_base64) {
        try {
          // Remove o prefixo "data:image/...;base64," se existir
          const base64Data = avatar_base64.replace(/^data:image\/\w+;base64,/, '');
          // Gera um nome único para o arquivo (timestamp)
          const filename = `avatar-${Date.now()}.jpg`;
          const filepath = path.join(uploadDir, filename);
          
          // Salva o arquivo no disco (writeFileSync com base64)
          fs.writeFileSync(filepath, base64Data, 'base64');
          novoAvatar = `/uploads/${filename}`;
          console.log(`Avatar salvo via base64: ${filepath}`);
        } catch (err) {
          console.error('Erro ao salvar avatar base64:', err);
          return res.status(500).json({ erro: "Erro ao processar a imagem." });
        }
      }

      // ============================================================
      // 2. SUPORTE A AVATAR VIA FORMDATA (multer) – mantido para compatibilidade
      // ============================================================
      if (req.file) {
        // Se o usuário já tinha um avatar, remove o arquivo antigo
        if (usuario.avatar_url) {
          const fotoAntiga = path.join(__dirname, "..", "..", usuario.avatar_url);
          if (fs.existsSync(fotoAntiga)) fs.unlinkSync(fotoAntiga);
        }
        novoAvatar = `/uploads/${req.file.filename}`;
      }

      // ============================================================
      // 3. ATUALIZA OS DADOS DO USUÁRIO
      // ============================================================
      await usuario.update({
        nome: nome ?? usuario.nome,
        email: email ?? usuario.email,
        senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
        avatar_url: novoAvatar,
      });

      // Remove a senha do objeto retornado (segurança)
      const user = usuario.toJSON();
      delete user.senha;
      return res.json(user);
    } catch (error) {
      console.error('[atualizar] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: perfil (PERFIL DO USUÁRIO LOGADO)
  // Rota: GET /usuarios/perfil (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Retorna os dados do usuário autenticado (sem senha).
    - Inclui os novos campos: data_nascimento, peso, altura.

    POR QUE ISSO É IMPORTANTE?
    - É a principal fonte de dados para a tela de Perfil.
  */
  async perfil(req, res) {
    try {
      const usuarioId = req.usuarioId;

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

  // ============================================================
  // MÉTODO: atualizarDadosPessoais (ATUALIZAR DADOS PESSOAIS)
  // Rota: PUT /usuarios/dados-pessoais (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Atualiza data_nascimento, peso e altura do usuário.

    POR QUE ISSO É IMPORTANTE?
    - Permite ao usuário preencher/editar seus dados pessoais.

    BOA PRÁTICA:
    - Validação do formato da data (YYYY-MM-DD) antes de salvar.
  */
  async atualizarDadosPessoais(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { data_nascimento, peso, altura } = req.body;

      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      if (data_nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(data_nascimento)) {
        return res.status(400).json({ erro: "Formato de data inválido. Use AAAA-MM-DD." });
      }

      await usuario.update({
        data_nascimento: data_nascimento || null,
        peso: peso !== undefined && peso !== null ? parseFloat(peso) : null,
        altura: altura !== undefined && altura !== null ? parseFloat(altura) : null,
      });

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
  // MÉTODO: habitosRecentes (ÚLTIMOS 4 HÁBITOS CONCLUÍDOS, SEM METAS)
  // Rota: GET /usuarios/habitos-recentes (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Retorna os 4 hábitos mais recentes que o usuário concluiu (bateu a meta).
    - Exclui os motivos de "meta" (bônus) para evitar duplicatas.
      Exemplo: se o usuário fez "Musculação" e "Meta Musculação", apenas "Musculação" aparece.

    POR QUE EXCLUIR AS METAS?
    - Para manter a lista mais limpa e representativa.
    - O usuário vê apenas o hábito base (ex: "Musculação") em vez de duas entradas.

    COMO FUNCIONA?
    1. Busca os últimos 10 logs de XP, ignorando os IDs de meta.
    2. Agrupa por motivo (mantém o mais recente de cada).
    3. Pega os 4 primeiros e formata para o frontend.

    POR QUE BUSCAR NO tab_xp_log?
    - É a fonte definitiva de hábitos concluídos (só registra quando a meta é batida).
  */
  async habitosRecentes(req, res) {
    try {
      const usuarioId = req.usuarioId;

      // Importa os models necessários
      const { XpLog, Motivo } = require("../models");

      // IDs dos motivos que representam "meta batida" (bônus)
      // Eles serão excluídos da lista para evitar duplicatas.
      const IDs_META = [3, 5, 9, 11, 15, 17, 21]; // conforme sua tab_motivo

      // 1. Busca os últimos 10 logs, excluindo as metas
      const logs = await XpLog.findAll({
        where: {
          usuario_id: usuarioId,
          id_motivo: { [Op.notIn]: IDs_META }  // <-- FILTRO PARA REMOVER METAS
        },
        include: [
          {
            model: Motivo,
            as: 'motivo',
            attributes: ['motivo_id', 'nome_motivo', 'descricao']
          }
        ],
        order: [['data_hora', 'DESC']],
        limit: 10
      });

      // 2. Agrupa manualmente por motivo (mantém o mais recente de cada)
      //    Usamos um Map para garantir que cada motivo apareça apenas uma vez.
      const mapaPorMotivo = new Map();
      logs.forEach(log => {
        const motivoId = log.motivo?.motivo_id;
        if (!motivoId) return;
        if (!mapaPorMotivo.has(motivoId)) {
          mapaPorMotivo.set(motivoId, log);
        }
        // Como os logs já estão ordenados por data_hora DESC, o primeiro que
        // encontrarmos de cada motivo já é o mais recente.
      });

      // 3. Converte o mapa para array e pega os primeiros 4
      const logsUnicos = Array.from(mapaPorMotivo.values()).slice(0, 4);

      // Mapeamento para nomes amigáveis de hábitos (ex: 'LEITURA' -> 'Leitura')
      const mapaHabitos = {
        'ARRUMAR_CAMA': { label: 'Arrumar a Cama' },
        'REGISTRO_AGUA': { label: 'Beber Água' },
        'LEITURA': { label: 'Leitura' },
        'MEDITACAO': { label: 'Meditação' },
        'CORRIDA': { label: 'Corrida' },
        'MUSCULACAO': { label: 'Musculação' },
        'SAUDE_BUCAL': { label: 'Saúde Bucal' },
        'SAUDE_BUCAL_COMPLETA': { label: 'Rotina Bucal Completa' },
        'SONO_REGULADO': { label: 'Sono Regulado' }
      };

      // 4. Mapeia cada log para o formato esperado pelo frontend
      const habitos = logsUnicos.map(log => {
        const nomeMotivo = log.motivo?.nome_motivo || '';
        const info = mapaHabitos[nomeMotivo] || { 
          label: nomeMotivo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        };

        return {
          id: log.motivo?.motivo_id || 0,
          label: info.label,
          xp: log.xp_ganho || 0,
          image: null, // será tratado pelo fallback no frontend
          mensagem: log.motivo?.descricao || `+${log.xp_ganho || 0} XP`
        };
      });

      return res.json(habitos);
    } catch (error) {
      console.error('[habitosRecentes] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: obterMetaLeitura (NOVO)
  // Rota: GET /usuarios/meta-leitura (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Retorna a meta mensal de páginas do usuário logado.
    - Se o usuário não tiver meta definida, retorna 500 (valor padrão).

    POR QUE ISSO É IMPORTANTE?
    - Permite que o frontend exiba a meta atual e o percentual de progresso.
    - A meta é personalizável, então o usuário pode definir sua própria meta.

    BOA PRÁTICA:
    - Usa a coluna `meta_leitura` da tabela `tab_usuario`.
    - Fallback para 500 se o campo for null.
  */
  async obterMetaLeitura(req, res) {
    try {
      const usuarioId = req.usuarioId;

      // Busca apenas o campo meta_leitura do usuário
      const usuario = await Usuario.findByPk(usuarioId, {
        attributes: ['meta_leitura']
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Retorna a meta (se null, fallback para 500)
      return res.json({ meta: usuario.meta_leitura || 500 });
    } catch (error) {
      console.error('[obterMetaLeitura] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: atualizarMetaLeitura (NOVO)
  // Rota: PUT /usuarios/meta-leitura (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Atualiza a meta mensal de páginas do usuário.
    - Recebe um número inteiro positivo (meta).

    POR QUE ISSO É IMPORTANTE?
    - Permite que o usuário personalize sua meta de leitura mensal.
    - A meta é usada para calcular o percentual de progresso no relatório.

    BOA PRÁTICA:
    - Validação: meta deve ser um número positivo.
    - Atualiza apenas o campo meta_leitura do usuário.
  */
  async atualizarMetaLeitura(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { meta } = req.body;

      // Validação: meta deve ser um número positivo
      if (!meta || typeof meta !== 'number' || meta <= 0) {
        return res.status(400).json({
          erro: "Meta inválida. Deve ser um número positivo."
        });
      }

      // Busca o usuário
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // Atualiza a meta
      await usuario.update({ meta_leitura: meta });

      // Retorna a meta atualizada
      return res.json({
        mensagem: "Meta atualizada com sucesso!",
        meta: meta
      });
    } catch (error) {
      console.error('[atualizarMetaLeitura] Erro:', error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============================================================
  // MÉTODO: deletar (DELETAR USUÁRIO)
  // Rota: DELETE /usuarios/:id (protegida)
  // ============================================================
  /*
    O QUE FAZ?
    - Remove o usuário do banco e também seu avatar do disco.

    BOA PRÁTICA:
    - Remove o arquivo de avatar do disco para não acumular lixo.
  */
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