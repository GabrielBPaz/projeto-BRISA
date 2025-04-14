module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrgaoPublico', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nome: { type: DataTypes.STRING, allowNull: false },
      cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
      endereco: DataTypes.TEXT,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING(2),
      telefone: DataTypes.STRING,
      email: DataTypes.STRING,
    }, {
      tableName: 'orgaos_publicos',
      timestamps: false,
    });
  };
  