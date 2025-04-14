module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Empresa', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nome_fantasia: { type: DataTypes.STRING, allowNull: false },
      razao_social: DataTypes.STRING,
      cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
      inscricao_estadual: DataTypes.STRING,
      endereco: DataTypes.TEXT,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING(2),
      telefone: DataTypes.STRING,
      email: DataTypes.STRING,
      responsavel_legal: DataTypes.STRING,
    }, {
      tableName: 'empresas',
      timestamps: false,
    });
  };
  