import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBrain, FaHeartBroken, FaLock, FaPlay, FaServer, FaChevronRight } from 'react-icons/fa';

const extractCode = (input) => {
  const trimmed = input.trim();
  const match = trimmed.match(/challenge\/([A-Za-z0-9]+)/);
  if (match) return match[1];
  return trimmed.replace(/[^A-Za-z0-9]/g, '');
};

const features = [
  {
    icon: <FaBrain className="text-2xl text-amazigh-blue" />,
    title: '10 Tachelhit Words',
    text: 'Each challenge contains exactly 10 Amazigh words created by the challenge maker.',
  },
  {
    icon: <FaHeartBroken className="text-2xl text-amazigh-red" />,
    title: '3 Attempts',
    text: 'You may miss up to 3 answers. A fourth mistake means game over.',
  },
  {
    icon: <FaLock className="text-2xl text-amazigh-yellow" />,
    title: '5-Hour Lock',
    text: 'Run out of attempts? The challenge locks for 5 hours. Server-enforced, no cheating.',
  },
  {
    icon: <FaServer className="text-2xl text-amazigh-green" />,
    title: '100% Server-Side',
    text: 'Answers and game state live on the server. Refresh or inspect code all you want.',
  },
];

export default function Home() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    const code = extractCode(input);
    if (code) navigate(`/challenge/${code}`);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 select-none">
        <span className="absolute left-[8%] top-16 animate-float text-7xl text-amazigh-blue/10">ⵣ</span>
        <span className="absolute right-[10%] top-32 animate-float-slow text-8xl text-amazigh-green/10">ⵣ</span>
        <span className="absolute bottom-24 left-[15%] animate-float-slow text-6xl text-amazigh-red/10">ⵣ</span>
        <span className="absolute bottom-40 right-[18%] animate-float text-6xl text-amazigh-yellow/10">ⵣ</span>
        <span className="absolute left-1/2 top-1/4 animate-float text-5xl text-white/5">ⵣ</span>
      </div>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center">
        <span className="animate-fade-in mb-6 rounded-full border border-line bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300">
          ⵣ An Amazigh language challenge
        </span>

        <h1 className="animate-slide-up text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          <span className="text-amazigh-yellow">ⵣ</span>{' '}
          <span className="bg-gradient-to-r from-amazigh-yellow via-amazigh-blue to-amazigh-green bg-clip-text text-transparent">
            TACHELHIT
          </span>{' '}
          AMAZIGH <span className="bg-gradient-to-r from-amazigh-red to-amazigh-yellow bg-clip-text text-transparent">CHALLENGE</span>
        </h1>

        <p className="mt-4 max-w-xl text-lg text-slate-300">
          Are you ready to test your <span className="font-semibold text-white">Tachelhit</span>?
        </p>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Someone shared a challenge with you. Enter their link or code below and prove your Amazigh vocabulary.
        </p>

        <form onSubmit={handleStart} className="mt-8 w-full max-w-lg">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste challenge link or code..."
              className="input flex-1 py-4 text-base"
            />
            <button type="submit" className="btn-primary shrink-0 px-8 py-4 text-base" disabled={!input.trim()}>
              <FaPlay /> Start Challenge
            </button>
          </div>
        </form>

        <div className="mt-6">
          <Link to="/challenge/demo" className="text-sm text-amazigh-blue transition hover:text-amazigh-blue/70">
            Try an example challenge <FaChevronRight className="inline text-xs" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="card animate-slide-up p-6 text-left transition hover:-translate-y-1 hover:border-white/20">
              <div className="mb-3 inline-flex rounded-xl bg-white/5 p-3">{feature.icon}</div>
              <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
