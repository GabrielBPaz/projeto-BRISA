// backend/models/Documento.js

module.exports = (sequelize, DataTypes) => {
  const Documento = sequelize.define("Documento", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    caminho_arquivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tamanho: {
      type: DataTypes.INTEGER,
    },
    tipo_arquivo: {
      type: DataTypes.STRING,
    },
    data_upload: {
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
      allowNull: true, // Permitir nulo se o usuário for deletado?
      references: {
        model: "usuarios", // Nome da tabela de usuários
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
    tableName: "documentos",
    timestamps: true, // Mantém timestamps habilitado, mas o mapeamento é feito acima
    // Remove as opções globais createdAt/updatedAt daqui
    // createdAt: false, // Desabilitar se não quiser que Sequelize gerencie
    // updatedAt: false,
  });

  Documento.associate = (models) => {
    // Associação com Licitacao
    Documento.belongsTo(models.Licitacao, {
      foreignKey: "licitacao_id",
      as: "licitacao",
    });
    // Associação com Usuario
    Documento.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  };

  return Documento;
};

