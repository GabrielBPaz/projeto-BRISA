const { Licitacao, Empresa, OrgaoPublico, Empenho, NotaFiscal, Entrega, Usuario, Documento, Comentario, ItemEmpenho, AtaRegistro, Pagamento } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs").promises; // Usar promises para fs
const path = require("path");

// Criar uma nova licitação com upload de edital obrigatório
exports.criarLicitacao = async (req, res) => {
  let novaLicitacao;
  let editalPath;

  try {
    // Verificar se o arquivo do edital foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "O upload do arquivo do edital (PDF) é obrigatório.",
      });
    }
    editalPath = req.file.path; // Guardar o caminho temporário

    // Extrair dados do corpo da requisição
    const { numero_licitacao, orgao_id, empresa_id, modalidade, objeto, valor_total, data_abertura, data_encerramento, status } = req.body;
    const userId = req.userId;

    // Validação básica dos campos de texto (pode ser expandida)
    if (!numero_licitacao || !orgao_id || !modalidade || !objeto || !data_abertura) {
        // Se a validação falhar, remover o arquivo temporário
        await fs.unlink(editalPath);
        return res.status(400).json({ success: false, message: "Campos obrigatórios não fornecidos." });
    }

    // Criar a licitação no banco de dados
    novaLicitacao = await Licitacao.create({
      numero_licitacao,
      orgao_id: parseInt(orgao_id),
      empresa_id: empresa_id ? parseInt(empresa_id) : null,
      modalidade,
      objeto,
      valor_total: valor_total ? parseFloat(valor_total) : null,
      data_abertura,
      data_encerramento: data_encerramento || null,
      status: status || "Em Aberto",
      // edital_arquivo: editalPath // Não salvar o caminho temporário aqui, faremos no Documento
    });

    // Renomear o arquivo do edital para incluir o ID da licitação
    const novoNomeArquivo = `${Date.now()}-${novaLicitacao.id}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const novoPath = path.join(path.dirname(editalPath), novoNomeArquivo);
    await fs.rename(editalPath, novoPath);

    // Criar o registro do documento (edital) associado à licitação
    await Documento.create({
      nome: `Edital - ${req.file.originalname}`, // Nome descritivo
      tipo: "Edital", // Tipo específico para identificar
      descricao: "Edital principal da licitação",
      caminho_arquivo: novoPath, // Usar o novo caminho após renomear
      tamanho: req.file.size,
      tipo_arquivo: req.file.mimetype,
      data_upload: new Date(),
      licitacao_id: novaLicitacao.id,
      usuario_id: userId,
    });

    res.status(201).json({
      success: true,
      message: "Licitação e edital criados com sucesso!",
      data: novaLicitacao,
    });

  } catch (error) {
    console.error("Erro ao criar licitação:", error);

    // Se ocorreu erro após criar a licitação, tentar deletá-la (rollback manual)
    if (novaLicitacao && novaLicitacao.id) {
      try {
        await Licitacao.destroy({ where: { id: novaLicitacao.id } });
      } catch (deleteError) {
        console.error("Erro ao tentar deletar licitação após falha:", deleteError);
      }
    }

    // Se ocorreu erro (em qualquer ponto), tentar deletar o arquivo de upload
    if (editalPath) {
      try {
        await fs.unlink(editalPath);
      } catch (unlinkError) {
        // Se o arquivo já foi renomeado, tentar deletar pelo novo nome (melhoria futura)
        console.error("Erro ao tentar deletar arquivo de upload após falha:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Erro interno ao criar licitação",
      error: error.message,
    });
  }
};

// Obter todas as licitações
exports.getLicitacoes = async (req, res) => {
  try {
    const { empresaId, status, dataInicio, dataFim } = req.query;
    const userRole = req.userRole;
    const userId = req.userId;
    const where = {};

    const usuario = await Usuario.findByPk(userId, { attributes: ["id", "empresa_id"] });

    if (usuario && usuario.empresa_id) {
      where.empresa_id = usuario.empresa_id;
    } else if (userRole === "admin" && empresaId) {
      where.empresa_id = empresaId;
    } else if (userRole !== "admin") {
      return res.json({ success: true, data: [] });
    }

    if (status) where.status = status;
    if (dataInicio && dataFim) where.data_abertura = { [Op.between]: [new Date(dataInicio), new Date(dataFim)] };
    else if (dataInicio) where.data_abertura = { [Op.gte]: new Date(dataInicio) };
    else if (dataFim) where.data_abertura = { [Op.lte]: new Date(dataFim) };

    const licitacoes = await Licitacao.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome_fantasia"] },
        { model: OrgaoPublico, as: "orgao", attributes: ["id", "nome"] },
      ],
      order: [["data_abertura", "DESC"]],
    });

    res.json({ success: true, data: licitacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar licitações", error: error.message });
  }
};

// Obter detalhes de uma licitação por ID
exports.getLicitacaoById = async (req, res) => {
  try {
    const { id } = req.params;
    const licitacao = await Licitacao.findByPk(id, {
      include: [
        { model: OrgaoPublico, as: "orgao", required: false },
        { model: Empresa, as: "empresa", required: false },
        { model: Empenho, as: "empenhos", required: false, include: [{ model: ItemEmpenho, as: "itens", required: false }] },
        { model: NotaFiscal, as: "notasFiscais", required: false, include: [{ model: Pagamento, as: "pagamentos", required: false }] },
        // Ajuste: Incluir Entrega com associação a Empenho, se necessário
        { model: Entrega, as: "entregas_licitacao", required: false }, // Mantendo relação com licitação por enquanto
        { model: AtaRegistro, as: "atas", required: false },
      ],
    });

    if (!licitacao) {
      return res.status(404).json({ success: false, message: "Licitação não encontrada" });
    }

    const documentos = await Documento.findAll({
      where: { licitacao_id: id },
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "nome"] }],
      order: [["data_upload", "DESC"]],
    });

    const comentarios = await Comentario.findAll({
      where: { licitacao_id: id },
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "nome"] }],
      order: [["data", "ASC"]],
    });

    const licitacaoData = licitacao.get({ plain: true });
    licitacaoData.documentos = documentos;
    licitacaoData.comentarios = comentarios;

    res.status(200).json({ success: true, data: licitacaoData });

  } catch (error) {
    console.error("Erro em getLicitacaoById:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar detalhes da licitação", error: error.message });
  }
};

// Obter estatísticas para o dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const userRole = req.userRole;
    const userId = req.userId;
    let empresaId = null;
    const usuario = await Usuario.findByPk(userId, { attributes: ["id", "empresa_id"] });

    if (usuario && usuario.empresa_id) {
      empresaId = usuario.empresa_id;
    } else if (userRole !== "admin") {
      return res.json({ success: true, data: { stats: { ativas: 0, proximosPrazos: 0, emAtraso: 0, concluidas: 0 }, licitacoesAndamento: [] } });
    }

    const whereBase = empresaId ? { empresa_id: empresaId } : {};
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + 7);

    const [ativas, proximosPrazos, emAtraso, concluidas, licitacoesAndamento] = await Promise.all([
      Licitacao.count({ where: { ...whereBase, status: "ativa" } }),
      Licitacao.count({ where: { ...whereBase, status: { [Op.notIn]: ["concluida", "cancelada"] }, data_encerramento: { [Op.gte]: hoje, [Op.lte]: dataLimite, [Op.ne]: null } } }),
      Licitacao.count({ where: { ...whereBase, status: { [Op.notIn]: ["concluida", "cancelada"] }, data_encerramento: { [Op.lt]: hoje, [Op.ne]: null } } }),
      Licitacao.count({ where: { ...whereBase, status: "concluida" } }),
      Licitacao.findAll({
        where: { ...whereBase, status: { [Op.in]: ["ativa", "em_andamento"] } },
        include: [
          { model: Empresa, as: "empresa", attributes: ["nome_fantasia"] },
          { model: OrgaoPublico, as: "orgao", attributes: ["nome"] },
        ],
        limit: 5,
        order: [["data_encerramento", "ASC"]],
      })
    ]);

    res.json({ success: true, data: { stats: { ativas, proximosPrazos, emAtraso, concluidas }, licitacoesAndamento } });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar estatísticas", error: error.message });
  }
};

// Atualizar prazos de uma licitação
exports.atualizarPrazos = async (req, res) => {
  try {
    const { id } = req.params;
    const { data_abertura, data_encerramento, proxima_entrega, prazo_vigencia, observacoes } = req.body;
    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      return res.status(404).json({ success: false, message: "Licitação não encontrada" });
    }
    await licitacao.update({
      data_abertura: data_abertura || licitacao.data_abertura,
      data_encerramento: data_encerramento || licitacao.data_encerramento,
      // Adicionar outros campos de prazo se existirem no modelo
    });
    res.json({ success: true, message: "Prazos atualizados", data: licitacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar prazos", error: error.message });
  }
};

// Anexar documentos a uma licitação existente
exports.anexarDocumento = async (req, res) => {
  let filePath;
  try {
    const { id } = req.params;
    filePath = req.file ? req.file.path : null;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo foi enviado" });
    }

    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      await fs.unlink(filePath); // Remover arquivo órfão
      return res.status(404).json({ success: false, message: "Licitação não encontrada" });
    }

    // Renomear arquivo para incluir ID da licitação (se não foi feito no storage)
    // (Assumindo que o storage ainda usa req.params.id)
    // const novoNomeArquivo = `${Date.now()}-${id}-${req.file.originalname.replace(/\s+/g, "_")}`;
    // const novoPath = path.join(path.dirname(filePath), novoNomeArquivo);
    // await fs.rename(filePath, novoPath);
    // filePath = novoPath; // Atualizar path

    const documento = await Documento.create({
      nome: req.body.nome || req.file.originalname,
      tipo: req.body.tipo || "Outro", // Default tipo
      descricao: req.body.descricao || "",
      caminho_arquivo: filePath, // Usar path (potencialmente renomeado)
      tamanho: req.file.size,
      tipo_arquivo: req.file.mimetype,
      data_upload: new Date(),
      licitacao_id: id,
      usuario_id: req.userId,
    });

    res.status(201).json({ success: true, message: "Documento anexado com sucesso!", data: documento });

  } catch (error) {
    console.error("Erro ao anexar documento:", error);
    if (filePath) {
      try { await fs.unlink(filePath); } catch (e) { console.error("Erro ao remover arquivo após erro:", e); }
    }
    res.status(500).json({ success: false, message: "Erro ao anexar documento", error: error.message });
  }
};

// Adicionar comentários a uma licitação
exports.adicionarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      return res.status(404).json({ success: false, message: "Licitação não encontrada" });
    }
    if (!texto || texto.trim() === "") {
      return res.status(400).json({ success: false, message: "O texto do comentário é obrigatório" });
    }

    const comentario = await Comentario.create({
      texto,
      licitacao_id: id,
      usuario_id: req.userId,
    });

    const comentarioComUsuario = await Comentario.findByPk(comentario.id, {
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "nome"] }]
    });

    res.status(201).json({ success: true, message: "Comentário adicionado!", data: comentarioComUsuario });

  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    res.status(500).json({ success: false, message: "Erro ao adicionar comentário", error: error.message });
  }
};

