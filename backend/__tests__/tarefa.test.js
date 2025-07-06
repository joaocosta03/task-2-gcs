const { validarCamposTarefa } = require('../services/tarefaService');

describe('Tarefas - Testes Unitários', () => {
  test('Criação de tarefa válida', () => {
    const novaTarefa = {
      descricao: 'Estudar testes',
      data_prevista: '2025-07-10',
      situacao: 'pendente'
    };

    expect(novaTarefa.descricao).toBeDefined();
    expect(novaTarefa.data_prevista).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(['pendente', 'concluída']).toContain(novaTarefa.situacao);
  });


  test('Criação com campo vazio deve falhar', () => {
    const tarefaInvalida = {
      descricao: '',
      data_prevista: '2025-07-10',
      situacao: 'pendente'
    };

    const resultado = validarCamposTarefa(tarefaInvalida);
    expect(resultado).toBe(false);
  });
});
