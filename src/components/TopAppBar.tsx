import React from 'react';
import { BookOpen, Search, User, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopAppBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user: UserSession;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenInstallGuide: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenAuth,
  onOpenAdmin,
  onOpenInstallGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
      {/* Brand Title */}
      <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2.5 cursor-pointer group shrink-0"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white">ডিজিটাল বই লাইব্রেরি</span>
            <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded hidden xs:inline-block">
              বাংলাদেশ
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            বিনামূল্যে পড়ুন • বিকাশে ডাউনলোড করুন
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* PWA In-App Install Button */}
        <PWAInstallButton onOpenGuide={onOpenInstallGuide} variant="topbar" />

        {/* Search quick button */}
        <button
          onClick={() => onNavigate('search')}
          className={`p-2 rounded-xl border transition cursor-pointer ${
            currentScreen === 'search'
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="বই খুঁজুন"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* User Account / Profile */}
        <button
          onClick={onOpenAuth}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
            user.isLoggedIn
              ? 'bg-slate-800 border-slate-700 text-emerald-400'
              : 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500 shadow-sm'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span className="max-w-[70px] sm:max-w-[100px] truncate">
            {user.isLoggedIn ? user.displayName.split(' ')[0] : 'লগইন'}
          </span>
        </button>

        {/* Admin Access Indicator */}
        <button
          onClick={onOpenAdmin}
          className={`p-2 rounded-xl border transition cursor-pointer ${
            user.role === 'admin'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-amber-400'
          }`}
          title="প্রশাসক কন্ট্রোল"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
