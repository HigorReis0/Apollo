// ============================================================
// IMPORTAÇÕES
// ============================================================

const express = require("express");
const cors = require("cors");
const path = require("path");

// Roteadores
const routes = require("./routes/usuarioRoutes");
const xpLogRoutes = require("./routes/xpLogRoutes");
const consumoAguaRoutes = require("./routes/consumoAguaRoutes");
const leituraRoutes = require("./routes/leituraRoutes");
const habitoRoutes = require("./routes/habitoRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes")

const app = express();

// ============================================================
// MIDDLEWARES GLOBAIS COM LIMITE DE PAYLOAD (20MB)
// ============================================================

app.use(cors());
app.use(express.json({ limit: '20mb' }));              
app.use(express.urlencoded({ extended: true, limit: '20mb' })); 

// Servir arquivos estáticos (avatares)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ============================================================
// ROTAS DA API
// ============================================================

app.use("/usuarios", routes);
app.use("/xp", xpLogRoutes);
app.use("/agua", consumoAguaRoutes);
app.use("/leitura", leituraRoutes);
app.use("/habitos", habitoRoutes);
app.use("/relatorio", relatorioRoutes);

module.exports = app;