const pdfService = require('../services/pdfService');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});	

exports.exportarTarefas = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tarefa ORDER BY id ASC');
    const tarefas = resultado.rows;
    pdfService.generateTaskListPDF(tarefas, res);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};
