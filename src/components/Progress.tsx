import React from 'react';
import { SwimSession, UserProfile, LEVELS, getTitleForGender } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalendarCheck, History, Lock, Check, MapPin } from 'lucide-react';

interface ProgressProps {
  sessions: SwimSession[];
  user: UserProfile;
}

export const Progress: React.FC<ProgressProps> = ({ sessions, user }) => {
  // Prepare data for chart (Last 7 days simplified logic)
  const chartData = sessions.slice(0, 7).reverse().map(s => ({
    name: new Date(s.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
    minutos: s.durationMinutes,
    feeling: s.feeling
  }));

  const getBarColor = (feeling: string) => {
    switch(feeling) {
      case 'great': return '#22c55e'; // green
      case 'good': return '#3b82f6'; // blue
      case 'hard': return '#eab308'; // yellow
      default: return '#ef4444'; // red
    }
  };

  // Find current level index
  const currentLevelIndex = LEVELS.slice().reverse().findIndex(l => user.xp >= l.minXp);
  const realCurrentIndex = LEVELS.length - 1 - (currentLevelIndex === -1 ? LEVELS.length - 1 : currentLevelIndex);

  // Total Hours calculation fixed
  const totalHours = (sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60).toFixed(1);

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Sua Evolução</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CalendarCheck size={16} />
            <span className="text-xs font-medium">Treinos Totais</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <History size={16} />
            <span className="text-xs font-medium">Tempo Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {totalHours}h
          </p>
        </div>
      </div>

      {/* Journey / Levels Timeline */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="text-blue-500" size={20} />
          Jornada do Nadador
        </h3>
        
        <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-4 before:w-0.5 before:bg-gray-100">
          {LEVELS.map((level, index) => {
            const isUnlocked = user.xp >= level.minXp;
            const isCurrent = index === realCurrentIndex;
            const isNext = index === realCurrentIndex + 1;

            return (
              <div key={index} className={`relative flex items-start gap-4 ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                {/* Indicator Dot */}
                <div className={`
                  z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 
                  ${isCurrent ? 'bg-blue-600 border-blue-200 scale-125 shadow-lg shadow-blue-200 ring-4 ring-blue-50' : 
                    isUnlocked ? 'bg-green-500 border-white text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}
                `}>
                  {isCurrent ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : 
                   isUnlocked ? <Check size={12} /> : 
                   <Lock size={12} />}
                </div>

                {/* Content */}
                <div className={`flex-1 ${isCurrent ? 'bg-blue-50 p-3 -mt-2 rounded-xl border border-blue-100' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-sm ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                      {getTitleForGender(level, user.gender)}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{level.minXp} XP</span>
                  </div>
                  <p className="text-xs text-gray-500 italic leading-snug">{level.desc}</p>
                  
                  {isNext && (
                    <div className="mt-2 text-[10px] font-bold text-orange-500 bg-orange-50 inline-block px-2 py-1 rounded">
                      Faltam {level.minXp - user.xp} XP
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-64">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Minutos na Água (Últimos treinos)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="minutos" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.feeling)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};