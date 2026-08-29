import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { FaUserShield, FaEnvelope, FaLock as FaLockIcon, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="card animate-slide-up p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex rounded-2xl bg-amazigh-yellow/15 p-4 text-3xl">
            <FaUserShield className="text-amazigh-yellow" />
          </span>
          <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage language challenges</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <FaLockIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading || !email || !password}>
            {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />} Login
          </button>
        </form>
      </div>

      <Link to="/" className="mt-4 text-center text-sm text-slate-400 hover:text-slate-200">
        ← Back to Home
      </Link>
    </div>
  );
}
