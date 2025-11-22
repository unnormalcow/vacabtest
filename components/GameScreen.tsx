import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WordItem, MaskedWord, GameStats, Language, TRANSLATIONS } from '../types';
import { Check, X, HelpCircle, ArrowRight, Lightbulb, Volume2 } from 'lucide-react';

interface GameScreenProps {
  words: WordItem[];
  onFinish: (stats: GameStats) => void;
  language: Language;
}

export const GameScreen: React.FC<GameScreenProps> = ({ words, onFinish, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMasked, setCurrentMasked] = useState<MaskedWord | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'checked' | 'success'>('playing');
  const [stats, setStats] = useState<GameStats>({ total: 0, correct: 0, streak: 0, mistakes: [] });
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const t = TRANSLATIONS[language];

  // Initialize or change word
  useEffect(() => {
    if (currentIndex < words.length) {
      const wordItem = words[currentIndex];
      const cleanWord = wordItem.word.toLowerCase();
      const length = cleanWord.length;

      // Logic to mask letters: mask about 40-50% of letters, never the first one unless very short
      const maskedArray: (string | null)[] = cleanWord.split('').map((char, idx) => {
        // Always show non-alphabet characters (-, space)
        if (!/[a-z]/.test(char)) return char;
        
        // Always show first letter
        if (idx === 0) return char;

        // Randomly hide
        return Math.random() > 0.5 ? null : char;
      });

      // Ensure at least one hidden
      if (!maskedArray.includes(null)) {
          maskedArray[length - 1] = null;
      }
      // Ensure not all hidden (except first)
      const hiddenCount = maskedArray.filter(c => c === null).length;
      if (hiddenCount === length - 1 && length > 3) {
          maskedArray[Math.floor(length / 2)] = cleanWord[Math.floor(length / 2)];
      }

      setCurrentMasked({
        original: wordItem,
        maskedWord: maskedArray,
        userInput: maskedArray.map(c => c === null ? '' : c),
        isRevealed: false
      });
      setGameStatus('playing');
      
      // Focus first empty input after a brief delay for render
      setTimeout(() => {
         const firstInput = inputRefs.current.find(input => input && !input.disabled && input.value === '');
         firstInput?.focus();
      }, 100);
    } else {
      onFinish(stats);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, words]);

  const handleInputChange = (index: number, value: string) => {
    if (!currentMasked || gameStatus !== 'playing') return;
    
    // Only allow single alphabet char
    if (value && !/^[a-zA-Z]$/.test(value)) return;

    const newUserInput = [...currentMasked.userInput];
    newUserInput[index] = value.toLowerCase();
    
    setCurrentMasked({ ...currentMasked, userInput: newUserInput });

    // Auto-advance focus
    if (value) {
      let nextIndex = index + 1;
      while (nextIndex < currentMasked.maskedWord.length) {
        if (currentMasked.maskedWord[nextIndex] === null) {
          inputRefs.current[nextIndex]?.focus();
          break;
        }
        nextIndex++;
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !currentMasked?.userInput[index] && index > 0) {
      // Find previous editable field
      let prevIndex = index - 1;
      while (prevIndex >= 0) {
        if (currentMasked?.maskedWord[prevIndex] === null) {
          inputRefs.current[prevIndex]?.focus();
          break;
        }
        prevIndex--;
      }
    } else if (e.key === 'Enter') {
        checkAnswer();
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = useCallback(() => {
    if (!currentMasked) return;

    const isCorrect = currentMasked.userInput.join('') === currentMasked.original.word.toLowerCase();

    if (isCorrect) {
      setGameStatus('success');
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        correct: prev.correct + 1,
        streak: prev.streak + 1
      }));
      // Auto speak when correct
      speak(currentMasked.original.word);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setGameStatus('checked');
      
      // Add to mistakes if not already added this session
      setStats(prev => {
         const exists = prev.mistakes.find(m => m.word === currentMasked.original.word);
         if (!exists) {
             return { ...prev, streak: 0, mistakes: [...prev.mistakes, currentMasked.original] };
         }
         return { ...prev, streak: 0 };
      });
    }
  }, [currentMasked]);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const revealAnswer = () => {
      if (!currentMasked) return;
      const fullWord = currentMasked.original.word.toLowerCase().split('');
      setCurrentMasked({
          ...currentMasked,
          userInput: fullWord,
          isRevealed: true
      });
      setGameStatus('checked');
      
      // Add to mistakes
      setStats(prev => {
        const exists = prev.mistakes.find(m => m.word === currentMasked.original.word);
         if (!exists) {
             return { ...prev, total: prev.total + 1, streak: 0, mistakes: [...prev.mistakes, currentMasked.original] };
         }
         return { ...prev, total: prev.total + 1, streak: 0 };
      });
      speak(currentMasked.original.word);
  };

  if (!currentMasked) return <div className="p-10 text-center">Loading word...</div>;

  const progress = ((currentIndex) / words.length) * 100;

  return (
    <div className="max-w-3xl mx-auto w-full p-4 flex flex-col min-h-screen">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-slate-500 hidden sm:block">{t.progress}</div>
          <div className="w-20 sm:w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-sm font-bold text-slate-700">{currentIndex + 1}/{words.length}</div>
        </div>
        <div className="flex gap-4 text-sm font-bold">
            <div className="text-green-600">{t.score}: {stats.correct}</div>
            <div className="text-orange-500">{t.streak}: 🔥 {stats.streak}</div>
        </div>
      </div>

      {/* Word Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {/* Meaning Section */}
            <div className="bg-indigo-600 p-8 text-center relative">
                <h2 className="text-3xl font-bold text-white mb-2">{currentMasked.original.meaning}</h2>
                <div className="flex items-center justify-center gap-2 text-indigo-200 italic">
                    <button 
                        onClick={() => speak(currentMasked.original.sentence)}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        title="Read sentence"
                    >
                        <Volume2 size={18} />
                    </button>
                    <span>"{currentMasked.original.sentence}"</span>
                </div>
            </div>

            {/* Input Section */}
            <div className="p-8 md:p-12 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => speak(currentMasked.original.word)}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                        title="Read word"
                    >
                        <Volume2 size={24} />
                    </button>
                    <div className={`flex flex-wrap justify-center gap-2 md:gap-3 ${shake ? 'shake' : ''}`}>
                        {currentMasked.original.word.split('').map((char, idx) => {
                            const isStatic = currentMasked.maskedWord[idx] !== null;
                            const isWrong = gameStatus === 'checked' && !isStatic && currentMasked.userInput[idx] !== char.toLowerCase();
                            
                            return (
                                <input
                                    key={idx}
                                    ref={el => inputRefs.current[idx] = el}
                                    type="text"
                                    maxLength={1}
                                    disabled={isStatic || gameStatus === 'success' || currentMasked.isRevealed}
                                    value={currentMasked.userInput[idx]}
                                    onChange={(e) => handleInputChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    className={`w-10 h-14 md:w-14 md:h-16 text-2xl md:text-3xl font-bold text-center rounded-lg border-b-4 transition-all focus:outline-none 
                                        ${isStatic 
                                            ? 'bg-slate-100 border-slate-300 text-slate-500 select-none' 
                                            : 'bg-white border-indigo-200 text-indigo-900 focus:border-indigo-500 focus:bg-indigo-50 shadow-sm'
                                        }
                                        ${isWrong ? 'bg-red-50 border-red-400 text-red-600' : ''}
                                        ${gameStatus === 'success' && !isStatic ? 'bg-green-50 border-green-500 text-green-700' : ''}
                                    `}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Feedback Message */}
                <div className="h-8">
                    {gameStatus === 'success' && (
                        <div className="text-green-600 font-bold flex items-center gap-2 animate-bounce">
                            <Check className="w-5 h-5" /> {t.correctMsg}
                        </div>
                    )}
                    {gameStatus === 'checked' && !currentMasked.isRevealed && (
                        <div className="text-red-500 font-bold flex items-center gap-2">
                            <X className="w-5 h-5" /> {t.wrongMsg}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-100">
                {gameStatus === 'playing' || (gameStatus === 'checked' && !currentMasked.isRevealed) ? (
                    <>
                        <button 
                            onClick={revealAnswer}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <Lightbulb className="w-5 h-5" /> {t.giveUp}
                        </button>
                        <button 
                            onClick={checkAnswer}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                        >
                            {t.check} <HelpCircle className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={handleNext}
                        autoFocus
                        className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center animate-pulse"
                    >
                        {t.next} <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
