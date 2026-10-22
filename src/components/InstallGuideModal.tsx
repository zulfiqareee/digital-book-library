import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Info,
  CreditCard,
  Globe,
  AlertTriangle,
  Server
} from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'free' | 'pwa' | 'apk'>('free');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-950">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                বিনা খরচে অ্যান্ড্রয়েড ফোনে ইনস্টল ও ডিপ্লয়মেন্ট গাইড
              </h2>
              <p className="text-xs text-slate-400">
                Google Cloud Billing ছাড়া সম্পূর্ণ ফ্রিতে অ্যাপ চালানোর সমাধান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Banner explaining "No billing setup" */}
        <div className="bg-amber-500/10 p-3.5 border-b border-amber-500/20 px-5 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">কেন AI Studio-র "Publish" প্যানেলে Billing চাইছে?</strong><br />
            Google AI Studio-র <span className="font-semibold text-amber-300">"Publish"</span> বাটনটি Google Cloud Run-এ কাস্টম প্রোডাকশন ডেডিকেটেড ক্লাউড প্রজেক্ট তৈরি করার চেষ্টা করে, যার জন্য গুগল ক্লাউডে ক্রেডিট কার্ড বা বিলিং অ্যাকাউন্ট বাধ্যতামূলক।{' '}
            <span className="text-emerald-300 font-semibold underline">
              কিন্তু আপনার এই ডিজিটাল লাইব্রেরি প্রজেক্টটি চালানোর জন্য গুগলকে কোনো টাকা বা বিলিং দেওয়ার প্রয়োজন নেই!
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 pt-2 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('free')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'free'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>১. সম্পূর্ণ ফ্রি ক্লাউড হোস্টিং (Render / Vercel)</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>২. ফোনে PWA ইনস্টল পদ্ধতি</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2.5 px-3.5 font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'apk'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>৩. নেটিভ APK বিল্ড (Android Studio)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm text-slate-300">
          {activeTab === 'free' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>কোনো ক্রেডিট কার্ড ছাড়া ১০০% ফ্রি পাবলিক HTTPS লিঙ্ক পাওয়ার পদ্ধতি</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  আমরা প্রজেক্টটিতে ইতিমধ্যে <code className="text-emerald-400 font-mono">render.yaml</code> এবং{' '}
                  <code className="text-emerald-400 font-mono">vercel.json</code> কনফিগার করে রেখেছি। নিচের যেকোনো একটি ফ্রি প্ল্যাটফর্মে ডিপ্লয় করলেই স্থায়ী পাবলিক HTTPS লিংক পেয়ে যাবেন:
                </p>
              </div>

              {/* Option A: Render.com (Recommended for Fullstack Node/Express + React) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <Server className="w-4 h-4 text-rose-500" />
                    <span>পদ্ধতি ক: Render.com (ফুল-স্ট্যাক Node + React এর জন্য সেরা)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    ১০০% ফ্রি • নো ক্রেডিট কার্ড
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-2 pl-1 text-xs text-slate-300 leading-relaxed">
                  <li>
                    GitHub-এ বিনামূল্যে একটি রিপোজিটরি তৈরি করে এই কোডগুলো আপলোড করুন (অথবা ডাউনলোড করে নিন)।
                  </li>
                  <li>
                    <a href="https://render.com" target="_blank" rel="noreferrer" className="text-rose-400 underline font-semibold">
                      Render.com
                    </a>{' '}
                    -এ ফ্রি সাইন-আপ করুন (GitHub দিয়ে ১ ক্লিকে)।
                  </li>
                  <li>
                    <strong>New + → Web Service</strong> নির্বাচন করে আপনার GitHub রিপোজিটরি কানেক্ট করুন।
                  </li>
                  <li>
                    Render স্বয়ংক্রিয়ভাবে প্রজেক্টের <code className="text-emerald-400 font-mono">render.yaml</code> ফাইলটি শনাক্ত করবে।
                  </li>
                  <li>
                    <strong>Create Web Service</strong> চাপলেই ২ মিনিটে আপনার একটি স্থায়ী পাবলিক লিংক (যেমন:{' '}
                    <code className="text-rose-300 font-mono">https://digital-book-library.onrender.com</code>) তৈরি হবে।
                  </li>
                </ol>
              </div>

              {/* Option B: Vercel */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>পদ্ধতি খ: Vercel (দ্রুততম গ্লোবাল সিডিএন)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    ১০০% ফ্রি • ১ ক্লিকে রেডি
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-2 pl-1 text-xs text-slate-300 leading-relaxed">
                  <li>
                    <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">
                      Vercel.com
                    </a>{' '}
                    -এ ফ্রি অ্যাকাউন্ট খুলুন।
                  </li>
                  <li>
                    <strong>Import Project</strong> এ ক্লিক করে GitHub রিপোটি সিলেক্ট করুন।
                  </li>
                  <li>
                    <strong>Deploy</strong> বাটনে চাপ দিন। স্বয়ংক্রিয়ভাবে <code className="text-emerald-400 font-mono">https://your-app.vercel.app</code> লাইভ হয়ে যাবে।
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
                ✓ Render বা Vercel লিংক তৈরি হওয়ার পর সেই লিংকে ফোনে গিয়ে Chrome থেকে ১ ক্লিকে <strong>"Install App"</strong> চাপলেই আপনার ফোনে ফুল-স্ক্রিন PWA হিসেবে ইনস্টল হয়ে যাবে!
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              {isInstallable && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">ব্রাউজার ইনস্টল প্রস্তুত!</h4>
                    <p className="text-xs text-slate-400">সরাসরি নিচের বাটনে ক্লিক করে ফোনে যুক্ত করুন।</p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>এখনই ইনস্টল করুন</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs">অ্যান্ড্রয়েড ফোনে Chrome ব্রাউজারে ইনস্টল করার নিয়ম:</h4>
                <ol className="list-decimal list-inside space-y-2 pl-1 text-xs text-slate-300 leading-relaxed">
                  <li>
                    আপনার ডিপ্লয় করা পাবলিক HTTPS লিংক (যেমন Render বা Vercel URL) অ্যান্ড্রয়েড ফোনের <strong>Google Chrome</strong> ব্রাউজারে ওপেন করুন।
                  </li>
                  <li>
                    স্ক্রিনের নিচে সরাসরি <strong>"Add Digital Book Library to Home screen"</strong> বা <strong>"Install app"</strong> নোটিফিকেশন আসবে।
                  </li>
                  <li>
                    নোটিফিকেশন না আসলে Chrome-এর ডানদিকের <strong>তিনটি ডট মেনু (⋮)</strong> চাপুন।
                  </li>
                  <li>
                    মেনু থেকে <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> অপশনে ট্যাপ করুন।
                  </li>
                  <li>
                    কয়েক সেকেন্ডের মধ্যে আপনার ফোনের হোমস্ক্রিনে বাংলা আইকনসহ <strong>"বই লাইব্রেরি"</strong> অ্যাপ যুক্ত হবে।
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">কম্পিউটারে Android Studio দিয়ে APK বিল্ড:</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  প্রজেক্টের <code className="text-rose-400 font-mono">/android</code> ফোল্ডারে Kotlin ও Jetpack Compose কোড প্রস্তুত রয়েছে:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-xs text-slate-300">
                  <li>কম্পিউটারে Android Studio ওপেন করুন এবং <code className="text-rose-400 font-mono">/android</code> ফোল্ডারটি ওপেন করুন।</li>
                  <li>মেনু থেকে <strong>Build → Build Bundle(s) / APK(s) → Build APK(s)</strong> চাপুন।</li>
                  <li><code className="text-emerald-400 font-mono">app/build/outputs/apk/debug/app-debug.apk</code> ফাইলটি সরাসরি ফোনে পাঠিয়ে ইনস্টল করুন।</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">কোনো ক্লাউড বিলিং ছাড়াই শতভাগ কার্যকর</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
