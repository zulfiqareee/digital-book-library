import React from 'react';
import { Settings, Globe, Moon, ShieldCheck, Server, Key, LogOut, Smartphone, Download } from 'lucide-react';
import { UserSession, BackendStatus } from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface SettingsScreenProps {
  user: UserSession;
  status: BackendStatus | null;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  onOpenInstallGuide: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  status,
  onLogout,
  onNavigate,
  onOpenInstallGuide,
}) => {
  return (
    <div className="pb-16 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-rose-500" />
          <span>অ্যাপ সেটিংস (Settings)</span>
        </h1>
        <p className="text-xs text-slate-400">
          ভাষা, প্রদর্শনী এবং সার্ভার ও গেটওয়ে কনফিগারেশন
        </p>
      </div>

      {/* Install PWA Prompt Box */}
      <div className="bg-slate-800/90 border border-rose-500/30 rounded-2xl p-4 space-y-2">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4" />
          <span>অ্যান্ড্রয়েড ফোন অ্যাপ ইনস্টলেশন (PWA)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          কোনো প্লে-স্টোর ফাইল ছাড়াই ব্রাউজার থেকে সরাসরি আপনার ফোনের হোমস্ক্রিনে ফুল-স্ক্রিন অ্যাপ হিসেবে ইনস্টল করুন।
        </p>
        <div className="pt-1">
          <PWAInstallButton onOpenGuide={onOpenInstallGuide} variant="settings" />
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ব্যবহারকারী অ্যাকাউন্ট</h3>
        {user.isLoggedIn ? (
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white text-sm">{user.displayName}</p>
              <p className="text-slate-400">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                রোল: {user.role === 'admin' ? 'প্রশাসক (Admin)' : 'সাধারণ পাঠক (Reader)'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-rose-300 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400">আপনি বর্তমানে অতিথি (Guest) হিসেবে ব্রাউজ করছেন।</p>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
        <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">পছন্দসমূহ</h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>অ্যাপের প্রধান ভাষা</span>
          </div>
          <span className="font-bold text-white">বাংলা (Bangla First)</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-rose-400" />
            <span>থিম ইন্টারফেস</span>
          </div>
          <span className="font-bold text-white">Material 3 ডার্ক</span>
        </div>
      </div>

      {/* Backend & Diagnostics */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3 text-xs">
        <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          <span>সার্ভার ও এপিআই ডায়াগনস্টিকস</span>
        </h3>

        <div className="space-y-2 text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-700/40">
            <span className="text-slate-400">অ্যাপ্লিকেশন স্ট্যাটাস:</span>
            <span className="text-emerald-400 font-bold">অনলাইন (Vite + Express PWA)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-700/40">
            <span className="text-slate-400">PWA সার্ভিস ওয়ার্কার:</span>
            <span className="text-emerald-400 font-bold">সক্রিয় (Service Worker Active)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-700/40">
            <span className="text-slate-400">bKash গেটওয়ে:</span>
            <span className="text-rose-400 font-mono">
              {status?.bkash?.isConfigured ? 'Live Merchant Mode' : 'Sandbox Simulated Engine'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-700/40">
            <span className="text-slate-400">Firebase Firestore:</span>
            <span className="text-slate-300 font-mono">
              {status?.firebase?.isConfigured ? 'Connected' : 'Schema & Rules Configured (Ready to Provision)'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">পিডিএফ ক্যাশ সুরক্ষা:</span>
            <span className="text-emerald-400 font-semibold">নিরাপদ (প্রাইভেট পিডিএফ অফলাইনে ক্যাশ হয় না)</span>
          </div>
        </div>
      </div>

      {/* Links to legal screens */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-400 justify-center">
        <button
          onClick={() => onNavigate('about')}
          className="hover:text-rose-400 transition underline cursor-pointer"
        >
          আমাদের সম্পর্কে
        </button>
        <span>•</span>
        <button
          onClick={() => onNavigate('contact')}
          className="hover:text-rose-400 transition underline cursor-pointer"
        >
          যোগাযোগ
        </button>
        <span>•</span>
        <button
          onClick={() => onNavigate('privacy')}
          className="hover:text-rose-400 transition underline cursor-pointer"
        >
          গোপনীয়তা নীতি
        </button>
        <span>•</span>
        <button
          onClick={() => onNavigate('terms')}
          className="hover:text-rose-400 transition underline cursor-pointer"
        >
          ব্যবহারের শর্তাবলী
        </button>
      </div>
    </div>
  );
};
