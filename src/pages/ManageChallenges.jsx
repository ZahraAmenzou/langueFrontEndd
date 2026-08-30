import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaLink,
  FaPlusCircle,
  FaArrowLeft,
  FaUsers,
  FaSpinner,
} from 'react-icons/fa';
import { challengeApi, getErrorMessage } from '../services/api';
import Loading from '../components/Loading';
import { getLanguage } from '../config/languages';

const statusStyles = {
  New: 'bg-white/5 text-slate-300 border-line',
  Active: 'bg-amazigh-green/10 text-amazigh-green border-emerald-500/30',
  Completed: 'bg-amazigh-yellow/10 text-amazigh-yellow border-amber-500/30',
};

export default function ManageChallenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await challengeApi.list();
      setChallenges(res.data.challenges);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load challenges.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${link}`);
      alert('Challenge link copied to clipboard!');
    } catch {
      prompt('Copy this challenge link:', `${window.location.origin}${link}`);
    }
  };

  const handleDelete = async (challenge) => {
    if (!window.confirm(`Delete "${challenge.title}"? This will also remove all player sessions.`)) return;
    setDeletingId(challenge.id);
    try {
      await challengeApi.remove(challenge.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the challenge.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-white">Manage Challenges</h1>
        </div>
        <Link to="/admin/dashboard/create" className="btn-primary">
          <FaPlusCircle /> New Challenge
        </Link>
      </div>

      {loading ? (
        <Loading label="Loading challenges..." />
      ) : error ? (
        <div className="card p-8 text-center text-slate-400">{error}</div>
      ) : challenges.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="mb-2 text-4xl">📦</p>
          <p className="mb-4 text-slate-400">No challenges yet. Create your first one!</p>
          <Link to="/admin/dashboard/create" className="btn-primary">
            <FaPlusCircle /> Create Challenge
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-4">Challenge</th>
                <th className="px-4 py-4 text-center">Language</th>
                <th className="px-4 py-4 text-center">Translation</th>
                <th className="px-4 py-4 text-center">Words</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Players</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => {
                const lang = getLanguage(challenge.language);
                const translationLang = getLanguage(challenge.translationLanguage);
                return (
                <tr key={challenge.id} className="border-b border-line/60 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{challenge.title}</p>
                    <p className="font-mono text-xs text-slate-500">/{challenge.uniqueCode}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                      <span>{lang.flag}</span>
                      {lang.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                      <span>{translationLang.flag}</span>
                      {translationLang.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold text-slate-300">{challenge.words}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[challenge.status] || statusStyles.New
                      }`}
                    >
                      {challenge.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                      <FaUsers className="text-slate-500" />
                      {challenge.totalPlayers}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {new Date(challenge.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={challenge.link}
                        target="_blank"
                        rel="noreferrer"
                        title="View challenge"
                        className="rounded-lg border border-line bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                      >
                        <FaEye />
                      </a>
                      <Link
                        to={`/admin/dashboard/manage/edit/${challenge.id}`}
                        title="Edit"
                        className="rounded-lg border border-line bg-white/5 p-2 text-amazigh-blue transition hover:bg-white/10"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => copyLink(challenge.link)}
                        title="Copy link"
                        className="rounded-lg border border-line bg-white/5 p-2 text-amazigh-yellow transition hover:bg-white/10"
                      >
                        <FaLink />
                      </button>
                      <button
                        onClick={() => handleDelete(challenge)}
                        title="Delete"
                        disabled={deletingId === challenge.id}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-amazigh-red transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingId === challenge.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
