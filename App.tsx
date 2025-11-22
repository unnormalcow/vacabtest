import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { MistakeScreen } from './components/MistakeScreen';
import { StatsScreen } from './components/StatsScreen';
import { generateVocabulary } from './services/geminiService';
import { AppState, WordItem, GameStats, Language, TRANSLATIONS, User, GradeLevel } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  // Load users from local storage
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('vq_users');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.AUTH);
  const [words, setWords] = useState<WordItem[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({ total: 0, correct: 0, streak: 0, mistakes: [] });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [language, setLanguage] = useState<Language>('zh');
  const [isMistakeReview, setIsMistakeReview] = useState(false);

  const t = TRANSLATIONS[language];

  // Persist users when updated
  useEffect(() => {
    localStorage.setItem('vq_users', JSON.stringify(users));
  }, [users]);

  const handleCreateUser = (name: string, grade: GradeLevel, avatarDesc: string, avatarUrl: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      grade,
      avatarDesc,
      avatarUrl,
      mistakes: [],
      history: [],
      createdAt: Date.now()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAppState(AppState.WELCOME);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState(AppState.WELCOME);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    if (currentUser?.id === id) {
        setCurrentUser(null);
    }
  };

  const handleSwitchUser = () => {
    setCurrentUser(null);
    setAppState(AppState.AUTH);
  };

  const handleStart = async (topic: string, count: number) => {
    if (!currentUser) return;
    setIsMistakeReview(false);
    setAppState(AppState.LOADING);
    try {
      const fetchedWords = await generateVocabulary(topic, currentUser.grade, count);
      if (fetchedWords.length === 0) {
          throw new Error("No words generated.");
      }
      setWords(fetchedWords);
      setAppState(AppState.PLAYING);
    } catch (err) {
      setErrorMsg("Failed to load vocabulary. Please check your connection or API key.");
      setAppState(AppState.ERROR);
    }
  };

  const handleMistakePractice = () => {
    if (!currentUser || currentUser.mistakes.length === 0) return;
    setIsMistakeReview(true);
    // Shuffle mistakes
    const shuffledMistakes = [...currentUser.mistakes].sort(() => Math.random() - 0.5);
    // Limit to 20 for a session
    setWords(shuffledMistakes.slice(0, 20));
    setAppState(AppState.PLAYING);
  };

  const handleFinish = (stats: GameStats) => {
    if (!currentUser) return;

    let updatedMistakes = [...currentUser.mistakes];
    
    if (isMistakeReview) {
        // In review mode: Remove words that were answered correctly.
        // A word is correct if it is NOT in stats.mistakes (which captures wrong answers this session).
        // Iterate through the words we just played (words state)
        words.forEach(playedWord => {
            const failedAgain = stats.mistakes.some(m => m.word === playedWord.word);
            if (!failedAgain) {
                // Remove from notebook
                updatedMistakes = updatedMistakes.filter(m => m.word !== playedWord.word);
            }
        });
    } else {
        // Normal mode: Add new mistakes
        stats.mistakes.forEach(newMistake => {
            if (!updatedMistakes.some(m => m.word === newMistake.word)) {
                updatedMistakes.push(newMistake);
            }
        });
    }

    // Update History
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...(currentUser.history || [])];
    const todayStatIndex = newHistory.findIndex(h => h.date === today);

    if (todayStatIndex >= 0) {
        newHistory[todayStatIndex] = {
            ...newHistory[todayStatIndex],
            wordsLearned: newHistory[todayStatIndex].wordsLearned + stats.total,
            correctCount: newHistory[todayStatIndex].correctCount + stats.correct,
            mistakesMade: newHistory[todayStatIndex].mistakesMade + stats.mistakes.length
        };
    } else {
        newHistory.push({
            date: today,
            wordsLearned: stats.total,
            correctCount: stats.correct,
            mistakesMade: stats.mistakes.length
        });
    }

    const updatedUser = {
        ...currentUser,
        mistakes: updatedMistakes,
        history: newHistory
    };

    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    setGameStats(stats);
    setAppState(AppState.RESULTS);
  };

  const handleRestart = () => {
      // If review mode, we might need to refresh 'words' if some were cleared, 
      // but simpler to just reshuffle current set or re-trigger logic.
      // For simplicity in restart, just shuffle the current set again.
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setAppState(AppState.PLAYING);
  };

  const handleHome = () => {
      setAppState(AppState.WELCOME);
      setWords([]);
      setGameStats({ total: 0, correct: 0, streak: 0, mistakes: [] });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.1)_0%,rgba(255,255,255,0)_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.1)_0%,rgba(255,255,255,0)_40%)]"></div>
      </div>

      <div className="relative z-10">
        {appState === AppState.AUTH && (
          <AuthScreen 
            users={users} 
            onLogin={handleLogin} 
            onCreateUser={handleCreateUser} 
            onDeleteUser={handleDeleteUser}
            language={language} 
            setLanguage={setLanguage} 
          />
        )}

        {appState === AppState.WELCOME && currentUser && (
          <WelcomeScreen 
            user={currentUser}
            onStart={handleStart} 
            onSwitchUser={handleSwitchUser}
            language={language} 
            setLanguage={setLanguage} 
            onReviewMistakes={() => setAppState(AppState.MISTAKES)}
            onViewStats={() => setAppState(AppState.STATS)}
          />
        )}

        {appState === AppState.LOADING && (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-700">{t.loadingTitle}</h2>
            <p className="text-slate-500 mt-2">{t.loadingDesc}</p>
          </div>
        )}

        {appState === AppState.PLAYING && (
          <GameScreen words={words} onFinish={handleFinish} language={language} />
        )}

        {appState === AppState.RESULTS && (
          <ResultScreen 
            stats={gameStats} 
            onRestart={handleRestart} 
            onHome={handleHome}
            onReviewMistakes={() => setAppState(AppState.MISTAKES)} 
            language={language}
          />
        )}

        {appState === AppState.MISTAKES && currentUser && (
          <MistakeScreen 
            mistakes={currentUser.mistakes}
            onHome={handleHome}
            onPractice={handleMistakePractice}
            language={language}
          />
        )}

        {appState === AppState.STATS && currentUser && (
          <StatsScreen 
            history={currentUser.history || []} 
            onHome={handleHome}
            language={language}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.errorTitle}</h2>
            <p className="text-slate-600 mb-8 max-w-sm">{errorMsg}</p>
            <button 
                onClick={handleHome}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
                {t.retry}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;