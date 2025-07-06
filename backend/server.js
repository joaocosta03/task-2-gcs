require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const tarefaRoutes = require('./routes/tarefa');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email'); 
const pdfRoutes = require('./routes/pdf');    
const usuarioRoutes = require('./routes/usuario');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/tarefas', tarefaRoutes);
app.use('/auth', authRoutes);
app.use('/email', emailRoutes);   
app.use('/pdf', pdfRoutes);       
app.use('/usuarios', usuarioRoutes);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/dados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefa');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro ao buscar dados.');
  }
});
console.log('Ambiente ativo:', process.env.NODE_ENV);
module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}
