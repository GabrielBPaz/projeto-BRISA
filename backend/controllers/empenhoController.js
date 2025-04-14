const { Empenho } = require('../models');

// UC05 - Cadastrar Empenho
exports.cadastrar = async (req, res) => {
  try {
    const empenho = await Empenho.create(req.body);
    res.status(201).json(empenho);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// UC07 - Consultar Empenhos por Licitação
exports.listarPorLicitacao = async (req, res) => {
  try {
    const empenhos = await Empenho.findAll({ where: { licitacao_id: req.params.licitacao_id }});
    res.json(empenhos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// UC08 - Atualizar Status do Empenho (Exemplo simples, supondo campo 'status_empenho')
exports.atualizarStatus = async (req, res) => {
  try {
    const empenho = await Empenho.findByPk(req.params.id);
    if (!empenho) return res.status(404).json({ erro: 'Empenho não encontrado' });

    empenho.status_empenho = req.body.status_empenho;
    await empenho.save();
    res.json(empenho);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
