import React, { useState, useRef } from 'react';
import { UserProfile, LEVELS } from '../types';
import { Camera, RefreshCw, Anchor, Fish, Crown, Zap, Sparkles, Waves, PawPrint } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onReset: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onReset }) => {
  const [photo, setPhoto] = useState<string | null>(localStorage.getItem('swimevo_profile_photo'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        localStorage.setItem('swimevo_profile_photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFrameConfig = () => {
    const lvlIndex = LEVELS.slice().reverse().findIndex(l => user.xp >= l.minXp);
    // Real index from 0 (lowest) to 8 (highest)
    const realIndex = LEVELS.length - 1 - (lvlIndex === -1 ? LEVELS.length - 1 : lvlIndex);
    
    // Level 0: Anchor
    if (realIndex === 0) {
      return { 
        type: 'beginner',
        color: 'border-slate-400', 
        icon: Anchor, 
        bg: 'from-gray-300 to-slate-400',
        effect: (
          <>
             <div className="absolute -bottom-4 left-4 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-[bounce_3s_infinite]" />
             <div className="absolute -bottom-2 right-8 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-[bounce_4s_infinite_0.5s]" />
             <div className="absolute bottom-6 left-1 w-2 h-2 bg-blue-100 rounded-full opacity-80 animate-[ping_2s_infinite]" />
          </>
        )
      };
    }

    // Level 1: Puppy (Cachorrinho Molhado) - NOW DISTINCT
    if (realIndex === 1) {
       return { 
        type: 'intermediate',
        color: 'border-blue-400', 
        icon: PawPrint, 
        bg: 'from-blue-200 to-cyan-300',
        effect: (
          <>
             <div className="absolute -top-1 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-50 animate-pulse" />
             <div className="absolute bottom-2 right-2 text-blue-500 opacity-60"><PawPrint size={16} /></div>
          </>
        )
      };
    }

    // Level 2, 3, 4 (Fish, Turtle)
    if (realIndex <= 4) {
      return { 
        type: 'intermediate',
        color: 'border-cyan-400', 
        icon: Fish, 
        bg: 'from-cyan-300 to-blue-400',
        effect: (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-[ping_3s_infinite]" />
            <Waves className="absolute bottom-0 w-full text-blue-100 opacity-40 animate-pulse" />
          </>
        )
      };
    }

    // Level 5, 6 (Shark, Dolphin)
    if (realIndex <= 6) {
      return { 
        type: 'advanced',
        color: 'border-purple-500', 
        icon: Zap, 
        bg: 'from-purple-400 to-indigo-500',
        effect: (
          <>
             <div className="absolute inset-[-4px] rounded-full border-t-4 border-purple-300 animate-spin opacity-60" />
             <Sparkles className="absolute top-2 right-2 text-yellow-300 animate-pulse" size={20} />
          </>
        )
      };
    }

    // 7, 8 (Mermaid, Cielo)
    return { 
      type: 'legend',
      color: 'border-yellow-400', 
      icon: Crown, 
      bg: 'from-yellow-300 to-orange-400',
      effect: (
        <>
           <div className="absolute inset-[-8px] rounded-full border-2 border-dashed border-yellow-300 animate-[spin_10s_linear_infinite]" />
           <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse" />
           <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 drop-shadow-lg" size={40} fill="gold" />
           <Sparkles className="absolute bottom-4 left-2 text-white animate-bounce" size={16} />
           <Sparkles className="absolute top-10 right-0 text-white animate-bounce delay-100" size={16} />
        </>
      )
    };
  };

  const frame = getFrameConfig();
  const FrameIcon = frame.icon;

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Perfil</h1>

      {/* Selfie Area */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 mb-6 flex flex-col items-center">
        <div className="relative w-64 h-64 mb-10 group mt-4">
           {/* The Frame Container */}
           <div className={`absolute inset-0 z-20 pointer-events-none rounded-full border-8 ${frame.color} flex items-center justify-center`}>
              {/* Decorative Elements (Animations) */}
              {frame.effect}
              
              {/* Icon Badge */}
              {frame.type !== 'legend' && (
                <div className="absolute -top-5 bg-white p-2 rounded-full border-2 border-gray-100 shadow-md">
                   <FrameIcon className={`text-${frame.color.replace('border-', '')}`} size={24} />
                </div>
              )}

              {/* Title Badge */}
              <div className="absolute -bottom-4 bg-gray-900 text-white text-xs px-4 py-1.5 rounded-full shadow-lg font-bold uppercase tracking-widest border-2 border-white whitespace-nowrap z-30">
                {user.levelTitle}
              </div>
           </div>

           {/* The Photo */}
           <div className={`w-full h-full rounded-full overflow-hidden bg-gradient-to-br ${frame.bg} flex items-center justify-center relative shadow-inner`}>
              {photo ? (
                <img src={photo} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera size={48} className="mx-auto text-white mb-2 opacity-50" />
                  <span className="text-white font-bold text-sm opacity-80">Tirar Selfie</span>
                </div>
              )}
           </div>

           {/* Hidden Input */}
           <input 
             type="file" 
             ref={fileInputRef} 
             accept="image/*" 
             capture="user"
             className="hidden" 
             onChange={handlePhotoUpload}
           />
           
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="absolute bottom-2 right-2 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-90 border-4 border-white"
           >
             <Camera size={20} />
           </button>
        </div>

        <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
          Sua moldura está viva! Ela muda conforme você evolui de nível.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 mb-8">
         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
            <span className="text-gray-500">Nome</span>
            <span className="font-bold text-gray-900">{user.name}</span>
         </div>
         <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
            <span className="text-gray-500">Meta Semanal</span>
            <span className="font-bold text-blue-600">{user.weeklyGoal} dias</span>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-gray-500">Streak Atual</span>
            <span className="font-bold text-orange-500">{user.streak} semanas 🔥</span>
         </div>
      </div>

      {/* Danger Zone */}
      <button 
        onClick={onReset}
        className="w-full py-4 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw size={16} />
        Resetar Progresso (Apagar tudo)
      </button>

      <div className="mt-8 text-center text-xs text-gray-300">
        SwimEvo v1.2 • Mantenha a cabeça conectada
      </div>
    </div>
  );
};