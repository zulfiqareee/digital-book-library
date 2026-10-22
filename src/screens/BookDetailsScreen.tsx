import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Download, Star, Share2, CheckCircle2, ShieldCheck, Calendar, BookText, Globe } from 'lucide-react';
import { Book, UserSession } from '../types';
import { formatBDT, toBengaliNumber } from '../components/BengaliUtils';

interface BookDetailsScreenProps {
  book: Book;
  user: UserSession;
  isPurchased: boolean;
  onBack: () => void;
  onReadFree: (book: Book) => void;
  onBuyBook: (book: Book) => void;
  onDownloadLicensedPdf: (book: Book) => void;
}

export const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({
  book,
  user,
  isPurchased,
  onBack,
  onReadFree,
  onBuyBook,
  onDownloadLicensedPdf,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-16 max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>তালিকায় ফিরে যান</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Cover Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 relative">
              <img
                src={book.coverImage}
                alt={book.titleBn}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold shadow-md">
                ফ্রি অনলাইন রিডিং
              </div>
            </div>

            {/* Price Box */}
            <div className="w-full max-w-[260px] mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">অরিজিনাল পিডিএফ ডাউনলোড মূল্য</span>
              <span className="text-2xl font-black text-white">{formatBDT(book.priceBDT)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">বিকাশ গেটওয়ে দ্বারা নিরাপদ পেমেন্ট</span>
            </div>
          </div>

          {/* Info Column */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                  {book.categoryBn} ({book.category})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs font-medium">
                  {book.language === 'Bengali' ? 'বাংলা সংস্করণ' : book.language === 'English' ? 'English Edition' : 'দ্বিভাষিক (Dual)'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {book.titleBn}
              </h1>
              <p className="text-sm text-slate-400 font-medium mb-3">
                {book.titleEn}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-300 mb-4 pb-4 border-b border-slate-700/60">
                <span className="font-semibold text-white">লেখক: {book.authorBn}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{book.authorEn}</span>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{toBengaliNumber(book.rating.toFixed(1))}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">পাঠক রেটিং</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-200 text-xs font-bold mb-0.5">
                    <BookText className="w-3.5 h-3.5 text-rose-400" />
                    <span>{toBengaliNumber(book.pagesCount)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">মোট পৃষ্ঠা</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-200 text-xs font-bold mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{toBengaliNumber(book.publishedYear)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">প্রকাশকাল</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  বইয়ের সংক্ষিপ্ত বিবরণ
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {book.descriptionBn}
                </p>
                {book.descriptionEn && (
                  <p className="text-xs text-slate-400 italic mt-2 leading-relaxed">
                    {book.descriptionEn}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row gap-3">
              {/* Read Free Online Button */}
              <button
                onClick={() => onReadFree(book)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm shadow transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>বিনামূল্যে সম্পূর্ণ বই পড়ুন</span>
              </button>

              {/* Buy or Download Button */}
              {isPurchased ? (
                <button
                  onClick={() => onDownloadLicensedPdf(book)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>লাইসেন্সকৃত পিডিএফ ডাউনলোড</span>
                </button>
              ) : (
                <button
                  onClick={() => onBuyBook(book)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>বিকাশে কিনুন ও ডাউনলোড করুন</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Guarantee Note */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">কেন এই মডেল?</strong> পাঠকদের জন্য জ্ঞান ও সাহিত্য যেন সহজলভ্য থাকে,
          তাই অনলাইন রিডিং সর্বদা বিনামূল্যে রাখা হয়েছে। মূল আনরেস্ট্রিকটেড পিডিএফ সংরক্ষণ ও মুদ্রণের জন্য বিকাশ দ্বারা
          অল্প সম্মানী পরিশোধ করে আপনি সরাসরি লেখক ও প্রকাশককে সমর্থন করছেন।
        </div>
      </div>
    </div>
  );
};
