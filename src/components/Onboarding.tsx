import React, { useState } from 'react';
import { UserProfile, Gender, LEVELS, getTitleForGender } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: "Qual sua relação com a água hoje?",
    options: [
      { text: "Tenho medo até do chuveiro.", xp: 0 },
      { text: "Entro na piscina, mas fico no raso segurando a borda.", xp: 50 },
      { text: "Consigo boiar e bater perna.", xp: 150 },
      { text: "Já nado o estilo 'cachorrinho' com perfeição.", xp: 300 },
    ],
  },
  {
    id: 2,
    question: "Como é sua respiração na água?",
    options: [
      { text: "Eu prendo a respiração até ficar roxo.", xp: 0 },
      { text: "Solto o ar pelo nariz, mas engulo água as vezes.", xp: 100 },
      { text: "Consigo respirar de lado (mais ou menos).", xp: 200 },
    ],
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Name/Gender, 1..N: Quiz, N+1: Goals
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [tempQuizScore, setTempQuizScore] = useState(0); // Used only for internal logic if needed, but ignored for initial level
  
  // Goal State
  const [classDays, setClassDays] = useState(2);
  const [extraDays, setExtraDays] = useState(0);

  const handleNextInfo = () => {
    if (!name.trim()) return;
    setStep(1);
  };

  const handleQuizAnswer = (xp: number) => {
    const newScore = tempQuizScore + xp;
    setTempQuizScore(newScore);
    setStep(prev => prev + 1);
  };

  const finishOnboarding = () => {
    // FIX: Since XP starts at 0, the Level Title MUST correspond to 0 XP (Level 0).
    // Ignoring tempQuizScore for the title assignment to ensure consistency.
    const startXp = 0;
    const level = LEVELS[0]; 
    const title = getTitleForGender(level, gender);

    const weeklyGoal = classDays + extraDays;

    const newProfile: UserProfile = {
      name,
      gender,
      xp: startXp,
      levelTitle: title,
      onboardingCompleted: true,
      weeklyGoal: weeklyGoal > 0 ? weeklyGoal : 1,
      streak: 0,
      quizHistory: {} 
    };
    onComplete(newProfile);
  };

  // Step 0: Personal Info
  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-gray-800">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">SwimEvo 🏊</h1>
        <p className="mb-8 text-center text-gray-500">Vamos criar seu perfil de nadador(a).</p>
        
        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium mb-2 text-gray-700">Como devemos te chamar?</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-blue-100 bg-blue-50/50 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Seu nome ou apelido"
          />

          <label className="block text-sm font-medium mb-2 text-gray-700">Como você se identifica?</label>
          <div className="grid grid-cols-2 gap-2 mb-8">
            {[
              { id: 'female', label: 'Feminino' },
              { id: 'male', label: 'Masculino' },
              { id: 'non-binary', label: 'Não-binário' },
              { id: 'gender-fluid', label: 'Gênero Fluido' },
              { id: 'agender', label: 'Agênero' },
              { id: 'other', label: 'Outro' },
            ].map((g) => (
              <button 
                key={g.id}
                onClick={() => setGender(g.id as Gender)}
                className={`py-3 px-2 rounded-xl border text-sm font-medium transition-all ${
                  gender === g.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-blue-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleNextInfo}
            disabled={!name}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Quiz Steps
  if (step > 0 && step <= QUESTIONS.length) {
    const currentQuestion = QUESTIONS[step - 1];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((step) / (QUESTIONS.length + 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-2 font-medium">Etapa de Diagnóstico</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(option.xp)}
                className="w-full text-left p-5 bg-white border-2 border-blue-50 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 text-gray-700 font-medium transition-all"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Final Step: Goals
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-gray-800">
      <div className="w-full max-w-md">
         <h2 className="text-2xl font-bold text-gray-800 mb-2">Vamos definir sua meta! 🎯</h2>
         <p className="text-gray-500 mb-8">Para calcularmos sua constância.</p>

         <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6">
           <label className="block text-sm font-bold mb-4 text-blue-900">Quantos dias de AULA você tem na semana?</label>
           <div className="flex justify-between items-center mb-6">
             <button onClick={() => setClassDays(Math.max(0, classDays - 1))} className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold border border-blue-100">-</button>
             <span className="text-3xl font-bold text-blue-600">{classDays}</span>
             <button onClick={() => setClassDays(Math.min(7, classDays + 1))} className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold border border-blue-100">+</button>
           </div>

           <label className="block text-sm font-bold mb-4 text-blue-900">Pretende ir nadar por fora (Treino Livre)?</label>
           <div className="flex justify-between items-center">
             <button onClick={() => setExtraDays(Math.max(0, extraDays - 1))} className="w-10 h-10 rounded-full bg-white text-purple-600 font-bold border border-purple-100">-</button>
             <span className="text-3xl font-bold text-purple-600">{extraDays}</span>
             <button onClick={() => setExtraDays(Math.min(7, extraDays + 1))} className="w-10 h-10 rounded-full bg-white text-purple-600 font-bold border border-purple-100">+</button>
           </div>
         </div>

         <div className="text-center mb-8">
            <p className="text-sm text-gray-500">Sua meta semanal será de:</p>
            <p className="text-4xl font-bold text-gray-900">{classDays + extraDays} <span className="text-lg font-normal text-gray-400">dias</span></p>
         </div>

         <button 
            onClick={finishOnboarding}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Finalizar e Começar
          </button>
      </div>
    </div>
  );
};