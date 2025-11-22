import React, { useState } from 'react';
import { BookOpen, Sparkles, Brain, Rocket, Languages, LogOut, BarChart3, Settings2 } from 'lucide-react';
import { TRANSLATIONS, Language, User } from '../types';

interface WelcomeScreenProps {
  user: User;
  onStart: (topic: string, count: number) => void;
  onSwitchUser: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onReviewMistakes: () => void;
  onViewStats: () => void;
}

const TOPICS = [
  { id: 'daily', labelKey: 'daily', icon: '🏠', desc: 'Everyday conversations and objects' },
  { id: 'school', labelKey: 'school', icon: '📚', desc: 'Classroom, subjects, and learning' },
  { id: 'travel', labelKey: 'travel', icon: '✈️', desc: 'Vacations, transport, and dining' },
  { id: 'nature', labelKey: 'nature', icon: '🌿', desc: 'Environment, weather, and pets' },
  { id: 'feelings', labelKey: 'feelings', icon: '😊', desc: 'Expressing how you feel' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onStart, onSwitchUser, language, setLanguage, onReviewMistakes, onViewStats }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].id);
  const [wordCount, setWordCount] = useState<number>(10);
  const t = TRANSLATIONS[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto w-full relative">
      
      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full shadow-sm border border-slate-100">
             <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200 border-2 border-indigo-100" />
             <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-800 leading-none">{user.name}</span>
                 <span className="text-xs text-slate-500 leading-none mt-1">
                    {/* @ts-ignore dynamic grade key */}
                    {t[user.grade].split('(')[0]}
                 </span>
             </div>
         </div>

         <div className="flex gap-2 self-end">
            <button 
                onClick={onViewStats}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 text-indigo-600 font-bold"
            >
                <BarChart3 size={18} />
                <span className="hidden sm:inline">{t.viewStats}</span>
            </button>
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
            >
                <Languages size={18} />
                <span className="hidden sm:inline">{language === 'en' ? '中文' : 'English'}</span>
            </button>
            <button
                onClick={onSwitchUser}
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-500"
                title={t.switchUser}
            >
                <LogOut size={18} />
            </button>
         </div>
      </div>

      <div className="text-center mb-6 space-y-4 mt-24 md:mt-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-2 ring-8 ring-indigo-50">
          <Brain className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
          {language === 'en' ? 'Vocab' : '单词'}<span className="text-indigo-600">{language === 'en' ? 'Quest' : '大冒险'}</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100">
          
          {/* Mistake Button */}
          <div className="flex justify-end mb-4">
             {user.mistakes.length > 0 && (
                 <button 
                    onClick={onReviewMistakes} 
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                 >
                    {t.reviewMistakes} ({user.mistakes.length})
                 </button>
             )}
          </div>

          {/* Word Count Slider */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
             <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Settings2 size={16} /> {t.wordCount}
                </label>
                <span className="text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded text-sm">{wordCount}</span>
             </div>
             <input 
                type="range" 
                min="5" 
                max="30" 
                step="5"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
             />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5</span>
                <span>15</span>
                <span>30</span>
             </div>
          </div>

          <div className="flex justify-between items-center mb-4">
             <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                {t.chooseTopic}
             </label>
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 text-left border-2 ${
                  selectedTopic === topic.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]'
                    : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl mr-4">{topic.icon}</span>
                <div className="flex-1">
                  <div className="font-bold">
                    {/* @ts-ignore dynamic key access */}
                    {t[topic.labelKey]}
                  </div>
                </div>
                {selectedTopic === topic.id && (
                  <div className="ml-auto text-indigo-500">
                    <Sparkles size={20} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(selectedTopic, wordCount)}
          className="w-full group relative flex items-center justify-center py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xl shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-indigo-300 transform hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="flex items-center gap-2">
            {t.start} <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm flex items-center gap-2">
        <BookOpen size={16} />
        <span>{t.poweredBy}</span>
      </div>
    </div>
  );
};