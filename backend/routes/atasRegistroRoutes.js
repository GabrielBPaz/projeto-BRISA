const express = require('express');
const router = express.Router();
const controller = require('../controllers/ataRegistroController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.put('/:id', controller.editar);
router.delete('/:id', controller.deletar);

module.exports = router;
