import React, { useState } from 'react';
import { UserProfile, SwimSession } from '../types';
import { generateSwimFeedback } from '../services/geminiService';
import { Save, Loader2, Smile, Frown, Meh, AlertCircle, ArrowRight } from 'lucide-react';

interface TrainingLogProps {
  user: UserProfile;
  onSaveSession: (session: SwimSession, xpGained: number) => void;
  onCancel: () => void;
}

export const TrainingLog: React.FC<TrainingLogProps> = ({ user, onSaveSession, onCancel }) => {
  const [duration, setDuration] = useState(30);
  const [feeling, setFeeling] = useState<SwimSession['feeling']>('good');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [xpToGain, setXpToGain] = useState(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate XP first
    let xp = 50; 
    if (feeling === 'great') xp += 50;
    if (feeling === 'exhausted') xp += 20; 
    setXpToGain(xp);

    const feedback = await generateSwimFeedback(notes || `Me senti ${feeling}`, user);
    setAiResponse(feedback);
    setIsSubmitting(false);
  };

  const handleConfirmAndExit = () => {
    const newSession: SwimSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        durationMinutes: duration,
        feeling,
        notes,
        aiFeedback: aiResponse || ""
    };
    onSaveSession(newSession, xpToGain);
  };

  if (aiResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-white">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
            <Smile size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Treino Registrado!</h2>
          <div className="text-left bg-blue-50/50 p-6 rounded-2xl text-sm text-gray-700 mb-8 border border-blue-100 relative">
             <div className="absolute top-0 left-4 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Coach IA diz:</div>
            <p className="italic leading-relaxed">"{aiResponse}"</p>
          </div>
          
          <button 
             onClick={handleConfirmAndExit}
             className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
             Entendi, finalizar <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-screen bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Registrar Mergulho</h2>

      <div className="space-y-8">
        {/* Feeling */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">Como você saiu da água?</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'great', icon: Smile, label: 'Voando', color: 'bg-green-100 text-green-600 border-green-200' },
              { id: 'good', icon: Smile, label: 'Bem', color: 'bg-blue-100 text-blue-600 border-blue-200' },
              { id: 'hard', icon: Meh, label: 'Cansad@', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
              { id: 'exhausted', icon: Frown, label: 'Mort@', color: 'bg-red-100 text-red-600 border-red-200' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFeeling(opt.id as any)}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                  feeling === opt.id 
                    ? `${opt.color} shadow-md scale-105` 
                    : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <opt.icon size={28} />
                <span className="text-[10px] mt-2 font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
          <div className="flex justify-between items-center mb-4">
             <label className="text-sm font-bold text-blue-900">Tempo na Água</label>
             <div className="text-2xl font-bold text-blue-600">{duration} <span className="text-sm font-normal text-blue-400">min</span></div>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Diário de Bordo
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none text-sm min-h-[120px] transition-all"
            placeholder="Conte para a IA: Engoliu água? A perna afundou? Sentiu evolução?"
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Gerando feedback...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar Treino
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};