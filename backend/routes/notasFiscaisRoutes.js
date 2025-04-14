const express = require('express');
const router = express.Router();
const controller = require('../controllers/notaFiscalController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar); // pode usar query param ?licitacao_id=xxx
router.put('/:id', controller.editar);

module.exports = router;
