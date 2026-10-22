import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, BookmarkCheck, ArrowRight, ShieldCheck, Copy, Check, FileText } from 'lucide-react';
import { Book, UserSession } from '../types';
import { formatBDT, formatBengaliDate } from '../components/BengaliUtils';

interface PaymentResultScreenProps {
  result: {
    orderId: string;
    trxId: string;
    bookId: string;
    amountBDT: number;
    book: Book;
  };
  user: UserSession;
  onGoToLibrary: () => void;
  onBrowseBooks: () => void;
  onDownloadPdf: (book: Book) => void;
}

export const PaymentResultScreen: React.FC<PaymentResultScreenProps> = ({
  result,
  user,
  onGoToLibrary,
  onBrowseBooks,
  onDownloadPdf,
}) => {
  const [copiedTrx, setCopiedTrx] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Fire confetti celebration on successful verified purchase
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E2136E', '#10B981', '#3B82F6', '#F59E0B']
      });
    } catch {}
  }, []);

  const handleCopyTrx = () => {
    navigator.clipboard.writeText(result.trxId);
    setCopiedTrx(true);
    setTimeout(() => setCopiedTrx(false), 2000);
  };

  const handleInstantDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPdf(result.book);
      setDownloadSuccess(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6 animate-in zoom-in-95 duration-200">
      {/* Success Card */}
      <div className="bg-slate-800/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
          পেমেন্ট সফল ও সার্ভার যাচাইকৃত
        </span>

        <h1 className="text-2xl font-black text-white mb-1">
          অভিনন্দন! বইটি আপনার অধিকারে যুক্ত হয়েছে
        </h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
          বিকাশ পেমেন্ট গেটওয়ে দ্বারা লেনদেন সফলভাবে নিশ্চিত হয়েছে। বইটি এখন আপনার ব্যক্তিগত লাইব্রেরিতে সংরক্ষিত।
        </p>

        {/* Book Preview Card */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700/80 flex items-center gap-3.5 text-left mb-6">
          <img
            src={result.book.coverImage}
            alt={result.book.titleBn}
            className="w-14 h-18 object-cover rounded-lg shadow-md shrink-0 border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-rose-400 font-semibold">{result.book.categoryBn}</span>
            <h4 className="font-bold text-sm text-white truncate">{result.book.titleBn}</h4>
            <p className="text-xs text-slate-400 truncate">{result.book.authorBn}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-400">
                {formatBDT(result.amountBDT)} (পরিশোধিত)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                লাইসেন্স সক্রিয়
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Receipt Details */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/60 text-xs space-y-2 text-left mb-6 font-mono">
          <div className="flex justify-between items-center text-slate-400">
            <span>অর্ডার নম্বর:</span>
            <span className="text-white font-semibold">{result.orderId}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>বিকাশ TrxID:</span>
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span>{result.trxId}</span>
              <button
                onClick={handleCopyTrx}
                className="p-1 hover:text-white transition cursor-pointer"
                title="কপি করুন"
              >
                {copiedTrx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>ক্রেতার অ্যাকাউন্ট:</span>
            <span className="text-slate-200">{user.email}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>যাচাইকরণের সময়:</span>
            <span className="text-slate-200">{formatBengaliDate(new Date().toISOString())}</span>
          </div>
        </div>

        {/* Primary Download Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleInstantDownload}
            disabled={isDownloading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>
              {isDownloading
                ? 'টাইমড সিকিউর টোকেন জেনারেট হচ্ছে...'
                : downloadSuccess
                ? 'পিডিএফ ডাউনলোড সম্পন্ন হয়েছে'
                : 'মূল এইচডি পিডিএফ ডাউনলোড করুন'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onGoToLibrary}
              className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>আমার লাইব্রেরি</span>
            </button>
            <button
              onClick={onBrowseBooks}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>আরও বই দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Security explanation note */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2.5 text-slate-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          আপনার অর্জিত ডিজিটাল কপিটি স্থায়ীভাবে সুরক্ষিত। ভবিষ্যতে আপনি যেকোনো সময় 'আমার লাইব্রেরি' থেকে পুনরায় ডাউনলোড করতে পারবেন।
        </span>
      </div>
    </div>
  );
};
