import { useEffect, useState } from 'react';
import api from '../api.js';

function UsuarioList() {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  const excluirUsuario = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (!confirmar) return;

    try {
      	await api.delete(`/usuarios/${id}`);
      	fetchUsuarios(); // atualiza a lista
    } catch (err) {
      	console.error('Erro ao excluir usuário:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Usuários Cadastrados</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => excluirUsuario(usuario.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsuarioList;
