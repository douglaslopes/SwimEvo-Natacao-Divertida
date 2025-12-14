export type Gender = 'male' | 'female' | 'non-binary' | 'gender-fluid' | 'agender' | 'other';

export interface QuizHistory {
  [levelIndex: number]: {
    completed: boolean;
    lastAttemptDate: string | null; // ISO Date string YYYY-MM-DD
    bestScore: number;
  };
}

export interface UserProfile {
  name: string;
  gender: Gender;
  xp: number;
  levelTitle: string;
  onboardingCompleted: boolean;
  weeklyGoal: number; // days per week
  streak: number;
  quizHistory: QuizHistory;
}

export interface SwimSession {
  id: string;
  date: string;
  durationMinutes: number;
  feeling: 'great' | 'good' | 'hard' | 'exhausted';
  notes: string;
  aiFeedback?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  LOG_SWIM = 'LOG_SWIM',
  PROGRESS = 'PROGRESS',
  PROFILE = 'PROFILE',
  QUIZ = 'QUIZ'
}

export const LEVELS = [
  { minXp: 0, male: "Ancora de Navio", female: "Ancora de Navio", neutral: "Ancora de Navio", desc: "Você afunda com estilo." },
  { minXp: 100, male: "Cachorrinho Molhado", female: "Cachorrinho Molhado", neutral: "Cachorrinho Molhado", desc: "Mantendo a cabeça fora d'água, quase lá." },
  { minXp: 300, male: "Girino Confuso", female: "Girino Confuso", neutral: "Girino em Evolução", desc: "Muitos movimentos, pouco deslocamento." },
  { minXp: 600, male: "Peixinho Dourado", female: "Peixinho Dourado", neutral: "Peixinho Dourado", desc: "Nado gracioso, mas memória curta dos treinos." },
  { minXp: 1000, male: "Tartaruga Ninja", female: "Tartaruga Ninja", neutral: "Tartaruga Ninja", desc: "Lento mas constante (e adora pizza pós-treino)." },
  { minXp: 1500, male: "Tubarão de Aquário", female: "Tubarão de Aquário", neutral: "Tubarão de Aquário", desc: "Impõe respeito na piscina infantil." },
  { minXp: 2500, male: "Golfinho em Treinamento", female: "Golfinho em Treinamento", neutral: "Golfinho em Treinamento", desc: "Inteligente e ágil." },
  { minXp: 4000, male: "Sereio", female: "Sereia", neutral: "Ser Aquático Místico", desc: "Metade humano, metade peixe." },
  { minXp: 6000, male: "Cesar Cielo", female: "Katie Ledecky", neutral: "Lenda Olímpica", desc: "Lenda das piscinas." },
];

export const getTitleForGender = (level: typeof LEVELS[0], gender: Gender) => {
  if (gender === 'male') return level.male;
  if (gender === 'female') return level.female;
  return level.neutral;
};