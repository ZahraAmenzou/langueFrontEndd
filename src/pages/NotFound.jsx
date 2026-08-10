import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-7xl">ⵣ</span>
      <h1 className="mb-2 text-4xl font-extrabold text-white">404</h1>
      <p className="mb-6 text-slate-400">This page or challenge doesn't exist.</p>
      <Link to="/" className="btn-secondary">
        <FaHome /> Back to Home
      </Link>
    </div>
  );
}
