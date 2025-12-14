import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserProfile, LEVELS, getTitleForGender } from '../types';
import { CheckCircle, XCircle, Trophy, ArrowRight, HelpCircle, Lock, Clock, Check, Star } from 'lucide-react';

interface QuizSectionProps {
  user: UserProfile;
  onQuizComplete: (levelIndex: number, success: boolean, score: number, xpEarned: number) => void;
}

// Helper to generate questions based on level
const getQuestionsForLevel = (levelIndex: number): QuizQuestion[] => {
  // Level 0: Anchor (Basics & Safety)
  const lvl0 = [
    { id: 1, question: "Qual a regra número 1 de segurança na piscina?", options: [{text: "Nunca nadar sozinho", isCorrect: true}, {text: "Usar touca bonita", isCorrect: false}, {text: "Comer antes de entrar", isCorrect: false}], explanation: "Segurança em primeiro lugar: nunca nade sem supervisão ou companhia." },
    { id: 2, question: "Para boiar de costas, o que deve ficar fora da água?", options: [{text: "Os pés", isCorrect: false}, {text: "O umbigo e o nariz", isCorrect: true}, {text: "Apenas as mãos", isCorrect: false}], explanation: "Estufar a barriga (umbigo) ajuda a flutuabilidade." },
    { id: 3, question: "O que fazer se sentir câimbra na água?", options: [{text: "Gritar e bater os braços", isCorrect: false}, {text: "Manter a calma, boiar e pedir ajuda", isCorrect: true}, {text: "Nadar mais rápido", isCorrect: false}], explanation: "O pânico é o maior inimigo. Boie e peça ajuda." },
    { id: 4, question: "Por onde devemos soltar o ar dentro da água?", options: [{text: "Pela boca e nariz", isCorrect: true}, {text: "Pelo ouvido", isCorrect: false}, {text: "Não se solta ar", isCorrect: false}], explanation: "A expiração contínua pelo nariz e boca evita a entrada de água." },
    { id: 5, question: "Qual acessório protege os olhos do cloro?", options: [{text: "Touca", isCorrect: false}, {text: "Óculos de natação", isCorrect: true}, {text: "Prancha", isCorrect: false}], explanation: "Óculos são essenciais para visibilidade e saúde dos olhos." },
  ];

  // Level 1: Puppy (Kick & Breath)
  const lvl1 = [
    { id: 1, question: "No nado Crawl, a perna deve estar:", options: [{text: "Dura como madeira", isCorrect: false}, {text: "Relaxada e estendida", isCorrect: true}, {text: "Dobrada 90 graus", isCorrect: false}], explanation: "Pernas muito dobradas ou rígidas geram arrasto." },
    { id: 2, question: "Qual a função da prancha nos treinos?", options: [{text: "Descansar a cabeça", isCorrect: false}, {text: "Isolar o treino de pernas", isCorrect: true}, {text: "Fazer sombra", isCorrect: false}], explanation: "A prancha ajuda a focar exclusivamente na técnica da pernada." },
    { id: 3, question: "O 'nado cachorrinho' é oficialmente chamado de:", options: [{text: "Não é um nado oficial", isCorrect: true}, {text: "Nado Canino", isCorrect: false}, {text: "Crawl Adaptado", isCorrect: false}], explanation: "É um nado de sobrevivência ou iniciação, não competitivo." },
    { id: 4, question: "Ao bater pernas, o movimento começa no:", options: [{text: "Joelho", isCorrect: false}, {text: "Quadril", isCorrect: true}, {text: "Pé", isCorrect: false}], explanation: "A força vem do quadril, como um chicote até o pé." },
    { id: 5, question: "Quanto tempo devemos esperar após comer muito para nadar intensamente?", options: [{text: "5 minutos", isCorrect: false}, {text: "Pelo menos 1 hora", isCorrect: true}, {text: "Não precisa esperar", isCorrect: false}], explanation: "A digestão requer sangue que seria usado pelos músculos." },
  ];

  // Level 2: Tadpole (Arms & Coordination)
  const lvl2 = [
    { id: 1, question: "No nado Crawl, como a mão entra na água?", options: [{text: "Com a palma virada para fora", isCorrect: false}, {text: "Primeiro os dedos, alinhado ao ombro", isCorrect: true}, {text: "Batendo forte na superfície", isCorrect: false}], explanation: "Entrada suave com os dedos corta a água e reduz resistência." },
    { id: 2, question: "O que é 'Streamline'?", options: [{text: "Uma marca de sunga", isCorrect: false}, {text: "Posição de flecha (hidrodinâmica)", isCorrect: true}, {text: "Um estilo de nado", isCorrect: false}], explanation: "Streamline é a posição mais hidrodinâmica possível: corpo reto, braços acima da cabeça." },
    { id: 3, question: "Quantas raias tem uma piscina olímpica oficial de competição?", options: [{text: "5", isCorrect: false}, {text: "8 ou 10", isCorrect: true}, {text: "20", isCorrect: false}], explanation: "Geralmente 10 raias, sendo as 2 laterais deixadas vazias para evitar marola." },
    { id: 4, question: "Quem é o maior medalhista olímpico da história?", options: [{text: "Michael Phelps", isCorrect: true}, {text: "Usain Bolt", isCorrect: false}, {text: "Larisa Latynina", isCorrect: false}], explanation: "Phelps tem 28 medalhas, sendo 23 de ouro." },
    { id: 5, question: "No nado peito, o movimento de braço se parece com um:", options: [{text: "Coração", isCorrect: true}, {text: "Quadrado", isCorrect: false}, {text: "Triângulo", isCorrect: false}], explanation: "Puxa, abre, fecha no meio e estica. Lembra o formato de um coração." },
  ];

  // Generic fallback for higher levels
  const genericHard = [
    { id: 1, question: "Qual a distância da prova de maratona aquática nas Olimpíadas?", options: [{text: "5km", isCorrect: false}, {text: "10km", isCorrect: true}, {text: "42km", isCorrect: false}], explanation: "A maratona aquática olímpica é de 10km em águas abertas." },
    { id: 2, question: "O que significa DQ na natação?", options: [{text: "Donut Quente", isCorrect: false}, {text: "Desclassificado (Disqualified)", isCorrect: true}, {text: "Deu Quase", isCorrect: false}], explanation: "DQ ocorre quando o nadador infringe uma regra técnica." },
    { id: 3, question: "Qual o único nado onde a saída é feita de dentro da água?", options: [{text: "Crawl", isCorrect: false}, {text: "Costas", isCorrect: true}, {text: "Borboleta", isCorrect: false}], explanation: "No nado de costas, os atletas seguram na barra de partida dentro da água." },
    { id: 4, question: "Em qual cidade Cesar Cielo bateu o recorde mundial dos 50m livre?", options: [{text: "Pequim", isCorrect: false}, {text: "São Paulo", isCorrect: true}, {text: "Roma", isCorrect: false}], explanation: "O recorde mundial de 20.91s foi batido em São Paulo, 2009 (embora o Ouro Olímpico tenha sido em Pequim)." },
    { id: 5, question: "Qual a temperatura média ideal de uma piscina de competição?", options: [{text: "15-18°C", isCorrect: false}, {text: "25-28°C", isCorrect: true}, {text: "32-35°C", isCorrect: false}], explanation: "Água muito quente causa exaustão, muito fria causa choque térmico." },
  ];

  if (levelIndex === 0) return lvl0;
  if (levelIndex === 1) return lvl1;
  if (levelIndex === 2) return lvl2;
  return genericHard.map(q => ({...q, question: `(Nível ${levelIndex}) ${q.question}`})); 
};

