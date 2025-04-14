module.exports = (sequelize, DataTypes) => {
    const Empenho = sequelize.define('Empenho', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      licitacao_id: { type: DataTypes.INTEGER },
      numero_empenho: DataTypes.STRING,
      data_empenho: DataTypes.DATE,
      valor_empenhado: DataTypes.DECIMAL(18,2),
      arquivo: DataTypes.TEXT,
    }, {
      tableName: 'empenhos',
      timestamps: false,
    });
  
    return Empenho;
  };
  