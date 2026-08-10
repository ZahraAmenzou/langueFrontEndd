import { FaHeart, FaHeartBroken } from 'react-icons/fa';

export default function Attempts({ attempts, total = 3 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-400">Attempts:</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) =>
          i < attempts ? (
            <FaHeart key={i} className="text-lg text-amazigh-red" aria-label="attempt remaining" />
          ) : (
            <FaHeartBroken key={i} className="text-lg text-slate-700" aria-label="lost attempt" />
          )
        )}
      </div>
    </div>
  );
}
