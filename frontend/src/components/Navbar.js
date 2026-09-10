import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-200 transition">
          📚 Blog Dinâmico
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-200 transition text-sm">Início</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="hover:text-blue-200 transition text-sm">Admin</Link>
              <Link to="/posts/new" className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100 transition">
                + Novo Post
              </Link>
              <button onClick={handleLogout} className="text-sm text-blue-200 hover:text-white transition">
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-white text-blue-800 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
