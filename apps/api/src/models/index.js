const Usuario = require("./Usuario");
const XpLog = require("./XpLog");
const ConsumoAgua = require("./ConsumoAgua");
const Motivo = require("./Motivo");
const Leitura = require("./Leitura");


// Associações do Banco de Dados
Usuario.hasMany(ConsumoAgua, { foreignKey: "usuario_id", as: "consumos_agua" });
ConsumoAgua.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Usuario.hasMany(XpLog, { foreignKey: "usuario_id", as: "logs_xp" });
XpLog.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Motivo.hasMany(XpLog, { foreignKey: "id_motivo", as: "logs_xp" });
XpLog.belongsTo(Motivo, { foreignKey: "id_motivo", as: "motivo" });

Usuario.hasMany(Leitura, { foreignKey: 'usuario_id' });
Leitura.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
  Usuario,
  XpLog,
  ConsumoAgua,
  Motivo,
  Leitura
};