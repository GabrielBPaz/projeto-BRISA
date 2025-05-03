const { OrgaoPublico } = require('../models');

exports.cadastrar = async (req, res) => {
  try {
    const { nome, cnpj, cidade, estado, endereco, telefone, email } = req.body;

    // Validação mais específica dos campos obrigatórios
    const errors = [];
    if (!nome || nome.trim() === "") errors.push("Nome é obrigatório");
    if (!cnpj || cnpj.trim() === "") errors.push("CNPJ é obrigatório");
    if (!cidade || cidade.trim() === "") errors.push("Cidade é obrigatória");
    if (!estado || estado.trim() === "") {
        errors.push("Estado (UF) é obrigatório");
    } else if (estado.trim().length !== 2) {
        errors.push("Estado (UF) deve ter 2 letras");
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Erro de validação: ${errors.join(", ")}.` // Mensagem mais específica
      });
    }

    // Formatar CNPJ (remover caracteres não numéricos, se necessário - opcional)
    // const cnpjFormatado = cnpj.replace(/\D/g, ");

    // Criar o órgão com os dados validados
    const orgao = await OrgaoPublico.create({
        nome: nome.trim(),
        cnpj: cnpj.trim(), // Usar cnpjFormatado se formatar
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        endereco: endereco ? endereco.trim() : null,
        telefone: telefone ? telefone.trim() : null,
        email: email ? email.trim() : null
    });

    // Retornar sucesso e o órgão criado (importante para o frontend atualizar a lista)
    res.status(201).json({ success: true, orgao });

  } catch (err) {
    console.error("Erro ao cadastrar órgão:", err); // Log detalhado no backend
    // Tratar erros específicos (ex: CNPJ duplicado)
    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ success: false, message: "Erro: CNPJ já cadastrado." });
    }
    // Outros erros
    res.status(500).json({ success: false, message: err.message || "Erro interno ao cadastrar órgão." });
  }
};

exports.listar = async (req, res) => {
  try {
    const orgaos = await OrgaoPublico.findAll({ order: [['nome', 'ASC']] }); // Ordenar por nome
    res.json(orgaos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.editar = async (req, res) => {
  try {
    const orgao = await OrgaoPublico.findByPk(req.params.id);
    if (!orgao) return res.status(404).json({ erro: 'Órgão não encontrado' });

    // Adicionar validação para campos obrigatórios na edição também, se necessário
    const { nome, cnpj, cidade, estado } = req.body;
    if (nome === '' || cnpj === '' || cidade === '' || estado === '') {
        return res.status(400).json({ 
            success: false, 
            message: 'Campos obrigatórios (Nome, CNPJ, Cidade, Estado) não podem ficar vazios na edição.' 
        });
    }

    await orgao.update(req.body);
    res.json(orgao);
  } catch (err) {
     if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ success: false, message: 'Erro: CNPJ já cadastrado para outro órgão.' });
    }
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
