import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Lock, Smartphone, ChevronRight } from 'lucide-react';
import { Book, UserSession } from '../types';
import { formatBDT, toBengaliNumber } from '../components/BengaliUtils';

interface BkashCheckoutModalProps {
  isOpen: boolean;
  book: Book | null;
  user: UserSession;
  onClose: () => void;
  onPaymentSuccess: (result: {
    orderId: string;
    trxId: string;
    bookId: string;
    amountBDT: number;
    book: Book;
  }) => void;
  onRequireAuth: () => void;
}

export const BkashCheckoutModal: React.FC<BkashCheckoutModalProps> = ({
  isOpen,
  book,
  user,
  onClose,
  onPaymentSuccess,
  onRequireAuth,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'init' | 'gateway' | 'verifying' | 'error'>('init');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  // bKash modal form inputs
  const [bkashNumber, setBkashNumber] = useState('017');
  const [otpCode, setOtpCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [gatewayStage, setGatewayStage] = useState<'number' | 'otp' | 'pin'>('number');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check user authentication upon modal opening
  useEffect(() => {
    if (isOpen && !user.isLoggedIn) {
      onClose();
      onRequireAuth();
    }
  }, [isOpen, user.isLoggedIn]);

  // Initiate backend order when modal opens
  useEffect(() => {
    if (isOpen && book && user.isLoggedIn) {
      setCheckoutStep('init');
      setErrorMessage('');
      setGatewayStage('number');
      setOtpCode('');
      setPinCode('');

      // Call backend to create checkout session with server-authoritative price
      fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userId: user.userId,
          userEmail: user.email,
          userName: user.displayName,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrderData(data);
            setCheckoutStep('gateway');
          } else {
            setCheckoutStep('error');
            setErrorMessage(data.error || 'বিকাশ চেকআউট প্রস্তুত করতে সমস্যা হয়েছে।');
          }
        })
        .catch((err) => {
          setCheckoutStep('error');
          setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
        });
    }
  }, [isOpen, book, user]);

  if (!isOpen || !book) return null;

  // Handle bKash Gateway Steps
  const handleProceedNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bkashNumber || bkashNumber.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের বিকাশ অ্যাকাউন্ট নম্বর দিন (উদাঃ 01712345678)।');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setGatewayStage('otp');
      setOtpCode('123456'); // Pre-fill test OTP for frictionless developer experience
    }, 700);
  };

  const handleProceedOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('যাচাইকরণ কোড (OTP) সঠিকভাবে প্রদান করুন।');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setGatewayStage('pin');
    }, 600);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode || pinCode.length < 4) {
      setErrorMessage('বিকাশ পিন নম্বর প্রদান করুন।');
      return;
    }

    setErrorMessage('');
    setCheckoutStep('verifying');

    // Call backend to execute and verify payment on the server
    fetch('/api/bkash/execute-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentID: orderData?.paymentID,
        simulatedPin: pinCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.status === 'COMPLETED') {
          onPaymentSuccess({
            orderId: data.orderId,
            trxId: data.trxID,
            bookId: book.id,
            amountBDT: data.amountBDT,
            book,
          });
        } else {
          setCheckoutStep('error');
          setErrorMessage(data.error || 'পেমেন্ট যাচাইকরণ ব্যর্থ হয়েছে। কোনো টাকা কাটা হয়নি।');
        }
      })
      .catch((err) => {
        setCheckoutStep('error');
        setErrorMessage('সার্ভার যাচাইকরণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* bKash Official Branded Header */}
        <div className="bg-[#E2136E] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md">
              <span className="font-black text-[#E2136E] text-lg tracking-tighter">bKash</span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">বিকাশ পেমেন্ট গেটওয়ে</h3>
              <p className="text-[11px] text-pink-100 opacity-90">অফিসিয়াল মার্চেন্ট চেকআউট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Bar */}
        <div className="bg-pink-50 border-b border-pink-100 p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">বইয়ের নাম</span>
            <span className="font-bold text-slate-800 line-clamp-1">{book.titleBn}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[10px]">মোট প্রদেয় মূল্য</span>
            <span className="text-base font-extrabold text-[#E2136E]">{formatBDT(book.priceBDT)}</span>
          </div>
        </div>

        {/* Dynamic Modal Body */}
        <div className="p-5">
          {checkoutStep === 'init' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#E2136E] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700">বিকাশ সার্ভারের সাথে সংযোগ স্থাপন করা হচ্ছে...</p>
              <p className="text-[11px] text-slate-500">অনন্য অর্ডার আইডি ও সার্ভার-নিয়ন্ত্রিত মূল্য যাচাই চলছে।</p>
            </div>
          )}

          {checkoutStep === 'verifying' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-pink-100 text-[#E2136E] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">পেমেন্ট ও লেনদেন যাচাই করা হচ্ছে...</p>
              <p className="text-xs text-slate-500">
                বিকাশ সার্ভার থেকে ট্রানজেকশন আইডি এবং স্ট্যাটাস কনফার্মেশন গ্রহণ করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।
              </p>
            </div>
          )}

          {checkoutStep === 'error' && (
            <div className="py-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong className="block font-semibold">পেমেন্ট সম্পন্ন হয়নি</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckoutStep('init')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  পুনরায় চেষ্টা করুন
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'gateway' && (
            <div>
              {/* Error warning if any */}
              {errorMessage && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Stage 1: bKash Number */}
              {gatewayStage === 'number' && (
                <form onSubmit={handleProceedNumber} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      আপনার বিকাশ অ্যাকাউন্ট নম্বর দিন
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        maxLength={11}
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        required
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#E2136E] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none transition"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      (স্যান্ডবক্স মোডে আপনার ডেমো বিকাশ নম্বর ব্যবহার করতে পারেন)
                    </span>
                  </div>

                  <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 text-[11px] text-slate-600 leading-relaxed">
                    পরবর্তী ধাপে আপনার বিকাশ নম্বরে একটি যাচাইকরণ ওটিপি কোড পাঠানো হবে।
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'প্রসেসিং...' : 'নিশ্চিত করুন'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Stage 2: OTP Verification */}
              {gatewayStage === 'otp' && (
                <form onSubmit={handleProceedOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        বিকাশ ওটিপি (OTP) কোড দিন
                      </label>
                      <span className="text-[10px] text-emerald-600 font-medium">কোড পাঠানো হয়েছে</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#E2136E] rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-slate-900 focus:outline-none transition"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1 text-center">
                      (টেস্ট ওটিপি: 123456)
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    {isSubmitting ? 'যাচাই করা হচ্ছে...' : 'ওটিপি নিশ্চিত করুন'}
                  </button>
                </form>
              )}

              {/* Stage 3: PIN Verification */}
              {gatewayStage === 'pin' && (
                <form onSubmit={handleExecutePayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      আপনার বিকাশ গোপন পিন (PIN) নম্বর দিন
                    </label>
                    <input
                      type="password"
                      maxLength={5}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="•••••"
                      required
                      autoFocus
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#E2136E] rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-slate-900 focus:outline-none transition"
                    />
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>গোপন পিন কখনোই কারও সাথে শেয়ার করবেন না</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E2136E] to-pink-600 hover:from-[#c90f61] hover:to-pink-700 text-white font-extrabold text-sm shadow-lg shadow-pink-200 transition cursor-pointer"
                  >
                    {isSubmitting ? 'পেমেন্ট অনুমোদিত হচ্ছে...' : `${formatBDT(book.priceBDT)} পেমেন্ট সম্পন্ন করুন`}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Security & Agreement Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>১২৮-বিট এনক্রিপশন • ডিজিটাল বই লাইব্রেরি বাংলাদেশ মার্চেন্ট সুরক্ষা</span>
        </div>
      </div>
    </div>
  );
};
