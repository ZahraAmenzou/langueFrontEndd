import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLayerGroup,
  FaPlay,
  FaCheckCircle,
  FaLock,
  FaUsers,
  FaPlusCircle,
  FaList,
  FaSync,
} from 'react-icons/fa';
import { challengeApi, getErrorMessage } from '../services/api';
import Loading from '../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await challengeApi.stats();
      setStats(res.data.stats);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load dashboard statistics.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { icon: <FaLayerGroup className="text-amazigh-blue" />, label: 'Total Challenges', value: stats?.totalChallenges ?? 0 },
    { icon: <FaPlay className="text-amazigh-green" />, label: 'Active Challenges', value: stats?.activeChallenges ?? 0 },
    { icon: <FaCheckCircle className="text-amazigh-yellow" />, label: 'Completed Challenges', value: stats?.completedChallenges ?? 0 },
    { icon: <FaLock className="text-amazigh-red" />, label: 'Locked Players', value: stats?.lockedPlayers ?? 0 },
    { icon: <FaUsers className="text-amazigh-blue" />, label: 'Total Players', value: stats?.totalPlayers ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your language challenges at a glance</p>
        </div>
        <button onClick={load} className="btn-secondary">
          <FaSync /> Refresh
        </button>
      </div>

      {loading ? (
        <Loading label="Loading statistics..." />
      ) : error ? (
        <div className="card p-8 text-center text-slate-400">{error}</div>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((card) => (
              <div key={card.label} className="card p-5 text-center transition hover:-translate-y-1">
                <div className="mb-3 flex justify-center text-3xl">{card.icon}</div>
                <p className="text-3xl font-extrabold text-white">{card.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/admin/dashboard/create"
              className="card group p-8 text-center transition hover:-translate-y-1 hover:border-amazigh-green/40"
            >
              <FaPlusCircle className="mb-3 text-4xl text-amazigh-green transition group-hover:scale-110" />
              <h2 className="text-xl font-bold text-white">Create Challenge</h2>
              <p className="mt-1 text-sm text-slate-400">Build a new challenge with exactly 10 words in any supported language</p>
            </Link>

            <Link
              to="/admin/dashboard/manage"
              className="card group p-8 text-center transition hover:-translate-y-1 hover:border-amazigh-blue/40"
            >
              <FaList className="mb-3 text-4xl text-amazigh-blue transition group-hover:scale-110" />
              <h2 className="text-xl font-bold text-white">Manage Challenges</h2>
              <p className="mt-1 text-sm text-slate-400">View, edit, delete or copy links for existing challenges</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
