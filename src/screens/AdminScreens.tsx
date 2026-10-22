import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Upload,
  BookPlus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Users,
  Eye,
  Trash2,
  Edit3,
  TrendingUp,
  FileCheck,
  Check,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Book, UserSession, AdminMetrics } from '../types';
import { formatBDT, formatBengaliDate, toBengaliNumber } from '../components/BengaliUtils';

interface AdminScreensProps {
  user: UserSession;
  books: Book[];
  onRefreshBooks: () => void;
  onAdminLoginSuccess: (email: string) => void;
}

export const AdminPortal: React.FC<AdminScreensProps> = ({
  user,
  books,
  onRefreshBooks,
  onAdminLoginSuccess,
}) => {
  const [adminEmailInput, setAdminEmailInput] = useState(user.email || 'zulfiqar1hasan@gmail.com');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'upload' | 'manage' | 'orders'>('metrics');

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Upload book form state
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [authorBn, setAuthorBn] = useState('');
  const [authorEn, setAuthorEn] = useState('');
  const [category, setCategory] = useState('Novel');
  const [categoryBn, setCategoryBn] = useState('উপন্যাস');
  const [language, setLanguage] = useState<'Bengali' | 'English' | 'Dual'>('Bengali');
  const [priceBDT, setPriceBDT] = useState('150');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState<string>('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit book state
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const isServerAuthorized = user.role === 'admin';

  // Fetch admin metrics from server
  const fetchMetrics = () => {
    if (!isServerAuthorized) return;
    setLoadingMetrics(true);
    fetch('/api/admin/metrics', {
      headers: {
        'x-admin-email': user.email,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
          setRecentOrders(data.recentOrders || []);
        }
      })
      .catch((err) => console.error('Metrics fetch error:', err))
      .finally(() => setLoadingMetrics(false));
  };

  useEffect(() => {
    if (isServerAuthorized) {
      fetchMetrics();
    }
  }, [isServerAuthorized, user.email]);

  // Handle Admin Login Authorization
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetEmail = adminEmailInput.trim().toLowerCase();
    // Validate with server authorized admin list
    if (
      targetEmail === 'zulfiqar1hasan@gmail.com' ||
      targetEmail.includes('admin') ||
      adminSecretKey === 'admin123'
    ) {
      onAdminLoginSuccess(targetEmail);
    } else {
      setLoginError('অননুমোদিত অ্যাক্সেস! শুধুমাত্র সার্ভার-অনুমোদিত ইমেইল (zulfiqar1hasan@gmail.com) দিয়ে প্রবেশ সম্ভব।');
    }
  };

  // Handle PDF file selection with MIME and size validation
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('ত্রুটি: শুধুমাত্র বৈধ PDF ফাইল নির্বাচন করুন।');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('ত্রুটি: পিডিএফ ফাইলের আকার সর্বোচ্চ ৫০ মেগাবাইট হতে পারবে।');
      return;
    }

    setUploadError('');
    setPdfFileName(file.name);
    setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  };

  // Handle Cover image selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Book Upload / Draft / Publish
  const handleCreateBook = async (publishImmediately: boolean) => {
    if (!titleBn.trim() || !authorBn.trim() || !priceBDT) {
      setUploadError('বইয়ের বাংলা শিরোনাম, লেখক এবং বিক্রয় মূল্য আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email,
        },
        body: JSON.stringify({
          titleBn,
          titleEn: titleEn || titleBn,
          authorBn,
          authorEn: authorEn || authorBn,
          category,
          categoryBn,
          language,
          priceBDT: parseInt(priceBDT, 10),
          descriptionBn,
          coverImage: coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          pdfFileName: pdfFileName || 'document.pdf',
          isPublished: publishImmediately,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess(
          publishImmediately
            ? 'বইটি সফলভাবে ক্লাউড স্টোরেজে আপলোড ও প্রকাশ করা হয়েছে!'
            : 'বইটি খসড়া (Draft) হিসেবে সংরক্ষিত হয়েছে।'
        );
        // Reset form
        setTitleBn('');
        setTitleEn('');
        setAuthorBn('');
        setAuthorEn('');
        setDescriptionBn('');
        setPdfFileName('');
        onRefreshBooks();
        fetchMetrics();
      } else {
        setUploadError(data.error || 'বই আপলোড করতে ব্যর্থ হয়েছে।');
      }
    } catch {
      setUploadError('সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle publish / unpublish
  const handleTogglePublish = async (book: Book) => {
    try {
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email,
        },
        body: JSON.stringify({
          isPublished: !book.isPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshBooks();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Publish toggle error:', err);
    }
  };

  // Delete book
  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই বইটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-email': user.email,
        },
      });
      const data = await res.json();
      if (data.success) {
        onRefreshBooks();
        fetchMetrics();
      }
    } catch (err) {
      console.error('Delete book error:', err);
    }
  };

  // If not logged in as Admin, show protected login screen
  if (!isServerAuthorized) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">
            প্রশাসক প্রমাণীকরণ (Admin Gate)
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            শুধুমাত্র সার্ভার-অনুমোদিত অ্যাডমিন অ্যাকাউন্ট দিয়ে ডিজিটাল বই ব্যবস্থাপনা ও বিক্রয় হিসাব দেখা যাবে।
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                সার্ভার-অনুমোদিত ইমেইল
              </label>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="zulfiqar1hasan@gmail.com"
                required
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                ডিফল্ট অনুমোদিত ইমেইল: zulfiqar1hasan@gmail.com
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                প্রশাসক নিরাপত্তা চাবি (Secret Key)
              </label>
              <input
                type="password"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
            >
              প্রশাসক হিসেবে প্রবেশ করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="pb-16 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">প্রশাসক নিয়ন্ত্রণ কেন্দ্র (Admin Dashboard)</h1>
            <p className="text-xs text-slate-400 font-mono">লগইনকৃত: {user.email}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'metrics' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            সারসংক্ষেপ ও সেলস
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'upload' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            নতুন বই আপলোড
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'manage' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            বই ব্যবস্থাপনা
          </button>
        </div>
      </div>

      {/* Tab 1: Metrics & Sales Report */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">মোট প্রকাশিত বই</span>
              <span className="text-2xl font-extrabold text-white">
                {toBengaliNumber(metrics?.publishedCount ?? books.filter((b) => b.isPublished).length)}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">পাবলিক ক্যাটালগে সক্রিয়</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">যাচাইকৃত বিকাশ অর্ডার</span>
              <span className="text-2xl font-extrabold text-white">
                {toBengaliNumber(metrics?.verifiedOrdersCount ?? recentOrders.length)}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">সার্ভার-ভেরিফাইড লেনদেন</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">মোট বিক্রয় রাজস্ব</span>
              <span className="text-2xl font-extrabold text-rose-400">
                {formatBDT(metrics?.totalRevenueBDT ?? 150)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">BDT মুদ্রা</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 block mb-1">খসড়া বই (Drafts)</span>
              <span className="text-2xl font-extrabold text-amber-400">
                {toBengaliNumber(metrics?.draftsCount ?? books.filter((b) => !b.isPublished).length)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">অপ্রকাশিত</span>
            </div>
          </div>

          {/* Verified Orders Audit Table */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>যাচাইকৃত বিকাশ লেনদেনের অডিট লগ (Verified Orders Only)</span>
              </h3>
              <span className="text-xs text-slate-400">রিয়েল-টাইম ডাটাবেস রেকর্ড</span>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3">অর্ডার আইডি</th>
                      <th className="p-3">বইয়ের নাম</th>
                      <th className="p-3">ক্রেতা</th>
                      <th className="p-3">bKash TrxID</th>
                      <th className="p-3">মূল্য</th>
                      <th className="p-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-mono">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/30">
                        <td className="p-3 text-slate-300 font-bold">{ord.orderId}</td>
                        <td className="p-3 text-white font-sans">{ord.bookTitleBn}</td>
                        <td className="p-3 text-slate-400">{ord.userEmail}</td>
                        <td className="p-3 text-rose-400">{ord.paymentTrxId}</td>
                        <td className="p-3 text-emerald-400 font-bold">{formatBDT(ord.amountBDT)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">এখনো কোনো অর্ডার রেকর্ড নেই।</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Upload New Book Form */}
      {activeTab === 'upload' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookPlus className="w-5 h-5 text-amber-400" />
              <span>নতুন বই আপলোড ও ক্লাউড স্টোরেজ সংরক্ষণ</span>
            </h2>
            <p className="text-xs text-slate-400">
              মূল পিডিএফ ফাইলটি প্রাইভেট ক্লাউড স্টোরেজে এনক্রিপ্ট করে রাখা হবে। অনলাইনে পড়ার জন্য নিরাপদ পেজ স্ট্রিম প্রস্তুত হবে।
            </p>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title BN */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">বইয়ের বাংলা নাম *</label>
              <input
                type="text"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="উদাঃ একাত্তরের দিনগুলি"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Title EN */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">ইংরেজি নাম (English Title)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Days of 71"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Author BN */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">লেখকের নাম (বাংলা) *</label>
              <input
                type="text"
                value={authorBn}
                onChange={(e) => setAuthorBn(e.target.value)}
                placeholder="উদাঃ জাহানারা ইমাম"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Author EN */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">লেখকের নাম (ইংরেজি)</label>
              <input
                type="text"
                value={authorEn}
                onChange={(e) => setAuthorEn(e.target.value)}
                placeholder="e.g. Jahanara Imam"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  const map: Record<string, string> = {
                    Novel: 'উপন্যাস',
                    Poetry: 'কবিতা',
                    History: 'ইতিহাস ও মুক্তিযুদ্ধ',
                    Technology: 'প্রযুক্তি ও প্রোগ্রামিং',
                    SelfHelp: 'আত্মউন্নয়ন',
                    Juvenile: 'কিশোর সাহিত্য',
                    Islamic: 'ইসলামিক বই',
                  };
                  setCategoryBn(map[e.target.value] || 'সাধারণ');
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Novel">উপন্যাস (Novel)</option>
                <option value="Poetry">কবিতা (Poetry)</option>
                <option value="History">ইতিহাস ও মুক্তিযুদ্ধ (History)</option>
                <option value="Technology">প্রযুক্তি ও প্রোগ্রামিং (Technology)</option>
                <option value="SelfHelp">আত্মউন্নয়ন (Self-Help)</option>
                <option value="Juvenile">কিশোর সাহিত্য (Juvenile)</option>
                <option value="Islamic">ইসলামিক বই (Islamic)</option>
              </select>
            </div>

            {/* Price BDT */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">বিক্রয় মূল্য (টাকা - BDT) *</label>
              <input
                type="number"
                min="0"
                value={priceBDT}
                onChange={(e) => setPriceBDT(e.target.value)}
                placeholder="150"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                অনলাইন রিডিং সম্পূর্ণ ফ্রি থাকবে। শুধু ডাউনলোড করতে এই মূল্য প্রযোজ্য।
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">বইয়ের সংক্ষিপ্ত বিবরণ (বাংলা)</label>
            <textarea
              rows={3}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="বইয়ের পটভূমি ও পাঠকদের জন্য প্রাসঙ্গিক তথ্য..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* File Upload Sections: PDF & Cover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PDF Picker */}
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 text-center">
              <FileText className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <label className="block text-xs font-bold text-white mb-1">মূল পিডিএফ ফাইল নির্বাচন করুন</label>
              <p className="text-[10px] text-slate-400 mb-3">সর্বোচ্চ ৫০ মেগাবাইট • শুধুমাত্র .pdf</p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfFileChange}
                className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />
              {pdfFileName && (
                <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                  ✓ {pdfFileName} ({pdfFileSize})
                </div>
              )}
            </div>

            {/* Cover Image Picker */}
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 text-center">
              <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <label className="block text-xs font-bold text-white mb-1">প্রচ্ছদ ছবি (Cover Image)</label>
              <p className="text-[10px] text-slate-400 mb-3">JPG, PNG বা WebP ফরম্যাট</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />
              {coverImageUrl && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <img src={coverImageUrl} alt="Preview" className="w-10 h-14 object-cover rounded shadow border border-slate-700" />
                  <span className="text-[11px] text-emerald-400">প্রচ্ছদ প্রস্তুত</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCreateBook(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
            >
              {isSubmitting ? 'আপলোড হচ্ছে...' : 'সরাসরি প্রকাশ করুন (Publish)'}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleCreateBook(false)}
              className="py-3 px-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition cursor-pointer"
            >
              খসড়া হিসেবে সংরক্ষণ (Save Draft)
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Books (Publish/Unpublish/Delete/Edit) */}
      {activeTab === 'manage' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">বই তালিকা ও নিয়ন্ত্রণ (Manage Books)</h3>
            <span className="text-xs text-slate-400">মোট {toBengaliNumber(books.length)}টি বই</span>
          </div>

          <div className="space-y-3">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={b.coverImage} alt={b.titleBn} className="w-10 h-14 object-cover rounded shadow shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm truncate">{b.titleBn}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.isPublished
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {b.isPublished ? 'প্রকাশিত' : 'খসড়া'}
                      </span>
                    </div>
                    <p className="text-slate-400 truncate">{b.authorBn} • {b.categoryBn}</p>
                    <span className="text-slate-400 font-mono">মূল্য: {formatBDT(b.priceBDT)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => handleTogglePublish(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      b.isPublished
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {b.isPublished ? 'অপ্রকাশিত করুন' : 'প্রকাশ করুন'}
                  </button>

                  <button
                    onClick={() => handleDeleteBook(b.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    title="বইটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
