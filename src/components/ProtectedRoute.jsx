import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <Loading label="Checking session..." />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
