const Usuario = require("./Usuario");
const XpLog = require("./XpLog");
const ConsumoAgua = require("./ConsumoAgua");
const Motivo = require("./Motivo");

// Associações do Banco de Dados
Usuario.hasMany(ConsumoAgua, { foreignKey: "usuario_id", as: "consumos_agua" });
ConsumoAgua.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Usuario.hasMany(XpLog, { foreignKey: "usuario_id", as: "logs_xp" });
XpLog.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Motivo.hasMany(XpLog, { foreignKey: "id_motivo", as: "logs_xp" });
XpLog.belongsTo(Motivo, { foreignKey: "id_motivo", as: "motivo" });

module.exports = {
  Usuario,
  XpLog,
  ConsumoAgua,
  Motivo
};