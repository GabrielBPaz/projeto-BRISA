module.exports = (sequelize, DataTypes) => {
    return sequelize.define('AtaRegistro', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      licitacao_id: DataTypes.INTEGER,
      numero_ata: DataTypes.STRING,
      data_assinatura: DataTypes.DATE,
      validade: DataTypes.DATE,
      valor_total: DataTypes.DECIMAL(18,2),
      arquivo: DataTypes.TEXT,
    }, {
      tableName: 'atas_registro',
      timestamps: false,
    });
  };
  