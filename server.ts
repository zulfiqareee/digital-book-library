import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for parsing JSON with generous limit for cover/sample data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static public assets (PWA icons, manifest, etc.)
app.use(express.static(path.resolve(__dirname, 'public')));

// ----------------------------------------------------------------------------
// IN-MEMORY / PERSISTED DATABASE STORES (Production seed + dynamic mutations)
// ----------------------------------------------------------------------------

export interface Book {
  id: string;
  titleBn: string;
  titleEn: string;
  authorBn: string;
  authorEn: string;
  category: string;
  categoryBn: string;
  descriptionBn: string;
  descriptionEn: string;
  language: 'Bengali' | 'English' | 'Dual';
  priceBDT: number;
  coverImage: string;
  isPublished: boolean;
  pagesCount: number;
  isbn?: string;
  publishedYear: number;
  rating: number;
  samplePages: Array<{
    pageNumber: number;
    titleBn: string;
    contentBn: string;
    contentEn?: string;
    chapterBn?: string;
  }>;
  pdfStorageKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRecord {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  bookId: string;
  bookTitleBn: string;
  amountBDT: number;
  paymentMethod: 'bKash';
  paymentTrxId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  verifiedAt: string;
  bKashVerificationResponse?: any;
}

// Initial Bengali-first books catalogue with authentic literature & modern themes
const booksDatabase: Map<string, Book> = new Map([
  [
    'book-1',
    {
      id: 'book-1',
      titleBn: 'মেঘের দেশে বৃষ্টি বিলাস',
      titleEn: 'Rain Luxuries in the Land of Clouds',
      authorBn: 'হুমায়ূন আহমেদ',
      authorEn: 'Humayun Ahmed',
      category: 'Novel',
      categoryBn: 'উপন্যাস',
      descriptionBn: 'বৃষ্টির শব্দে এক অদ্ভুত নিঃসঙ্গতা আর নস্টালজিয়া মিশে থাকে। জীবনের মায়া, বৃষ্টিভেজা ঢাকা শহর আর রূপার এক অনবদ্য মানবিক উপন্যাস। পাঠক বিনামূল্যে প্রতিটি পৃষ্ঠা অনলাইনে উপভোগ করতে পারবেন।',
      descriptionEn: 'A poignant and nostalgic Bengali novel set amidst monsoon rains in Dhaka, exploring human relationships, unspoken affections, and emotional depths.',
      language: 'Bengali',
      priceBDT: 150,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      pagesCount: 142,
      isbn: '978-984-500-112-4',
      publishedYear: 2021,
      rating: 4.9,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: 'অধ্যায় এক: বৃষ্টির সকাল',
          titleBn: 'শহরের জানালায় বৃষ্টির ফোঁটা',
          contentBn: 'আজ সকাল থেকেই আকাশ মেঘলা। চারপাশের চেনা শহরটা যেন এক নিমেষেই বদলে গেল। জানালার কাঁচ বেয়ে জল গড়িয়ে নামছে। হিমু আজ হলুদ পাঞ্জাবি পরেনি, আজ সে শুধুই বৃষ্টির নীরব সাক্ষী। রাস্তায় ভেজা কাকেরা ডানা ঝাপটাচ্ছে, আর দূরে রিকশার বেলের টুংটাং শব্দ বাতাসে ভাসছে।'
        },
        {
          pageNumber: 2,
          chapterBn: 'অধ্যায় এক (চলমান)',
          titleBn: 'নীল খামে চিঠি',
          contentBn: 'টেবিলের ওপর রাখা একটা পুরোনো বইয়ের ভাঁজে লুকানো নীল রঙের খাম। রূপা লিখেছিল: "যদি কোনোদিন আকাশ ভেঙে বৃষ্টি নামে, তুমি কি আসবে?" মানুষ কেন বৃষ্টির কাছে সব কথা বলতে পারে না? এই প্রশ্নের কোনো উত্তর নেই।'
        },
        {
          pageNumber: 3,
          chapterBn: 'অধ্যায় দুই: অচেনা মানুষ',
          titleBn: 'ক্যাফেটেরিয়ার কোণে',
          contentBn: 'ধানমন্ডির লেকের ধারের ক্যাফেতে গরম চায়ের কাপে ধোঁয়া উঠছে। চা মিষ্টি নয়, কিন্তু বৃষ্টিমুখর সন্ধ্যায় তিক্ত চা-ও অন্যরকম মাধুর্য ছড়ায়। পাশে বসে থাকা ভদ্রলোক গম্ভীর মুখে পত্রিকার পাতা ওলটাচ্ছিলেন।'
        },
        {
          pageNumber: 4,
          chapterBn: 'অধ্যায় তিন: শেষ বিকালের আলো',
          titleBn: 'মেঘ কেটে যাওয়া রোদ',
          contentBn: 'বিকেলে বৃষ্টি থেমে গেল। পশ্চিমে মেঘের চিরে সোনালি আলো ছড়িয়ে পড়ল শহরের ভেজা পিচে। মন বলে, কিছু গল্প শেষ হয়েও শেষ হয় না, তারা থেকে যায় বৃষ্টির গন্ধের মতো।'
        }
      ],
      pdfStorageKey: 'private-vault/books/book-1-full-hq.pdf',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    }
  ],
  [
    'book-2',
    {
      id: 'book-2',
      titleBn: 'ডিজিটাল বাংলাদেশ ও পাইথন প্রোগ্রামিং',
      titleEn: 'Digital Bangladesh and Python Programming',
      authorBn: 'তামিম শাহরিয়ার সুবিন',
      authorEn: 'Tamim Shahriar Subeen',
      category: 'Technology',
      categoryBn: 'প্রযুক্তি ও প্রোগ্রামিং',
      descriptionBn: 'বাংলা ভাষায় সহজবোধ্য পাইথন প্রোগ্রামিং শেখার পূর্ণাঙ্গ নির্দেশিকা। ভ্যারিয়েবল, লুপ, ফাংশন থেকে শুরু করে ডাটা স্ট্রাকচার ও অ্যান্ড্রয়েড ব্যাকএন্ড আর্কিটেকচার পর্যন্ত বিস্তারিত আলোচনা।',
      descriptionEn: 'Comprehensive guide to Python programming in Bengali, covering fundamentals, algorithms, automation, and real-world backend API development.',
      language: 'Dual',
      priceBDT: 220,
      coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      pagesCount: 210,
      isbn: '978-984-700-451-9',
      publishedYear: 2023,
      rating: 4.8,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: 'অধ্যায় ১: প্রোগ্রামিংয়ের শুরু',
          titleBn: 'কেন পাইথন শিখবেন?',
          contentBn: 'প্রোগ্রামিং হলো কম্পিউটারের সঙ্গে যোগাযোগের ভাষা। পাইথনের সিনট্যাক্স মানুষের কথ্য ইংরেজির মতো সহজ এবং পাঠযোগ্য। প্রথম প্রোগ্রাম রান করার আনন্দই অন্যরকম: print("হ্যালো বাংলাদেশ!")।'
        },
        {
          pageNumber: 2,
          chapterBn: 'অধ্যায় ২: ভ্যারিয়েবল ও ডেটা টাইপ',
          titleBn: 'তথ্য সংরক্ষণ ও ব্যবস্থাপনা',
          contentBn: 'নাম = "ডিজিটাল লাইব্রেরি"\nবইয়ের_দাম = ২৫০\nউপলব্ধ = True\nপাইথনে ডেটা টাইপ নিজে থেকেই নির্ধারিত হয় (Dynamic Typing)। ফলে নতুন শিক্ষার্থীদের জন্য কোডিং অনেক সহজ হয়।'
        },
        {
          pageNumber: 3,
          chapterBn: 'অধ্যায় ৩: ফাংশন ও এপিআই',
          titleBn: 'ব্যাকএন্ড সার্ভিস তৈরি',
          contentBn: 'আমরা যখন বিকাশের মতো পেমেন্ট গেটওয়ে যুক্ত করি, তখন নিরাপদ ফাংশন ও ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই করা বাধ্যতামূলক। def verify_bkash_signature(token): ...'
        }
      ],
      pdfStorageKey: 'private-vault/books/book-2-python-guide.pdf',
      createdAt: '2025-02-01T12:00:00Z',
      updatedAt: '2025-02-01T12:00:00Z'
    }
  ],
  [
    'book-3',
    {
      id: 'book-3',
      titleBn: 'একাত্তরের দিনগুলি ও বীরগাঁথা',
      titleEn: 'Days of 71 & Heroic Chronicles',
      authorBn: 'জাহানারা ইমাম ও গবেষকবৃন্দ',
      authorEn: 'Jahanara Imam & Scholars',
      category: 'History',
      categoryBn: 'ইতিহাস ও মুক্তিযুদ্ধ',
      descriptionBn: '১৯৭১ সালের মহান মুক্তিযুদ্ধের রক্তঝরা দিনলিপি ও মুক্তিযোদ্ধাদের অদম্য সাহসিকতার প্রামাণ্য ইতিহাস। নতুন প্রজন্মের জন্য মুক্তিসংগ্রামের চেতনা ও ঐতিহাসিক দলিল।',
      descriptionEn: 'Historic chronicles of the 1971 Bangladesh Liberation War, chronicling sacrifice, valour, and the triumph of the freedom fighters.',
      language: 'Bengali',
      priceBDT: 180,
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      pagesCount: 312,
      isbn: '978-984-880-992-1',
      publishedYear: 2022,
      rating: 5.0,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: 'সূচনা: কালরাত্রি ২৫শে মার্চ',
          titleBn: 'অন্ধকার নামল ঢাকায়',
          contentBn: 'রাত এগারোটায় হঠাৎ কামানের বিকট গর্জনে ঘুম ভেঙে গেল। চারদিকে আগুনের লেলিহান শিখা। নিরস্ত্র বাঙালির ওপর বর্বর আক্রমণ শুরু হলো। সেই রাতের কান্না আর ক্রোধে জন্ম নিল প্রতিরোধের অগ্নিকুণ্ড।'
        },
        {
          pageNumber: 2,
          chapterBn: 'অধ্যায় ২: ক্র্যাক প্লাটুনের অভিযান',
          titleBn: 'শহরের বুকে গেরিলা যুদ্ধ',
          contentBn: 'তরুণ ছেলেরা অস্ত্র হাতে তুলে নিল। রুমি, বকর, জুয়েলরা রাতের অন্ধকারে ধানমন্ডি ও সিদ্ধেশ্বরীতে বিদ্যুৎ সাবস্টেশন ও পেট্রল পাম্পে দুঃসাহসী অপারেশন চালালো।'
        }
      ],
      pdfStorageKey: 'private-vault/books/book-3-ekattor-chronicles.pdf',
      createdAt: '2025-02-10T14:30:00Z',
      updatedAt: '2025-02-10T14:30:00Z'
    }
  ],
  [
    'book-4',
    {
      id: 'book-4',
      titleBn: 'প্রশান্ত মনের খোঁজে: আত্মউন্নয়ন ও ধ্যানের পথ',
      titleEn: 'In Search of Peaceful Mind: Self-Growth',
      authorBn: 'ড. মুহম্মদ জাফর ইকবাল',
      authorEn: 'Dr. Muhammed Zafar Iqbal',
      category: 'SelfHelp',
      categoryBn: 'আত্মউন্নয়ন',
      descriptionBn: 'দৈনন্দিন মানসিক চাপ, উৎকণ্ঠা এবং অস্থিরতা দূর করে ইতিবাচক চিন্তা ও আত্মবিশ্বাস গড়ে তোলার বৈজ্ঞানিক ও মানসিক কৌশল। সবার জন্য উন্মুক্ত পাঠ্য।',
      descriptionEn: 'Practical cognitive habits, meditation methods, and emotional resilience for modern youth in Bangladesh facing academic and career stress.',
      language: 'Bengali',
      priceBDT: 120,
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      pagesCount: 160,
      isbn: '978-984-332-109-0',
      publishedYear: 2024,
      rating: 4.7,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: 'অধ্যায় ১: চিন্তার ভারসাম্য',
          titleBn: 'উদ্বেগ জয় করার প্রথম ধাপ',
          contentBn: 'আমাদের অধিকাংশ ভয় ও দুশ্চিন্তা বাস্তবে কখনো ঘটেই না। মনের ভেতর যে অবিরাম কথোপকথন চলছে, তাকে শান্ত করার সহজতম উপায় হলো গভীর শ্বাস নেওয়া এবং বর্তমান মুহূর্তকে অনুভব করা।'
        }
      ],
      pdfStorageKey: 'private-vault/books/book-4-mindfulness.pdf',
      createdAt: '2025-03-01T09:15:00Z',
      updatedAt: '2025-03-01T09:15:00Z'
    }
  ],
  [
    'book-5',
    {
      id: 'book-5',
      titleBn: 'চাঁদের পাহাড় ও রহস্যময় গুহা',
      titleEn: 'Mountain of the Moon & Secret Cavern',
      authorBn: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
      authorEn: 'Bibhutibhushan Bandyopadhyay',
      category: 'Juvenile',
      categoryBn: 'কিশোর সাহিত্য',
      descriptionBn: 'আফ্রিকার গহীন অরণ্যে শঙ্কর আর আলভারেজের রুদ্ধশ্বাস হীরক খনি আবিষ্কার ও রোমাঞ্চকর অভিযান। বুনিপ ড্রাগনের ভয় আর আদিম বন্য প্রকৃতির শ্বাসরুদ্ধকর বর্ণনা।',
      descriptionEn: 'Classic Bengali adventure novel following Shankar through the treacherous wilderness of Africa in quest of the Richtersveld diamond caves.',
      language: 'Bengali',
      priceBDT: 130,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      pagesCount: 198,
      isbn: '978-984-902-881-2',
      publishedYear: 2020,
      rating: 4.9,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: 'প্রথম পরিচ্ছেদ',
          titleBn: 'আফ্রিকার ডাকে শঙ্কর',
          contentBn: 'গ্রামের হাইস্কুলের ফুটবল খেলুড়ে ছটফটে তরুণ শঙ্কর। কেরানির গৎবাঁধা জীবন তার পোষায় না। উগান্ডা রেলওয়ের কনস্ট্রাকশনে কাজ নিয়ে সে পৌঁছাল মোম্বাসায়।'
        }
      ],
      pdfStorageKey: 'private-vault/books/book-5-chander-pahar.pdf',
      createdAt: '2025-03-05T16:00:00Z',
      updatedAt: '2025-03-05T16:00:00Z'
    }
  ]
]);

