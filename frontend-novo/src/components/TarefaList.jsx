import React, { useEffect, useState } from 'react';
import api from '../api.js';

const TarefaList = () => {
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState(null);

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

  return (
    <div className="tarefa-list" style={{ padding: '1rem' }}>
      <h2>Lista de Tarefas</h2>

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
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa) => { 
                console.log('Renderizando tarefa:', tarefa)
                return (
              <tr key={tarefa.id}>
                <td>{tarefa.id}</td>
                <td>{tarefa.descricao}</td>
                <td>{tarefa.situacao}</td>
                <td>{new Date(tarefa.data_criacao).toLocaleDateString()}</td>
                <td>{tarefa.data_prevista ? new Date(tarefa.data_prevista).toLocaleDateString() : '-'}</td>
                <td>{tarefa.data_encerramento ? new Date(tarefa.data_encerramento).toLocaleDateString() : '-'}</td>
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
