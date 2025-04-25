// Middleware para verificar se o usuário tem permissão para acessar recursos específicos
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Chave secreta para JWT - vem de variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'brisa_jwt_secret_key_2025';

// Middleware para verificar autenticação
const authMiddleware = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token não fornecido' 
    });
  }

  // Formato esperado: "Bearer [token]"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ 
      success: false, 
      message: 'Erro no formato do token' 
    });
  }

  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token mal formatado' 
    });
  }

  // Verificar se o token é válido
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }

    // Armazenar informações do usuário no objeto de requisição
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    
    return next();
  });
};

// Middleware para verificar se o usuário é admin
const adminMiddleware = (req, res, next) => {
  // Primeiro verifica se o usuário está autenticado
  authMiddleware(req, res, () => {
    // Depois verifica se o usuário é admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso restrito a administradores' 
      });
    }
    
    return next();
  });
};

// Middleware para verificar se o usuário tem acesso a um recurso específico
const resourceAccessMiddleware = (resourceType) => {
  return async (req, res, next) => {
    try {
      // Primeiro verifica se o usuário está autenticado
      authMiddleware(req, res, async () => {
        // Se for admin, permite acesso direto
        if (req.userRole === 'admin') {
          return next();
        }

        // Verificar permissões específicas baseadas no tipo de recurso
        switch (resourceType) {
          case 'licitacao':
            // Lógica para verificar acesso a licitações
            // Por exemplo, verificar se o usuário pertence à empresa ou órgão relacionado
            const licitacaoId = req.params.id;
            // Implementar lógica de verificação aqui
            break;
          
          case 'empresa':
            // Lógica para verificar acesso a empresas
            const empresaId = req.params.id;
            // Implementar lógica de verificação aqui
            break;
          
          // Adicionar outros tipos de recursos conforme necessário
          
          default:
            // Se não houver regra específica, permitir acesso
            return next();
        }
        
        // Se chegou até aqui, permitir acesso
        return next();
      });
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar permissões de acesso'
      });
    }
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  resourceAccessMiddleware
};
