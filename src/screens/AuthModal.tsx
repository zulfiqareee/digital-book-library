import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isAdminEmail = email.toLowerCase().trim() === 'zulfiqar1hasan@gmail.com';

    onLogin({
      userId: `user-${Date.now().toString(36)}`,
      email: email.trim(),
      displayName: displayName.trim() || email.split('@')[0],
      role: isAdminEmail ? 'admin' : 'reader',
      isLoggedIn: true,
    });
    onClose();
  };

  const handleQuickDemoLogin = (role: 'reader' | 'admin') => {
    if (role === 'admin') {
      onLogin({
        userId: 'admin-verified-id',
        email: 'zulfiqar1hasan@gmail.com',
        displayName: 'Zulfiqar Hasan (Admin)',
        role: 'admin',
        isLoggedIn: true,
      });
    } else {
      onLogin({
        userId: 'demo-user-1',
        email: 'reader@example.bd',
        displayName: 'নিয়মিত পাঠক',
        role: 'reader',
        isLoggedIn: true,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base">
              {isRegister ? 'নতুন অ্যাকাউন্ট খুলুন' : 'লগইন করুন'}
            </h3>
            <p className="text-[11px] text-slate-400">
              ডিজিটাল বই লাইব্রেরি বাংলাদেশ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="mb-4 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            এক ক্লিকে ডেমো প্রবেশ:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('reader')}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>সাধারণ পাঠক</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-amber-300 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>অ্যাডমিন একাউন্ট</span>
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">অথবা ইমেইল দিয়ে</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">আপনার নাম</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="উদাঃ সাকিব আহমেদ"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">ইমেইল ঠিকানা</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer mt-2"
          >
            {isRegister ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
          </button>
        </form>

        {/* Switch Between Register and Login */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                লগইন করুন
              </button>
            </span>
          ) : (
            <span>
              নতুন পাঠক?{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                বিনামূল্যে রেজিস্টার করুন
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
