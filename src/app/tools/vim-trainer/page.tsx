'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface Shortcut {
  keys: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: 'h', description: 'Move cursor left' },
  { keys: 'j', description: 'Move cursor down' },
  { keys: 'k', description: 'Move cursor up' },
  { keys: 'l', description: 'Move cursor right' },
  { keys: 'w', description: 'Move forward one word' },
  { keys: 'b', description: 'Move back one word' },
  { keys: 'gg', description: 'Go to beginning of file' },
  { keys: 'G', description: 'Go to end of file' },
  { keys: 'dd', description: 'Delete current line' },
  { keys: 'yy', description: 'Yank (copy) current line' },
  { keys: 'p', description: 'Paste after cursor' },
  { keys: 'u', description: 'Undo last change' },
  { keys: 'ciw', description: 'Change inner word' },
  { keys: 'v', description: 'Enter visual mode (characters)' },
  { keys: 'V', description: 'Enter visual mode (lines)' },
  { keys: '/', description: 'Search forward for pattern' },
  { keys: 'n', description: 'Repeat last search forward' },
  { keys: 'N', description: 'Repeat last search backward' },
  { keys: ':q', description: 'Quit Vim' },
  { keys: ':w', description: 'Save file' },
  { keys: ':e', description: 'Open file for editing' },
  { keys: 'Ctrl+w', description: 'Switch window panes' },
];

function normalize(input: string): string {
  return input.replace(/\s+/g, '').toLowerCase();
}

export default function VimTrainerPage() {
  const [shuffled, setShuffled] = useState<Shortcut[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const s = [...shortcuts].sort(() => Math.random() - 0.5);
    setShuffled(s);
    setStartTime(Date.now());
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 < shuffled.length) {
      setCurrentIdx(prev => prev + 1);
      setInput('');
      setFeedback(null);
    } else {
      setFinished(true);
    }
  }, [currentIdx, shuffled.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback) return;

    const normalizedInput = normalize(input);
    const normalizedKeys = normalize(shuffled[currentIdx]?.keys ?? '');
    const isCorrect = normalizedInput === normalizedKeys || normalizedInput === normalize(shuffled[currentIdx]?.keys.replace('Ctrl+', 'C-'));

    setTotalAttempts(prev => prev + 1);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setFeedback('correct');
      setTimeout(nextQuestion, 800);
    } else {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1200);
    }
  }

  function restart() {
    const s = [...shortcuts].sort(() => Math.random() - 0.5);
    setShuffled(s);
    setCurrentIdx(0);
    setInput('');
    setFeedback(null);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setTotalAttempts(0);
    setFinished(false);
    setStartTime(Date.now());
  }

  if (finished) {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
      <div className="flex-1 py-10 px-6 max-w-2xl mx-auto w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Training Complete!</h1>
          <div className="grid grid-cols-2 gap-6 mb-8 max-w-xs mx-auto">
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}/{shortcuts.length}</div>
              <div className="text-xs text-[var(--muted)] mt-1">Correct</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bestStreak}</div>
              <div className="text-xs text-[var(--muted)] mt-1">Best Streak</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="text-2xl font-bold">{totalAttempts}</div>
              <div className="text-xs text-[var(--muted)] mt-1">Attempts</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="text-2xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</div>
              <div className="text-xs text-[var(--muted)] mt-1">Time</div>
            </div>
          </div>
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (shuffled.length === 0) return null;

  const current = shuffled[currentIdx];
  const progress = Math.round((currentIdx / shortcuts.length) * 100);

  return (
    <div className="flex-1 py-10 px-6 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">Vim Trainer</h1>
      <p className="text-sm text-[var(--muted)] mb-6">Type the Vim key combination for each action.</p>

      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-4">
        <span>Streak: <span className="font-semibold text-[var(--foreground)]">{streak}</span></span>
        <span>Correct: <span className="font-semibold text-green-600 dark:text-green-400">{correctCount}</span></span>
        <span>Attempts: <span className="font-semibold text-[var(--foreground)]">{totalAttempts}</span></span>
      </div>

      <div className="w-full bg-[var(--border)] rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`p-8 rounded-xl border-2 text-center transition-all duration-200 ${
        feedback === 'correct'
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : feedback === 'incorrect'
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
          : 'border-[var(--border)] bg-[var(--card)]'
      }`}>
        <p className="text-lg font-medium mb-1">Question {currentIdx + 1} of {shortcuts.length}</p>
        <p className="text-sm text-[var(--muted)] mb-6">{current.description}</p>

        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type keys..."
            autoFocus
            className="w-48 px-4 py-3 text-lg text-center font-mono rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)]"
          />
          <button
            type="submit"
            className="px-5 py-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>

        {feedback === 'incorrect' && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            Incorrect. The answer was: <kbd className="px-2 py-0.5 rounded bg-[var(--code-bg)] font-mono font-semibold">{current.keys}</kbd>
          </p>
        )}
      </div>
    </div>
  );
}
