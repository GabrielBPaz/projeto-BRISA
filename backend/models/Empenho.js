module.exports = (sequelize, DataTypes) => {
  const Empenho = sequelize.define("Empenho", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    licitacao_id: { type: DataTypes.INTEGER, allowNull: false }, // Tornar FK obrigatória
    numero_empenho: { type: DataTypes.STRING, allowNull: false }, // Tornar obrigatório
    data_empenho: { type: DataTypes.DATE, allowNull: false }, // Tornar obrigatório
    valor_empenhado: { type: DataTypes.DECIMAL(18,2), allowNull: false }, // Tornar obrigatório
    arquivo: DataTypes.TEXT, // Arquivo do empenho (opcional?)
    endereco_entrega: { type: DataTypes.TEXT } // Novo campo para endereço de entrega completo
    // Removidos campos cidade e uf, pois estarão em endereco_entrega ou tabela separada no futuro
  }, {
    tableName: "empenhos",
    timestamps: false,
  });

  // Associação removida daqui e centralizada em models/index.js

  return Empenho;
};