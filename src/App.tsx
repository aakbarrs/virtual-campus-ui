import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Attendance from './pages/Attendance';
import Meeting from './pages/Meeting';
import Grades from './pages/Grades';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

type Screen = 'login' | 'register' | 'dashboard' | 'schedule' | 'attendance' | 'meeting' | 'grades' | 'profile' | 'settings';

const tabs: { id: Screen; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Beranda', icon: '🏠' },
  { id: 'schedule', label: 'Jadwal', icon: '📅' },
  { id: 'attendance', label: 'Absensi', icon: '📋' },
  { id: 'meeting', label: 'Meeting', icon: '📹' },
  { id: 'grades', label: 'Nilai', icon: '📊' },
  { id: 'profile', label: 'Profil', icon: '👤' },
  { id: 'settings', label: 'Lainnya', icon: '⚙️' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  const renderScreen = () => {
    switch (screen) {
      case 'login': return <Login onNav={s => setScreen(s)} />;
      case 'register': return <Register onNav={s => setScreen(s)} />;
      case 'dashboard': return <Dashboard />;
      case 'schedule': return <Schedule />;
      case 'attendance': return <Attendance />;
      case 'meeting': return <Meeting />;
      case 'grades': return <Grades />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
    }
  };

  const isAuth = screen === 'login' || screen === 'register';

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">Virtual Campus</span>
        {!isAuth && (
          <span className="app-user" onClick={() => setScreen('settings')}>
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>
          </span>
        )}
      </header>

      <main className="app-main">
        {renderScreen()}
      </main>

      {!isAuth && (
        <nav className="app-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab ${screen === t.id ? 'active' : ''}`}
              onClick={() => setScreen(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
