const pdfService = require('../services/pdfService');
const tarefaController = require('../controllers/pdfController');
const { Pool } = require('pg');

jest.mock('pdfkit');
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn()
  };
  return { Pool: jest.fn(() => mClient) };
});

const PDFDocument = require('pdfkit');

describe('Exportação de PDF', () => {
  const mockPipe = jest.fn();
  const mockEnd = jest.fn();
  const mockFontSize = jest.fn().mockReturnThis();
  const mockText = jest.fn().mockReturnThis();
  const mockMoveDown = jest.fn().mockReturnThis();

  let mockRes;
  let mockPool;

  beforeAll(() => {
    PDFDocument.mockImplementation(() => ({
      pipe: mockPipe,
      end: mockEnd,
      fontSize: mockFontSize,
      text: mockText,
      moveDown: mockMoveDown
    }));

    mockRes = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };

    mockPool = new Pool();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exportar tarefas como PDF', async () => {
    const tarefas = [
      { descricao: 'Tarefa 1', situacao: 'pendente' },
      { descricao: 'Tarefa 2', situacao: 'concluída' }
    ];

    mockPool.query.mockResolvedValueOnce({ rows: tarefas });

    await tarefaController.exportarTarefas({}, mockRes);

    // Verifica headers
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=tarefas.pdf');

    // Verifica geração do PDF
    expect(mockPipe).toHaveBeenCalledWith(mockRes);
    expect(mockFontSize).toHaveBeenCalledWith(18);
    expect(mockText).toHaveBeenCalledWith('Lista de Tarefas', { align: 'center' });
    expect(mockText).toHaveBeenCalledWith('1. Tarefa 1 [pendente]', { continued: false });
    expect(mockText).toHaveBeenCalledWith('2. Tarefa 2 [concluída]', { continued: false });
    expect(mockEnd).toHaveBeenCalled();
  });
});
