const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');

// Mock do serviço de e-mail
jest.mock('../services/emailService');
const emailService = require('../services/emailService');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

afterAll(async () => {
  await pool.end();

  // 🔧 workaround para garantir que tudo termine
  await new Promise(resolve => setTimeout(resolve, 50));
});

afterEach(() => {
  jest.clearAllMocks(); // Limpa o mock entre os testes
});

describe.skip('Envio de e-mail - Registro de usuário', () => {
  const emailTeste = 'teste.emailservice@example.com';

  afterAll(async () => {
    await pool.query('DELETE FROM usuario WHERE email = $1', [emailTeste]);
  });

  it('deve chamar emailService.sendEmail após registro de novo usuário', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Mockado',
        email: emailTeste,
        senha: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      emailTeste,
      'Bem-vindo ao sistema de tarefas!',
      expect.stringContaining('Olá Mockado')
    );
  });
});

describe.skip('Envio de e-mail - Criação de tarefa', () => {
  let token;

  beforeAll(async () => {
    // Garante que o usuário existe
    await request(app).post('/auth/register').send({
      nome: 'Admin',
      email: 'admin@test.com',
      senha: 'admin123'
    });

    // Faz login e obtém token
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        senha: 'admin123'
      });

    token = res.body.token;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM tarefa WHERE descricao = 'Tarefa com e-mail'");
    await pool.query("DELETE FROM usuario WHERE email = 'admin@test.com'");
  });

  it('deve chamar emailService.sendEmail ao criar uma nova tarefa', async () => {
    const res = await request(app)
      .post('/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Tarefa com e-mail',
        situacao: 'pendente',
        data_criacao: '2025-07-06',
        data_prevista: '2025-07-10'
      });

    expect(res.statusCode).toBe(201);
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'admin@test.com',
      'Nova Tarefa Criada',
      expect.stringContaining('Tarefa com e-mail')
    );
  });
});
