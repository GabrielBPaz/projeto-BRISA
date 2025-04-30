// Imports iniciais
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);

const OrgaoPublico      = require('./OrgaoPublico')(sequelize, Sequelize.DataTypes);
const Empresa           = require('./Empresa')(sequelize, Sequelize.DataTypes);
const Licitacao         = require('./Licitacao')(sequelize, Sequelize.DataTypes);
const Empenho           = require('./Empenho')(sequelize, Sequelize.DataTypes);
const ItemEmpenho       = require('./ItemEmpenho')(sequelize, Sequelize.DataTypes);
const NotaFiscal        = require('./NotaFiscal')(sequelize, Sequelize.DataTypes);
const AtaRegistro       = require('./AtaRegistro')(sequelize, Sequelize.DataTypes);
const Entrega           = require('./Entrega')(sequelize, Sequelize.DataTypes);
const Pagamento         = require('./Pagamento')(sequelize, Sequelize.DataTypes);
const Alerta            = require('./Alerta')(sequelize, Sequelize.DataTypes);
const HistoricoInteracao= require('./HistoricoInteracao')(sequelize, Sequelize.DataTypes);
const Usuario           = require('./Usuario')(sequelize, Sequelize.DataTypes);

// =====================
// RELACIONAMENTOS
// =====================

// Uma Licitação pertence a um Órgão e uma Empresa (fornecedora)
Licitacao.belongsTo(OrgaoPublico, { foreignKey: 'orgao_id', as: 'orgao' });
OrgaoPublico.hasMany(Licitacao, { foreignKey: 'orgao_id', as: 'licitacoes' });

Licitacao.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });
Empresa.hasMany(Licitacao, { foreignKey: 'empresa_id', as: 'licitacoes_vencidas' });

// Uma Licitação pode ter muitas Atas de Registro, Empenhos, Entregas, Notas Fiscais
Licitacao.hasMany(AtaRegistro,    { foreignKey: 'licitacao_id', as: 'atas' });
AtaRegistro.belongsTo(Licitacao,  { foreignKey: 'licitacao_id', as: 'licitacao' });

Licitacao.hasMany(Empenho,        { foreignKey: 'licitacao_id', as: 'empenhos' });
Empenho.belongsTo(Licitacao,      { foreignKey: 'licitacao_id', as: 'licitacao' });

Licitacao.hasMany(Entrega,        { foreignKey: 'licitacao_id', as: 'entregas' });
Entrega.belongsTo(Licitacao,      { foreignKey: 'licitacao_id', as: 'licitacao' });

Licitacao.hasMany(NotaFiscal,     { foreignKey: 'licitacao_id', as: 'notasFiscais' });
NotaFiscal.belongsTo(Licitacao,   { foreignKey: 'licitacao_id', as: 'licitacao' });

// Empenho tem vários Itens de Empenho
Empenho.hasMany(ItemEmpenho,      { foreignKey: 'empenho_id', as: 'itens' });
ItemEmpenho.belongsTo(Empenho,    { foreignKey: 'empenho_id', as: 'empenho' });

// Nota Fiscal tem vários Pagamentos (um-para-muitos)
NotaFiscal.hasMany(Pagamento,     { foreignKey: 'nota_fiscal_id', as: 'pagamentos' });
Pagamento.belongsTo(NotaFiscal,   { foreignKey: 'nota_fiscal_id', as: 'notaFiscal' });

// Alerta está relacionado a uma Licitação E/OU Usuario (emitido para)
Alerta.belongsTo(Licitacao,   { foreignKey: 'licitacao_id', as: 'licitacao' });
Alerta.belongsTo(Usuario,     { foreignKey: 'usuario_id',   as: 'usuario' });

// Histórico de Interação está relacionado a uma Licitação e opcionalmente a um Usuário
HistoricoInteracao.belongsTo(Licitacao, { foreignKey: 'licitacao_id', as: 'licitacao' });
HistoricoInteracao.belongsTo(Usuario,   { foreignKey: 'usuario_id', as: 'usuario' });

// Usuário pertence a uma Empresa
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });
Empresa.hasMany(Usuario, { foreignKey: 'empresa_id', as: 'usuarios' });



// Exportando tudo
module.exports = {
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
};
