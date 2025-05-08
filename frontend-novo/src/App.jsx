import React from 'react';
import TarefaList from './components/TarefaList';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gerenciador de Tarefas</h1>
      <TarefaList />
    </div>
  );
}

export default App;