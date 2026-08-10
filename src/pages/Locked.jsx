import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaHome } from 'react-icons/fa';
import { playerApi, getPlayerToken, getErrorMessage } from '../services/api';
import Loading from '../components/Loading';
import Countdown from '../components/Countdown';

export default function Locked() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getPlayerToken(code);
    if (!token) {
      navigate(`/challenge/${code}`, { replace: true });
      return;
    }
    playerApi
      .state(code, token)
      .then((res) => {
        if (!res.data.state.locked) {
          navigate(`/challenge/${code}`, { replace: true });
        } else {
          setState(res.data.state);
        }
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Could not load lock status.'));
      });
  }, [code, navigate]);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="mb-6 text-slate-400">{error}</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <FaHome /> Back to Home
        </button>
      </div>
    );
  }

  if (!state || !state.lockedUntil) {
    return <Loading label="Checking lock status..." />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="animate-pop mb-4 inline-flex rounded-full bg-red-500/15 p-6">
        <FaLock className="text-6xl text-amazigh-red" />
      </div>

      <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl">🔒 CHALLENGE LOCKED</h1>
      <p className="mb-1 text-lg text-slate-300">You used all 3 attempts.</p>
      <p className="mb-8 text-slate-400">{state.title}</p>

      <div className="card w-full p-6">
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-amazigh-yellow">
          <FaLock /> Come back in
        </div>

        <Countdown
          lockedUntil={state.lockedUntil}
          onExpire={() => navigate(`/challenge/${code}`, { replace: true })}
        />

        <p className="mt-5 text-xs text-slate-500">
          The lock is enforced by the server. Refreshing or clearing your browser data won't help. 😉
        </p>
      </div>

      <button className="btn-secondary mt-6" onClick={() => navigate('/')}>
        <FaHome /> Back to Home
      </button>
    </div>
  );
}
