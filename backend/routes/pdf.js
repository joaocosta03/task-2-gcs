const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.get('/tarefas', pdfController.exportarTarefas);

module.exports = router;
