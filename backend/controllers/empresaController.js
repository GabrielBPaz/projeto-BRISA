const { Empresa } = require('../models');

exports.cadastrar = async (req, res) => {
  try { res.json(await Empresa.create(req.body)); }
  catch (err) { res.status(400).json({ erro: err.message }); }
};
exports.listar = async (req, res) => {
  try { res.json(await Empresa.findAll()); }
  catch (err) { res.status(500).json({ erro: err.message }); }
};
exports.editar = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada' });
    await empresa.update(req.body); res.json(empresa);
  } catch (err) { res.status(400).json({ erro: err.message }); }
};
exports.deletar = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada' });
    await empresa.destroy(); res.json({ ok: true });
  } catch (err) { res.status(400).json({ erro: err.message }); }
};
