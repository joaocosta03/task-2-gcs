const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.getTarefas = async (req, res) => {
    try { 
        const result = await pool.query('SELECT * FROM tarefa ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar tarefas:', error);
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
}

exports.createTarefa = async (req, res) => {
    const { descricao, situacao, data_criacao, data_prevista } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tarefa (descricao, situacao, data_criacao, data_prevista) VALUES ($1, $2, $3, $4) RETURNING *', 
            [descricao, situacao, data_criacao, data_prevista]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
}

exports.updateTarefa = async (req, res) => {
    const { id } = req.params;
    const { descricao, situacao, data_prevista, data_encerramento } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tarefa SET descricao = $1, situacao = $2, data_prevista = $3, data_encerramento = $4 WHERE id = $5 RETURNING *',
            [descricao, situacao, data_prevista, data_encerramento, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.status(204).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
}

exports.deleteTarefa = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tarefa WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
}

exports.getTarefaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarefa WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
}