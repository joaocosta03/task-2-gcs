import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TarefaList from '../components/TarefaList';
import api from '../api';

// Mock da API
vi.mock('../api');

describe('TarefaList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve mostrar "Nenhuma tarefa cadastrada" quando não há tarefas', async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    render(<TarefaList />);
    expect(await screen.findByText(/nenhuma tarefa cadastrada/i)).toBeInTheDocument();
  });

  it('deve exibir a lista de tarefas retornada da API', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          descricao: 'Estudar testes',
          situacao: 'pendente',
          data_criacao: '2025-07-01',
          data_prevista: '2025-07-05',
          data_encerramento: null
        }
      ]
    });

    render(<TarefaList />);

    expect(await screen.findByText(/estudar testes/i)).toBeInTheDocument();
    expect(screen.getByText(/editar/i)).toBeInTheDocument();
    expect(screen.getByText(/excluir/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro se a API falhar', async () => {
    api.get.mockRejectedValueOnce(new Error('Erro de conexão'));

    render(<TarefaList />);
    expect(await screen.findByText(/não foi possível carregar as tarefas/i)).toBeInTheDocument();
  });

  it('deve chamar a função de exportação ao clicar no botão', async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    const mockBlob = new Blob(['mock'], { type: 'application/pdf' });
    const blobUrl = 'blob:http://localhost/mockpdf';
    api.get.mockResolvedValueOnce({ data: mockBlob });

    global.URL.createObjectURL = vi.fn(() => blobUrl);
    const createElementSpy = vi.spyOn(document, 'createElement');

    render(<TarefaList />);

    fireEvent.click(await screen.findByText(/exportar tarefas em pdf/i));

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalled();
    });
  });

  it('deve entrar em modo de edição ao clicar em "Editar"', async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 2,
          descricao: 'Tarefa de edição',
          situacao: 'em andamento',
          data_criacao: '2025-07-02',
          data_prevista: '2025-07-10',
          data_encerramento: null
        }
      ]
    });

    render(<TarefaList />);

    const editarBtn = await screen.findByText('Editar');
    fireEvent.click(editarBtn);

    expect(await screen.findByDisplayValue('Tarefa de edição')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });
});
