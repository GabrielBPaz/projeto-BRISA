module.exports = (sequelize, DataTypes) => {
    const Licitacao = sequelize.define('Licitacao', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      numero_licitacao: { type: DataTypes.STRING, allowNull: false },
      orgao_id: { type: DataTypes.INTEGER },
      empresa_id: { type: DataTypes.INTEGER },
      modalidade: DataTypes.STRING,
      objeto: DataTypes.TEXT,
      valor_total: DataTypes.DECIMAL(18, 2),
      data_abertura: DataTypes.DATE,
      status: DataTypes.STRING,
      edital_arquivo: DataTypes.TEXT,
    }, {
      tableName: 'licitacoes',
      timestamps: false,
    });
  
    return Licitacao;
  };
  