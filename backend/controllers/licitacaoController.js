const { Licitacao, Empenho } = require('../models');

// UC01 - Cadastrar Licitação
exports.cadastrar = async (req, res) => {
  try {
    const licitacao = await Licitacao.create(req.body);
    res.status(201).json(licitacao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// UC02 - Consultar Licitações
exports.listar = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.orgao_id) where.orgao_id = req.query.orgao_id;
    if (req.query.numero_licitacao) where.numero_licitacao = req.query.numero_licitacao;
    // adicionar mais filtros conforme necessário

    const licitacoes = await Licitacao.findAll({ where });
    res.json(licitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// UC03 - Editar Licitação
exports.editar = async (req, res) => {
  try {
    const licitacao = await Licitacao.findByPk(req.params.id);
    if (!licitacao) return res.status(404).json({ erro: 'Licitação não encontrada' });

    await licitacao.update(req.body);
    res.json(licitacao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// UC04 - Encerrar/Cancelar Licitação
exports.mudarStatus = async (req, res) => {
  try {
    const licitacao = await Licitacao.findByPk(req.params.id);
    if (!licitacao) return res.status(404).json({ erro: 'Licitação não encontrada' });

    licitacao.status = req.body.status;
    await licitacao.save();
    res.json(licitacao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
