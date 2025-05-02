module.exports = (sequelize, DataTypes) => {
  const Entrega = sequelize.define("Entrega", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    licitacao_id: DataTypes.INTEGER, // Pode ser mantido ou removido dependendo da lógica
    empenho_id: { type: DataTypes.INTEGER }, // Nova chave estrangeira
    data_entrega: DataTypes.DATE,
    local_entrega: DataTypes.TEXT, // Pode ser preenchido com base na cidade/uf do empenho
    status_entrega: DataTypes.STRING(50),
    comprovante: DataTypes.TEXT,
  }, {
    tableName: "entregas",
    timestamps: false,
  });

  Entrega.associate = function(models) {
      // Uma Entrega pertence a um Empenho
      Entrega.belongsTo(models.Empenho, { foreignKey: "empenho_id", as: "empenho" });
      // Manter a relação com Licitação se ainda for útil
      Entrega.belongsTo(models.Licitacao, { foreignKey: "licitacao_id", as: "licitacao" });
  };

  return Entrega;
};

