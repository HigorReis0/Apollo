const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Pega o token que vem no cabeçalho (Header) da requisição
  const authHeader = req.headers.authorization;

  // 2. Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido. Acesso negado." });
  }

  /**
   * O padrão de mercado é enviar: "Bearer <token>"
   * Vamos dividir a string para pegar apenas o código do token
   */
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Erro no formato do token." });
  }

  const [scheme, token] = parts;

  // Verifica se a palavra 'Bearer' está lá (ignora maiúsculas/minúsculas)
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Token malformatado." });
  }

  // 3. Validação final usando a sua chave secreta do .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: "Token inválido ou expirado." });
    }

    // 4. Se deu tudo certo, salva o ID do usuário dentro da requisição (req)
    // Assim, o próximo Controller saberá exatamente QUEM está fazendo o pedido
    req.usuarioId = decoded.usuario_id;

    // 5. Autoriza a requisição a seguir para o Controller
    return next();
  });
};