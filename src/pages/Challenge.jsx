import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFlag, FaHeart, FaTrophy, FaSpinner, FaGem } from 'react-icons/fa';
import { playerApi, getPlayerToken, setPlayerToken, getErrorMessage } from '../services/api';
import Loading from '../components/Loading';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import { getLanguage } from '../config/languages';

export default function Challenge() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState('loading');
  const [meta, setMeta] = useState(null);
  const [state, setState] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const load = async () => {
      try {
        const statusRes = await playerApi.status(code);
        if (!mounted.current) return;
        setMeta(statusRes.data.challenge);

        const token = getPlayerToken(code);
        if (!token) {
          setView('intro');
          return;
        }

        const res = await playerApi.state(code, token);
        if (!mounted.current) return;
        const s = res.data.state;

        if (s.locked) {
          navigate(`/challenge/${code}/locked`, { replace: true });
          return;
        }
        if (s.completed) {
          navigate(`/challenge/${code}/success`, { replace: true });
          return;
        }
        setState(s);
        setView('game');
      } catch (err) {
        if (!mounted.current) return;
        setError(getErrorMessage(err, 'Challenge not found or the server is unreachable.'));
        setView('error');
      }
    };

    load();
    return () => {
      mounted.current = false;
    };
  }, [code, navigate]);

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    setError(null);
    try {
      const res = await playerApi.start(code, getPlayerToken(code) || null);
      setPlayerToken(code, res.data.playerToken);
      const s = res.data.state;
      if (s.locked) {
        navigate(`/challenge/${code}/locked`, { replace: true });
        return;
      }
      if (s.completed) {
        navigate(`/challenge/${code}/success`, { replace: true });
        return;
      }
      setState(s);
      setView('game');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not start the challenge. Please try again.'));
      setView('error');
    } finally {
      setStarting(false);
    }
  };

  const handleAnswer = useCallback(
    async (answer) => {
      if (submitting || !state) return;
      setSubmitting(true);
      setError(null);
      try {
        const res = await playerApi.answer(code, getPlayerToken(code), answer);
        const { correct, locked, gemEarned, bonusEarned } = res.data;
        setFeedback({ correct, message: correct ? 'CORRECT!' : 'WRONG!', gemEarned, bonusEarned });
        setState(res.data.state);

        if (locked) {
          setTimeout(() => navigate(`/challenge/${code}/locked`, { replace: true }), 1500);
        } else if (res.data.state.completed) {
          setTimeout(() => navigate(`/challenge/${code}/success`, { replace: true }), 1700);
        } else {
          setTimeout(() => setFeedback(null), 1500);
        }
      } catch (err) {
        if (err.response?.data?.code === 'GAME_LOCKED') {
          navigate(`/challenge/${code}/locked`, { replace: true });
        } else {
          setError(getErrorMessage(err));
        }
      } finally {
        setSubmitting(false);
      }
    },
    [code, navigate, state, submitting]
  );

  if (view === 'loading') {
    return <Loading label="Loading challenge..." />;
  }

  if (view === 'error') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 text-6xl">🙈</span>
        <h2 className="mb-2 text-2xl font-bold text-white">Oops!</h2>
        <p className="mb-6 text-slate-400">{error}</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  if (view === 'intro') {
    const lang = getLanguage(meta?.language);
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 inline-block animate-float text-6xl text-amazigh-yellow">{lang.flag}</span>
        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">{lang.label.toUpperCase()} CHALLENGE</h1>
        <p className="mb-8 text-slate-400">{meta?.title}</p>

        <div className="card mb-8 w-full space-y-3 p-6 text-left">
          <div className="flex items-center gap-3">
            <FaFlag className="text-amazigh-blue" />
            <span className="text-slate-300">{meta?.totalWords || 10} words to translate</span>
          </div>
          <div className="flex items-center gap-3">
            <FaHeart className="text-amazigh-red" />
            <span className="text-slate-300">10 attempts in total</span>
          </div>
          <div className="flex items-center gap-3">
            <FaGem className="text-amazigh-green" />
            <span className="text-slate-300">Earn a gem (💎) per correct answer = +1 attempt</span>
          </div>
          <div className="flex items-center gap-3">
            <FaTrophy className="text-amazigh-yellow" />
            <span className="text-slate-300">One answer per word</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amazigh-green text-lg">💀</span>
            <span className="text-slate-300">Run out of attempts = Game Over</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <span className="text-slate-300">Locked for 5 hours when you run out of attempts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">🎁</span>
            <span className="text-slate-300">Complete the challenge to earn a bonus attempt</span>
          </div>
        </div>

        <button className="btn-primary px-10 py-4 text-lg" onClick={handleStart} disabled={starting}>
          {starting ? <FaSpinner className="animate-spin" /> : null}
          {starting ? ' STARTING...' : ' START CHALLENGE'}
        </button>
      </div>
    );
  }

  if (!state) {
    return <Loading label="Preparing challenge..." />;
  }

  const total = state.totalWords;
  const current = Math.min(state.currentQuestion, total);
  const lang = getLanguage(state.language);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-10">
      <div className="mb-6 w-full max-w-xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.35em] text-amazigh-blue">
          {lang.flag} {lang.label} Challenge
        </p>
        <div className="mb-2 flex items-center justify-between gap-3">
          <h1 className="truncate text-lg font-bold text-white">{state.title}</h1>
          <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
            {lang.flag} {meta?.uniqueCode}
          </span>
        </div>
        <ProgressBar progress={current} total={total} />
      </div>

      <QuestionCard
        questionNumber={current + 1}
        total={total}
        word={state.currentWord}
        attempts={state.attemptsRemaining}
        totalAttempts={state.totalAttempts}
        gems={state.gems}
        score={state.score}
        onSubmit={handleAnswer}
        disabled={submitting}
      />

      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div
            className={`animate-pop card flex flex-col items-center px-10 py-8 text-center ${
              feedback.correct ? 'border-emerald-500/40' : 'border-red-500/40'
            }`}
          >
            <span className="mb-3 text-6xl">{feedback.correct ? '✅' : '❌'}</span>
            <h2
              className={`text-3xl font-extrabold ${
                feedback.correct ? 'text-amazigh-green' : 'text-amazigh-red'
              }`}
            >
              {feedback.message}
            </h2>
            {feedback.correct && <p className="mt-2 text-slate-300">+10 points</p>}
            {feedback.gemEarned && (
              <p className="mt-2 inline-flex items-center gap-1.5 font-semibold text-amazigh-green">
                <FaGem /> +1 gem — 1 extra attempt!
              </p>
            )}
            {feedback.bonusEarned && (
              <p className="mt-2 inline-flex items-center gap-1.5 font-semibold text-amazigh-yellow">
                🎁 Challenge complete — +1 bonus attempt!
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 w-full max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