export const QuizSection: React.FC<QuizSectionProps> = ({ user, onQuizComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [viewState, setViewState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  // Logic to determine Level
  const currentLevelIndex = LEVELS.slice().reverse().findIndex(l => user.xp >= l.minXp);
  const realLevelIndex = LEVELS.length - 1 - (currentLevelIndex === -1 ? LEVELS.length - 1 : currentLevelIndex);
  
  const history = user.quizHistory?.[realLevelIndex] || { completed: false, lastAttemptDate: null, bestScore: 0 };
  const questions = getQuestionsForLevel(realLevelIndex);

  // Check cooldown
  const today = new Date().toISOString().split('T')[0];
  const isCooldown = history.lastAttemptDate === today && !history.completed;
  const isCompleted = history.completed;

  const handleStart = () => {
    setScore(0);
    setCurrentQuestionIdx(0);
    setViewState('playing');
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptionIdx(idx);
    setIsAnswered(true);

    const question = questions[currentQuestionIdx];
    if (question.options[idx].isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Score holds current correct answers.
    const finalScore = score;
    const xpEarned = finalScore * 20;
    const success = finalScore === questions.length;
    
    // Use the unified handler passed from App.tsx
    onQuizComplete(realLevelIndex, success, finalScore, xpEarned);

    setViewState('result');
  };

  // --- RENDERS ---

  // 1. Level Completed Screen
  if (isCompleted && viewState === 'intro') {
    return (
      <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="bg-green-100 p-6 rounded-full mb-6 animate-pulse">
           <CheckCircle className="text-green-600" size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nível Dominado!</h2>
        <p className="text-gray-600 mb-6">
          Você já provou que sabe tudo sobre o nível <span className="font-bold text-green-700">"{getTitleForGender(LEVELS[realLevelIndex], user.gender)}"</span>.
        </p>
        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm text-sm text-gray-500">
           Continue nadando e ganhe XP para desbloquear o Quiz do próximo nível!
        </div>
      </div>
    );
  }

  // 2. Cooldown Screen
  if (isCooldown && viewState === 'intro') {
    return (
      <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="bg-orange-100 p-6 rounded-full mb-6">
           <Clock className="text-orange-600" size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz em Intervalo</h2>
        <p className="text-gray-600 mb-6">
          Você já tentou o desafio de hoje. O aprendizado precisa de descanso (igual aos músculos).
        </p>
        <div className="bg-orange-50 text-orange-800 font-bold py-3 px-6 rounded-xl">
           Volte amanhã!
        </div>
      </div>
    );
  }

  // 3. Result Screen
  if (viewState === 'result') {
    const isSuccess = score === questions.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 max-w-sm w-full">
           {isSuccess ? (
             <Trophy className="mx-auto text-yellow-400 mb-4 animate-bounce" size={64} />
           ) : (
             <div className="mx-auto text-blue-400 mb-4 font-bold text-6xl">{score}/{questions.length}</div>
           )}
           
           <h2 className="text-2xl font-bold text-gray-800 mb-2">
             {isSuccess ? "Perfeito!" : "Bom esforço!"}
           </h2>
           
           <p className="text-gray-600 mb-6">
             {isSuccess 
               ? "Você dominou este nível e garantiu sua aprovação." 
               : "Você ganhou XP, mas precisa acertar todas para completar o nível. Tente de novo amanhã!"}
           </p>
           
           <div className="bg-blue-50 p-4 rounded-xl mb-6">
             <p className="text-sm text-blue-800 font-bold">XP Ganho: +{score * 20} XP</p>
           </div>

           <button 
             onClick={() => setViewState('intro')}
             className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
           >
             Voltar
           </button>
        </div>
      </div>
    );
  }

  // 4. Intro / Start Screen
  if (viewState === 'intro') {
    return (
      <div className="pb-24 pt-6 px-6 max-w-md mx-auto">
         <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Diário</h1>
         <p className="text-gray-500 mb-6 text-sm">Responda 5 perguntas para provar seu conhecimento e avançar.</p>

         <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <HelpCircle size={100} />
            </div>
            
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1 block">Nível Atual</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{getTitleForGender(LEVELS[realLevelIndex], user.gender)}</h2>
            
            <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Star size={18} className="text-yellow-400" />
                  <span>Acerte 5/5 para completar o nível</span>
               </div>
               <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Clock size={18} className="text-blue-400" />
                  <span>1 Tentativa por dia</span>
               </div>
               <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Trophy size={18} className="text-green-400" />
                  <span>Ganhe até 100 XP hoje</span>
               </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Começar Quiz <ArrowRight size={18} />
            </button>
         </div>
      </div>
    );
  }

  // 5. Playing Screen
  const question = questions[currentQuestionIdx];

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="text-blue-500" /> Pergunta {currentQuestionIdx + 1}
        </h1>
        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full border border-blue-200">
          {currentQuestionIdx + 1}/{questions.length}
        </span>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Text - Explicit Color */}
        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            let btnClass = "border-gray-200 bg-white hover:bg-gray-50";
            let icon = null;

            if (isAnswered) {
              if (opt.isCorrect) {
                btnClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                icon = <CheckCircle size={20} className="text-green-600" />;
              } else if (selectedOptionIdx === idx) {
                btnClass = "border-red-500 bg-red-50 ring-1 ring-red-500";
                icon = <XCircle size={20} className="text-red-500" />;
              } else {
                 btnClass = "border-gray-100 opacity-50 bg-gray-50";
              }
            } else if (selectedOptionIdx === idx) {
               btnClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 flex justify-between items-center transition-all ${btnClass}`}
              >
                {/* Option Text - Explicit Color */}
                <span className={`text-sm font-medium ${isAnswered && (opt.isCorrect || selectedOptionIdx === idx) ? 'text-gray-900' : 'text-gray-700'}`}>
                  {opt.text}
                </span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-900 mb-6 leading-relaxed">
              <strong className="block mb-1 text-yellow-700">Explicação:</strong> {question.explanation}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
            >
              {currentQuestionIdx < questions.length - 1 ? "Próxima Pergunta" : "Finalizar Quiz"} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};