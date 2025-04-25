const { Usuario } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Chave secreta para JWT - idealmente deve vir de variável de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'brisa_jwt_secret_key_2025';

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    
    // Verificar se o usuário existe
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas  2' 
      });
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(403).json({ 
        success: false,
        message: 'Usuário desativado. Entre em contato com o administrador.' 
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    
    if (!senhaCorreta) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciais inválidas 1' 
      });
    }
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        email: usuario.email,
        role: usuario.tipo_usuario 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // Retornar dados do usuário e token
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor',
      error: err.message 
    });
  }
};

// Validação de token
exports.validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token não fornecido' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      success: true,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token inválido ou expirado' 
    });
  }
};

// Registro de usuário (opcional, pode ser usado pelo admin)
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome, email e senha são obrigatórios' 
      });
    }

    // Verificar se o email já está em uso
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email já está em uso' 
      });
    }

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash,
      tipo_usuario: tipo_usuario || 'usuario',
      ativo: true
    });

    // Retornar dados do usuário criado (sem a senha)
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo_usuario
      }
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor',
      error: err.message 
    });
  }
};
