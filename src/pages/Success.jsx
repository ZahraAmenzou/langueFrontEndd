import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaBullseye, FaClock, FaGem } from 'react-icons/fa';
import { playerApi, getPlayerToken } from '../services/api';
import Loading from '../components/Loading';
import { getLanguage } from '../config/languages';

const COLORS = ['#FACC15', '#38BDF8', '#4ADE80', '#F87171', '#A78BFA', '#FB923C'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 3 + Math.random() * 3,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 8,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

export default function Success() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    const token = getPlayerToken(code);
    if (!token) {
      navigate(`/challenge/${code}`, { replace: true });
      return;
    }
    playerApi
      .state(code, token)
      .then((res) => {
        if (!res.data.state.completed) {
          navigate(`/challenge/${code}`, { replace: true });
        } else {
          setState(res.data.state);
        }
      })
      .catch(() => navigate(`/challenge/${code}`, { replace: true }));
  }, [code, navigate]);

  if (!state) {
    return <Loading label="Loading results..." />;
  }

  const answered = state.correctAnswers + state.wrongAnswers;
  const accuracy = answered > 0 ? Math.round((state.correctAnswers / answered) * 100) : 100;
  const durationMs =
    state.startedAt && state.completedAt ? new Date(state.completedAt) - new Date(state.startedAt) : null;
  const langLabel = getLanguage(state.language).label;
  const translationLabel = getLanguage(state.translationLanguage).label;

  const stats = [
    { icon: <FaGem className="text-amazigh-green" />, label: 'Gems Earned', value: state.gems ?? 0 },
    { icon: <FaBullseye className="text-amazigh-yellow" />, label: 'Score', value: `${state.score} / 100` },
    { icon: <FaCheckCircle className="text-amazigh-green" />, label: 'Correct', value: state.correctAnswers },
    { icon: <FaTimesCircle className="text-amazigh-red" />, label: 'Wrong', value: state.wrongAnswers },
    { icon: <FaBullseye className="text-amazigh-blue" />, label: 'Accuracy', value: `${accuracy}%` },
    { icon: <FaClock className="text-slate-300" />, label: 'Time', value: formatDuration(durationMs) },
  ];

  return (
    <div className="relative">
      <Confetti />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-14 text-center">
        <div className="animate-pop mb-4 inline-flex rounded-full bg-amazigh-yellow/15 p-6">
          <FaTrophy className="text-6xl text-amazigh-yellow" />
        </div>

        <h1 className="animate-slide-up text-3xl font-extrabold text-white sm:text-5xl">
          🏆 CHALLENGE COMPLETED!
        </h1>
        <p className="mt-3 text-lg text-slate-300">Congratulations!</p>
        <p className="mt-1 text-2xl font-bold text-amazigh-yellow">
          {state.correctAnswers} / {state.totalWords}
        </p>
        <p className="mb-10 text-slate-400">
          You completed the {langLabel} Challenge — {langLabel} to {translationLabel}.
        </p>

        <div className="card w-full p-6">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-widest text-slate-400">Challenge</p>
            <p className="text-xl font-bold text-white">{state.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-panelLight/60 p-4">
                <div className="mb-2 flex justify-center text-2xl">{stat.icon}</div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {state.totalAttempts != null && state.totalAttempts > 10 && (
            <div className="mt-6 rounded-xl border border-amazigh-green/30 bg-amazigh-green/10 p-4 text-sm text-amazigh-green">
              💎 You earned {state.gems} gem(s) plus a 🎁 completion bonus — your total attempts reached{' '}
              <span className="font-bold">{state.totalAttempts}</span>!
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
