const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

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

app.listen(port, () => {
    console.log('Servidor rodando na porta ${port}');   
});

