module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OrgaoPublico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
    endereco: DataTypes.TEXT, // Mantido como TEXT por enquanto, para acomodar detalhes (Rua, Num, Bairro, Comp)
    cidade: { type: DataTypes.STRING, allowNull: false }, // Tornando obrigatório
    estado: { type: DataTypes.STRING(2), allowNull: false }, // Tornando obrigatório
    telefone: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    tableName: 'orgaos_publicos',
    timestamps: false,
  });
};
