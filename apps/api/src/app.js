const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AJUSTE: O path.join precisa de ".." para sair de 'src' e achar 'uploads' na raiz
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rotas de usuário
app.use("/usuarios", routes);

// Exporta o app para o server.js rodar
module.exports = app;