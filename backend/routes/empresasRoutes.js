const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.post('/', empresaController.cadastrar);
router.get('/', empresaController.listar);
router.put('/:id', empresaController.editar);
router.delete('/:id', empresaController.deletar);

module.exports = router;
