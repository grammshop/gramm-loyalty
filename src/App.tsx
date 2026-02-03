import './i18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import RegisterForm from './components/RegisterForm';
import ThemeToggle from './components/ThemeToggle';
import { useAuth } from './components/AuthContext';
import LoginForm from './components/LoginForm';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-start to-theme-end flex justify-center items-center transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-start to-theme-end flex flex-col items-center transition-colors duration-500">
      <ThemeToggle />
      <LanguageSwitcher />

      {user && user.email && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-theme-glass px-6 py-3 rounded-full shadow-md z-50 backdrop-blur-md flex items-center border border-white/20">
          <span className="text-base font-bold text-theme-base tracking-wide">
            Bacania{' '}
            {user.email
              .split('@')[0]
              .split('.')
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
              .join(' ')}
          </span>
        </div>
      )}

      {!user ? (
        <LoginForm />
      ) : (
        <div className="w-full flex-1 flex flex-col items-center py-8">
          <RegisterForm />
        </div>
      )}
    </div>
  );
}

export default App;
