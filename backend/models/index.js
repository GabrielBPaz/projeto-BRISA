// backend/models/index.js - CENTRALIZADO

// Imports iniciais
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);

// Importando todos os modelos
const OrgaoPublico      = require("./OrgaoPublico")(sequelize, Sequelize.DataTypes);
const Empresa           = require("./Empresa")(sequelize, Sequelize.DataTypes);
const Licitacao         = require("./Licitacao")(sequelize, Sequelize.DataTypes);
const Empenho           = require("./Empenho")(sequelize, Sequelize.DataTypes);
const ItemEmpenho       = require("./ItemEmpenho")(sequelize, Sequelize.DataTypes);
const NotaFiscal        = require("./NotaFiscal")(sequelize, Sequelize.DataTypes);
const AtaRegistro       = require("./AtaRegistro")(sequelize, Sequelize.DataTypes);
const Entrega           = require("./Entrega")(sequelize, Sequelize.DataTypes);
const Pagamento         = require("./Pagamento")(sequelize, Sequelize.DataTypes);
const Alerta            = require("./Alerta")(sequelize, Sequelize.DataTypes);
const HistoricoInteracao= require("./HistoricoInteracao")(sequelize, Sequelize.DataTypes);
const Usuario           = require("./Usuario")(sequelize, Sequelize.DataTypes);
const Documento         = require("./Documento")(sequelize, Sequelize.DataTypes);
const Comentario        = require("./Comentario")(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  OrgaoPublico,
  Empresa,
  Licitacao,
  Empenho,
  ItemEmpenho,
  NotaFiscal,
  AtaRegistro,
  Entrega,
  Pagamento,
  Alerta,
  HistoricoInteracao,
  Usuario,
  Documento,
  Comentario,
};

// ==========================================
// DEFINIÇÃO CENTRALIZADA DE RELACIONAMENTOS
// ==========================================

// --- Relações Principais ---
Licitacao.belongsTo(OrgaoPublico, { foreignKey: "orgao_id", as: "orgao" });
OrgaoPublico.hasMany(Licitacao, { foreignKey: "orgao_id", as: "licitacoes" });

Licitacao.belongsTo(Empresa, { foreignKey: "empresa_id", as: "empresa" });
Empresa.hasMany(Licitacao, { foreignKey: "empresa_id", as: "licitacoes_vencidas" });

// --- Relações da Licitação ---
Licitacao.hasMany(AtaRegistro,    { foreignKey: "licitacao_id", as: "atas" });
AtaRegistro.belongsTo(Licitacao,  { foreignKey: "licitacao_id", as: "licitacao" });

Licitacao.hasMany(Empenho,        { foreignKey: "licitacao_id", as: "empenhos" });
Empenho.belongsTo(Licitacao,      { foreignKey: "licitacao_id", as: "licitacao" });

Licitacao.hasMany(Entrega,        { foreignKey: "licitacao_id", as: "entregas_licitacao" }); // Relação secundária com Entrega
Entrega.belongsTo(Licitacao,      { foreignKey: "licitacao_id", as: "licitacao" }); // Relação secundária com Entrega

Licitacao.hasMany(NotaFiscal,     { foreignKey: "licitacao_id", as: "notasFiscais" });
NotaFiscal.belongsTo(Licitacao,   { foreignKey: "licitacao_id", as: "licitacao" });

Licitacao.hasMany(Documento,      { foreignKey: "licitacao_id", as: "documentos" });
Documento.belongsTo(Licitacao,    { foreignKey: "licitacao_id", as: "licitacao" });

Licitacao.hasMany(Comentario,     { foreignKey: "licitacao_id", as: "comentarios" });
Comentario.belongsTo(Licitacao,   { foreignKey: "licitacao_id", as: "licitacao" });

// --- Relações do Empenho ---
Empenho.hasMany(ItemEmpenho,      { foreignKey: "empenho_id", as: "itens" });
ItemEmpenho.belongsTo(Empenho,    { foreignKey: "empenho_id", as: "empenho" });

Empenho.hasMany(Entrega,          { foreignKey: "empenho_id", as: "entregas" }); // Relação principal com Entrega
Entrega.belongsTo(Empenho,        { foreignKey: "empenho_id", as: "empenho" }); // Relação principal com Entrega

// --- Outras Relações ---
NotaFiscal.hasMany(Pagamento,     { foreignKey: "nota_fiscal_id", as: "pagamentos" });
Pagamento.belongsTo(NotaFiscal,   { foreignKey: "nota_fiscal_id", as: "notaFiscal" });

Alerta.belongsTo(Licitacao,   { foreignKey: "licitacao_id", as: "licitacao" });
Alerta.belongsTo(Usuario,     { foreignKey: "usuario_id",   as: "usuario" });

HistoricoInteracao.belongsTo(Licitacao, { foreignKey: "licitacao_id", as: "licitacao" });
HistoricoInteracao.belongsTo(Usuario,   { foreignKey: "usuario_id", as: "usuario" });

Usuario.belongsTo(Empresa, { foreignKey: "empresa_id", as: "empresa" });
Empresa.hasMany(Usuario, { foreignKey: "empresa_id", as: "usuarios" });

Usuario.hasMany(Documento, { foreignKey: "usuario_id", as: "documentos_usuario" });
Documento.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

Usuario.hasMany(Comentario, { foreignKey: "usuario_id", as: "comentarios_usuario" });
Comentario.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });

// REMOVIDO: Chamada explícita dos métodos associate
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// Exportando tudo
module.exports = db;

