const express = require("express");
const router = express.Router();
const licitacoesController = require("../controllers/licitacoesController");
const empenhoController = require("../controllers/empenhoController");
const { authMiddleware } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Importar fs para criar diretório

// Criar diretório de uploads se não existir
const uploadDir = "uploads/documentos/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Usar a variável uploadDir
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo: timestamp + id da licitação (ou temp) + nome original
    // Usaremos 'temp' aqui e renomearemos no controller após criar a licitação
    const uniqueSuffix = Date.now() + "-temp";
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_")); // Substituir espaços no nome do arquivo
  },
});

// Filtro para tipos de arquivos permitidos (AJUSTADO PARA PERMITIR APENAS PDF NO UPLOAD INICIAL)
const editalFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido para o edital. Apenas PDF é aceito."), false);
  }
};

// Configuração do Multer para o edital (apenas PDF)
const uploadEdital = multer({
  storage: storage,
  fileFilter: editalFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
});

// Configuração do Multer para outros documentos (tipos variados)
const uploadDocumento = multer({
  storage: storage, // Reutiliza o storage, mas o nome será ajustado no controller anexarDocumento
  fileFilter: (req, file, cb) => { // Filtro mais abrangente para anexos gerais
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Tipo de arquivo não permitido. Apenas PDF, DOC(X), XLS(X), JPG e PNG são aceitos."), false);
      }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
});


// Rotas
// MODIFICADO: Adicionado uploadEdital.single('edital') para a rota de criação
router.post("/", authMiddleware, uploadEdital.single("edital"), licitacoesController.criarLicitacao);

router.get("/", authMiddleware, licitacoesController.getLicitacoes);
router.get("/dashboard", authMiddleware, licitacoesController.getDashboardStats);
router.get("/:id", authMiddleware, licitacoesController.getLicitacaoById);
router.post("/:id/empenhos", authMiddleware, empenhoController.cadastrar);
router.put("/:id/prazos", authMiddleware, licitacoesController.atualizarPrazos);

// Usar uploadDocumento para anexar documentos gerais
router.post(
  "/:id/documentos",
  authMiddleware,
  uploadDocumento.single("arquivo"), // Usar a config mais abrangente aqui
  licitacoesController.anexarDocumento
);
router.post(
  "/:id/comentarios",
  authMiddleware,
  licitacoesController.adicionarComentario
);

module.exports = router;