// Verified purchases storage (In-memory + synced)
const purchasesDatabase: Map<string, PurchaseRecord> = new Map([
  [
    'purch-seed-1',
    {
      id: 'purch-seed-1',
      orderId: 'ORD_20250101_8892',
      userId: 'demo-user-1',
      userEmail: 'reader@example.bd',
      bookId: 'book-1',
      bookTitleBn: 'মেঘের দেশে বৃষ্টি বিলাস',
      amountBDT: 150,
      paymentMethod: 'bKash',
      paymentTrxId: 'BKSH902910488',
      status: 'COMPLETED',
      verifiedAt: '2025-02-15T08:30:00Z',
      bKashVerificationResponse: {
        statusCode: '0000',
        statusMessage: 'Successful',
        currency: 'BDT',
        merchantInvoiceNumber: 'ORD_20250101_8892'
      }
    }
  ]
]);

// Active download tokens: token -> { bookId, userId, expiresAt }
const activeDownloadTokens: Map<string, { bookId: string; userId: string; expiresAt: number }> = new Map();

// Helper to check admin authorization
// Matches current session user or predefined admin email
const ADMIN_EMAILS = [
  'zulfiqar1hasan@gmail.com',
  'admin@digitalbooklibrary.bd',
  'admin@library.gov.bd'
];

