# Sistema de Gestão de Licitações - BRISA

Este sistema foi desenvolvido para gerenciar licitações, permitindo o controle de órgãos públicos, empresas, licitações, empenhos, notas fiscais e outros elementos relacionados ao processo licitatório.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend**: API REST desenvolvida com Node.js, Express e PostgreSQL
- **Frontend**: Interface de usuário desenvolvida com React

## Requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- NPM

## Configuração do Ambiente

### Backend

1. Navegue até a pasta do backend:
```
cd backend
```

2. Instale as dependências:
```
npm install
```

4. Execute o script SQL para criar o banco de dados:
```
psql -U postgres -f database.sql
```

5. Inicie o servidor:
```
npm start
```

### Frontend

1. Navegue até a pasta do frontend:
```
cd frontend
```

2. Instale as dependências:
```
npm install
```

3. Inicie o servidor de desenvolvimento:
```
npm start
```

## Funcionalidades Implementadas

- Autenticação de usuários com JWT
- Proteção de rotas com middleware de autenticação
- Gerenciamento de órgãos públicos
- Gerenciamento de empresas
- Gerenciamento de licitações
- Gerenciamento de empenhos e itens de empenho
- Gerenciamento de notas fiscais e pagamentos
- Gerenciamento de entregas
- Sistema de alertas
- Histórico de interações

## Rotas da API

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/validate` - Validação de token
- `POST /api/auth/register` - Registro de usuário (acesso restrito)

### Usuários

- `GET /api/usuarios` - Listar usuários (acesso restrito)
- `POST /api/usuarios` - Cadastrar usuário (acesso restrito)
- `PUT /api/usuarios/:id` - Editar usuário (acesso restrito)

### Outras Rotas

Todas as rotas abaixo requerem autenticação:

- `/api/orgaos` - Gerenciamento de órgãos públicos
- `/api/empresas` - Gerenciamento de empresas
- `/api/licitacoes` - Gerenciamento de licitações
- `/api/empenhos` - Gerenciamento de empenhos
- `/api/itens-empenho` - Gerenciamento de itens de empenho
- `/api/atas` - Gerenciamento de atas de registro
- `/api/entregas` - Gerenciamento de entregas
- `/api/notas-fiscais` - Gerenciamento de notas fiscais
- `/api/pagamentos` - Gerenciamento de pagamentos
- `/api/alertas` - Gerenciamento de alertas
- `/api/historico` - Gerenciamento de histórico de interações

## Segurança

O sistema implementa várias camadas de segurança:

- Autenticação com JWT (JSON Web Token)
- Senhas armazenadas com hash usando bcrypt
- Middleware de autenticação para proteger rotas
- Verificação de permissões baseada em papéis (admin, usuário)
- Variáveis de ambiente para configurações sensíveis

## Melhorias Implementadas

- Autenticação completa com JWT
- Proteção de rotas com middleware
- Integração frontend-backend para autenticação
- Melhoria na segurança com variáveis de ambiente
- Verificação de acesso a recursos específicos
- Tratamento adequado de erros
