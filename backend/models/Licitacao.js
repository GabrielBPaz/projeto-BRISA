module.exports = (sequelize, DataTypes) => {
  const Licitacao = sequelize.define("Licitacao", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero_licitacao: { type: DataTypes.STRING, allowNull: false },
    orgao_id: { type: DataTypes.INTEGER },
    empresa_id: { type: DataTypes.INTEGER },
    modalidade: DataTypes.STRING,
    objeto: DataTypes.TEXT,
    valor_total: DataTypes.DECIMAL(18, 2),
    data_abertura: DataTypes.DATE,
    data_encerramento: DataTypes.DATE, // Campo adicionado
    status: DataTypes.STRING,
    edital_arquivo: DataTypes.TEXT,
  }, {
    tableName: "licitacoes",
    timestamps: false,
  });

  Licitacao.associate = function(models) {
    Licitacao.belongsTo(models.OrgaoPublico, { foreignKey: "orgao_id", as: "orgao" });
    Licitacao.belongsTo(models.Empresa, { foreignKey: "empresa_id", as: "empresa" });
    // Adicione outras associações se necessário
    // Revertido: Removendo associações adicionadas incorretamente aqui
    // Licitacao.hasMany(models.Empenho, { foreignKey: 'licitacao_id', as: 'empenhos' });
    // Licitacao.hasMany(models.Documento, { foreignKey: 'licitacao_id', as: 'documentos' });
    // Licitacao.hasMany(models.Comentario, { foreignKey: 'licitacao_id', as: 'comentarios' });
  };

  return Licitacao;
};