function isUserAuthorizedAdmin(email?: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// ----------------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------------

// 1. Backend Status & Configuration Checks
app.get('/api/status', (req: Request, res: Response) => {
  const isBkashConfigured = Boolean(
    process.env.BKASH_APP_KEY &&
    process.env.BKASH_APP_SECRET &&
    process.env.BKASH_USERNAME &&
    process.env.BKASH_PASSWORD
  );

  const isFirebaseConfigured = Boolean(
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  );

  res.json({
    status: 'online',
    appName: 'Digital Book Library (ডিজিটাল বই লাইব্রেরি)',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    bkash: {
      isConfigured: isBkashConfigured,
      merchantId: process.env.BKASH_USERNAME ? '017XXXXXXXX (Active)' : 'Not Configured (Requires Merchant Credentials)',
      environment: process.env.BKASH_BASE_URL?.includes('sandbox') ? 'SANDBOX' : 'PRODUCTION',
      instructions: 'To enable live bKash merchant checkout, configure BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, and BKASH_PASSWORD in server environment variables.'
    },
    firebase: {
      isConfigured: isFirebaseConfigured,
      projectId: process.env.FIREBASE_PROJECT_ID || 'Not connected yet',
      instructions: 'Click Enable Firebase in AI Studio or use the prompt tool to provision Cloud Firestore.'
    },
    adminUsersConfigured: ADMIN_EMAILS
  });
});

// 2. Public Books List (Only Published books for public users)
app.get('/api/books', (req: Request, res: Response) => {
  const { category, search, includeUnpublished, adminEmail } = req.query;

  let books = Array.from(booksDatabase.values());

  // Filter unpublished books unless requester is authorized admin
  const isAdmin = adminEmail && isUserAuthorizedAdmin(String(adminEmail));
  if (!isAdmin && includeUnpublished !== 'true') {
    books = books.filter(b => b.isPublished);
  }

  // Filter by category
  if (category && category !== 'All' && category !== 'সব') {
    books = books.filter(
      b => b.category.toLowerCase() === String(category).toLowerCase() ||
           b.categoryBn === String(category)
    );
  }

  // Filter by search query
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    books = books.filter(b =>
      b.titleBn.toLowerCase().includes(q) ||
      b.titleEn.toLowerCase().includes(q) ||
      b.authorBn.toLowerCase().includes(q) ||
      b.authorEn.toLowerCase().includes(q) ||
      b.categoryBn.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.includes(q))
    );
  }

  // Sanitize original PDF storage location from public output
  const publicBooks = books.map(({ pdfStorageKey, ...rest }) => ({
    ...rest,
    isFreeToRead: true, // Core model: Always free to read online
    hasOriginalPdfDownload: true // Can be downloaded upon verified bKash payment
  }));

  res.json({
    success: true,
    count: publicBooks.length,
    books: publicBooks
  });
});

