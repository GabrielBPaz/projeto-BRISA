const express = require('express');
const router = express.Router();
const controller = require('../controllers/historicoInteracaoController');

router.post('/', controller.adicionar);
router.get('/', controller.listar);

module.exports = router;
