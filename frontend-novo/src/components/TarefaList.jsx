import React, { useEffect, useState } from 'react';
import TarefaForm from './TarefaForm.jsx';
import api from '../api.js';

const TarefaList = () => {
    const [tarefas, setTarefas] = useState([]);
    const [erro, setErro] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formEdit, setFormEdit] = useState({
    descricao: '',
    situacao: '',
    data_prevista: '',
    data_encerramento: ''
    });


  const loadTasks = async () => {
    try {
      const res = await api.get('/tarefas');
      console.log('resposta da api:', res.data);
      setTarefas(res.data);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setErro('Não foi possível carregar as tarefas.');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/tarefas/${id}`);
      loadTasks();
    }   catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
};

    const handleEdit = (tarefa) => {
        setEditingId(tarefa.id);
        setFormEdit({
            descricao: tarefa.descricao,
            situacao: tarefa.situacao,
            data_prevista: tarefa.data_prevista ? tarefa.data_prevista.slice(0, 10) : '',
            data_encerramento: tarefa.data_encerramento ? tarefa.data_encerramento.slice(0, 10) : ''
            });
    }

    const handleUpdate = async (id) => {
        const dados = {
            ...formEdit,
            data_prevista: formEdit.data_prevista
              ? new Date(formEdit.data_prevista).toISOString().split('T')[0]
              : null,
            data_encerramento: formEdit.data_encerramento && formEdit.data_encerramento.trim() !== ''
              ? new Date(formEdit.data_encerramento).toISOString().split('T')[0]
              : null
        };
        try {
            await api.put(`/tarefas/${id}`, dados);
            setEditingId(null);
            loadTasks();
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

  return (
    <div className="tarefa-list" style={{ padding: '1rem' }}>
      <h2>Lista de Tarefas</h2>

    <TarefaForm onSuccess={loadTasks} />
    
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Situação</th>
              <th>Data de Criação</th>
              <th>Data Prevista</th>
              <th>Data de Encerramento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa) => { 
                return (
              <tr key={tarefa.id}>
                <td>{tarefa.id}</td>
                {editingId === tarefa.id ? (
                    <>
                    <td colSpan="5">
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(tarefa.id); }}>
                            <input
                                type="text"
                                value={formEdit.descricao}
                                onChange={(e) => setFormEdit({ ...formEdit, descricao: e.target.value })}
                            />
                            <select
                                value={formEdit.situacao}
                                onChange={(e) => setFormEdit({ ...formEdit, situacao: e.target.value })}
                            >
                                <option value="pendente">Pendente</option>
                                <option value="em andamento">Em Andamento</option>
                                <option value="concluida">Concluída</option>
                            </select>
                            <td>{new Date(tarefa.data_criacao).toLocaleDateString()}</td>
                            <input
                                type="date"
                                value={formEdit.data_prevista}
                                onChange={(e) => setFormEdit({ ...formEdit, data_prevista: e.target.value })}
                            />
                            <input
                                type="date"
                                value={formEdit.data_encerramento}
                                onChange={(e) => setFormEdit({ ...formEdit, data_encerramento: e.target.value })}
                            />
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                        </form>
                    </td>
                </>
                ) : (
                <>
                <td>{tarefa.descricao}</td>
                <td>{tarefa.situacao}</td>
                <td>{new Date(tarefa.data_criacao).toLocaleDateString()}</td>
                <td>{tarefa.data_prevista ? new Date(tarefa.data_prevista).toLocaleDateString() : '-'}</td>
                <td>{tarefa.data_encerramento ? new Date(tarefa.data_encerramento).toLocaleDateString() : '-'}</td>
                <td>
                    <button onClick={() => handleEdit(tarefa)}>Editar</button>
                    <button onClick={() => handleDelete(tarefa.id)}>Excluir</button>
                </td>
              </>
              )}
              </tr>
                );}    
        )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TarefaList;
