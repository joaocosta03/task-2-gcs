const request = require('supertest');
const express = require('express');

const mockQuery = jest.fn();

jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => ({
      query: mockQuery
    }))
  };
});

let app;
let tarefaController;

beforeAll(() => {
  	jest.mock('../services/emailService');
	tarefaController = require('../controllers/tarefaController');

  app = express();
  app.use(express.json());

  app.get('/tarefas', tarefaController.getTarefas);
  app.get('/tarefas/:id', tarefaController.getTarefaById);
  app.post('/tarefas', (req, res, next) => {
    req.user = { email: 'teste@exemplo.com' }; // simula usuário autenticado
    tarefaController.createTarefa(req, res, next);
  });
  app.put('/tarefas/:id', tarefaController.updateTarefa);
  app.delete('/tarefas/:id', tarefaController.deleteTarefa);
});

beforeEach(() => {
  mockQuery.mockReset();
});

describe('TarefaController', () => {

  describe('updateTarefa', () => {
    it('deve retornar 404 se o ID da tarefa não existir', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/tarefas/999')
        .send({
          descricao: 'Nova descrição',
          situacao: 'pendente',
          data_prevista: '2025-07-10',
          data_encerramento: null
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Tarefa não encontrada' });
    });
  });

  describe('deleteTarefa', () => {
    it('deve deletar tarefa existente e retornar 204', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/tarefas/1');

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it('deve retornar 404 ao tentar deletar uma tarefa inexistente', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).delete('/tarefas/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Tarefa não encontrada' });
    });
  });

  describe('createTarefa', () => {
    it('deve criar uma nova tarefa e retornar 201', async () => {
      const tarefaCriada = {
        id: 1,
        descricao: 'Nova tarefa',
        situacao: 'pendente',
        data_criacao: '2025-07-06',
        data_prevista: '2025-07-10'
      };

      mockQuery.mockResolvedValueOnce({ rows: [tarefaCriada] });

      const res = await request(app)
        .post('/tarefas')
        .send(tarefaCriada);

      expect(res.statusCode).toBe(201);
      expect(res.body.descricao).toBe('Nova tarefa');
    });
  });

  describe('getTarefas', () => {
    it('deve retornar a lista de tarefas', async () => {
      const tarefas = [
        { id: 1, descricao: 'Tarefa 1', situacao: 'pendente' },
        { id: 2, descricao: 'Tarefa 2', situacao: 'concluída' }
      ];

      mockQuery.mockResolvedValueOnce({ rows: tarefas });

      const res = await request(app).get('/tarefas');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].descricao).toBe('Tarefa 1');
    });
  });

  describe('getTarefaById', () => {
    it('deve retornar 404 se a tarefa não for encontrada', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/tarefas/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Tarefa não encontrada' });
    });
  });

});
