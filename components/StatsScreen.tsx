import React from 'react';
import { DailyStat, Language, TRANSLATIONS } from '../types';
import { ArrowLeft, BarChart3, TrendingUp, CheckCircle2, AlertOctagon } from 'lucide-react';

interface StatsScreenProps {
  history: DailyStat[];
  onHome: () => void;
  language: Language;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ history, onHome, language }) => {
  const t = TRANSLATIONS[language];

  // Helper to draw chart
  const Chart = () => {
    if (history.length === 0) return <div className="h-48 flex items-center justify-center text-slate-400">No data available</div>;

    const data = history.slice(-7); // Last 7 days
    const height = 200;
    const width = 100; // percent
    
    const maxVal = Math.max(...data.map(d => Math.max(d.wordsLearned, d.correctCount + d.mistakesMade)), 10);
    
    const getPoints = (key: keyof DailyStat) => {
      return data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const val = d[key] as number;
        const y = 100 - (val / maxVal) * 100;
        return `${x},${y}`;
      }).join(' ');
    };

    return (
      <div className="relative h-[200px] w-full mt-8">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
           {/* Grid lines */}
           {[0, 25, 50, 75, 100].map(p => (
              <line key={p} x1="0" y1={p} x2="100" y2={p} stroke="#e2e8f0" strokeWidth="0.5" />
           ))}
           
           {/* Words Line */}
           <polyline 
              points={getPoints('wordsLearned')} 
              fill="none" 
              stroke="#6366f1" 
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((d, i) => {
                const x = (i / (data.length - 1 || 1)) * 100;
                const y = 100 - (d.wordsLearned / maxVal) * 100;
                return (
                    <circle key={`w-${i}`} cx={`${x}%`} cy={`${y}%`} r="3" fill="#6366f1" stroke="white" strokeWidth="1" />
                );
            })}

            {/* Accuracy Line (Correct Count) */}
             <polyline 
              points={getPoints('correctCount')} 
              fill="none" 
              stroke="#22c55e" 
              strokeWidth="2"
              strokeDasharray="4"
              vectorEffect="non-scaling-stroke"
            />
        </svg>
        
        {/* X Axis Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-400">
           {data.map((d, i) => (
             <span key={i}>{d.date.slice(5)}</span> // MM-DD
           ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-6 text-xs font-bold">
            <div className="flex items-center gap-1 text-indigo-600">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                {t.wordsLearned}
            </div>
            <div className="flex items-center gap-1 text-green-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                {t.accuracy} (Correct)
            </div>
        </div>
      </div>
    );
  };

  const totalWords = history.reduce((acc, curr) => acc + curr.wordsLearned, 0);
  const totalCorrect = history.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalMistakes = history.reduce((acc, curr) => acc + curr.mistakesMade, 0);
  const accuracy = totalWords > 0 ? Math.round((totalCorrect / (totalCorrect + totalMistakes)) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto w-full p-4 flex flex-col min-h-screen">
      <div className="flex items-center mb-6 pt-4">
        <button 
            onClick={onHome}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-slate-600 hover:bg-slate-50 font-bold"
        >
            <ArrowLeft className="w-4 h-4" /> {t.home}
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-4">{t.statsTitle}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center">
             <div className="bg-indigo-100 p-3 rounded-full mb-2">
                 <TrendingUp className="w-6 h-6 text-indigo-600" />
             </div>
             <div className="text-3xl font-extrabold text-indigo-700">{totalWords}</div>
             <div className="text-sm font-bold text-indigo-400">{t.wordsLearned}</div>
         </div>
         <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center">
             <div className="bg-green-100 p-3 rounded-full mb-2">
                 <CheckCircle2 className="w-6 h-6 text-green-600" />
             </div>
             <div className="text-3xl font-extrabold text-green-700">{accuracy}%</div>
             <div className="text-sm font-bold text-green-500">{t.accuracy}</div>
         </div>
         <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center">
             <div className="bg-orange-100 p-3 rounded-full mb-2">
                 <AlertOctagon className="w-6 h-6 text-orange-600" />
             </div>
             <div className="text-3xl font-extrabold text-orange-700">{totalMistakes}</div>
             <div className="text-sm font-bold text-orange-500">{t.mistakesMade}</div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
         <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Last 7 Days Activity
         </div>
         <Chart />
      </div>
    </div>
  );
};