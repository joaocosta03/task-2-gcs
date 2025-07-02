const request = require('supertest');
const app = require('../server');

describe('Autenticação', () => {
  it('deve retornar 200 ao logar com credenciais válidas', async () => {
    const res = await request(app)
      .post('/auth')
      .send({
        email: 'teste@teste.com.br',
        senha: 'aham'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const res = await request(app)
      .post('/auth')
      .send({
        email: 'teste@teste.com.br',
        senha: 'senhaErrada'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
