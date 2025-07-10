import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function NavBar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur shadow-md border-b mb-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-blue-700 tracking-tight">MyBlog</Link>
      </div>
      <div className="flex gap-6 text-lg font-semibold">
        <Link className="hover:text-blue-600 transition" to="/">Home</Link>
        {isLoggedIn ? (
          <>
            <Link className="hover:text-blue-600 transition" to="/create">Create Post</Link>
            <button
              onClick={handleLogout}
              className="ml-4 text-red-600 hover:text-red-800 transition font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-blue-600 transition" to="/login">Login</Link>
            <Link className="hover:text-blue-600 transition" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
} 