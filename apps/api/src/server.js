require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso");
    
    // Configura explicitamente o Host para '0.0.0.0' para expor a API à rede local (Intranet)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT} e aberto para requisições externas!`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err);
  });