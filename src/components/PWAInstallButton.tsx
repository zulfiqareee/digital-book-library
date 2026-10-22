import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

interface PWAInstallButtonProps {
  onOpenGuide: () => void;
  variant?: 'topbar' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenGuide, variant = 'topbar' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed in standalone mode, display subtle verified indicator or null
  if (isInstalled && variant === 'topbar') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>ইনস্টল্ড অ্যাপ</span>
      </span>
    );
  }

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // If ambient prompt not ready, open guide with step-by-step instructions
      onOpenGuide();
    }
  };

  if (variant === 'settings') {
    return (
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4" />
          <div className="text-left">
            <span>অ্যান্ড্রয়েড ফোনে অ্যাপটি ইনস্টল করুন (PWA)</span>
            <span className="block text-[10px] text-pink-100 font-normal">
              হোমস্ক্রিনে যুক্ত করুন এবং ফুল-স্ক্রিন মোডে বই পড়ুন
            </span>
          </div>
        </div>
        <Download className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalling}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition cursor-pointer shrink-0"
      title="অ্যান্ড্রয়েড ফোনে অ্যাপ হিসেবে ইনস্টল করুন"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">অ্যাপ ইনস্টল করুন</span>
      <span className="sm:hidden">ইনস্টল</span>
    </button>
  );
};
