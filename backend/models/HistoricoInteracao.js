module.exports = (sequelize, DataTypes) => {
    return sequelize.define('HistoricoInteracao', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      licitacao_id: DataTypes.INTEGER,
      data_interacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      canal: DataTypes.STRING(50),
      descricao: DataTypes.TEXT,
      usuario_id: DataTypes.INTEGER,
    }, {
      tableName: 'historico_interacoes',
      timestamps: false,
    });
  };
  