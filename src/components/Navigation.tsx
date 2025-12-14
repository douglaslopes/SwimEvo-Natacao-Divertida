import React from 'react';
import { AppView } from '../types';
import { Home, PlusCircle, BarChart2, User, GraduationCap } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: 'Início' },
    { view: AppView.LOG_SWIM, icon: PlusCircle, label: 'Nadar' },
    { view: AppView.QUIZ, icon: GraduationCap, label: 'Quiz' },
    { view: AppView.PROGRESS, icon: BarChart2, label: 'Evolução' },
    { view: AppView.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-blue-100 pb-safe pt-2 px-2 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-16 transition-all duration-200 active:scale-95 ${
              currentView === item.view
                ? 'text-blue-600 -translate-y-1'
                : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            <item.icon size={currentView === item.view ? 26 : 24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className={`text-[10px] mt-1 font-medium ${currentView === item.view ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};