const request = require('supertest');
const express = require('express');

const mockQuery = jest.fn();

jest.mock('pg', () => ({
	Pool: jest.fn(() => ({ query: mockQuery }))
}));

jest.mock('bcrypt', () => ({
	compare: jest.fn((senha, hash) => senha === 'admin123'),
	hash: jest.fn(() => 'hashed_senha')
}));

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn(() => 'mocked.jwt.token'),
	verify: jest.fn(() => ({ id: 1, email: 'admin@test.com' }))
}));

jest.mock('../services/emailService', () => ({
	sendEmail: jest.fn()
}));

const authController = require('../controllers/authController');

const app = express();
app.use(express.json());
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

describe('Autenticação (mockada)', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('deve registrar novo usuário com sucesso', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, nome: 'Teste', email: 'admin@test.com' }]
    });

    const res = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Teste',
        email: 'admin@test.com',
        senha: 'admin123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'admin@test.com');
  });

  it('deve retornar erro ao tentar registrar com email já existente', async () => {
    mockQuery.mockRejectedValueOnce({
      code: '23505',
      message: 'duplicate key value violates unique constraint'
    });

    const res = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Teste',
        email: 'admin@test.com',
        senha: 'admin123'
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  it('deve logar com sucesso e retornar token', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'admin@test.com', senha: 'hashed_senha', nome: 'Teste' }]
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        senha: 'admin123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked.jwt.token');
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockImplementation(() => false);

    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'admin@test.com', senha: 'hashed_senha', nome: 'Teste' }]
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        senha: 'senhaErrada'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar 401 para email inexistente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'naoexiste@test.com',
        senha: 'admin123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
