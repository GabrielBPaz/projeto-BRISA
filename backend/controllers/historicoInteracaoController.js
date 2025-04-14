const { HistoricoInteracao } = require('../models');

exports.adicionar = async (req, res) => {
  try {
    const item = await HistoricoInteracao.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let itens = await HistoricoInteracao.findAll({
      where: req.query.licitacao_id ? { licitacao_id: req.query.licitacao_id } : {},
    });
    res.json(itens);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

