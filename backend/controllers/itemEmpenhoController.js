const { ItemEmpenho } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const item = await ItemEmpenho.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let itens = await ItemEmpenho.findAll({
      where: req.query.empenho_id ? { empenho_id: req.query.empenho_id } : {},
    });
    res.json(itens);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.editar = async (req, res) => {
  try {
    let item = await ItemEmpenho.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    let item = await ItemEmpenho.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    await item.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
