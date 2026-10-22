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
  samplePages?: Array<{
    pageNumber: number;
    titleBn: string;
    contentBn: string;
    chapterBn?: string;
  }>;
  isFreeToRead?: boolean;
  hasOriginalPdfDownload?: boolean;
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

export interface UserSession {
  userId: string;
  displayName: string;
  email: string;
  role: 'reader' | 'admin';
  isLoggedIn: boolean;
}

export interface BackendStatus {
  status: string;
  appName: string;
  environment: string;
  serverTime: string;
  bkash: {
    isConfigured: boolean;
    merchantId: string;
    environment: string;
    instructions: string;
  };
  firebase: {
    isConfigured: boolean;
    projectId: string;
    instructions: string;
  };
  adminUsersConfigured: string[];
}

export interface AdminMetrics {
  totalBooks: number;
  publishedCount: number;
  draftsCount: number;
  verifiedOrdersCount: number;
  totalRevenueBDT: number;
  uniqueCustomersCount: number;
  averageOrderValueBDT: number;
}
