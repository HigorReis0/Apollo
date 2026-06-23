const express = require("express");
const cors = require("cors");
const path = require("path");

// Roteadores
const routes = require("./routes/usuarioRoutes");
const xpLogRoutes = require("./routes/xpLogRoutes");
const consumoAguaRoutes = require("./routes/consumoAguaRoutes"); 
const leituraRoutes = require("./routes/leituraRoutes");
const habitoRoutes = require("./routes/habitoRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Mapeamento das rotas base da API
app.use("/usuarios", routes);
app.use("/xp", xpLogRoutes);
app.use("/agua", consumoAguaRoutes); 
app.use("/leitura", leituraRoutes);
app.use("/habitos", habitoRoutes);

module.exports = app;