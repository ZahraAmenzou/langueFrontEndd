export default function ProgressBar({ progress, total, className = '' }) {
  const clamped = Math.min(100, Math.max(0, progress));
  const pct = total ? (progress / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-400">
        <span>Progress</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amazigh-yellow via-amazigh-blue to-amazigh-green transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
