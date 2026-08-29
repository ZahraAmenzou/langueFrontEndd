import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt, FaHome, FaGlobeAfrica } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <FaGlobeAfrica className="text-2xl text-amazigh-yellow" />
          <span>
            LANGUAGE{' '}
            <span className="bg-gradient-to-r from-amazigh-yellow via-amazigh-blue to-amazigh-green bg-clip-text text-transparent">
              CHALLENGE
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
          >
            <FaHome /> Home
          </Link>

          {admin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                <FaUserShield /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amazigh-red transition hover:bg-red-500/10"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center gap-2 rounded-lg border border-line bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <FaUserShield /> Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
