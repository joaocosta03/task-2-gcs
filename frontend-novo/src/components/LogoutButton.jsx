// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
	localStorage.removeItem('nome');
	localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}
