const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');

// cria pool direto para encerrar no afterAll
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

describe('Autenticação', () => {
  beforeAll(async () => {
    // garantir que o usuário exista com hash bcrypt
    await request(app).post('/auth/register').send({
      nome: 'Teste',
      email: 'admin@test.com',
      senha: 'admin123',
    });
  });

  afterAll(async () => {
    await pool.query("DELETE FROM usuario WHERE email = 'admin@test.com';");
    await pool.end(); // fecha conexão com o banco
  });

  it('deve retornar 200 ao logar com credenciais válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        senha: 'admin123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        senha: 'senhaErrada',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
