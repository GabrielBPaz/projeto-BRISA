const { Entrega } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const entrega = await Entrega.create(req.body);
    res.status(201).json(entrega);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let entregas = await Entrega.findAll({
      where: req.query.licitacao_id ? { licitacao_id: req.query.licitacao_id } : {},
    });
    res.json(entregas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.editar = async (req, res) => {
  try {
    let entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) return res.status(404).json({ erro: 'Entrega não encontrada' });
    await entrega.update(req.body);
    res.json(entrega);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    let entrega = await Entrega.findByPk(req.params.id);
    if (!entrega) return res.status(404).json({ erro: 'Entrega não encontrada' });
    await entrega.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
