const { Pagamento } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const pgto = await Pagamento.create(req.body);
    res.status(201).json(pgto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
exports.listar = async (req, res) => {
  try {
    let pagamentos = await Pagamento.findAll({
      where: req.query.nota_fiscal_id ? { nota_fiscal_id: req.query.nota_fiscal_id } : {},
    });
    res.json(pagamentos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
exports.editar = async (req, res) => {
  try {
    let pgto = await Pagamento.findByPk(req.params.id);
    if (!pgto) return res.status(404).json({ erro: 'Pagamento não encontrado' });
    await pgto.update(req.body);
    res.json(pgto);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
exports.deletar = async (req, res) => {
  try {
    let pgto = await Pagamento.findByPk(req.params.id);
    if (!pgto) return res.status(404).json({ erro: 'Pagamento não encontrado' });
    await pgto.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
