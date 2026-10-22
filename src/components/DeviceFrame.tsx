import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export type DeviceMode = 'full' | 'phone' | 'tablet';

interface DeviceFrameProps {
  deviceMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ deviceMode, onModeChange, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      {/* Device Mode Switcher Floating Bar */}
      <div className="fixed top-2 z-40 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-1 text-xs">
        <span className="text-slate-400 font-medium mr-1.5 hidden sm:inline">ডিসপ্লে মোড:</span>
        <button
          onClick={() => onModeChange('phone')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition cursor-pointer ${
            deviceMode === 'phone'
              ? 'bg-rose-600 text-white shadow-sm font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Pixel 8 Phone Mode"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>মোবাইল</span>
        </button>
        <button
          onClick={() => onModeChange('tablet')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition cursor-pointer ${
            deviceMode === 'tablet'
              ? 'bg-rose-600 text-white shadow-sm font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Pixel Tablet Mode"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>ট্যাবলেট</span>
        </button>
        <button
          onClick={() => onModeChange('full')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition cursor-pointer ${
            deviceMode === 'full'
              ? 'bg-rose-600 text-white shadow-sm font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Full Responsive Web Mode"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>ফুল স্ক্রিন</span>
        </button>
      </div>

      {/* Main Container based on mode */}
      <div className="w-full flex-1 flex justify-center pt-10 sm:pt-12 pb-6">
        {deviceMode === 'phone' && (
          <div className="w-full max-w-[412px] min-h-[860px] bg-slate-900 rounded-[38px] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative my-auto">
            {/* Camera notch simulation */}
            <div className="w-full flex justify-center pt-2 pb-1 bg-slate-900">
              <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800" />
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
              {children}
            </div>
            {/* Gesture bar */}
            <div className="w-full py-2 flex justify-center bg-slate-900">
              <div className="w-32 h-1 rounded-full bg-slate-700" />
            </div>
          </div>
        )}

        {deviceMode === 'tablet' && (
          <div className="w-full max-w-[900px] min-h-[720px] bg-slate-900 rounded-[28px] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative my-auto">
            <div className="flex-1 overflow-y-auto flex flex-col">
              {children}
            </div>
            {/* Gesture bar */}
            <div className="w-full py-2 flex justify-center bg-slate-900">
              <div className="w-40 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
        )}

        {deviceMode === 'full' && (
          <div className="w-full min-h-screen flex flex-col">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
