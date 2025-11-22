import React, { useState } from 'react';
import { User, GradeLevel, Language, TRANSLATIONS } from '../types';
import { generateAvatar } from '../services/geminiService';
import { UserPlus, LogIn, Sparkles, Trash2, Palette } from 'lucide-react';

interface AuthScreenProps {
  users: User[];
  onLogin: (user: User) => void;
  onCreateUser: (name: string, grade: GradeLevel, avatarDesc: string, avatarUrl: string) => void;
  onDeleteUser: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ users, onLogin, onCreateUser, onDeleteUser, language, setLanguage }) => {
  const [view, setView] = useState<'login' | 'create'>(users.length > 0 ? 'login' : 'create');
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState<GradeLevel>('grade7');
  const [avatarDesc, setAvatarDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const t = TRANSLATIONS[language];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !avatarDesc) return;

    setIsGenerating(true);
    try {
      // Generate avatar using AI
      const avatarUrl = await generateAvatar(avatarDesc);
      onCreateUser(newName, newGrade, avatarDesc, avatarUrl);
    } catch (error) {
      console.error(error);
      onCreateUser(newName, newGrade, avatarDesc, ""); 
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const GRADE_OPTIONS: GradeLevel[] = ['grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'grade12'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        {/* Language Toggle */}
        <button 
            onClick={toggleLanguage}
            className="absolute top-6 right-6 px-4 py-2 bg-white rounded-full shadow-sm text-slate-600 font-bold hover:bg-slate-50 transition"
        >
            {language === 'en' ? '中文' : 'English'}
        </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 my-10">
        <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-3xl font-extrabold text-white mb-2">{t.title}</h1>
            <p className="text-indigo-200">{t.subtitle}</p>
        </div>

        <div className="p-8">
            <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => setView('login')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${view === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t.login}
                </button>
                <button 
                    onClick={() => setView('create')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${view === 'create' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t.createProfile}
                </button>
            </div>

            {view === 'login' && (
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            {t.noUsers}
                        </div>
                    ) : (
                        <div className="grid gap-3 max-h-80 overflow-y-auto pr-1">
                            {users.map(user => (
                                <div key={user.id} className="group relative flex items-center p-3 rounded-xl hover:bg-indigo-50 border border-slate-100 transition-colors cursor-pointer" onClick={() => onLogin(user)}>
                                    <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover bg-slate-200" />
                                    <div className="ml-4 flex-1">
                                        <div className="font-bold text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-500">
                                            {/* @ts-ignore dynamic key */}
                                            {t[user.grade]}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteUser(user.id); }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title={t.deleteUser}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 pointer-events-none">
                                        <LogIn size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'create' && (
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">{t.enterName}</label>
                        <input 
                            type="text" 
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="Alice"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.selectGrade}</label>
                        <div className="grid grid-cols-2 gap-2">
                             {GRADE_OPTIONS.map(g => (
                                <label key={g} className={`flex flex-col items-center justify-center p-2 border rounded-xl cursor-pointer transition-colors text-center ${newGrade === g ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <input type="radio" name="grade" value={g} checked={newGrade === g} onChange={() => setNewGrade(g)} className="hidden" />
                                    <span className="text-xs font-bold">
                                        {/* @ts-ignore dynamic key */}
                                        {t[g].split('(')[0]}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {/* @ts-ignore dynamic key */}
                                        {t[g].split('(')[1].replace(')','')}
                                    </span>
                                </label>
                             ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                            <Palette size={16} className="text-indigo-500" />
                            {t.avatarDesc}
                        </label>
                        <textarea 
                            required
                            value={avatarDesc}
                            onChange={(e) => setAvatarDesc(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all h-20 resize-none text-sm"
                            placeholder={t.avatarPlaceholder}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isGenerating}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="animate-spin" /> {t.generatingAvatar}
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} /> {t.createAndStart}
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};