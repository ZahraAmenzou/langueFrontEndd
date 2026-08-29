import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Challenge from './pages/Challenge';
import Success from './pages/Success';
import Locked from './pages/Locked';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateChallenge from './pages/CreateChallenge';
import ManageChallenges from './pages/ManageChallenges';
import NotFound from './pages/NotFound';

function RedirectToEdit() {
  const { id } = useParams();
  return <Navigate to={`/admin/dashboard/manage/edit/${id}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge/:code" element={<Challenge />} />
            <Route path="/challenge/:code/success" element={<Success />} />
            <Route path="/challenge/:code/locked" element={<Locked />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/create"
              element={
                <ProtectedRoute>
                  <CreateChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/manage"
              element={
                <ProtectedRoute>
                  <ManageChallenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/manage/edit/:id"
              element={
                <ProtectedRoute>
                  <CreateChallenge />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/challenges" element={<Navigate to="/admin/dashboard/manage" replace />} />
            <Route path="/admin/challenges/create" element={<Navigate to="/admin/dashboard/create" replace />} />
            <Route path="/admin/challenges/edit/:id" element={<RedirectToEdit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-xs text-slate-500">
          🌍 Language Challenge — 10 words, 10 attempts, four languages.
        </footer>
      </div>
    </AuthProvider>
  );
}
