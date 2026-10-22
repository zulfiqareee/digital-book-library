import React from 'react';
import { BookOpen, Download, Star, Sparkles } from 'lucide-react';
import { Book } from '../types';
import { formatBDT, toBengaliNumber } from './BengaliUtils';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onReadFree: (book: Book) => void;
  onBuy: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onReadFree, onBuy }) => {
  return (
    <div className="group bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/50 rounded-2xl p-3 flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-rose-950/20 relative">
      {/* Free to Read Guaranteed Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-slate-950 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3 h-3" />
          বিনামূল্যে পড়ুন
        </span>
      </div>

      {/* Book Cover Image */}
      <div
        onClick={() => onSelect(book)}
        className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 relative cursor-pointer mb-3 shadow-md group-hover:scale-[1.01] transition"
      >
        <img
          src={book.coverImage}
          alt={book.titleBn}
          className="w-full h-full object-cover group-hover:opacity-95 transition"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Rating and Pages */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm flex items-center gap-1 font-medium">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {toBengaliNumber(book.rating.toFixed(1))}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-slate-300">
            {toBengaliNumber(book.pagesCount)} পৃষ্ঠা
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex-1 flex flex-col cursor-pointer" onClick={() => onSelect(book)}>
        <span className="text-[11px] font-medium text-rose-400 mb-0.5">
          {book.categoryBn}
        </span>
        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-rose-300 transition">
          {book.titleBn}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-1 mb-2">
          {book.authorBn}
        </p>

        {/* Description Snippet */}
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {book.descriptionBn}
        </p>
      </div>

      {/* Price & Primary Action Buttons */}
      <div className="pt-2 border-t border-slate-700/60 mt-auto">
        <div className="flex items-baseline justify-between mb-2.5">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">মূল পিডিএফ ডাউনলোড</span>
            <span className="text-base font-extrabold text-white tracking-tight">
              {formatBDT(book.priceBDT)}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
            অনলাইনে সম্পূর্ণ ফ্রি
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onReadFree(book)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold transition cursor-pointer"
            title="অনলাইনে বিনামূল্যে সম্পূর্ণ পড়ুন"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>ফ্রি পড়ুন</span>
          </button>
          <button
            onClick={() => onBuy(book)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-950/50 transition cursor-pointer"
            title="বিকাশ দিয়ে কিনুন ও ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>বিকাশে কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
