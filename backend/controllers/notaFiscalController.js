const { NotaFiscal } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const nf = await NotaFiscal.create(req.body);
    res.status(201).json(nf);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
exports.listar = async (req, res) => {
  try {
    let notas = await NotaFiscal.findAll({
      where: req.query.licitacao_id ? { licitacao_id: req.query.licitacao_id } : {},
    });
    res.json(notas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
exports.editar = async (req, res) => {
  try {
    let nf = await NotaFiscal.findByPk(req.params.id);
    if (!nf) return res.status(404).json({ erro: 'Nota Fiscal não encontrada' });
    await nf.update(req.body);
    res.json(nf);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
