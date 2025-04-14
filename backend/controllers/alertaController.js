const { Alerta } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const alerta = await Alerta.create(req.body);
    res.status(201).json(alerta);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let alertas = await Alerta.findAll();
    res.json(alertas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.visualizar = async (req, res) => {
  try {
    let alerta = await Alerta.findByPk(req.params.id);
    if (!alerta) return res.status(404).json({ erro: 'Alerta não encontrado' });
    await alerta.update({ visualizado: true });
    res.json(alerta);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
