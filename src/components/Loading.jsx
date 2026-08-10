import { FaSpinner } from 'react-icons/fa';

export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-400">
      <FaSpinner className="h-10 w-10 animate-spin text-amazigh-yellow" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
