import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  Download,
  ListFilter,
  Sun,
  Moon,
  Coffee,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Book } from '../types';
import { toBengaliNumber } from '../components/BengaliUtils';

interface PdfReaderScreenProps {
  book: Book;
  onBack: () => void;
  onBuyBook: (book: Book) => void;
}

export const PdfReaderScreen: React.FC<PdfReaderScreenProps> = ({ book, onBack, onBuyBook }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [showToc, setShowToc] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const totalPages = book.samplePages?.length || 4;

  // Fetch server-rendered page data from protected endpoint (Does not expose original PDF URL!)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/reader/${book.id}/page/${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setPageData(data.pageContent);
        }
      })
      .catch((err) => {
        console.error('Reader page fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [book.id, currentPage]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const currentSample = book.samplePages?.find((p) => p.pageNumber === currentPage);

  // Theme styling
  const themeClasses = {
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    sepia: 'bg-[#f4ecd8] text-[#433422] border-[#e2d5bc]',
    light: 'bg-white text-slate-900 border-slate-200'
  };

  return (
    <div className={`flex flex-col min-h-screen ${isFullscreen ? 'fixed inset-0 z-50' : 'pb-16'}`}>
      {/* Top Reader Controls Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white line-clamp-1 max-w-[200px] sm:max-w-md">
              {book.titleBn}
            </h2>
            <p className="text-[10px] text-emerald-400 font-medium">
              সুরক্ষিত ফ্রি রিডার • কোনো মূল ফাইল ইউআরএল প্রকাশ হয় না
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Table of contents toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition cursor-pointer"
            title="সূচিপত্র"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">সূচিপত্র</span>
          </button>

          {/* Reading theme switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setReadingTheme('dark')}
              className={`p-1 rounded transition cursor-pointer ${readingTheme === 'dark' ? 'bg-slate-700 text-rose-400' : 'text-slate-400'}`}
              title="রাত মোড"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`p-1 rounded transition cursor-pointer ${readingTheme === 'sepia' ? 'bg-amber-100 text-amber-900' : 'text-slate-400'}`}
              title="সেপিয়া মোড"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('light')}
              className={`p-1 rounded transition cursor-pointer ${readingTheme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
              title="দিন মোড"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-1.5 py-0.5 text-xs text-slate-300">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              disabled={zoomLevel <= 75}
              className="p-1 disabled:opacity-30 cursor-pointer"
              title="জুম আউট"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono min-w-[32px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(175, z + 15))}
              disabled={zoomLevel >= 175}
              className="p-1 disabled:opacity-30 cursor-pointer"
              title="জুম ইন"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer hidden xs:flex"
            title="ফুলস্ক্রিন"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Buy PDF quick action */}
          <button
            onClick={() => onBuyBook(book)}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            title="মূল এইচডি পিডিএফ সংগ্রহ করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">পিডিএফ কিনুন</span>
          </button>
        </div>
      </div>

      {/* Main Reader Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto shrink-0 z-10 animate-in slide-in-from-left duration-150">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">সূচিপত্র</span>
              <button
                onClick={() => setShowToc(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                বন্ধ
              </button>
            </div>
            <div className="space-y-1">
              {book.samplePages?.map((p) => (
                <button
                  key={p.pageNumber}
                  onClick={() => {
                    setCurrentPage(p.pageNumber);
                    setShowToc(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                    currentPage === p.pageNumber
                      ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">{p.chapterBn || `পৃষ্ঠা ${p.pageNumber}`}</div>
                  <div className="truncate">{p.titleBn}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reader Document Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/80">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-2xl min-h-[680px] p-8 sm:p-12 rounded-2xl shadow-2xl border transition-all duration-150 flex flex-col justify-between ${
              themeClasses[readingTheme]
            }`}
          >
            {/* Page Header */}
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-6 text-xs opacity-70">
                <span className="font-semibold">{book.titleBn}</span>
                <span>{book.authorBn}</span>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs opacity-60">পৃষ্ঠা রেন্ডার হচ্ছে...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageData?.chapterBn && (
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-500">
                      {pageData.chapterBn}
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {pageData?.titleBn || currentSample?.titleBn}
                  </h3>

                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-justify pt-2 font-serif">
                    {pageData?.contentBn || currentSample?.contentBn}
                  </div>
                </div>
              )}
            </div>

            {/* Page Footer */}
            <div className="pt-8 border-t mt-8 flex items-center justify-between text-xs opacity-70">
              <span className="text-[10px]">ডিজিটাল বুক লাইব্রেরি বাংলাদেশ • ফ্রি অনলাইন সংস্করণ</span>
              <span className="font-mono font-bold">
                পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page Navigation Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 sticky bottom-0 z-20">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-medium transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>পূর্ববর্তী</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">পৃষ্ঠা</span>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {toBengaliNumber(num)}
              </option>
            ))}
          </select>
          <span className="text-slate-400">এর {toBengaliNumber(totalPages)}</span>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-medium transition cursor-pointer"
        >
          <span>পরবর্তী</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Security note banner */}
      <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>
          সার্ভার-সুরক্ষিত স্ট্রিমিং: মূল পিডিএফ ফাইল ক্লায়েন্টে সংরক্ষিত নেই।
          (কপিরাইট আইন: স্ক্রিনশট বা ম্যানুয়াল কপি ১০০% ক্লায়েন্ট-সাইডে প্রতিরোধ সম্ভব নয়, তবে অবৈধ সরাসরি ডাউনলোড সম্পূর্ণ ব্লক করা হয়েছে।)
        </span>
      </div>
    </div>
  );
};
