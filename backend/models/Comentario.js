// backend/models/Comentario.js

module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define("Comentario", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    licitacao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "licitacoes", // Nome da tabela referenciada
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Ou SET NULL
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ou true se puder ser anônimo
      references: {
        model: "usuarios", // Nome da tabela referenciada
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Ou CASCADE
    },
    // Definindo explicitamente as colunas de timestamp
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt' // Mapeia para a coluna "createdAt" no DB
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt' // Mapeia para a coluna "updatedAt" no DB
    }
  }, {
    tableName: "comentarios",
    timestamps: true, // Mantém timestamps habilitado, mas o mapeamento é feito acima
    // Remove as opções globais createdAt/updatedAt daqui
  });

  Comentario.associate = (models) => {
    // Associação com Licitacao
    Comentario.belongsTo(models.Licitacao, {
      foreignKey: "licitacao_id",
      as: "licitacao",
    });
    // Associação com Usuario
    Comentario.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  };

  return Comentario;
};

