import React, { useState } from 'react';
import { BookOpen, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface LegalScreenProps {
  initialTab?: 'about' | 'contact' | 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalScreen: React.FC<LegalScreenProps> = ({ initialTab = 'about', onBack }) => {
  const [tab, setTab] = useState<'about' | 'contact' | 'privacy' | 'terms'>(initialTab);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1500);
  };

  return (
    <div className="pb-16 max-w-3xl mx-auto space-y-6">
      {/* Top tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900 p-1 rounded-2xl overflow-x-auto text-xs">
        <button
          onClick={() => setTab('about')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-semibold transition cursor-pointer text-center ${
            tab === 'about' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          আমাদের সম্পর্কে
        </button>
        <button
          onClick={() => setTab('contact')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-semibold transition cursor-pointer text-center ${
            tab === 'contact' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          যোগাযোগ
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-semibold transition cursor-pointer text-center ${
            tab === 'privacy' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          গোপনীয়তা নীতি
        </button>
        <button
          onClick={() => setTab('terms')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-semibold transition cursor-pointer text-center ${
            tab === 'terms' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          শর্তাবলী ও রিফান্ড
        </button>
      </div>

      {/* About View */}
      {tab === 'about' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ডিজিটাল বই লাইব্রেরি বাংলাদেশ</h2>
              <p className="text-xs text-rose-400">একটি বাংলা-প্রথম উন্মুক্ত বই পাঠ ও বিতরণ উদ্যোগ</p>
            </div>
          </div>

          <p>
            'ডিজিটাল বই লাইব্রেরি' হলো বাংলাদেশের পাঠকদের জন্য তৈরি একটি উদ্ভাবনী ডিজিটাল বই প্ল্যাটফর্ম।
            আমাদের মূল উদ্দেশ্য হলো জ্ঞান ও সাহিত্যকে প্রত্যেকের হাতের নাগালে পৌঁছে দেওয়া।
          </p>

          <h3 className="font-bold text-white text-sm pt-2">আমাদের ব্যবসায়িক মডেল:</h3>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong className="text-emerald-400">অনলাইনে বিনামূল্যে পড়ুন:</strong> যে-কোনো প্রকাশিত বই ব্রাউজারে বা অ্যাপে কোনো অর্থ বা সাবস্ক্রিপশন ফি ছাড়াই পড়া যায়।</li>
            <li><strong className="text-rose-400">বিকাশ পেমেন্টে ডাউনলোড:</strong> মূল হাই-রেজ্যুলেশন প্রিন্টাবল পিডিএফ ব্যক্তিগত সংগ্রহে রাখার জন্য লেখক ও প্রকাশকের নির্ধারিত নামমাত্র মূল্যে বিকাশে ক্রয় করা যায়।</li>
          </ul>

          <p>
            আমরা কপিরাইট ও ডিজিটাল রাইটস ম্যানেজমেন্টকে সর্বাধিক অগ্রাধিকার দিই। মূল পিডিএফ ফাইল ক্লাউড ভল্টে এনক্রিপ্ট করে রাখা হয় এবং শুধুমাত্র যাচাইকৃত ক্রয়ের পর সীমিত সময়ের সাইনড টোকেন দিয়ে প্রদান করা হয়।
          </p>
        </div>
      )}

      {/* Contact View */}
      {tab === 'contact' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">সরাসরি যোগাযোগ করুন</h2>
            <p className="text-xs text-slate-400">লেখক, প্রকাশক বা পাঠকদের যেকোনো জিজ্ঞাসা বা সহযোগিতায় আমরা প্রস্তুত</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <Mail className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">ইমেইল</span>
              <span className="text-white font-mono">support@digitalbooklibrary.bd</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <Phone className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">হটলাইন</span>
              <span className="text-white font-mono">+880 1700-000000</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
              <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">কার্যালয়</span>
              <span className="text-white">ধানমন্ডি, ঢাকা, বাংলাদেশ</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {messageSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>আপনার বার্তা সফলভাবে গৃহীত হয়েছে! শীঘ্রই আমাদের প্রতিনিধি উত্তর দেবেন।</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="উদাঃ রফিক উদ্দিন"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">বার্তা বা মন্তব্য</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="আপনার বার্তা এখানে লিখুন..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>বার্তা প্রেরণ করুন</span>
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {/* Privacy Policy */}
      {tab === 'privacy' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">ব্যবহারকারীর গোপনীয়তা নীতি</h2>
          </div>
          <p>
            আমরা পাঠকদের ব্যক্তিগত তথ্যের সর্বোচ্চ নিরাপত্তা বিধানে প্রতিশ্রুতিবদ্ধ।
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>তথ্য সংরক্ষণ:</strong> শুধুমাত্র অ্যাকাউন্ট পরিচালনা ও বিকাশ লেনদেন ভেরিফিকেশনের জন্য ইমেইল ও নাম সংরক্ষিত হয়।</li>
            <li><strong>বিকাশ তথ্য নিরাপত্তা:</strong> ব্যবহারকারীর বিকাশ পিন বা ওটিপি কখনোই আমাদের সার্ভারে সংরক্ষিত হয় না; এটি অফিসিয়াল গেটওয়েতে সরাসরি এনক্রিপ্ট হয়।</li>
            <li><strong>বিজ্ঞাপন ও ডেটা বিক্রি নয়:</strong> আমরা কোনো তৃতীয় পক্ষের কাছে পাঠকদের ব্রাউজিং বা পড়ার ডেটা বিক্রি করি না।</li>
          </ul>
        </div>
      )}

      {/* Terms & Refund Policy */}
      {tab === 'terms' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">ব্যবহারের শর্তাবলী ও ডিজিটাল রিফান্ড নীতি</h2>
          </div>
          <p>
            'ডিজিটাল বই লাইব্রেরি' সেবা ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>ডিজিটাল পণ্যের প্রকৃতি:</strong> যেহেতু বইটির প্রতিটি পৃষ্ঠা অনলাইনে সম্পূর্ণ বিনামূল্যে পাঠযোগ্য, তাই মূল পিডিএফ ফাইল ক্রয়ের পূর্বে বইটির মান যাচাই করার পূর্ণ সুযোগ পাঠকদের রয়েছে।</li>
            <li><strong>রিফান্ড নীতি:</strong> বিকাশ পেমেন্ট সম্পন্ন হওয়ার পর তাৎক্ষণিকভাবে সার্ভার ভেরিফিকেশনের মাধ্যমে লাইসেন্স ও ডাউনলোড টোকেন ইস্যু হয়ে গেলে তা ফেরতযোগ্য নয়। তবে কোনো প্রযুক্তিগত জটিলতার কারণে ফাইল সরবরাহ বিঘ্নিত হলে আমাদের সাপোর্ট টিম পুনরায় ফাইল সরবরাহ নিশ্চিত করবে।</li>
            <li><strong>ব্যক্তিগত ব্যবহার:</strong> সংগৃহীত পিডিএফ ফাইল শুধুমাত্র ব্যক্তিগত পাঠ ও প্রিন্টের জন্য। বাণিজ্যিক পুনঃবিতরণ বা ইন্টারনেটে আপলোড করা কপিরাইট আইনের লঙ্ঘন।</li>
          </ul>
        </div>
      )}
    </div>
  );
};
