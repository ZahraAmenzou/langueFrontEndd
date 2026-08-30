import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaPlusCircle, FaCheckCircle, FaLink, FaSave, FaArrowLeft, FaTrash, FaSpinner } from 'react-icons/fa';
import { challengeApi, getErrorMessage } from '../services/api';
import Loading from '../components/Loading';
import { LANGUAGES, LANGUAGE_CODES, DEFAULT_LANGUAGE, getLanguage } from '../config/languages';

const EMPTY_WORDS = () => Array.from({ length: 10 }, () => ({ word: '', correctAnswer: '' }));

function LanguagePicker({ label, description, value, onChange }) {
  return (
    <div className="card p-6">
      <label className="label">{label}</label>
      <p className="mb-3 text-sm text-slate-400">{description}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {LANGUAGE_CODES.map((code) => {
          const lang = LANGUAGES[code];
          const selected = value === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-4 transition ${
                selected
                  ? 'border-amazigh-blue bg-amazigh-blue/10 text-white'
                  : 'border-line bg-panelLight/40 text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-semibold">{lang.label}</span>
              <span className="text-xs text-slate-400">{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateChallenge() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [translationLanguage, setTranslationLanguage] = useState(DEFAULT_LANGUAGE);
  const [words, setWords] = useState(EMPTY_WORDS);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    if (!id) return;
    challengeApi
      .get(id)
      .then((res) => {
        setTitle(res.data.challenge.title);
        setLanguage(res.data.challenge.language || DEFAULT_LANGUAGE);
        setTranslationLanguage(res.data.challenge.translationLanguage || DEFAULT_LANGUAGE);
        setWords(
          Array.from({ length: 10 }, (_, i) => ({
            word: res.data.challenge.words[i]?.word || '',
            correctAnswer: res.data.challenge.words[i]?.correctAnswer || '',
          }))
        );
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load challenge for editing.')))
      .finally(() => setLoading(false));
  }, [id]);

  const updateWord = (index, field, value) => {
    setWords((prev) => prev.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Challenge title is required.');
      return;
    }

    const empty = words.find((w) => !w.word.trim() || !w.correctAnswer.trim());
    if (empty) {
      setError('All 10 words must have both a word and a correct answer.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        language,
        translationLanguage,
        words: words.map((w) => ({ word: w.word.trim(), correctAnswer: w.correctAnswer.trim() })),
      };
      const res = isEdit ? await challengeApi.update(id, payload) : await challengeApi.create(payload);
      setCreated(res.data.link);
      if (!isEdit) {
        setTitle('');
        setLanguage(DEFAULT_LANGUAGE);
        setTranslationLanguage(DEFAULT_LANGUAGE);
        setWords(EMPTY_WORDS());
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save the challenge.'));
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${created}`);
      alert('Challenge link copied to clipboard!');
    } catch {
      prompt('Copy this challenge link:', `${window.location.origin}${created}`);
    }
  };

  if (loading) {
    return <Loading label="Loading challenge..." />;
  }

  if (created) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="card animate-pop p-10">
          <FaCheckCircle className="mx-auto mb-4 text-6xl text-amazigh-green" />
          <h1 className="mb-2 text-3xl font-extrabold text-white">
            Challenge created successfully! 🎉
          </h1>
          <p className="mb-6 text-slate-400">Share this link with your player:</p>

          <div className="mb-6 rounded-xl border border-line bg-panelLight p-4">
            <p className="break-all text-amazigh-blue">
              {window.location.origin}
              {created}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button className="btn-primary" onClick={copyLink}>
              <FaLink /> COPY CHALLENGE LINK
            </button>
            <button className="btn-secondary" onClick={() => setCreated(null)}>
              <FaPlusCircle /> Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-extrabold text-white">
          {isEdit ? 'Edit Challenge' : 'Create Challenge'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <label className="label">Challenge title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g. Basics for Beginners"
          />
        </div>

        <LanguagePicker
          label="Challenge language (words)"
          description="Choose the language the words of this challenge are in. Players will translate these words."
          value={language}
          onChange={setLanguage}
        />

        <LanguagePicker
          label="Translation language (answers)"
          description="Choose the language players must translate the words into. For example: the English word 'car' → the French answer 'voiture'."
          value={translationLanguage}
          onChange={setTranslationLanguage}
        />

        <div className="card p-6">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-bold text-white">Words &amp; Correct Answers</h2>
            <span className="rounded-full bg-amazigh-blue/10 px-3 py-1 text-xs font-semibold text-amazigh-blue">
              {words.filter((w) => w.word.trim() && w.correctAnswer.trim()).length} / 10 filled
            </span>
          </div>
          <p className="mb-6 text-sm text-slate-400">
            Exactly 10 {getLanguage(language).label} words are required, each with its{' '}
            {getLanguage(translationLanguage).label} translation. Answers are stored securely on the server and never shown to players.
          </p>

          <div className="space-y-4">
            {words.map((word, index) => (
              <div key={index} className="grid grid-cols-1 gap-3 rounded-xl border border-line bg-panelLight/40 p-4 sm:grid-cols-2">
                <div>
                  <label className="label">Word {index + 1} — {getLanguage(language).label}</label>
                  <input
                    type="text"
                    value={word.word}
                    onChange={(e) => updateWord(index, 'word', e.target.value)}
                    className="input"
                    placeholder="e.g. AMAN"
                  />
                </div>
                <div>
                  <label className="label">Word {index + 1} — {getLanguage(translationLanguage).label} translation</label>
                  <input
                    type="text"
                    value={word.correctAnswer}
                    onChange={(e) => updateWord(index, 'correctAnswer', e.target.value)}
                    className="input"
                    placeholder="Type the translation"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3">
          <Link to="/admin/dashboard" className="btn-secondary">
            <FaArrowLeft /> Dashboard
          </Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <FaSpinner className="animate-spin" /> : isEdit ? <FaSave /> : <FaPlusCircle />}
            {saving ? ' Saving...' : isEdit ? ' SAVE CHANGES' : ' CREATE CHALLENGE'}
          </button>
        </div>
      </form>
    </div>
  );
}
