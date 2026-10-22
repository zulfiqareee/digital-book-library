import React from 'react';
import { Home, BookCopy, Search, BookmarkCheck, Shield, Settings } from 'lucide-react';

interface NavigationBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isAdmin: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentScreen, onNavigate, isAdmin }) => {
  const navItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'books', label: 'বইসমূহ', icon: BookCopy },
    { id: 'search', label: 'অনুসন্ধান', icon: Search },
    { id: 'library', label: 'লাইব্রেরি', icon: BookmarkCheck },
    { id: isAdmin ? 'admin-dashboard' : 'admin-login', label: 'অ্যাডমিন', icon: Shield },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || (item.id === 'books' && currentScreen === 'book-details');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition cursor-pointer relative ${
              isActive
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`px-4 py-1 rounded-full transition ${
                isActive ? 'bg-rose-500/15 text-rose-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
