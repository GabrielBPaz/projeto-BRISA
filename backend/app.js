// backend/app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
require('dotenv').config();

// Import das rotas
const orgaosRoutes         = require('./routes/orgaosRoutes');
const empresasRoutes       = require('./routes/empresasRoutes');
const licitacoesRoutes     = require('./routes/licitacoesRoutes');
const empenhosRoutes       = require('./routes/empenhosRoutes');
const itensEmpenhoRoutes   = require('./routes/itensEmpenhoRoutes');
const atasRegistroRoutes   = require('./routes/atasRegistroRoutes');
const entregasRoutes       = require('./routes/entregasRoutes');
const notasFiscaisRoutes   = require('./routes/notasFiscaisRoutes');
const pagamentosRoutes     = require('./routes/pagamentosRoutes');
const alertasRoutes        = require('./routes/alertasRoutes');
const historicoInteracoesRoutes = require('./routes/historicoInteracoesRoutes');
const usuariosRoutes       = require('./routes/usuariosRoutes');
const authRoutes           = require('./routes/auth/authRoutes');

// Import do middleware de autenticação
const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Middlewares globais
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Teste conexão DB
sequelize.authenticate()
  .then(() => console.log('Banco conectado!'))
  .catch(err => console.error('Erro ao conectar banco:', err));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => res.send('API de Licitações rodando!'));

// Rotas protegidas por autenticação
app.use('/api/orgaos', authMiddleware, orgaosRoutes);
app.use('/api/empresas', authMiddleware, empresasRoutes);
app.use('/api/licitacoes', authMiddleware, licitacoesRoutes);
app.use('/api/empenhos', authMiddleware, empenhosRoutes);
app.use('/api/itens-empenho', authMiddleware, itensEmpenhoRoutes);
app.use('/api/atas', authMiddleware, atasRegistroRoutes);
app.use('/api/entregas', authMiddleware, entregasRoutes);
app.use('/api/notas-fiscais', authMiddleware, notasFiscaisRoutes);
app.use('/api/pagamentos', authMiddleware, pagamentosRoutes);
app.use('/api/alertas', authMiddleware, alertasRoutes);
app.use('/api/historico', authMiddleware, historicoInteracoesRoutes);

// Rotas de administração (protegidas por middleware de admin)
app.use('/api/usuarios', adminMiddleware, usuariosRoutes);

// Tratamento de erros para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Rota não encontrada' 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