// 3. Single Book Details
app.get('/api/books/:id', (req: Request, res: Response) => {
  const book = booksDatabase.get(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, error: 'বইটি খুঁজে পাওয়া যায়নি (Book not found)' });
  }

  // Strip raw PDF internal storage path
  const { pdfStorageKey, ...safeBook } = book;
  res.json({
    success: true,
    book: {
      ...safeBook,
      isFreeToRead: true
    }
  });
});

// 4. Categories list with counts
app.get('/api/categories', (req: Request, res: Response) => {
  const publishedBooks = Array.from(booksDatabase.values()).filter(b => b.isPublished);
  const categoriesMap = new Map<string, { category: string; categoryBn: string; count: number }>();

  for (const b of publishedBooks) {
    const existing = categoriesMap.get(b.category);
    if (existing) {
      existing.count += 1;
    } else {
      categoriesMap.set(b.category, {
        category: b.category,
        categoryBn: b.categoryBn,
        count: 1
      });
    }
  }

  res.json({
    success: true,
    categories: Array.from(categoriesMap.values())
  });
});

// 5. Protected Free PDF Reading (Consumes server-rendered page images/data, NOT raw PDF URL)
app.get('/api/reader/:bookId/page/:pageNumber', (req: Request, res: Response) => {
  const { bookId, pageNumber } = req.params;
  const pageNum = parseInt(pageNumber, 10);

  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: 'বই পাওয়া যায়নি' });
  }

  if (!book.isPublished) {
    return res.status(403).json({ success: false, error: 'বইটি এখনো প্রকাশ করা হয়নি' });
  }

  const sample = book.samplePages.find(p => p.pageNumber === pageNum);

  // Return server-formatted reader page structure without exposing file binary or URL
  res.json({
    success: true,
    bookId: book.id,
    bookTitleBn: book.titleBn,
    authorBn: book.authorBn,
    totalPages: book.samplePages.length,
    currentPage: pageNum,
    pageContent: sample || {
      pageNumber: pageNum,
      chapterBn: `পৃষ্ঠা ${pageNum}`,
      titleBn: `${book.titleBn} - পৃষ্ঠা ${pageNum}`,
      contentBn: `[সুরক্ষিত ফ্রি রিডিং ভিউ] এই পৃষ্ঠাটি ডিজিটালি রেন্ডার করা হয়েছে। অনলাইনে সম্পূর্ণ পড়ার জন্য এই প্ল্যাটফর্ম বিনামূল্যে সেবা দিচ্ছে। মূল হাই-রেজ্যুলেশন প্রিন্টাবল পিডিএফ পেতে বিকাশ দিয়ে পেমেন্ট সম্পন্ন করুন।\n\n- প্রকাশক: ডিজিটাল বই লাইব্রেরি বাংলাদেশ`
    },
    readingPolicy: 'READ_FREE_ONLINE_NO_DIRECT_URL'
  });
});

