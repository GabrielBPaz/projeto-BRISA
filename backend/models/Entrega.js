module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Entrega', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      licitacao_id: DataTypes.INTEGER,
      data_entrega: DataTypes.DATE,
      local_entrega: DataTypes.TEXT,
      status_entrega: DataTypes.STRING(50),
      comprovante: DataTypes.TEXT,
    }, {
      tableName: 'entregas',
      timestamps: false,
    });
  };
  