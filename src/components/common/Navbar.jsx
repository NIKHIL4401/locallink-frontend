import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiBell, FiMessageSquare, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-wider bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent">
        LocalLink
      </Link>

      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-xl glass-card text-xl text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <button className="p-2 rounded-xl glass-card text-xl text-slate-600 dark:text-slate-300 relative hover:text-brand-500">
          <FiBell />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <button className="p-2 rounded-xl glass-card text-xl text-slate-600 dark:text-slate-300 hover:text-brand-500">
          <FiMessageSquare />
        </button>
        <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
            <FiUser />
          </div>
        </div>
      </div>
    </nav>
  );
}