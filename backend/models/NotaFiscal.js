module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NotaFiscal', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      licitacao_id: DataTypes.INTEGER,
      numero_nf: DataTypes.STRING,
      data_emissao: DataTypes.DATE,
      valor_nf: DataTypes.DECIMAL(18,2),
      arquivo: DataTypes.TEXT,
    }, {
      tableName: 'notas_fiscais',
      timestamps: false,
    });
  };
  