const { Licitacao, Empresa, OrgaoPublico, Empenho, NotaFiscal, Entrega, Usuario, Documento, Comentario, ItemEmpenho, AtaRegistro, Pagamento } = require("../models");
const { Op } = require("sequelize");

// Obter todas as licitações com filtro por empresa (se o usuário for de uma empresa)
exports.getLicitacoes = async (req, res) => {
  try {
    const { empresaId, status, dataInicio, dataFim } = req.query;
    const userRole = req.userRole;
    const userId = req.userId;

    // Construir filtros
    const where = {};

    // Filtro por empresa baseado na associação do usuário
    const usuario = await Usuario.findByPk(userId, {
      attributes: ["id", "empresa_id"], // Buscar apenas ID e empresa_id
    });

    if (usuario && usuario.empresa_id) {
      // Se o usuário está associado a uma empresa, filtrar por ela
      where.empresa_id = usuario.empresa_id;
    } else if (userRole === "admin" && empresaId) {
      // Se for admin e especificou empresa no query param, usar o query param
      where.empresa_id = empresaId;
    } else if (userRole !== "admin") {
      // Se não for admin e não estiver associado a uma empresa, não deve ver nada
      return res.json({ success: true, data: [] }); // Retorna lista vazia
    }
    // Se for admin e não especificou empresaId, não aplica filtro de empresa (vê tudo)

    // Filtro por status
    if (status) {
      where.status = status;
    }

    // Filtro por data
    if (dataInicio && dataFim) {
      where.data_abertura = {
        [Op.between]: [new Date(dataInicio), new Date(dataFim)],
      };
    } else if (dataInicio) {
      where.data_abertura = {
        [Op.gte]: new Date(dataInicio),
      };
    } else if (dataFim) {
      where.data_abertura = {
        [Op.lte]: new Date(dataFim),
      };
    }

    // Buscar licitações com filtros
    const licitacoes = await Licitacao.findAll({
      where,
      // Garantir que os campos essenciais para a lista estão incluídos
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome_fantasia"] }, // Apenas nome fantasia para a lista
        { model: OrgaoPublico, as: "orgao", attributes: ["id", "nome"] }, // Apenas nome para a lista
      ],
      order: [["data_abertura", "DESC"]],
      // attributes: ["id", "numero_licitacao", "objeto", "status", "data_abertura", "data_encerramento"], // Descomentar se quiser limitar campos da Licitacao
    });

    // *** ADICIONADO LOG ***

    res.json({
      success: true,
      data: licitacoes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar licitações",
      error: error.message,
    });
  }
};

// Obter detalhes de uma licitação específica
exports.getLicitacaoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.userRole;
    const userId = req.userId;
    // *** ADICIONADO LOG ***

    const licitacao = await Licitacao.findByPk(id, {
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome_fantasia", "razao_social", "cnpj"], required: false }, // Alias já estava correto
        { model: OrgaoPublico, as: "orgao", attributes: ["id", "nome", "cnpj"], required: false },       // Alias já estava correto
        { model: Empenho, as: "empenhos", required: false, include: [{ model: ItemEmpenho, as: "itens", required: false }] }, // Adicionado alias 'empenhos' e 'itens'
        { model: NotaFiscal, as: "notasFiscais", required: false, include: [{ model: Pagamento, as: "pagamentos", required: false }] }, // Adicionado alias 'notasFiscais' e 'pagamentos'
        { model: Entrega, as: "entregas", required: false }, // Adicionado alias 'entregas'
        { model: AtaRegistro, as: "atas", required: false }, // Adicionado alias 'atas'
        // { model: Documento, required: false }, // Removido temporariamente - Associação não definida no index.js
        // { model: Comentario, required: false, include: [{ model: Usuario, attributes: ["nome"], required: false }] }, // Removido temporariamente - Associação não definida no index.js
      ],
    });

    if (!licitacao) {
      // *** ADICIONADO LOG ***
      return res.status(404).json({
        success: false,
        message: "Licitação não encontrada",
      });
    }
    // *** ADICIONADO LOG ***

    // Verificar permissão baseado na associação do usuário
    if (userRole !== "admin") {
      // *** ADICIONADO LOG ***
      const usuario = await Usuario.findByPk(userId, { attributes: ["empresa_id"] });

      if (!usuario) {
          // *** ADICIONADO LOG ***
          return res.status(403).json({
            success: false,
            message: "Usuário não encontrado para verificação de permissão",
          });
      }

      // *** ADICIONADO LOG ***

      if (usuario.empresa_id !== licitacao.empresa_id) {
        // *** ADICIONADO LOG ***
        return res.status(403).json({
          success: false,
          message: "Você não tem permissão para acessar esta licitação",
        });
      } else {
        // *** ADICIONADO LOG ***
      }
    } else {
      // *** ADICIONADO LOG ***
    }

    // --- LOG DIAGNÓSTICO: Verificar dados retornados pelo Sequelize ---
    console.log("--- getLicitacaoById: Dados retornados pelo findByPk ---", JSON.stringify(licitacao, null, 2));
    // --- FIM LOG DIAGNÓSTICO ---

    res.json({
      success: true,
      data: licitacao,
    });
  } catch (error) {
    console.error("--- ERROR in getLicitacaoById ---", error); // LOG DETALHADO NO SERVIDOR
    res.status(500).json({
      success: false,
      message: "Erro interno ao buscar detalhes da licitação. Verifique os logs do servidor.",
      // error: error.message // Não enviar detalhes do erro para o cliente
    });
  }
};

