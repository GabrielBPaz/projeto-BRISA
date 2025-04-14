const express = require('express');
const router = express.Router();
const orgaoController = require('../controllers/orgaoController');

router.post('/', orgaoController.cadastrar);
router.get('/', orgaoController.listar);
router.put('/:id', orgaoController.editar);
router.delete('/:id', orgaoController.deletar);

module.exports = router;
