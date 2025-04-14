const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// Cadastro (UC23)
exports.cadastrar = async (req, res) => {
  try {
    req.body.senha_hash = await bcrypt.hash(req.body.senha, 10);
    delete req.body.senha;
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Listar
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Editar ou desativar (UC24)
exports.editar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    await usuario.update(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
