const { AtaRegistro } = require('../models');

// Criar
exports.cadastrar = async (req, res) => {
  try {
    const ata = await AtaRegistro.create(req.body);
    res.status(201).json(ata);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Listar
exports.listar = async (req, res) => {
  try {
    let atas = await AtaRegistro.findAll();
    res.json(atas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Editar
exports.editar = async (req, res) => {
  try {
    let ata = await AtaRegistro.findByPk(req.params.id);
    if (!ata) return res.status(404).json({ erro: 'Ata não encontrada' });
    await ata.update(req.body);
    res.json(ata);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Deletar
exports.deletar = async (req, res) => {
  try {
    let ata = await AtaRegistro.findByPk(req.params.id);
    if (!ata) return res.status(404).json({ erro: 'Ata não encontrada' });
    await ata.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
