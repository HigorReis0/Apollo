const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Motivo = require("./Motivo");
const XpLog = require("./XpLog");
const ConsumoAgua = require("./ConsumoAgua");
const Leitura = require("./Leitura");
const LivrosLidos = require("./LivrosLidos");
const Habito = require("./Habito");
const UsuarioHabito = require("./UsuarioHabito");
const Nivel = require("./Nivel");

// ============================================================
// ASSOCIAÇÕES RELACIONAIS (Sequelize ORM)
// ============================================================

// 1. Relacionamento Utilizador <-> ConsumoAgua (1:N)
Usuario.hasMany(ConsumoAgua, { foreignKey: "usuario_id", as: "consumosAgua" });
ConsumoAgua.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// 2. Relacionamento Utilizador <-> XpLog (1:N)
Usuario.hasMany(XpLog, { foreignKey: "usuario_id", as: "logsXP" });
XpLog.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// 3. Relacionamento Motivo <-> XpLog (1:N)
Motivo.hasMany(XpLog, { foreignKey: "id_motivo", as: "logsXP" });
XpLog.belongsTo(Motivo, { foreignKey: "id_motivo", as: "motivo" });

// 4. Relacionamento Utilizador <-> LivrosLidos (1:N)
Usuario.hasMany(LivrosLidos, { foreignKey: "usuario_id", as: "livros" });
LivrosLidos.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// 5. Relacionamento LivrosLidos <-> Leitura (1:N)
LivrosLidos.hasMany(Leitura, { foreignKey: "id_livro_lido", as: "sessoesLeitura" });
Leitura.belongsTo(LivrosLidos, { foreignKey: "id_livro_lido", as: "livro" });

// 6. Relacionamento Utilizador <-> Leitura (1:N)
Usuario.hasMany(Leitura, { foreignKey: "usuario_id", as: "leituras" });
Leitura.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// 7. Relacionamento Muitos-para-Muitos: Utilizador <-> Habito (através de UsuarioHabito)
Usuario.belongsToMany(Habito, {
  through: UsuarioHabito,
  foreignKey: "usuario_id",
  otherKey: "habito_id",
  as: "habitos"
});
Habito.belongsToMany(Usuario, {
  through: UsuarioHabito,
  foreignKey: "habito_id",
  otherKey: "usuario_id",
  as: "usuarios"
});

// Relacionamentos diretos da tabela intermediária para facilitar as pesquisas de rotina
Usuario.hasMany(UsuarioHabito, { foreignKey: "usuario_id", as: "rotinas" });
UsuarioHabito.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Habito.hasMany(UsuarioHabito, { foreignKey: "habito_id", as: "execucoes" });
UsuarioHabito.belongsTo(Habito, { foreignKey: "habito_id", as: "habito" });

module.exports = {
  sequelize,
  Usuario,
  Motivo,
  XpLog,
  ConsumoAgua,
  Leitura,
  LivrosLidos,
  Habito,
  UsuarioHabito,
  Nivel
};