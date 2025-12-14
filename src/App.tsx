import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { TrainingLog } from './components/TrainingLog';
import { Progress } from './components/Progress';
import { Profile } from './components/Profile';
import { QuizSection } from './components/QuizSection';
import { Navigation } from './components/Navigation';
import { UserProfile, SwimSession, AppView, LEVELS, getTitleForGender } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SwimSession[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);

  useEffect(() => {
    const storedUser = localStorage.getItem('swimevo_user');
    const storedSessions = localStorage.getItem('swimevo_sessions');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure quizHistory exists for old users
      if (!parsedUser.quizHistory) parsedUser.quizHistory = {};
      setUser(parsedUser);
      setCurrentView(AppView.DASHBOARD);
    }
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('swimevo_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('swimevo_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleEarnXp = (amount: number) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const level = LEVELS.slice().reverse().find(l => newXp >= l.minXp) || LEVELS[0];
    const title = getTitleForGender(level, user.gender);

    setUser({
        ...user,
        xp: newXp,
        levelTitle: title
    });
  };

  // Unified handler to prevent state race conditions
  const handleQuizComplete = (levelIndex: number, success: boolean, score: number, xpEarned: number) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate new XP
    const newXp = user.xp + xpEarned;
    const level = LEVELS.slice().reverse().find(l => newXp >= l.minXp) || LEVELS[0];
    const title = getTitleForGender(level, user.gender);

    // Update History
    const newHistory = {
      ...user.quizHistory,
      [levelIndex]: {
        completed: success, 
        lastAttemptDate: today,
        bestScore: Math.max(score, user.quizHistory[levelIndex]?.bestScore || 0)
      }
    };

    // Single State Update
    setUser({
      ...user,
      xp: newXp,
      levelTitle: title,
      quizHistory: newHistory
    });
  };

  const handleSaveSession = (newSession: SwimSession, xpGained: number) => {
    setSessions(prev => [...prev, newSession]);
    handleEarnXp(xpGained);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleReset = () => {
    if(confirm("Tem certeza? Isso apagará todo seu histórico.")){
        localStorage.clear();
        window.location.reload();
    }
  };

  if (!user || currentView === AppView.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} setView={setCurrentView} />;
      case AppView.LOG_SWIM:
        return (
          <TrainingLog 
            user={user} 
            onSaveSession={handleSaveSession} 
            onCancel={() => setCurrentView(AppView.DASHBOARD)} 
          />
        );
      case AppView.QUIZ:
        return <QuizSection user={user} onQuizComplete={handleQuizComplete} />;
      case AppView.PROGRESS:
        return <Progress sessions={sessions} user={user} />;
      case AppView.PROFILE:
        return <Profile user={user} onReset={handleReset} />;
      default:
        return <Dashboard user={user} setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/30">
      {renderView()}
      {currentView !== AppView.LOG_SWIM && (
        <Navigation currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
