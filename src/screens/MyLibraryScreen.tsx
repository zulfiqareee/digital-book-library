import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Download, BookOpen, Clock, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { Book, UserSession } from '../types';
import { formatBDT, formatBengaliDate, toBengaliNumber } from '../components/BengaliUtils';

interface MyLibraryScreenProps {
  user: UserSession;
  onReadFree: (book: Book) => void;
  onDownloadPdf: (book: Book) => void;
  onRequireAuth: () => void;
  onBrowseBooks: () => void;
}

export const MyLibraryScreen: React.FC<MyLibraryScreenProps> = ({
  user,
  onReadFree,
  onDownloadPdf,
  onRequireAuth,
  onBrowseBooks,
}) => {
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user.isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/user/library?userId=${encodeURIComponent(user.userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLibraryItems(data.library || []);
        }
      })
      .catch((err) => {
        console.error('Library fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, [user.isLoggedIn, user.userId]);

  const handleDownload = async (book: Book) => {
    setDownloadingId(book.id);
    try {
      await onDownloadPdf(book);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">আপনার লাইব্রেরিতে প্রবেশ করুন</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          আপনার কেনা বইসমূহ দেখতে এবং মূল লাইসেন্সকৃত পিডিএফ ডাউনলোড করতে আপনার অ্যাকাউন্টে লগইন করুন।
        </p>
        <button
          onClick={onRequireAuth}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition cursor-pointer"
        >
          লগইন / রেজিস্টার করুন
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <BookmarkCheck className="w-6 h-6 text-rose-500" />
          <span>আমার ব্যক্তিগত লাইব্রেরি</span>
        </h1>
        <p className="text-xs text-slate-400">
          বিকাশের মাধ্যমে সংগৃহীত আপনার ডিজিটাল বই ও লাইসেন্সকৃত পিডিএফ কালেকশন
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">লাইব্রেরি লোড হচ্ছে...</p>
        </div>
      ) : libraryItems.length > 0 ? (
        <div className="space-y-4">
          {libraryItems.map((item) => {
            const b = item.book;
            if (!b) return null;
            const isDownloadingThis = downloadingId === b.id;

            return (
              <div
                key={item.purchaseId}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-600 transition shadow-md"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={b.coverImage}
                    alt={b.titleBn}
                    className="w-16 h-22 object-cover rounded-xl shadow-md shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-rose-400 font-semibold uppercase">{b.categoryBn}</span>
                    <h3 className="font-bold text-base text-white truncate">{b.titleBn}</h3>
                    <p className="text-xs text-slate-400 truncate">{b.authorBn}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-mono">
                      <span>অর্ডার: {item.orderId}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{formatBDT(item.amountPaidBDT)}</span>
                      <span>•</span>
                      <span>{formatBengaliDate(item.verifiedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
                  <button
                    onClick={() => onReadFree(b)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition cursor-pointer"
                    title="অনলাইনে ফ্রি পড়ুন"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>অনলাইনে পড়ুন</span>
                  </button>

                  <button
                    onClick={() => handleDownload(b)}
                    disabled={isDownloadingThis}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                    title="৫ মিনিটের টাইমড সাইনড টোকেন দিয়ে মূল পিডিএফ ডাউনলোড করুন"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloadingThis ? 'টোকেন প্রস্তুত হচ্ছে...' : 'পিডিএফ ডাউনলোড'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-800">
          <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">আপনার লাইব্রেরিতে এখনো কোনো বই নেই</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            আপনি যে-কোনো বই অনলাইনে বিনামূল্যে পড়তে পারেন অথবা মূল পিডিএফ সংরক্ষণের জন্য বিকাশ দিয়ে কিনতে পারেন।
          </p>
          <button
            onClick={onBrowseBooks}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            বই কালেকশন দেখুন
          </button>
        </div>
      )}

      {/* Security Note */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">নিরাপদ ফাইল সরবরাহ নীতি:</strong> মূল পিডিএফ ফাইলগুলোর স্থায়ী পাবলিক ইউআরএল ইন্টারনেটে উন্মুক্ত করা হয় না।
          ডাউনলোড চাপলে সার্ভার আপনার ইউজার আইডি ও অর্ডার ভেরিফিকেশন যাচাই করে এবং শুধুমাত্র ৫ মিনিটের জন্য বৈধ একটি সুরক্ষিত সাইনড ডাউনলোড লিঙ্ক ইস্যু করে।
        </div>
      </div>
    </div>
  );
};
