import { Routes, Route, Navigate } from 'react-router-dom';
import TarefaList from './components/TarefaList';
import Login from './pages/login';
import Register from './pages/register';
import LogoutButton from './components/LogoutButton';


const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace/>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/tarefas"
        element={
          <RotaPrivada>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <LogoutButton />
            </div>
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
              <h1>Gerenciador de Tarefas</h1>
              <TarefaList />
            </div>
          </RotaPrivada>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace/>} />
    </Routes>
  );
}

export default App;
