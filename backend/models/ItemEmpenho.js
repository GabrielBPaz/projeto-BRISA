module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ItemEmpenho', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      empenho_id: DataTypes.INTEGER,
      descricao: { type: DataTypes.TEXT, allowNull: false },
      quantidade: { type: DataTypes.INTEGER, allowNull: false },
      valor_unitario: { type: DataTypes.DECIMAL(12,2), allowNull: false },
      valor_total: DataTypes.DECIMAL(14,2), // OBS: O campo é calculado no banco!
    }, {
      tableName: 'itens_empenho',
      timestamps: false,
    });
  };
  