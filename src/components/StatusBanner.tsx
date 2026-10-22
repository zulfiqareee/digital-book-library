import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, ChevronDown, ChevronUp, Server, Smartphone, Key, Download } from 'lucide-react';
import { BackendStatus } from '../types';

interface StatusBannerProps {
  status: BackendStatus | null;
  onRefresh: () => void;
  onOpenAndroidCode: () => void;
  onOpenInstallGuide: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  onRefresh,
  onOpenAndroidCode,
  onOpenInstallGuide,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isBkashReady = status?.bkash?.isConfigured ?? false;
  const isFirebaseReady = status?.firebase?.isConfigured ?? false;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
            ডেমো প্রিভিউ মোড (Preview Sandbox)
          </span>
          <span className="text-slate-400 hidden sm:inline">
            মূল নীতি: <strong className="text-emerald-400">অনলাইনে বিনামূল্যে পড়ুন</strong>, মূল পিডিএফ ডাউনলোড করতে বিকাশ দিয়ে পেমেন্ট করুন।
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* bKash Status Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isBkashReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span>bKash: {isBkashReady ? 'লাইভ গেটওয়ে' : 'স্যান্ডবক্স টেস্ট মোড'}</span>
          </div>

          {/* Install on Android Button */}
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-medium transition cursor-pointer shadow-sm"
            title="Install app on Android phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ফোনে ইনস্টল নির্দেশিকা</span>
          </button>

          {/* Android Jetpack Code Button */}
          <button
            onClick={onOpenAndroidCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
            title="View Kotlin & Jetpack Compose Android code"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Android সোর্স</span>
          </button>

          {/* Details Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition px-1.5 py-0.5 cursor-pointer"
          >
            <span>কনফিগ বিবরণ</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 transition-all">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            {/* bKash Details */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 font-medium text-rose-400">
                <Key className="w-4 h-4" />
                <span>bKash মার্চেন্ট এপিআই স্ট্যাটাস</span>
              </div>
              <p className="text-slate-400 mb-2 leading-relaxed">
                {isBkashReady
                  ? 'লাইভ বিকাশ মার্চেন্ট ক্রেডেনশিয়াল সক্রিয় রয়েছে।'
                  : 'সার্ভারে লাইভ বিকাশ মার্চেন্ট কি এখনো যুক্ত হয়নি। সিস্টেমটি নিরাপদে অফিসিয়াল bKash স্যান্ডবক্স টেস্ট মোডে চলছে।'}
              </p>
              <div className="text-[11px] font-mono bg-black/40 p-2 rounded text-slate-400 overflow-x-auto">
                BKASH_APP_KEY="your_key"<br/>
                BKASH_APP_SECRET="your_secret"<br/>
                BKASH_USERNAME="your_username"<br/>
                BKASH_PASSWORD="your_password"
              </div>
            </div>

            {/* Firebase Details */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 font-medium text-amber-400">
                <Server className="w-4 h-4" />
                <span>Firebase ও Firestore স্ট্যাটাস</span>
              </div>
              <p className="text-slate-400 mb-2 leading-relaxed">
                {isFirebaseReady
                  ? `ফায়ারবেস সফলভাবে সংযুক্ত: ${status?.firebase.projectId}`
                  : 'ফায়ারবেস ক্লাউড স্টোরেজ ও অথেনটিকেশন কানেকশনের জন্য প্রস্তুত। `firestore.rules` ও `firebase-blueprint.json` তৈরি আছে।'}
              </p>
              <p className="text-[11px] text-slate-500">
                Firebase সক্রিয় করতে AI Studio-র প্রম্পটে "Enable Firebase" লিখুন অথবা প্রম্পট টুল ব্যবহার করুন।
              </p>
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 font-medium text-emerald-400">
                <ShieldAlert className="w-4 h-4" />
                <span>নিরাপদ ডাউনলোড সুরক্ষা নীতি</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>বিনামূল্যে অনলাইন পড়ার জন্য আসল PDF লিঙ্ক কখনোই এক্সপোজ হয় না।</li>
                <li>বিকাশে যাচাইকৃত অর্ডার না থাকলে মূল পিডিএফ ডাউনলোড অবরুদ্ধ।</li>
                <li>যাচাইকৃত পেমেন্টের পর ৫ মিনিটের জন্য ক্রিপ্টোগ্রাফিক টাইমড টোকেন প্রদান করা হয়।</li>
                <li>সার্ভিস ওয়ার্কার কখনোই সংবেদনশীল পেমেন্ট বা প্রাইভেট পিডিএফ ক্যাশ করে না।</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
