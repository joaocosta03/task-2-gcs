import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function Login() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [erro, setErro] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try{
			const res = await api.post('/auth/login', { email, senha });

			localStorage.setItem('token', res.data.token);
			localStorage.setItem('email', res.data.email);
			localStorage.setItem('nome', res.data.nome);
			navigate('/tarefas');
		} catch (err) {
			setErro('Erro ao conectar ao servidor');
		}
	};

	return (
		<div>
      <h2>Login</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem conta? <a href="/register">Registre-se</a></p>
    </div>
  );
}