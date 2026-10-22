import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';

interface AllBooksScreenProps {
  books: Book[];
  categories: Array<{ category: string; categoryBn: string; count: number }>;
  initialCategory?: string;
  onSelectBook: (book: Book) => void;
  onReadFree: (book: Book) => void;
  onBuyBook: (book: Book) => void;
}

export const AllBooksScreen: React.FC<AllBooksScreenProps> = ({
  books,
  categories,
  initialCategory = 'All',
  onSelectBook,
  onReadFree,
  onBuyBook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'সব') {
      result = result.filter(
        (b) => b.category.toLowerCase() === selectedCategory.toLowerCase() || b.categoryBn === selectedCategory
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.titleBn.toLowerCase().includes(q) ||
          b.titleEn.toLowerCase().includes(q) ||
          b.authorBn.toLowerCase().includes(q) ||
          b.authorEn.toLowerCase().includes(q) ||
          b.categoryBn.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.priceBDT - b.priceBDT);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.priceBDT - a.priceBDT);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [books, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header and Search Box */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
          সকল প্রকাশিত বইসমূহ
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          সরাসরি অনলাইনে বিনামূল্যে পৃষ্ঠা পড়ুন অথবা হাই-রেজ্যুলেশন পিডিএফ বিকাশে কিনুন
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বইয়ের নাম বা লেখকের নাম দিয়ে খুঁজুন..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="featured">জনপ্রিয়তা অনুযায়ী</option>
            <option value="rating">রেটিং অনুযায়ী</option>
            <option value="priceAsc">দাম: কম থেকে বেশি</option>
            <option value="priceDesc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Categories Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          সব ({books.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.category}
            onClick={() => setSelectedCategory(c.category)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === c.category
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {c.categoryBn} ({c.count})
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onReadFree={onReadFree}
              onBuy={onBuyBook}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">কোনো বই খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mb-4">অন্য কোনো ক্যাটাগরি অথবা কিওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
};