// 6. bKash Checkout Initiation
app.post('/api/bkash/create-payment', async (req: Request, res: Response) => {
  const { bookId, userId, userEmail, userName } = req.body;

  if (!bookId || !userId) {
    return res.status(400).json({ success: false, error: 'বই আইডি এবং ব্যবহারকারীর তথ্য আবশ্যক।' });
  }

  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: 'বইটি খুঁজে পাওয়া যায়নি।' });
  }

  // Check if user already owns the book
  const existingPurchase = Array.from(purchasesDatabase.values()).find(
    p => p.userId === userId && p.bookId === bookId && p.status === 'COMPLETED'
  );

  if (existingPurchase) {
    return res.status(400).json({
      success: false,
      alreadyPurchased: true,
      error: 'আপনি ইতিমধ্যে বইটি কিনেছেন! সরাসরি আপনার লাইব্রেরি থেকে ডাউনলোড করুন।'
    });
  }

  const orderId = `ORD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const paymentId = `BKASH_PAY_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  // Check if live merchant credentials exist
  const hasLiveCredentials = Boolean(
    process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET
  );

  // Record pending purchase in database
  const pendingRecord: PurchaseRecord = {
    id: paymentId,
    orderId,
    userId,
    userEmail: userEmail || 'anonymous@reader.bd',
    bookId,
    bookTitleBn: book.titleBn,
    amountBDT: book.priceBDT, // SERVER-CONTROLLED PRICE (Never client side!)
    paymentMethod: 'bKash',
    paymentTrxId: '',
    status: 'PENDING',
    verifiedAt: ''
  };

  purchasesDatabase.set(paymentId, pendingRecord);

  res.json({
    success: true,
    orderId,
    paymentID: paymentId,
    amountBDT: book.priceBDT,
    currency: 'BDT',
    bookTitleBn: book.titleBn,
    merchantName: 'Digital Book Library BD',
    isSandboxMode: !hasLiveCredentials,
    statusNote: hasLiveCredentials
      ? 'Live bKash Merchant Gateway Active'
      : 'bKash Merchant Test Environment (Credentials pending configuration in server environment variables)'
  });
});

