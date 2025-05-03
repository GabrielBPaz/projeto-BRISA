require('dotenv').config();

module.exports = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'LICNET',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
  //logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  }
};

