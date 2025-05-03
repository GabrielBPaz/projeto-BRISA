const { Empenho } = require('../models');

// UC05 - Cadastrar Empenho
exports.cadastrar = async (req, res) => {
  try {
    const { 
      numero_empenho, 
      data_empenho, 
      valor_empenhado, 
      licitacao_id, 
      endereco_entrega, // Receber o novo campo
      arquivo // Receber arquivo se houver upload
    } = req.body;

    // Validação básica dos campos obrigatórios (conforme modelo)
    if (!numero_empenho || !data_empenho || !valor_empenhado || !licitacao_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campos obrigatórios (Número, Data, Valor, ID Licitação) não fornecidos.' 
      });
    }

    // Criar o empenho com os dados validados, incluindo endereco_entrega
    const empenho = await Empenho.create({
        numero_empenho,
        data_empenho,
        valor_empenhado,
        licitacao_id,
        endereco_entrega, // Salvar o endereço de entrega
        arquivo // Salvar o caminho do arquivo se existir
    });

    res.status(201).json({ success: true, empenho }); // Retornar sucesso e o empenho criado

  } catch (err) {
    console.error("Erro ao cadastrar empenho:", err); // Log do erro no backend
    res.status(500).json({ success: false, message: err.message || 'Erro interno ao cadastrar empenho.' });
  }
};

// UC07 - Consultar Empenhos por Licitação
exports.listarPorLicitacao = async (req, res) => {
  try {
    const empenhos = await Empenho.findAll({ 
        where: { licitacao_id: req.params.licitacao_id },
        order: [['data_empenho', 'DESC']] // Ordenar por data, mais recente primeiro
    });
    res.json(empenhos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// UC08 - Atualizar Status do Empenho (Exemplo - Precisa de campo 'status' no modelo)
/*
exports.atualizarStatus = async (req, res) => {
  try {
    const empenho = await Empenho.findByPk(req.params.id);
    if (!empenho) return res.status(404).json({ erro: 'Empenho não encontrado' });

    // Supondo que existe um campo 'status' no modelo Empenho
    // empenho.status = req.body.status;
    // await empenho.save();
    res.json(empenho);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};
*/

// Adicionar funcionalidade de Edição e Deleção se necessário
exports.editar = async (req, res) => {
  try {
    const empenho = await Empenho.findByPk(req.params.id);
    if (!empenho) return res.status(404).json({ erro: 'Empenho não encontrado' });

    const { 
      numero_empenho, 
      data_empenho, 
      valor_empenhado, 
      endereco_entrega, 
      arquivo 
    } = req.body;

    // Validação básica na edição
    if (numero_empenho === '' || !data_empenho || valor_empenhado === '' || isNaN(parseFloat(valor_empenhado))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campos obrigatórios (Número, Data, Valor) não podem ficar vazios ou inválidos na edição.' 
      });
    }

    await empenho.update({
        numero_empenho,
        data_empenho,
        valor_empenhado: parseFloat(valor_empenhado),
        endereco_entrega,
        arquivo
    });
    res.json({ success: true, empenho });
  } catch (err) {
    console.error("Erro ao editar empenho:", err);
    res.status(500).json({ success: false, message: err.message || 'Erro interno ao editar empenho.' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const empenho = await Empenho.findByPk(req.params.id);
    if (!empenho) return res.status(404).json({ erro: 'Empenho não encontrado' });

    await empenho.destroy();
    res.json({ success: true, message: 'Empenho deletado com sucesso.' });
  } catch (err) {
    console.error("Erro ao deletar empenho:", err);
    res.status(500).json({ success: false, message: err.message || 'Erro interno ao deletar empenho.' });
  }
};
