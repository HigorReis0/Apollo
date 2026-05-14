const express = require("express");
const cors = require("cors");
const path = require("path");

// Importação das rotas (Modularização por domínios de negócio)
const usuarioRoutes = require("./routes/usuarioRoutes");
const xpLogRoutes = require("./routes/xpLogRoutes");

const app = express();

// Middlewares de Parsing e Cross-Origin
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AJUSTE: O path.join precisa de ".." para sair de 'src' e achar 'uploads' na raiz
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// #################### -> REGISTRO DE ROTAS <- ####################

// Rotas de usuário
app.use("/usuarios", usuarioRoutes);

// Rotas de Log de Experiência (Gamification Logic)
// Definimos o prefixo /xp para concentrar todas as operações de log
app.use("/xp", xpLogRoutes);

// Exporta o app para o server.js rodar
module.exports = app;