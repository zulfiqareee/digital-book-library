import React from 'react';
import { BookOpen, Sparkles, TrendingUp, ShieldCheck, ChevronRight, Zap, ArrowRight, Download } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';
import { formatBDT } from '../components/BengaliUtils';

interface HomeScreenProps {
  books: Book[];
  categories: Array<{ category: string; categoryBn: string; count: number }>;
  onSelectBook: (book: Book) => void;
  onReadFree: (book: Book) => void;
  onBuyBook: (book: Book) => void;
  onNavigate: (screen: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  books,
  categories,
  onSelectBook,
  onReadFree,
  onBuyBook,
  onNavigate,
  onSelectCategory,
}) => {
  const featuredBooks = books.slice(0, 3);
  const recentBooks = books.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/60 to-slate-900 border border-rose-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>বাংলাদেশের প্রথম ডিজিটাল ওপেন বুক প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
            বাংলায় বই পড়ুন <span className="text-emerald-400 underline decoration-emerald-500/40">সম্পূর্ণ বিনামূল্যে</span>,
            সংগ্রহে রাখতে <span className="text-rose-400">বিকাশে ডাউনলোড</span> করুন।
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            কোনো সাবস্ক্রিপশন ফি নেই। যে-কোনো প্রকাশিত বই ওয়েবে বা অ্যাপে বিনামূল্যে পাতা উল্টে পড়ুন।
            প্রিন্ট ও অফলাইনে ব্যবহারের জন্য মূল হাই-রেজ্যুলেশন পিডিএফ বিকাশ পেমেন্টে সংগ্রহ করুন।
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('books')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition cursor-pointer"
            >
              <span>সকল বই ব্রাউজ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (books[0]) onReadFree(books[0]);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>জনপ্রিয় বই পড়ুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Principle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-0.5">১০০% ফ্রি অনলাইন রিডিং</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              সবার জন্য সব বই উন্মুক্ত। কোনো পেমেন্ট বা লগইন ছাড়াই প্রতিটি পৃষ্ঠা ব্রাউজারে পড়তে পারবেন।
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-0.5">সহজ বিকাশ ডাউনলোড</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              অফলাইনে সংরক্ষণ ও হাই-কোয়ালিটি প্রিন্টের জন্য শুধুমাত্র বইটির মূল্যে বিকাশ দিয়ে ডাউনলোড করুন।
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white mb-0.5">নিরাপদ ও কপিরাইট সুরক্ষিত</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              লেখক ও প্রকাশকের অধিকার সংরক্ষিত। সার্ভার-ভেরিফাইড টোকেন ছাড়া ফাইল সরাসরি ডাউনলোড অসম্ভব।
            </p>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>জনপ্রিয় ক্যাটাগরি</span>
          </h2>
          <button
            onClick={() => onNavigate('books')}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('All')}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer"
          >
            সকল ক্যাটাগরি
          </button>
          {categories.map((c) => (
            <button
              key={c.category}
              onClick={() => onSelectCategory(c.category)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-xs font-medium whitespace-nowrap transition cursor-pointer"
            >
              {c.categoryBn} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Books Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span>নির্বাচিত বইসমূহ</span>
            </h2>
            <p className="text-xs text-slate-400">অনলাইনে বিনামূল্যে পড়ুন অথবা সংগ্রহে রাখুন</p>
          </div>
          <button
            onClick={() => onNavigate('books')}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onReadFree={onReadFree}
              onBuy={onBuyBook}
            />
          ))}
        </div>
      </div>

      {/* Recently Added Books */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>সম্প্রতি যুক্ত বইসমূহ</span>
            </h2>
            <p className="text-xs text-slate-400">সর্বশেষ প্রকাশিত পাঠযোগ্য ডিজিটাল সংস্করণ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onReadFree={onReadFree}
              onBuy={onBuyBook}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
