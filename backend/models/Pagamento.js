module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pagamento', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nota_fiscal_id: DataTypes.INTEGER,
      data_pagamento: DataTypes.DATE,
      valor_pago: DataTypes.DECIMAL(18,2),
      forma_pagamento: DataTypes.STRING(50),
      comprovante: DataTypes.TEXT,
    }, {
      tableName: 'pagamentos',
      timestamps: false,
    });
  };
  