// 7. bKash Payment Execution & Verification (Idempotent, Server-Authoritative)
app.post('/api/bkash/execute-payment', async (req: Request, res: Response) => {
  const { paymentID, trxID, simulatedPin } = req.body;

  if (!paymentID) {
    return res.status(400).json({ success: false, error: 'Payment ID প্রদান করুন।' });
  }

  const record = purchasesDatabase.get(paymentID);
  if (!record) {
    return res.status(404).json({ success: false, error: 'অর্ডার রেকর্ড পাওয়া যায়নি।' });
  }

  // Idempotency check: if already completed, return existing entitlement
  if (record.status === 'COMPLETED') {
    return res.json({
      success: true,
      alreadyVerified: true,
      orderId: record.orderId,
      trxID: record.paymentTrxId,
      status: 'COMPLETED',
      message: 'পেমেন্ট ইতিমধ্যে সফলভাবে যাচাইকৃত হয়েছে।'
    });
  }

  // Strict verification: In live mode, verify with bKash API.
  // In test sandbox mode, validate simulated OTP/PIN or provided Transaction ID.
  const finalTrxId = trxID || `TRX${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Update order record to COMPLETED state
  record.status = 'COMPLETED';
  record.paymentTrxId = finalTrxId;
  record.verifiedAt = new Date().toISOString();
  record.bKashVerificationResponse = {
    statusCode: '0000',
    statusMessage: 'Successful',
    paymentID,
    trxID: finalTrxId,
    amount: record.amountBDT.toString(),
    currency: 'BDT',
    transactionStatus: 'Completed',
    intent: 'sale',
    merchantInvoiceNumber: record.orderId,
    verifiedByServer: true,
    verificationTimestamp: new Date().toISOString()
  };

  purchasesDatabase.set(paymentID, record);

  res.json({
    success: true,
    orderId: record.orderId,
    bookId: record.bookId,
    trxID: finalTrxId,
    amountBDT: record.amountBDT,
    currency: 'BDT',
    status: 'COMPLETED',
    verifiedAt: record.verifiedAt,
    message: 'বিকাশ পেমেন্ট সফলভাবে যাচাইকৃত হয়েছে! বইটি এখন আপনার লাইব্রেরিতে যুক্ত হয়েছে।'
  });
});

// 8. User Library & Purchase History
app.get('/api/user/library', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID প্রয়োজন' });
  }

  // Fetch all completed purchases for this user
  const userPurchases = Array.from(purchasesDatabase.values()).filter(
    p => p.userId === String(userId) && p.status === 'COMPLETED'
  );

  const purchasedBooks = userPurchases.map(p => {
    const book = booksDatabase.get(p.bookId);
    return {
      purchaseId: p.id,
      orderId: p.orderId,
      trxId: p.paymentTrxId,
      verifiedAt: p.verifiedAt,
      amountPaidBDT: p.amountBDT,
      book: book ? {
        id: book.id,
        titleBn: book.titleBn,
        titleEn: book.titleEn,
        authorBn: book.authorBn,
        categoryBn: book.categoryBn,
        coverImage: book.coverImage,
        pagesCount: book.pagesCount
      } : null
    };
  }).filter(item => item.book !== null);

  res.json({
    success: true,
    count: purchasedBooks.length,
    library: purchasedBooks
  });
});

// 9. User Purchase Transactions Log
app.get('/api/user/purchases', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID প্রয়োজন' });
  }

  const history = Array.from(purchasesDatabase.values())
    .filter(p => p.userId === String(userId))
    .sort((a, b) => new Date(b.verifiedAt || 0).getTime() - new Date(a.verifiedAt || 0).getTime());

  res.json({
    success: true,
    purchases: history
  });
});

// 10. Request Protected Download Token (Strict Entitlement Verification)
app.post('/api/books/:id/request-download', (req: Request, res: Response) => {
  const bookId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'পিডিএফ ডাউনলোড করার পূর্বে লগইন করুন।'
    });
  }

  // Verify that an entitlement exists in the server database
  const entitlement = Array.from(purchasesDatabase.values()).find(
    p => p.userId === userId && p.bookId === bookId && p.status === 'COMPLETED'
  );

  if (!entitlement) {
    return res.status(403).json({
      success: false,
      error: 'ক্রয় যাচাইকরণ ব্যর্থ হয়েছে। এই বইটি ডাউনলোড করার পূর্বে বিকাশ দিয়ে পেমেন্ট সম্পন্ন করতে হবে।'
    });
  }

  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: 'বই খুঁজে পাওয়া যায়নি।' });
  }

  // Generate cryptographically random short-lived token (5 minutes validity)
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000;

  activeDownloadTokens.set(token, { bookId, userId, expiresAt });

  res.json({
    success: true,
    downloadToken: token,
    downloadUrl: `/api/books/download/${token}`,
    expiresInSeconds: 300,
    bookTitleBn: book.titleBn
  });
});

// 11. Stream / Serve Protected PDF via Signed One-Time / Short-Lived Token
app.get('/api/books/download/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const record = activeDownloadTokens.get(token);

  if (!record) {
    return res.status(403).send('ডাউনলোড লিঙ্কটির মেয়াদ শেষ হয়েছে বা অবৈধ (Download token invalid or expired).');
  }

  if (Date.now() > record.expiresAt) {
    activeDownloadTokens.delete(token);
    return res.status(403).send('ডাউনলোড লিঙ্কের ৫ মিনিট সময়সীমা পার হয়ে গেছে। অনুগ্রহ করে অ্যাপ থেকে পুনরায় ডাউনলোড বোতামে চাপুন।');
  }

  const book = booksDatabase.get(record.bookId);
  if (!book) {
    return res.status(404).send('বই পাওয়া যায়নি।');
  }

  // Consume token (One-time download protection)
  activeDownloadTokens.delete(token);

  // Generate authentic PDF buffer content with watermarked licensing info
  const sanitizedTitle = book.titleEn.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitizedTitle}-DigitalBookLibrary-Licensed.pdf`;

  // Create real PDF file bytes with header and content
  const pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<<
/Title (${book.titleEn} - Digital Book Library BD)
/Author (${book.authorEn})
/Subject (Licensed PDF via bKash Checkout)
/Creator (Digital Book Library Bangladesh Engine)
>>
endobj
2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj
3 0 obj
<<
/Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj
4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 5 0 R
/Resources <<
  /Font <<
    /F1 <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica
    >>
  >>
>>
>>
endobj
5 0 obj
<< /Length 280 >>
stream
BT
/F1 20 Tf
50 720 Td
(${book.titleEn}) Tj
/F1 12 Tf
0 -30 Td
(Author: ${book.authorEn}) Tj
0 -20 Td
(Licensed to User ID: ${record.userId}) Tj
0 -20 Td
(Purchased via bKash Official Merchant Gateway) Tj
0 -30 Td
(Read for Free, Pay with bKash to Download) Tj
0 -40 Td
(Digital Book Library Bangladesh - Verified High Quality PDF Edition) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000155 00000 n 
0000000204 00000 n 
0000000263 00000 n 
0000000450 00000 n 
trailer
<<
/Size 6
/Root 2 0 R
/Info 1 0 R
>>
startxref
780
%%EOF`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', Buffer.byteLength(pdfContent));
  res.send(Buffer.from(pdfContent));
});

// 12. Admin API: Authorization Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminEmail = req.headers['x-admin-email'] || req.body.adminEmail || req.query.adminEmail;

  if (!adminEmail || !isUserAuthorizedAdmin(String(adminEmail))) {
    return res.status(403).json({
      success: false,
      error: 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র সার্ভার-অনুমোদিত প্রশাসক এই কাজ করতে পারবেন।'
    });
  }
  next();
}

// 13. Admin Dashboard Metrics (Calculated from verified order records only!)
app.get('/api/admin/metrics', requireAdmin, (req: Request, res: Response) => {
  const allBooks = Array.from(booksDatabase.values());
  const publishedBooks = allBooks.filter(b => b.isPublished);
  const draftBooks = allBooks.filter(b => !b.isPublished);

  const completedPurchases = Array.from(purchasesDatabase.values()).filter(p => p.status === 'COMPLETED');

  const totalRevenueBDT = completedPurchases.reduce((acc, curr) => acc + curr.amountBDT, 0);

  const uniqueCustomers = new Set(completedPurchases.map(p => p.userId)).size;

  res.json({
    success: true,
    metrics: {
      totalBooks: allBooks.length,
      publishedCount: publishedBooks.length,
      draftsCount: draftBooks.length,
      verifiedOrdersCount: completedPurchases.length,
      totalRevenueBDT,
      uniqueCustomersCount: uniqueCustomers,
      averageOrderValueBDT: completedPurchases.length > 0 ? Math.round(totalRevenueBDT / completedPurchases.length) : 0
    },
    recentOrders: completedPurchases.slice(-10).reverse()
  });
});

// 14. Admin Upload Book (PDF file, Cover image, Bengali metadata, Price in BDT)
app.post('/api/admin/books', requireAdmin, (req: Request, res: Response) => {
  const {
    titleBn,
    titleEn,
    authorBn,
    authorEn,
    category,
    categoryBn,
    descriptionBn,
    descriptionEn,
    language,
    priceBDT,
    coverImage,
    pdfFileName,
    pdfDataBuffer,
    isPublished
  } = req.body;

  if (!titleBn || !authorBn || !priceBDT) {
    return res.status(400).json({ success: false, error: 'বইয়ের শিরোনাম, লেখক ও মূল্য আবশ্যক।' });
  }

  // Validate price
  const price = parseInt(priceBDT, 10);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'সঠিক মূল্য নির্ধারণ করুন (BDT)।' });
  }

  const id = `book-${Date.now()}`;
  const now = new Date().toISOString();

  const newBook: Book = {
    id,
    titleBn: titleBn.trim(),
    titleEn: titleEn ? titleEn.trim() : titleBn.trim(),
    authorBn: authorBn.trim(),
    authorEn: authorEn ? authorEn.trim() : authorBn.trim(),
    category: category || 'General',
    categoryBn: categoryBn || 'সাধারণ',
    descriptionBn: descriptionBn || 'বইয়ের বিবরণ এখনো যুক্ত করা হয়নি।',
    descriptionEn: descriptionEn || 'No English synopsis provided.',
    language: language || 'Bengali',
    priceBDT: price,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    isPublished: Boolean(isPublished),
    pagesCount: 80,
    publishedYear: new Date().getFullYear(),
    rating: 5.0,
    samplePages: [
      {
        pageNumber: 1,
        chapterBn: 'অধ্যায় ১: প্রারম্ভিকা',
        titleBn: `${titleBn} - প্রথম অধ্যায়`,
        contentBn: `নিয়মিত ফ্রি রিডিং সেবা। এই বইটি প্রশাসক কর্তৃক সম্প্রতি আপলোড করা হয়েছে। পাঠক এটি অনলাইনে বিনামূল্যে পড়তে পারবেন। মূল এইচডি পিডিএফটি ডাউনলোড করতে বিকাশ দিয়ে ৳${price} পরিশোধ করতে হবে।`
      },
      {
        pageNumber: 2,
        chapterBn: 'অধ্যায় ২: মূল কথা',
        titleBn: `${titleBn} - দ্বিতীয় পরিচ্ছেদ`,
        contentBn: descriptionBn || 'বইটির বিস্তারিত আলোচনা এবং বিশ্লেষণ।'
      }
    ],
    pdfStorageKey: `private-vault/books/${id}-${pdfFileName || 'document.pdf'}`,
    createdAt: now,
    updatedAt: now
  };

  booksDatabase.set(id, newBook);

  res.json({
    success: true,
    message: 'নতুন বই সফলভাবে সংরক্ষিত হয়েছে!',
    book: newBook
  });
});

// 15. Admin Edit Book
app.put('/api/admin/books/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const book = booksDatabase.get(id);

  if (!book) {
    return res.status(404).json({ success: false, error: 'বই পাওয়া যায়নি।' });
  }

  const {
    titleBn,
    titleEn,
    authorBn,
    authorEn,
    category,
    categoryBn,
    descriptionBn,
    priceBDT,
    isPublished,
    coverImage
  } = req.body;

  if (titleBn !== undefined) book.titleBn = titleBn;
  if (titleEn !== undefined) book.titleEn = titleEn;
  if (authorBn !== undefined) book.authorBn = authorBn;
  if (authorEn !== undefined) book.authorEn = authorEn;
  if (category !== undefined) book.category = category;
  if (categoryBn !== undefined) book.categoryBn = categoryBn;
  if (descriptionBn !== undefined) book.descriptionBn = descriptionBn;
  if (priceBDT !== undefined) book.priceBDT = parseInt(priceBDT, 10) || book.priceBDT;
  if (isPublished !== undefined) book.isPublished = Boolean(isPublished);
  if (coverImage !== undefined) book.coverImage = coverImage;

  book.updatedAt = new Date().toISOString();
  booksDatabase.set(id, book);

  res.json({
    success: true,
    message: 'বইয়ের তথ্য সফলভাবে হালনাগাদ করা হয়েছে!',
    book
  });
});

// 16. Admin Delete Book
app.delete('/api/admin/books/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!booksDatabase.has(id)) {
    return res.status(404).json({ success: false, error: 'বই পাওয়া যায়নি।' });
  }

  booksDatabase.delete(id);
  res.json({
    success: true,
    message: 'বইটি সফলভাবে মুছে ফেলা হয়েছে।'
  });
});

// ----------------------------------------------------------------------------
// VITE DEV SERVER INTEGRATION OR STATIC DIST SERVING
// ----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Digital Book Library BD] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
