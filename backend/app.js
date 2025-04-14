// backend/app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

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

const app = express();

// Middlewares globais
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Teste conexão DB
sequelize.authenticate()
  .then(() => console.log('Banco conectado!'))
  .catch(err => console.error('Erro ao conectar banco:', err));

// Rotas
app.use('/api/orgaos', orgaosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/licitacoes', licitacoesRoutes);
app.use('/api/empenhos', empenhosRoutes);
app.use('/api/itens-empenho', itensEmpenhoRoutes);
app.use('/api/atas', atasRegistroRoutes);
app.use('/api/entregas', entregasRoutes);
app.use('/api/notas-fiscais', notasFiscaisRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/historico', historicoInteracoesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Rota de teste
app.get('/', (req, res) => res.send('API de Licitações rodando!'));

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
