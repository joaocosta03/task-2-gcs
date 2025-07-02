require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : undefined
});

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const tarefaRoutes = require('./routes/tarefa');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/tarefas', tarefaRoutes);
app.use('/auth', authRoutes);

module.exports = app; 

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
        return res.sendStatus(500).send('Erro ao buscar dados.');
    }
});


if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);   
    });
}

