import React, { useState } from 'react';
import { Search, X, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from '../components/BookCard';

interface SearchScreenProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onReadFree: (book: Book) => void;
  onBuyBook: (book: Book) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  books,
  onSelectBook,
  onReadFree,
  onBuyBook,
}) => {
  const [query, setQuery] = useState('');

  const suggestions = [
    'হুমায়ূন আহমেদ',
    'পাইথন প্রোগ্রামিং',
    'একাত্তরের দিনগুলি',
    'উপন্যাস',
    'কিশোর সাহিত্য',
    'মুক্তিযুদ্ধ',
  ];

  const searchResults = query.trim()
    ? books.filter((b) => {
        const q = query.toLowerCase().trim();
        return (
          b.titleBn.toLowerCase().includes(q) ||
          b.titleEn.toLowerCase().includes(q) ||
          b.authorBn.toLowerCase().includes(q) ||
          b.authorEn.toLowerCase().includes(q) ||
          b.categoryBn.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.includes(q))
        );
      })
    : [];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
          বই অনুসন্ধান
        </h1>
        <p className="text-xs text-slate-400">
          শিরোনাম, লেখক, বা বিষয়বস্তু লিখে খুঁজুন
        </p>
      </div>

      {/* Big Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-rose-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="বইয়ের শিরোনাম, লেখক বা ক্যাটাগরি লিখুন..."
          autoFocus
          className="w-full bg-slate-800/95 border-2 border-slate-700 focus:border-rose-500 rounded-2xl pl-12 pr-10 py-3.5 text-base text-white placeholder-slate-400 focus:outline-none transition shadow-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Suggestions */}
      {!query && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            জনপ্রিয় অনুসন্ধানসমূহ:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-rose-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">
              "{query}" এর জন্য {searchResults.length}টি বই পাওয়া গেছে
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((book) => (
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
            <div className="p-8 text-center rounded-2xl bg-slate-800/40 border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">বানান ঠিক আছে কি-না যাচাই করুন।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
