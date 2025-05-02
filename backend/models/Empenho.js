module.exports = (sequelize, DataTypes) => {
  const Empenho = sequelize.define("Empenho", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    licitacao_id: { type: DataTypes.INTEGER },
    numero_empenho: DataTypes.STRING,
    data_empenho: DataTypes.DATE,
    valor_empenhado: DataTypes.DECIMAL(18,2),
    arquivo: DataTypes.TEXT,
    cidade: { type: DataTypes.STRING }, // Novo campo Cidade
    uf: { type: DataTypes.STRING(2) }   // Novo campo UF (limitado a 2 caracteres)
  }, {
    tableName: "empenhos",
    timestamps: false,
  });

  // Adicionar associação com Licitacao (se não estiver em index.js)
  Empenho.associate = function(models) {
      Empenho.belongsTo(models.Licitacao, { foreignKey: "licitacao_id", as: "licitacao" });
      // Futuramente, adicionar associação com Entrega aqui, se necessário
      // Empenho.hasMany(models.Entrega, { foreignKey: 'empenho_id', as: 'entregas' });
  };

  return Empenho;
};

