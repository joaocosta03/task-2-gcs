import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Register() {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [erro, setErro] = useState('');
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();

		try {
			const res = await api.post('/auth/register', { nome, email, senha });

			const { token } = res.data;

      		
			alert('Usuário registrado com sucesso!');
			localStorage.setItem('token', token);
			navigate('/login');
		} catch (err) {
			setErro('Erro ao conectar ao servidor');
		}
	};

	return (
    <div>
      <h2>Registro de Usuário</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem conta? <a href="/login">Faça login</a></p>
    </div>
  );
}