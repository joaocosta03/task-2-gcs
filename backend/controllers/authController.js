const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const JWT_SECRET = process.env.JWT_SECRET || 'segredo'; 

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const usuario = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, nome: usuario.nome, email: usuario.email });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }   
}

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, hashedPassword]
        );

        const usuario = result.rows[0];
        res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};