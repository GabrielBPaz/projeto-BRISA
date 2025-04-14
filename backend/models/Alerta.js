module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Alerta', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: DataTypes.STRING,
      descricao: DataTypes.TEXT,
      data_alerta: DataTypes.DATE,
      tipo_alerta: DataTypes.STRING(50),
      licitacao_id: DataTypes.INTEGER,
      usuario_id: DataTypes.INTEGER,
      visualizado: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
      tableName: 'alertas',
      timestamps: false,
    });
  };
  