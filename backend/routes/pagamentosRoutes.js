const express = require('express');
const router = express.Router();
const controller = require('../controllers/pagamentoController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar); // pode usar query param ?nota_fiscal_id=xxx
router.put('/:id', controller.editar);
router.delete('/:id', controller.deletar);

module.exports = router;
