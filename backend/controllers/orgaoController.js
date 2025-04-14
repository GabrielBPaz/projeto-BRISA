const { OrgaoPublico } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const orgao = await OrgaoPublico.create(req.body);
    res.status(201).json(orgao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const orgaos = await OrgaoPublico.findAll();
    res.json(orgaos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.editar = async (req, res) => {
  try {
    const orgao = await OrgaoPublico.findByPk(req.params.id);
    if (!orgao) return res.status(404).json({ erro: 'Órgão não encontrado' });

    await orgao.update(req.body);
    res.json(orgao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const orgao = await OrgaoPublico.findByPk(req.params.id);
    if (!orgao) return res.status(404).json({ erro: 'Órgão não encontrado' });

    await orgao.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
