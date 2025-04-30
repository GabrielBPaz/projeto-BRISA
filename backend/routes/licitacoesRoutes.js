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
    // Gerar nome único para o arquivo: timestamp + id da licitação + nome original
    const uniqueSuffix = Date.now() + "-" + (req.params.id || "temp"); // Adicionar fallback para id
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_")); // Substituir espaços no nome do arquivo
  },
});

// Filtro para tipos de arquivos permitidos
const fileFilter = (req, file, cb) => {
  // Tipos de arquivos permitidos
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
    cb(
      new Error(
        "Tipo de arquivo não permitido. Apenas PDF, DOC, DOCX, XLS, XLSX, JPG e PNG são aceitos."
      ),
      false
    );
  }
};

// Configuração do Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
});

// Rotas
router.get("/", authMiddleware, licitacoesController.getLicitacoes);
router.get("/dashboard", authMiddleware, licitacoesController.getDashboardStats); // Adicionar rota para dashboard
router.get("/:id", authMiddleware, licitacoesController.getLicitacaoById);
router.post("/:id/empenhos", authMiddleware, empenhoController.cadastrar);
router.put("/:id/prazos", authMiddleware, licitacoesController.atualizarPrazos);
router.post(
  "/:id/documentos",
  authMiddleware,
  upload.single("arquivo"),
  licitacoesController.anexarDocumento
);
router.post(
  "/:id/comentarios",
  authMiddleware,
  licitacoesController.adicionarComentario
);

module.exports = router;

