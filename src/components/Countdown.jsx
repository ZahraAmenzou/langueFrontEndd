import { useEffect, useRef, useState } from 'react';

function format(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return { hours, minutes, seconds };
}

export default function Countdown({ lockedUntil, onExpire, className = '' }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, lockedUntil - Date.now()));
  const expired = useRef(false);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, lockedUntil - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  useEffect(() => {
    if (remaining === 0 && !expired.current && onExpire) {
      expired.current = true;
      onExpire();
    }
  }, [remaining, onExpire]);

  const { hours, minutes, seconds } = format(remaining);
  const blocks = [
    { value: hours, label: 'HRS' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' },
  ];

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {blocks.map((block, index) => (
        <div key={block.label} className="flex items-center gap-3">
          <div className="min-w-[76px] rounded-2xl border border-line bg-panelLight px-3 py-4 text-center">
            <p className="font-mono text-3xl font-bold tabular-nums text-white sm:text-4xl">{block.value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {block.label}
            </p>
          </div>
          {index < blocks.length - 1 && <span className="text-2xl font-bold text-slate-600">:</span>}
        </div>
      ))}
    </div>
  );
}