// Obter estatísticas para o dashboard
exports.getDashboardStats = async (req, res) => {
  // ... (código existente, já corrigido e com logs)
  try {
    const userRole = req.userRole;
    const userId = req.userId;

    let empresaId = null;
    const usuario = await Usuario.findByPk(userId, {
      attributes: ["id", "empresa_id"],
    });

    if (usuario && usuario.empresa_id) {
      empresaId = usuario.empresa_id;
    } else if (userRole !== "admin") {
      const payload = {
        success: true,
        data: {
          stats: { ativas: 0, proximosPrazos: 0, emAtraso: 0, concluidas: 0 },
          licitacoesAndamento: [],
        },
      };
      return res.json(payload);
    }

    const whereBase = empresaId ? { empresa_id: empresaId } : {};

    const ativas = await Licitacao.count({
      where: { ...whereBase, status: "ativa" },
    });

    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + 7);
    const proximosPrazos = await Licitacao.count({
      where: {
        ...whereBase,
        status: { [Op.notIn]: ["concluida", "cancelada"] },
        data_encerramento: { [Op.gte]: hoje, [Op.lte]: dataLimite, [Op.ne]: null },
      },
    });

    const emAtraso = await Licitacao.count({
      where: {
        ...whereBase,
        status: { [Op.notIn]: ["concluida", "cancelada"] },
        data_encerramento: { [Op.lt]: hoje, [Op.ne]: null },
      },
    });

    const concluidas = await Licitacao.count({
      where: { ...whereBase, status: "concluida" },
    });

    const licitacoesAndamento = await Licitacao.findAll({
      where: {
        ...whereBase,
        status: { [Op.in]: ["ativa", "em_andamento"] },
      },
      include: [
        { model: Empresa, as: "empresa", attributes: ["nome_fantasia"] },
        { model: OrgaoPublico, as: "orgao", attributes: ["nome"] },
      ],
      limit: 5,
      order: [["data_encerramento", "ASC"]],
    });

    const payload = {
      success: true,
      data: {
        stats: { ativas, proximosPrazos, emAtraso, concluidas },
        licitacoesAndamento,
      },
    };

    res.json(payload);

  } catch (error) {
    if (error.message && error.message.includes("coluna") && error.message.includes("não existe")) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar estatísticas: Verifique se a coluna 'data_encerramento' foi adicionada corretamente ao banco de dados.",
            error: error.message,
        });
    }
    res.status(500).json({
      success: false,
      message: "Erro ao buscar estatísticas do dashboard",
      error: error.message,
    });
  }
};

// Adicionar método para atualizar prazos de uma licitação
exports.atualizarPrazos = async (req, res) => {
  // ... (código existente)
  try {
    const { id } = req.params;
    const { data_abertura, data_encerramento, proxima_entrega, prazo_vigencia, observacoes } = req.body;
    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      return res.status(404).json({
        success: false,
        message: "Licitação não encontrada",
      });
    }
    // Adicionar verificação de permissão aqui também, se necessário
    await licitacao.update({
      data_abertura: data_abertura || licitacao.data_abertura,
      data_encerramento: data_encerramento || licitacao.data_encerramento,
      proxima_entrega: proxima_entrega || licitacao.proxima_entrega,
      prazo_vigencia: prazo_vigencia || licitacao.prazo_vigencia,
      observacoes: observacoes || licitacao.observacoes,
    });
    res.json({
      success: true,
      message: "Prazos atualizados com sucesso",
      data: licitacao,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar prazos da licitação",
      error: error.message,
    });
  }
};


// Adicionar método para anexar documentos a uma licitação
exports.anexarDocumento = async (req, res) => {
  // ... (código existente)
  try {
    const { id } = req.params;
    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      return res.status(404).json({
        success: false,
        message: "Licitação não encontrada",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo foi enviado",
      });
    }
    const documento = await Documento.create({
      nome: req.body.nome,
      tipo: req.body.tipo,
      descricao: req.body.descricao || "",
      caminho_arquivo: req.file.path,
      tamanho: req.file.size,
      tipo_arquivo: req.file.mimetype,
      data_upload: new Date(),
      licitacao_id: id,
      usuario_id: req.userId,
    });
    res.status(201).json({
      success: true,
      message: "Documento anexado com sucesso",
      data: documento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao anexar documento",
      error: error.message,
    });
  }
};

// Adicionar método para adicionar comentários a uma licitação
exports.adicionarComentario = async (req, res) => {
  // ... (código existente)
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const licitacao = await Licitacao.findByPk(id);
    if (!licitacao) {
      return res.status(404).json({
        success: false,
        message: "Licitação não encontrada",
      });
    }
    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "O texto do comentário é obrigatório",
      });
    }
    const comentario = await Comentario.create({
      texto,
      data: new Date(),
      licitacao_id: id,
      usuario_id: req.userId,
    });
    res.status(201).json({
      success: true,
      message: "Comentário adicionado com sucesso",
      data: comentario,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao adicionar comentário",
      error: error.message,
    });
  }
};

