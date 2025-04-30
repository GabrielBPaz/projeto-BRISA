const jwt = require("jsonwebtoken");
const { Usuario } = require("../models"); // Removido Empresa, não usado aqui
require("dotenv").config();

// Middleware para verificar autenticação
exports.authMiddleware = async (req, res, next) => {
  
  try {
    // Bypass de autenticação comentado
    // const bypassAuth = process.env.NODE_ENV !== "production";
    // if (bypassAuth) { ... }

    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      
      return res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
    }

    // Extrair o token
    const token = authHeader.split(" ")[1];
    

    // Verificar o token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "brisa_jwt_secret_key_2025"
      );
      
    } catch (verifyError) {
      
      if (verifyError.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Token inválido" });
      }
      if (verifyError.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expirado" });
      }
      // Outro erro de verificação
      throw verifyError;
    }

    // Buscar o usuário no banco de dados
    
    const usuario = await Usuario.findByPk(decoded.userId);

    if (!usuario) {
      
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }
    

    // Adicionar informações do usuário ao objeto de requisição
    req.userId = usuario.id;
    req.userRole = usuario.tipo_usuario;

    next();
  } catch (error) {
    
    // Evitar enviar detalhes do erro interno para o cliente em produção
    res.status(500).json({
      success: false,
      message: "Erro interno ao verificar autenticação",
      // error: error.message // Opcional: incluir em dev, remover em prod
    });
  }
};

// Middleware para verificar se o usuário é admin
exports.adminMiddleware = async (req, res, next) => {
  
  try {
    // Bypass comentado
    // const bypassAuth = process.env.NODE_ENV !== "production";
    // if (bypassAuth) { ... }

    // Reutilizar a lógica do authMiddleware para verificar o token e obter o usuário
    // Isso evita duplicação, mas requer que authMiddleware já tenha rodado ou que se repita a lógica aqui.
    // Assumindo que authMiddleware já rodou e populou req.userId e req.userRole:
    if (!req.userId || !req.userRole) {
        return res.status(500).json({ success: false, message: "Erro interno de configuração de middleware." });
    }

    if (req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores podem acessar este recurso.",
      });
    }

    next();

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Erro ao verificar permissão de administrador",
      // error: error.message // Opcional
    });
  }
};

