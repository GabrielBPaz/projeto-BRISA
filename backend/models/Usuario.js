module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nome: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      senha_hash: { type: DataTypes.TEXT, allowNull: false },
      tipo_usuario: DataTypes.STRING,
      ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
      empresa_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      tableName: 'usuarios',
      timestamps: false,
    });
  };
  