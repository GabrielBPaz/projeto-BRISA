const { Licitacao, Empresa, OrgaoPublico, Empenho, NotaFiscal, Entrega, Usuario, Documento, Comentario, ItemEmpenho, AtaRegistro, Pagamento } = require("../models");
const { Op, Sequelize } = require("sequelize"); // Importar Sequelize para usar Sequelize.col
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
    const { numero_licitacao, orgao_id, /* empresa_id removido do body */ modalidade, objeto, valor_total, data_abertura, data_encerramento, status } = req.body;
    const userId = req.userId; // ID do usuário vindo do middleware de autenticação
    console.log(`[criarLicitacao] userId recebido: ${userId}`); // LOG 1: Verificar userId

    // Buscar o usuário para obter o empresa_id
    const usuario = await Usuario.findByPk(userId, { attributes: ["id", "empresa_id"] });
    console.log(`[criarLicitacao] Resultado busca usuário: ${JSON.stringify(usuario)}`); // LOG 2: Verificar resultado da busca

    if (!usuario) {
        console.error(`[criarLicitacao] Usuário com ID ${userId} não encontrado.`);
        await fs.unlink(editalPath);
        return res.status(401).json({ success: false, message: "Usuário não autenticado ou não encontrado." });
    }
    const empresaIdUsuario = usuario.empresa_id;
    console.log(`[criarLicitacao] empresaIdUsuario obtido: ${empresaIdUsuario}`); // LOG 3: Verificar empresaIdUsuario

    // Validação básica dos campos de texto (pode ser expandida)
    if (!numero_licitacao || !orgao_id || !modalidade || !objeto || !data_abertura) {
        console.warn(`[criarLicitacao] Validação falhou: Campos obrigatórios ausentes.`);
        await fs.unlink(editalPath);
        return res.status(400).json({ success: false, message: "Campos obrigatórios (Número, Órgão, Modalidade, Objeto, Data Abertura) não fornecidos." });
    }

    // Definir status padrão se não fornecido ou inválido (ajustar conforme necessidade)
    const statusValido = status && ["Em Aberto", "Em Andamento", "Concluída", "Cancelada", "Suspensa", "ativa"].includes(status) ? status : "Em Aberto";
    console.log(`[criarLicitacao] Status definido: ${statusValido}`); // LOG 4: Verificar status

    // Montar objeto para criação
    const dadosCriacao = {
      numero_licitacao,
      orgao_id: parseInt(orgao_id),
      empresa_id: empresaIdUsuario, // Usar o ID da empresa do usuário logado
      modalidade,
      objeto,
      valor_total: valor_total ? parseFloat(valor_total) : null,
      data_abertura,
      data_encerramento: data_encerramento || null,
      status: statusValido, // Usar status validado ou padrão
    };
    console.log(`[criarLicitacao] Dados para Licitacao.create: ${JSON.stringify(dadosCriacao)}`); // LOG 5: Verificar dados antes de criar

    // Criar a licitação no banco de dados
    novaLicitacao = await Licitacao.create(dadosCriacao);
    console.log(`[criarLicitacao] Licitação criada com ID: ${novaLicitacao.id}`);

    // Renomear o arquivo do edital para incluir o ID da licitação
    const novoNomeArquivo = `${Date.now()}-${novaLicitacao.id}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const novoPath = path.join(path.dirname(editalPath), novoNomeArquivo);
    await fs.rename(editalPath, novoPath);
    console.log(`[criarLicitacao] Edital renomeado para: ${novoPath}`);

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
    console.log(`[criarLicitacao] Documento do edital criado para licitação ID: ${novaLicitacao.id}`);

    res.status(201).json({
      success: true,
      message: "Licitação e edital criados com sucesso!",
      data: novaLicitacao,
    });

  } catch (error) {
    console.error("[criarLicitacao] Erro ao criar licitação:", error); // Log de erro

    // Se ocorreu erro após criar a licitação, tentar deletá-la (rollback manual)
    if (novaLicitacao && novaLicitacao.id) {
      try {
        await Licitacao.destroy({ where: { id: novaLicitacao.id } });
        console.warn(`[criarLicitacao] Rollback: Licitação ID ${novaLicitacao.id} deletada após erro.`);
      } catch (deleteError) {
        console.error("[criarLicitacao] Erro ao tentar deletar licitação após falha:", deleteError);
      }
    }

    // Se ocorreu erro (em qualquer ponto), tentar deletar o arquivo de upload
    if (editalPath) {
      try {
        await fs.unlink(editalPath);
        console.warn(`[criarLicitacao] Rollback: Arquivo de upload ${editalPath} deletado após erro.`);
      } catch (unlinkError) {
        // Se o arquivo já foi renomeado, tentar deletar pelo novo nome (melhoria futura)
        console.error("[criarLicitacao] Erro ao tentar deletar arquivo de upload após falha:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Erro interno ao criar licitação",
      error: error.message,
    });
  }
};

// Obter todas as licitações com filtro e ordenação dinâmica
exports.getLicitacoes = async (req, res) => {
  try {
    const { empresaId, status, dataInicio, dataFim, sortBy } = req.query; // Adicionado sortBy
    const userRole = req.userRole;
    const userId = req.userId;
    const where = {};

    const usuario = await Usuario.findByPk(userId, { attributes: ["id", "empresa_id"] });

    // Filtrar por empresa baseado no usuário ou query param (se admin)
    if (usuario && usuario.empresa_id) {
      where.empresa_id = usuario.empresa_id;
    } else if (userRole === "admin" && empresaId) {
      where.empresa_id = empresaId;
    } else if (userRole !== "admin") {
      // Se não for admin e não tiver empresa_id, retorna vazio (ou ajusta regra)
      return res.json({ success: true, data: [] });
    }

    // Aplicar filtros
    if (status) where.status = status;
    if (dataInicio && dataFim) where.data_abertura = { [Op.between]: [new Date(dataInicio), new Date(dataFim)] };
    else if (dataInicio) where.data_abertura = { [Op.gte]: new Date(dataInicio) };
    else if (dataFim) where.data_abertura = { [Op.lte]: new Date(dataFim) };

    // Definir ordenação dinâmica
    let order = [["data_abertura", "DESC"]]; // Padrão: Mais recente
    if (sortBy) {
      switch (sortBy) {
        case "data_abertura_asc":
          order = [["data_abertura", "ASC"]];
          break;
        case "proximo_prazo":
          // Ordena por data_encerramento ASC, tratando nulos (coloca no final)
          order = [[Sequelize.fn("isnull", Sequelize.col("data_encerramento")), "ASC"], ["data_encerramento", "ASC"]];
          break;
        case "orgao_az":
          // Ordena pelo nome do órgão associado (A-Z)
          order = [[{ model: OrgaoPublico, as: "orgao" }, "nome", "ASC"]];
          break;
        case "cidade_az":
          // Ordena pela cidade do órgão associado (A-Z)
          // ATENÇÃO: Certifique-se que o modelo OrgaoPublico tem o campo 'cidade'
          order = [[{ model: OrgaoPublico, as: "orgao" }, "cidade", "ASC"]];
          break;
        // case "data_abertura_desc": // Já é o padrão
        //   order = [["data_abertura", "DESC"]];
        //   break;
        default:
          // Mantém o padrão se sortBy for inválido
          order = [["data_abertura", "DESC"]];
      }
    }

    const licitacoes = await Licitacao.findAll({
      where,
      include: [
        { model: Empresa, as: "empresa", attributes: ["id", "nome_fantasia"] },
        { model: OrgaoPublico, as: "orgao", attributes: ["id", "nome", "cidade", "estado"] }, // Incluir cidade/estado para ordenação e exibição
      ],
      order: order, // Usar a ordenação dinâmica
    });

    res.json({ success: true, data: licitacoes });
  } catch (error) {
    console.error("Erro ao buscar licitações:", error); // Log de erro no backend
    res.status(500).json({ success: false, message: "Erro ao buscar licitações", error: error.message });
  }
};

// Obter detalhes de uma licitação por ID
exports.getLicitacaoById = async (req, res) => {
  const { id } = req.params;
  console.log(`Buscando detalhes para licitação ID: ${id}`); // Log do ID
  try {
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
      console.warn(`Licitação ID: ${id} não encontrada.`); // Log se não encontrada
      return res.status(404).json({ success: false, message: "Licitação não encontrada" });
    }

    // Buscar documentos e comentários separadamente para simplificar a query principal
    const [documentos, comentarios] = await Promise.all([
        Documento.findAll({
            where: { licitacao_id: id },
            include: [{ model: Usuario, as: "usuario", attributes: ["id", "nome"] }],
            order: [["data_upload", "DESC"]],
        }),
        Comentario.findAll({
            where: { licitacao_id: id },
            include: [{ model: Usuario, as: "usuario", attributes: ["id", "nome"] }],
            order: [["data", "ASC"]],
        })
    ]);

    const licitacaoData = licitacao.get({ plain: true });
    licitacaoData.documentos = documentos;
    licitacaoData.comentarios = comentarios;

    console.log(`Detalhes da licitação ID: ${id} encontrados com sucesso.`); // Log de sucesso
    res.status(200).json({ success: true, data: licitacaoData });

  } catch (error) {
    // Log detalhado do erro no backend
    console.error(`Erro detalhado ao buscar licitação ID: ${id}:`, error);
    res.status(500).json({ 
        success: false, 
        message: "Erro interno ao buscar detalhes da licitação. Consulte os logs do servidor.", // Mensagem mais genérica para o usuário
        error: error.message // Manter a mensagem original para depuração se necessário
    });
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
        where: { ...whereBase, status: { [Op.in]: ["ativa", "em_andamento"] } }, // Ajustado para incluir "em_andamento"
        include: [
          { model: Empresa, as: "empresa", attributes: ["nome_fantasia"] },
          { model: OrgaoPublico, as: "orgao", attributes: ["nome"] },
        ],
        limit: 5,
        order: [[Sequelize.fn("isnull", Sequelize.col("data_encerramento")), "ASC"], ["data_encerramento", "ASC"]], // Ordenar por próximo prazo
      })
    ]);

    res.json({ success: true, data: { stats: { ativas, proximosPrazos, emAtraso, concluidas }, licitacoesAndamento } });

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error); // Log de erro
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

