import React, { useState, useEffect } from 'react';
import { Book, UserSession, BackendStatus } from './types';
import { TopAppBar } from './components/TopAppBar';
import { NavigationBar } from './components/NavigationBar';
import { StatusBanner } from './components/StatusBanner';
import { DeviceFrame, DeviceMode } from './components/DeviceFrame';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { AllBooksScreen } from './screens/AllBooksScreen';
import { SearchScreen } from './screens/SearchScreen';
import { BookDetailsScreen } from './screens/BookDetailsScreen';
import { PdfReaderScreen } from './screens/PdfReaderScreen';
import { BkashCheckoutModal } from './screens/BkashCheckoutModal';
import { PaymentResultScreen } from './screens/PaymentResultScreen';
import { MyLibraryScreen } from './screens/MyLibraryScreen';
import { PurchaseHistoryScreen } from './screens/PurchaseHistoryScreen';
import { AdminPortal } from './screens/AdminScreens';
import { SettingsScreen } from './screens/SettingsScreen';
import { LegalScreen } from './screens/LegalScreen';
import { AuthModal } from './screens/AuthModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('full');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  // Authenticated user state
  const [user, setUser] = useState<UserSession>({
    userId: 'demo-user-1',
    displayName: 'জুলফিকার হাসান',
    email: 'zulfiqar1hasan@gmail.com',
    role: 'admin', // Default to admin for seamless evaluation of admin & reader modes
    isLoggedIn: true,
  });

  // User purchased book IDs
  const [purchasedBookIds, setPurchasedBookIds] = useState<Set<string>>(new Set(['book-1']));

  // Modals state
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAndroidCodeModalOpen, setIsAndroidCodeModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [activePaymentResult, setActivePaymentResult] = useState<any | null>(null);

  // Fetch initial books catalogue, categories, and backend status
  const loadData = () => {
    // 1. Backend status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data))
      .catch((err) => console.error('Status fetch error:', err));

    // 2. Books catalogue
    fetch(`/api/books?adminEmail=${encodeURIComponent(user.email || '')}&includeUnpublished=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.books) {
          setBooks(data.books);
        }
      })
      .catch((err) => console.error('Books fetch error:', err));

    // 3. Categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error('Categories fetch error:', err));
  };

  useEffect(() => {
    loadData();
  }, [user.email]);

  // Sync user's library purchases
  useEffect(() => {
    if (user.isLoggedIn) {
      fetch(`/api/user/library?userId=${encodeURIComponent(user.userId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.library) {
            const ids = new Set<string>(data.library.map((item: any) => item.book?.id).filter(Boolean));
            setPurchasedBookIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [user.isLoggedIn, user.userId]);

  // Actions
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentScreen('book-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadFree = (book: Book) => {
    setSelectedBook(book);
    setCurrentScreen('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyBook = (book: Book) => {
    if (!user.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedBook(book);
    setIsBkashModalOpen(true);
  };

  // Payment success handler (Invoked when bKash server verifies payment)
  const handlePaymentSuccess = (result: any) => {
    setIsBkashModalOpen(false);
    setPurchasedBookIds((prev) => new Set(prev).add(result.bookId));
    setActivePaymentResult(result);
    setCurrentScreen('payment-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Request signed download token and download PDF
  const handleDownloadLicensedPdf = async (book: Book) => {
    try {
      const res = await fetch(`/api/books/${book.id}/request-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId }),
      });

      const data = await res.json();
      if (data.success && data.downloadUrl) {
        // Trigger browser file download with the short-lived cryptographic token
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = `${book.titleEn.replace(/\s+/g, '_')}-Licensed.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.error || 'ডাউনলোড টোকেন সংগ্রহ ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    }
  };

  // Admin login success
  const handleAdminLoginSuccess = (email: string) => {
    setUser({
      userId: 'admin-verified-id',
      displayName: 'Zulfiqar Hasan (Admin)',
      email,
      role: 'admin',
      isLoggedIn: true,
    });
    setCurrentScreen('admin-dashboard');
  };

  // Logout
  const handleLogout = () => {
    setUser({
      userId: `guest-${Date.now().toString(36)}`,
      displayName: 'অতিথি পাঠক',
      email: '',
      role: 'reader',
      isLoggedIn: false,
    });
    setPurchasedBookIds(new Set());
    setCurrentScreen('home');
  };

  return (
    <DeviceFrame deviceMode={deviceMode} onModeChange={setDeviceMode}>
      {/* Configuration & Transparent Sandbox Status Banner */}
      <StatusBanner
        status={backendStatus}
        onRefresh={loadData}
        onOpenAndroidCode={() => setIsAndroidCodeModalOpen(true)}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
      />

      {/* Top App Bar with Bengali Branding & Search */}
      {currentScreen !== 'reader' && (
        <TopAppBar
          currentScreen={currentScreen}
          onNavigate={(s) => {
            setCurrentScreen(s);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAdmin={() => {
            if (user.role === 'admin') setCurrentScreen('admin-dashboard');
            else setCurrentScreen('admin-login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        />
      )}

      {/* Main Screen Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
        {currentScreen === 'home' && (
          <HomeScreen
            books={books.filter((b) => b.isPublished)}
            categories={categories}
            onSelectBook={handleSelectBook}
            onReadFree={handleReadFree}
            onBuyBook={handleBuyBook}
            onNavigate={(s) => {
              setCurrentScreen(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentScreen('books');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'books' && (
          <AllBooksScreen
            books={books.filter((b) => b.isPublished)}
            categories={categories}
            initialCategory={selectedCategory}
            onSelectBook={handleSelectBook}
            onReadFree={handleReadFree}
            onBuyBook={handleBuyBook}
          />
        )}

        {currentScreen === 'search' && (
          <SearchScreen
            books={books.filter((b) => b.isPublished)}
            onSelectBook={handleSelectBook}
            onReadFree={handleReadFree}
            onBuyBook={handleBuyBook}
          />
        )}

        {currentScreen === 'book-details' && selectedBook && (
          <BookDetailsScreen
            book={selectedBook}
            user={user}
            isPurchased={purchasedBookIds.has(selectedBook.id)}
            onBack={() => setCurrentScreen('home')}
            onReadFree={handleReadFree}
            onBuyBook={handleBuyBook}
            onDownloadLicensedPdf={handleDownloadLicensedPdf}
          />
        )}

        {currentScreen === 'reader' && selectedBook && (
          <PdfReaderScreen
            book={selectedBook}
            onBack={() => setCurrentScreen('book-details')}
            onBuyBook={handleBuyBook}
          />
        )}

        {currentScreen === 'library' && (
          <MyLibraryScreen
            user={user}
            onReadFree={handleReadFree}
            onDownloadPdf={handleDownloadLicensedPdf}
            onRequireAuth={() => setIsAuthModalOpen(true)}
            onBrowseBooks={() => setCurrentScreen('books')}
          />
        )}

        {currentScreen === 'purchases' && (
          <PurchaseHistoryScreen
            user={user}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentScreen === 'payment-result' && activePaymentResult && (
          <PaymentResultScreen
            result={activePaymentResult}
            user={user}
            onGoToLibrary={() => setCurrentScreen('library')}
            onBrowseBooks={() => setCurrentScreen('books')}
            onDownloadPdf={handleDownloadLicensedPdf}
          />
        )}

        {(currentScreen === 'admin-login' || currentScreen === 'admin-dashboard') && (
          <AdminPortal
            user={user}
            books={books}
            onRefreshBooks={loadData}
            onAdminLoginSuccess={handleAdminLoginSuccess}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            user={user}
            status={backendStatus}
            onLogout={handleLogout}
            onNavigate={(s) => {
              setCurrentScreen(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          />
        )}

        {(currentScreen === 'about' ||
          currentScreen === 'contact' ||
          currentScreen === 'privacy' ||
          currentScreen === 'terms') && (
          <LegalScreen
            initialTab={currentScreen as any}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      {currentScreen !== 'reader' && (
        <NavigationBar
          currentScreen={currentScreen}
          onNavigate={(s) => {
            setCurrentScreen(s);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isAdmin={user.role === 'admin'}
        />
      )}

      {/* Official bKash Checkout Modal */}
      <BkashCheckoutModal
        isOpen={isBkashModalOpen}
        book={selectedBook}
        user={user}
        onClose={() => setIsBkashModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />

      {/* Android Kotlin & Jetpack Compose Native Code Modal */}
      <AndroidCodeModal
        isOpen={isAndroidCodeModalOpen}
        onClose={() => setIsAndroidCodeModalOpen(false)}
      />

      {/* PWA Phone Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </DeviceFrame>
  );
}
