const express = require('express');
const router = express.Router();
const licitacaoController = require('../controllers/licitacaoController');

router.post('/', licitacaoController.cadastrar); // UC01
router.get('/', licitacaoController.listar); // UC02
router.put('/:id', licitacaoController.editar); // UC03
router.patch('/:id/status', licitacaoController.mudarStatus); // UC04

module.exports = router;
