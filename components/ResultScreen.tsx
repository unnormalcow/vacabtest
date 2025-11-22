import React from 'react';
import { GameStats, Language, TRANSLATIONS } from '../types';
import { Trophy, RefreshCcw, Home, BookX } from 'lucide-react';

interface ResultScreenProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
  onReviewMistakes: () => void;
  language: Language;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart, onHome, onReviewMistakes, language }) => {
  const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const t = TRANSLATIONS[language];

  let message = t.effort;
  let color = "text-indigo-600";
  
  if (percentage === 100) { message = t.perfect; color = "text-yellow-500"; }
  else if (percentage >= 80) { message = t.awesome; color = "text-green-500"; }
  else if (percentage >= 60) { message = t.good; color = "text-blue-500"; }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-100">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-6 ring-8 ring-slate-50 ${color}`}>
            <Trophy className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{t.sessionComplete}</h2>
        <p className={`text-xl font-bold mb-8 ${color}`}>{message}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-3xl font-bold text-slate-800">{stats.correct}/{stats.total}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">{t.score}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-3xl font-bold text-slate-800">{percentage}%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">{t.accuracy}</div>
            </div>
        </div>

        <div className="space-y-3">
             {stats.mistakes.length > 0 && (
                <button 
                    onClick={onReviewMistakes}
                    className="w-full py-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-lg border-2 border-orange-200 transition-all flex items-center justify-center gap-2"
                >
                    <BookX className="w-5 h-5" /> {t.reviewMistakes} ({stats.mistakes.length})
                </button>
            )}

            <button 
                onClick={onRestart}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
                <RefreshCcw className="w-5 h-5" /> {t.playAgain}
            </button>
            <button 
                onClick={onHome}
                className="w-full py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-bold text-lg border-2 border-slate-100 transition-all flex items-center justify-center gap-2"
            >
                <Home className="w-5 h-5" /> {t.home}
            </button>
        </div>
      </div>
    </div>
  );
};
