import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Attempts from './Attempts';

export default function QuestionCard({
  questionNumber,
  total,
  word,
  attempts,
  score,
  onSubmit,
  disabled = false,
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || disabled) return;
    onSubmit(answer);
    setAnswer('');
  };

  return (
    <div className="card animate-slide-up w-full max-w-xl p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="rounded-full bg-amazigh-blue/10 px-4 py-1.5 text-sm font-semibold text-amazigh-blue">
          Question {questionNumber} / {total}
        </span>
        <span className="rounded-full bg-amazigh-yellow/10 px-4 py-1.5 text-sm font-semibold text-amazigh-yellow">
          +{score} pts
        </span>
      </div>

      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-slate-400">
        What does this word mean?
      </p>

      <div className="mb-6 rounded-2xl border border-line bg-gradient-to-br from-panelLight to-panel py-8 text-center">
        <p className="text-4xl font-extrabold tracking-wide text-white sm:text-5xl">{word}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="input py-4 text-lg"
          autoFocus
          disabled={disabled}
        />
        <button type="submit" className="btn-primary w-full text-lg" disabled={disabled || !answer.trim()}>
          <FaPaperPlane /> Submit
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <Attempts attempts={attempts} />
      </div>
    </div>
  );
}
