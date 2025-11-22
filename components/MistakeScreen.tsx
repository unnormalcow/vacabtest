import React from 'react';
import { WordItem, Language, TRANSLATIONS } from '../types';
import { Home, Volume2, BookX, ArrowLeft, PlayCircle } from 'lucide-react';

interface MistakeScreenProps {
  mistakes: WordItem[];
  onHome: () => void;
  onPractice: () => void;
  language: Language;
}

export const MistakeScreen: React.FC<MistakeScreenProps> = ({ mistakes, onHome, onPractice, language }) => {
  const t = TRANSLATIONS[language];

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 flex flex-col min-h-screen">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 pt-4 gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
                 <button 
                    onClick={onHome}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-slate-600 hover:bg-slate-50 font-bold"
                >
                    <ArrowLeft className="w-4 h-4" /> {t.home}
                </button>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 ml-2">
                    <BookX className="text-orange-500" /> {t.mistakeTitle}
                </h1>
            </div>
           
            {mistakes.length > 0 && (
                <button 
                    onClick={onPractice}
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                    <PlayCircle className="w-5 h-5" /> {t.practiceMistakes}
                </button>
            )}
        </div>

        {mistakes.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <BookX className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.mistakeEmpty}</h2>
                <button onClick={onHome} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">
                    {t.home}
                </button>
             </div>
        ) : (
            <div className="grid gap-4 pb-10">
                {mistakes.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-indigo-700">{item.word}</h3>
                                    <button 
                                        onClick={() => speak(item.word)}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                                    >
                                        <Volume2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-600 font-semibold mb-2">{item.meaning}</p>
                            <div className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg flex items-start gap-2">
                                <span>"{item.sentence}"</span>
                                <button 
                                    onClick={() => speak(item.sentence)}
                                    className="text-slate-400 hover:text-indigo-500 mt-0.5"
                                >
                                    <Volume2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};