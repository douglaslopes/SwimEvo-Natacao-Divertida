import React, { useEffect, useState } from 'react';
import { UserProfile, LEVELS, AppView, getTitleForGender } from '../types';
import { generateWeeklyChallenge } from '../services/geminiService';
import { Trophy, Calendar, Waves, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [nextLevel, setNextLevel] = useState(LEVELS[1]);
  const [challenge, setChallenge] = useState<string>("Carregando desafio...");

  useEffect(() => {
    // Calculate level based on XP to ensure consistency
    const lvl = LEVELS.slice().reverse().find(l => user.xp >= l.minXp) || LEVELS[0];
    const nxt = LEVELS.find(l => l.minXp > user.xp) || LEVELS[LEVELS.length - 1];
    setCurrentLevel(lvl);
    setNextLevel(nxt);

    // CACHING LOGIC
    const loadChallenge = async () => {
      const todayKey = new Date().toDateString();
      const storageKeyText = `swimevo_challenge_text_${user.levelTitle}`; // Cache per level title
      const storageKeyDate = `swimevo_challenge_date`;

      const cachedText = localStorage.getItem(storageKeyText);
      const cachedDate = localStorage.getItem(storageKeyDate);

      // If we have a cached challenge from today (or essentially same session valid for the day)
      if (cachedText && cachedDate === todayKey) {
        setChallenge(cachedText);
      } else {
        // Fetch new one
        try {
          const text = await generateWeeklyChallenge(getTitleForGender(lvl, user.gender));
          setChallenge(text);
          localStorage.setItem(storageKeyText, text);
          localStorage.setItem(storageKeyDate, todayKey);
        } catch (e) {
          setChallenge("Foque em soltar o ar pelo nariz e relaxar os ombros.");
        }
      }
    };

    loadChallenge();
  }, [user.xp, user.levelTitle, user.gender]); // Dependencies

  const progressPercent = Math.min(100, Math.max(0, ((user.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100));

  // Simple Markdown bold parser
  const renderChallengeText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-blue-700 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-lg text-gray-500">Olá, {user.name} 👋</h1>
          {/* Use derived title from currentLevel to ensure it matches XP, falling back to user.levelTitle if needed */}
          <p className="text-2xl font-bold text-gray-900">{getTitleForGender(currentLevel, user.gender)}</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm">
           <span className="text-lg leading-none">{user.xp}</span>
           <span className="text-[9px] text-gray-400 font-normal">XP</span>
        </div>
      </header>

      {/* Level Card */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <Waves className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32" />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-medium opacity-90 tracking-wide">
              Próximo: {getTitleForGender(nextLevel, user.gender)}
            </span>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md">{Math.floor(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div 
              className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-5 text-sm font-medium opacity-90 italic text-blue-50">"{currentLevel.desc}"</p>
        </div>
      </div>

      {/* Daily Challenge / Tip */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
        <div className="flex items-center gap-2 mb-3 text-orange-500">
          <BrainCircuit size={20} />
          <h3 className="font-bold uppercase text-xs tracking-wider">Foco da Semana</h3>
        </div>
        <p className="text-gray-700 font-medium leading-relaxed">
          {renderChallengeText(challenge)}
        </p>
      </div>

      {/* Weekly Schedule Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar size={20} />
            <h3 className="font-bold">Sua Semana</h3>
          </div>
          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold border border-green-100">
            Meta: {user.weeklyGoal}x
          </span>
        </div>
        <div className="flex justify-between">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => {
             const today = new Date().getDay();
             const isToday = idx === today;
             return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <span className={`text-[10px] font-bold ${isToday ? 'text-blue-600' : 'text-gray-300'}`}>{day}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                  ${isToday 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                    : 'bg-white border border-gray-100 text-gray-300'}`}>
                  {new Date().getDate() + (idx - today)}
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {/* CTA */}
      <button 
        onClick={() => setView(AppView.LOG_SWIM)}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:bg-gray-800 transition-transform active:scale-95"
      >
        <Trophy size={20} className="text-yellow-400" />
        Registrar Treino de Hoje
      </button>

    </div>
  );
};