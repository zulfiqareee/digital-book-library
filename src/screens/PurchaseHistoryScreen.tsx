import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, XCircle, Clock, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { UserSession } from '../types';
import { formatBDT, formatBengaliDate } from '../components/BengaliUtils';

interface PurchaseHistoryScreenProps {
  user: UserSession;
  onRequireAuth: () => void;
}

export const PurchaseHistoryScreen: React.FC<PurchaseHistoryScreenProps> = ({ user, onRequireAuth }) => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user.isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/user/purchases?userId=${encodeURIComponent(user.userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPurchases(data.purchases || []);
        }
      })
      .catch((err) => {
        console.error('Purchases fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, [user.isLoggedIn, user.userId]);

  const handleCopy = (trx: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedId(trx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-2">লগইন প্রয়োজন</h3>
        <p className="text-xs text-slate-400 mb-4">লেনদেন ইতিহাস দেখতে অনুগ্রহ করে অ্যাকাউন্টে প্রবেশ করুন।</p>
        <button
          onClick={onRequireAuth}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <History className="w-5 h-5 text-rose-500" />
          <span>ক্রয় ও লেনদেন ইতিহাস</span>
        </h1>
        <p className="text-xs text-slate-400">
          বিকাশ মার্চেন্ট গেটওয়েতে পরিশোধিত সকল অর্ডারের অফিশিয়াল ভেরিফিকেশন লগ
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">লেনদেন তথ্য যাচাই হচ্ছে...</p>
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-3">
          {purchases.map((p) => {
            const isCompleted = p.status === 'COMPLETED';

            return (
              <div
                key={p.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{p.bookTitleBn}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isCompleted ? 'যাচাইকৃত (Completed)' : 'অপেক্ষমান (Pending)'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 font-mono text-[11px]">
                    <span>অর্ডার: {p.orderId}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>bKash TrxID: {p.paymentTrxId || 'N/A'}</span>
                      {p.paymentTrxId && (
                        <button
                          onClick={() => handleCopy(p.paymentTrxId)}
                          className="hover:text-white cursor-pointer"
                        >
                          {copiedId === p.paymentTrxId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <span>•</span>
                    <span>তারিখ: {formatBengaliDate(p.verifiedAt)}</span>
                  </div>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/60 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                  <span className="text-[10px] text-slate-400 sm:block hidden">পরিশোধিত অর্থ</span>
                  <span className="text-base font-extrabold text-white">
                    {formatBDT(p.amountBDT)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-800/40 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400">এখনো কোনো বিকাশ পেমেন্ট সম্পন্ন করা হয়নি।</p>
        </div>
      )}
    </div>
  );
};
