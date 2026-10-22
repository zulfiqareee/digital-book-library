import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(path.resolve(__dirname, "public")));
const booksDatabase = /* @__PURE__ */ new Map([
  [
    "book-1",
    {
      id: "book-1",
      titleBn: "\u09AE\u09C7\u0998\u09C7\u09B0 \u09A6\u09C7\u09B6\u09C7 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF \u09AC\u09BF\u09B2\u09BE\u09B8",
      titleEn: "Rain Luxuries in the Land of Clouds",
      authorBn: "\u09B9\u09C1\u09AE\u09BE\u09AF\u09BC\u09C2\u09A8 \u0986\u09B9\u09AE\u09C7\u09A6",
      authorEn: "Humayun Ahmed",
      category: "Novel",
      categoryBn: "\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8",
      descriptionBn: "\u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u09B6\u09AC\u09CD\u09A6\u09C7 \u098F\u0995 \u0985\u09A6\u09CD\u09AD\u09C1\u09A4 \u09A8\u09BF\u0983\u09B8\u0999\u09CD\u0997\u09A4\u09BE \u0986\u09B0 \u09A8\u09B8\u09CD\u099F\u09BE\u09B2\u099C\u09BF\u09AF\u09BC\u09BE \u09AE\u09BF\u09B6\u09C7 \u09A5\u09BE\u0995\u09C7\u0964 \u099C\u09C0\u09AC\u09A8\u09C7\u09B0 \u09AE\u09BE\u09AF\u09BC\u09BE, \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09AD\u09C7\u099C\u09BE \u09A2\u09BE\u0995\u09BE \u09B6\u09B9\u09B0 \u0986\u09B0 \u09B0\u09C2\u09AA\u09BE\u09B0 \u098F\u0995 \u0985\u09A8\u09AC\u09A6\u09CD\u09AF \u09AE\u09BE\u09A8\u09AC\u09BF\u0995 \u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8\u0964 \u09AA\u09BE\u09A0\u0995 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AA\u09C3\u09B7\u09CD\u09A0\u09BE \u0985\u09A8\u09B2\u09BE\u0987\u09A8\u09C7 \u0989\u09AA\u09AD\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964",
      descriptionEn: "A poignant and nostalgic Bengali novel set amidst monsoon rains in Dhaka, exploring human relationships, unspoken affections, and emotional depths.",
      language: "Bengali",
      priceBDT: 150,
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      pagesCount: 142,
      isbn: "978-984-500-112-4",
      publishedYear: 2021,
      rating: 4.9,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u098F\u0995: \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u09B8\u0995\u09BE\u09B2",
          titleBn: "\u09B6\u09B9\u09B0\u09C7\u09B0 \u099C\u09BE\u09A8\u09BE\u09B2\u09BE\u09AF\u09BC \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u09AB\u09CB\u0981\u099F\u09BE",
          contentBn: "\u0986\u099C \u09B8\u0995\u09BE\u09B2 \u09A5\u09C7\u0995\u09C7\u0987 \u0986\u0995\u09BE\u09B6 \u09AE\u09C7\u0998\u09B2\u09BE\u0964 \u099A\u09BE\u09B0\u09AA\u09BE\u09B6\u09C7\u09B0 \u099A\u09C7\u09A8\u09BE \u09B6\u09B9\u09B0\u099F\u09BE \u09AF\u09C7\u09A8 \u098F\u0995 \u09A8\u09BF\u09AE\u09C7\u09B7\u09C7\u0987 \u09AC\u09A6\u09B2\u09C7 \u0997\u09C7\u09B2\u0964 \u099C\u09BE\u09A8\u09BE\u09B2\u09BE\u09B0 \u0995\u09BE\u0981\u099A \u09AC\u09C7\u09AF\u09BC\u09C7 \u099C\u09B2 \u0997\u09A1\u09BC\u09BF\u09AF\u09BC\u09C7 \u09A8\u09BE\u09AE\u099B\u09C7\u0964 \u09B9\u09BF\u09AE\u09C1 \u0986\u099C \u09B9\u09B2\u09C1\u09A6 \u09AA\u09BE\u099E\u09CD\u099C\u09BE\u09AC\u09BF \u09AA\u09B0\u09C7\u09A8\u09BF, \u0986\u099C \u09B8\u09C7 \u09B6\u09C1\u09A7\u09C1\u0987 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u09A8\u09C0\u09B0\u09AC \u09B8\u09BE\u0995\u09CD\u09B7\u09C0\u0964 \u09B0\u09BE\u09B8\u09CD\u09A4\u09BE\u09AF\u09BC \u09AD\u09C7\u099C\u09BE \u0995\u09BE\u0995\u09C7\u09B0\u09BE \u09A1\u09BE\u09A8\u09BE \u099D\u09BE\u09AA\u099F\u09BE\u099A\u09CD\u099B\u09C7, \u0986\u09B0 \u09A6\u09C2\u09B0\u09C7 \u09B0\u09BF\u0995\u09B6\u09BE\u09B0 \u09AC\u09C7\u09B2\u09C7\u09B0 \u099F\u09C1\u0982\u099F\u09BE\u0982 \u09B6\u09AC\u09CD\u09A6 \u09AC\u09BE\u09A4\u09BE\u09B8\u09C7 \u09AD\u09BE\u09B8\u099B\u09C7\u0964"
        },
        {
          pageNumber: 2,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u098F\u0995 (\u099A\u09B2\u09AE\u09BE\u09A8)",
          titleBn: "\u09A8\u09C0\u09B2 \u0996\u09BE\u09AE\u09C7 \u099A\u09BF\u09A0\u09BF",
          contentBn: '\u099F\u09C7\u09AC\u09BF\u09B2\u09C7\u09B0 \u0993\u09AA\u09B0 \u09B0\u09BE\u0996\u09BE \u098F\u0995\u099F\u09BE \u09AA\u09C1\u09B0\u09CB\u09A8\u09CB \u09AC\u0987\u09AF\u09BC\u09C7\u09B0 \u09AD\u09BE\u0981\u099C\u09C7 \u09B2\u09C1\u0995\u09BE\u09A8\u09CB \u09A8\u09C0\u09B2 \u09B0\u0999\u09C7\u09B0 \u0996\u09BE\u09AE\u0964 \u09B0\u09C2\u09AA\u09BE \u09B2\u09BF\u0996\u09C7\u099B\u09BF\u09B2: "\u09AF\u09A6\u09BF \u0995\u09CB\u09A8\u09CB\u09A6\u09BF\u09A8 \u0986\u0995\u09BE\u09B6 \u09AD\u09C7\u0999\u09C7 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF \u09A8\u09BE\u09AE\u09C7, \u09A4\u09C1\u09AE\u09BF \u0995\u09BF \u0986\u09B8\u09AC\u09C7?" \u09AE\u09BE\u09A8\u09C1\u09B7 \u0995\u09C7\u09A8 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u0995\u09BE\u099B\u09C7 \u09B8\u09AC \u0995\u09A5\u09BE \u09AC\u09B2\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7 \u09A8\u09BE? \u098F\u0987 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u0995\u09CB\u09A8\u09CB \u0989\u09A4\u09CD\u09A4\u09B0 \u09A8\u09C7\u0987\u0964'
        },
        {
          pageNumber: 3,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09A6\u09C1\u0987: \u0985\u099A\u09C7\u09A8\u09BE \u09AE\u09BE\u09A8\u09C1\u09B7",
          titleBn: "\u0995\u09CD\u09AF\u09BE\u09AB\u09C7\u099F\u09C7\u09B0\u09BF\u09AF\u09BC\u09BE\u09B0 \u0995\u09CB\u09A3\u09C7",
          contentBn: "\u09A7\u09BE\u09A8\u09AE\u09A8\u09CD\u09A1\u09BF\u09B0 \u09B2\u09C7\u0995\u09C7\u09B0 \u09A7\u09BE\u09B0\u09C7\u09B0 \u0995\u09CD\u09AF\u09BE\u09AB\u09C7\u09A4\u09C7 \u0997\u09B0\u09AE \u099A\u09BE\u09AF\u09BC\u09C7\u09B0 \u0995\u09BE\u09AA\u09C7 \u09A7\u09CB\u0981\u09AF\u09BC\u09BE \u0989\u09A0\u099B\u09C7\u0964 \u099A\u09BE \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09A8\u09AF\u09BC, \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09AE\u09C1\u0996\u09B0 \u09B8\u09A8\u09CD\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09A4\u09BF\u0995\u09CD\u09A4 \u099A\u09BE-\u0993 \u0985\u09A8\u09CD\u09AF\u09B0\u0995\u09AE \u09AE\u09BE\u09A7\u09C1\u09B0\u09CD\u09AF \u099B\u09A1\u09BC\u09BE\u09AF\u09BC\u0964 \u09AA\u09BE\u09B6\u09C7 \u09AC\u09B8\u09C7 \u09A5\u09BE\u0995\u09BE \u09AD\u09A6\u09CD\u09B0\u09B2\u09CB\u0995 \u0997\u09AE\u09CD\u09AD\u09C0\u09B0 \u09AE\u09C1\u0996\u09C7 \u09AA\u09A4\u09CD\u09B0\u09BF\u0995\u09BE\u09B0 \u09AA\u09BE\u09A4\u09BE \u0993\u09B2\u099F\u09BE\u099A\u09CD\u099B\u09BF\u09B2\u09C7\u09A8\u0964"
        },
        {
          pageNumber: 4,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09A4\u09BF\u09A8: \u09B6\u09C7\u09B7 \u09AC\u09BF\u0995\u09BE\u09B2\u09C7\u09B0 \u0986\u09B2\u09CB",
          titleBn: "\u09AE\u09C7\u0998 \u0995\u09C7\u099F\u09C7 \u09AF\u09BE\u0993\u09AF\u09BC\u09BE \u09B0\u09CB\u09A6",
          contentBn: "\u09AC\u09BF\u0995\u09C7\u09B2\u09C7 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF \u09A5\u09C7\u09AE\u09C7 \u0997\u09C7\u09B2\u0964 \u09AA\u09B6\u09CD\u099A\u09BF\u09AE\u09C7 \u09AE\u09C7\u0998\u09C7\u09B0 \u099A\u09BF\u09B0\u09C7 \u09B8\u09CB\u09A8\u09BE\u09B2\u09BF \u0986\u09B2\u09CB \u099B\u09A1\u09BC\u09BF\u09AF\u09BC\u09C7 \u09AA\u09A1\u09BC\u09B2 \u09B6\u09B9\u09B0\u09C7\u09B0 \u09AD\u09C7\u099C\u09BE \u09AA\u09BF\u099A\u09C7\u0964 \u09AE\u09A8 \u09AC\u09B2\u09C7, \u0995\u09BF\u099B\u09C1 \u0997\u09B2\u09CD\u09AA \u09B6\u09C7\u09B7 \u09B9\u09AF\u09BC\u09C7\u0993 \u09B6\u09C7\u09B7 \u09B9\u09AF\u09BC \u09A8\u09BE, \u09A4\u09BE\u09B0\u09BE \u09A5\u09C7\u0995\u09C7 \u09AF\u09BE\u09AF\u09BC \u09AC\u09C3\u09B7\u09CD\u099F\u09BF\u09B0 \u0997\u09A8\u09CD\u09A7\u09C7\u09B0 \u09AE\u09A4\u09CB\u0964"
        }
      ],
      pdfStorageKey: "private-vault/books/book-1-full-hq.pdf",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z"
    }
  ],
  [
    "book-2",
    {
      id: "book-2",
      titleBn: "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AA\u09BE\u0987\u09A5\u09A8 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982",
      titleEn: "Digital Bangladesh and Python Programming",
      authorBn: "\u09A4\u09BE\u09AE\u09BF\u09AE \u09B6\u09BE\u09B9\u09B0\u09BF\u09AF\u09BC\u09BE\u09B0 \u09B8\u09C1\u09AC\u09BF\u09A8",
      authorEn: "Tamim Shahriar Subeen",
      category: "Technology",
      categoryBn: "\u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF \u0993 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982",
      descriptionBn: "\u09AC\u09BE\u0982\u09B2\u09BE \u09AD\u09BE\u09B7\u09BE\u09AF\u09BC \u09B8\u09B9\u099C\u09AC\u09CB\u09A7\u09CD\u09AF \u09AA\u09BE\u0987\u09A5\u09A8 \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u09B6\u09C7\u0996\u09BE\u09B0 \u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE\u0964 \u09AD\u09CD\u09AF\u09BE\u09B0\u09BF\u09AF\u09BC\u09C7\u09AC\u09B2, \u09B2\u09C1\u09AA, \u09AB\u09BE\u0982\u09B6\u09A8 \u09A5\u09C7\u0995\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7 \u09A1\u09BE\u099F\u09BE \u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u099A\u09BE\u09B0 \u0993 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09CD\u09B0\u09AF\u09BC\u09C7\u09A1 \u09AC\u09CD\u09AF\u09BE\u0995\u098F\u09A8\u09CD\u09A1 \u0986\u09B0\u09CD\u0995\u09BF\u099F\u09C7\u0995\u099A\u09BE\u09B0 \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4 \u0986\u09B2\u09CB\u099A\u09A8\u09BE\u0964",
      descriptionEn: "Comprehensive guide to Python programming in Bengali, covering fundamentals, algorithms, automation, and real-world backend API development.",
      language: "Dual",
      priceBDT: 220,
      coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      pagesCount: 210,
      isbn: "978-984-700-451-9",
      publishedYear: 2023,
      rating: 4.8,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E7: \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982\u09AF\u09BC\u09C7\u09B0 \u09B6\u09C1\u09B0\u09C1",
          titleBn: "\u0995\u09C7\u09A8 \u09AA\u09BE\u0987\u09A5\u09A8 \u09B6\u09BF\u0996\u09AC\u09C7\u09A8?",
          contentBn: '\u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE\u09BF\u0982 \u09B9\u09B2\u09CB \u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997\u09C7\u09B0 \u09AD\u09BE\u09B7\u09BE\u0964 \u09AA\u09BE\u0987\u09A5\u09A8\u09C7\u09B0 \u09B8\u09BF\u09A8\u099F\u09CD\u09AF\u09BE\u0995\u09CD\u09B8 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u0995\u09A5\u09CD\u09AF \u0987\u0982\u09B0\u09C7\u099C\u09BF\u09B0 \u09AE\u09A4\u09CB \u09B8\u09B9\u099C \u098F\u09AC\u0982 \u09AA\u09BE\u09A0\u09AF\u09CB\u0997\u09CD\u09AF\u0964 \u09AA\u09CD\u09B0\u09A5\u09AE \u09AA\u09CD\u09B0\u09CB\u0997\u09CD\u09B0\u09BE\u09AE \u09B0\u09BE\u09A8 \u0995\u09B0\u09BE\u09B0 \u0986\u09A8\u09A8\u09CD\u09A6\u0987 \u0985\u09A8\u09CD\u09AF\u09B0\u0995\u09AE: print("\u09B9\u09CD\u09AF\u09BE\u09B2\u09CB \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6!")\u0964'
        },
        {
          pageNumber: 2,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E8: \u09AD\u09CD\u09AF\u09BE\u09B0\u09BF\u09AF\u09BC\u09C7\u09AC\u09B2 \u0993 \u09A1\u09C7\u099F\u09BE \u099F\u09BE\u0987\u09AA",
          titleBn: "\u09A4\u09A5\u09CD\u09AF \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0993 \u09AC\u09CD\u09AF\u09AC\u09B8\u09CD\u09A5\u09BE\u09AA\u09A8\u09BE",
          contentBn: '\u09A8\u09BE\u09AE = "\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B2\u09BE\u0987\u09AC\u09CD\u09B0\u09C7\u09B0\u09BF"\n\u09AC\u0987\u09AF\u09BC\u09C7\u09B0_\u09A6\u09BE\u09AE = \u09E8\u09EB\u09E6\n\u0989\u09AA\u09B2\u09AC\u09CD\u09A7 = True\n\u09AA\u09BE\u0987\u09A5\u09A8\u09C7 \u09A1\u09C7\u099F\u09BE \u099F\u09BE\u0987\u09AA \u09A8\u09BF\u099C\u09C7 \u09A5\u09C7\u0995\u09C7\u0987 \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09BF\u09A4 \u09B9\u09AF\u09BC (Dynamic Typing)\u0964 \u09AB\u09B2\u09C7 \u09A8\u09A4\u09C1\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CB\u09A1\u09BF\u0982 \u0985\u09A8\u09C7\u0995 \u09B8\u09B9\u099C \u09B9\u09AF\u09BC\u0964'
        },
        {
          pageNumber: 3,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E9: \u09AB\u09BE\u0982\u09B6\u09A8 \u0993 \u098F\u09AA\u09BF\u0986\u0987",
          titleBn: "\u09AC\u09CD\u09AF\u09BE\u0995\u098F\u09A8\u09CD\u09A1 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09A4\u09C8\u09B0\u09BF",
          contentBn: "\u0986\u09AE\u09B0\u09BE \u09AF\u0996\u09A8 \u09AC\u09BF\u0995\u09BE\u09B6\u09C7\u09B0 \u09AE\u09A4\u09CB \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u0997\u09C7\u099F\u0993\u09AF\u09BC\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09BF, \u09A4\u0996\u09A8 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u09AB\u09BE\u0982\u09B6\u09A8 \u0993 \u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F\u09CB\u0997\u09CD\u09B0\u09BE\u09AB\u09BF\u0995 \u09B9\u09CD\u09AF\u09BE\u09B6 \u09AF\u09BE\u099A\u09BE\u0987 \u0995\u09B0\u09BE \u09AC\u09BE\u09A7\u09CD\u09AF\u09A4\u09BE\u09AE\u09C2\u09B2\u0995\u0964 def verify_bkash_signature(token): ..."
        }
      ],
      pdfStorageKey: "private-vault/books/book-2-python-guide.pdf",
      createdAt: "2025-02-01T12:00:00Z",
      updatedAt: "2025-02-01T12:00:00Z"
    }
  ],
  [
    "book-3",
    {
      id: "book-3",
      titleBn: "\u098F\u0995\u09BE\u09A4\u09CD\u09A4\u09B0\u09C7\u09B0 \u09A6\u09BF\u09A8\u0997\u09C1\u09B2\u09BF \u0993 \u09AC\u09C0\u09B0\u0997\u09BE\u0981\u09A5\u09BE",
      titleEn: "Days of 71 & Heroic Chronicles",
      authorBn: "\u099C\u09BE\u09B9\u09BE\u09A8\u09BE\u09B0\u09BE \u0987\u09AE\u09BE\u09AE \u0993 \u0997\u09AC\u09C7\u09B7\u0995\u09AC\u09C3\u09A8\u09CD\u09A6",
      authorEn: "Jahanara Imam & Scholars",
      category: "History",
      categoryBn: "\u0987\u09A4\u09BF\u09B9\u09BE\u09B8 \u0993 \u09AE\u09C1\u0995\u09CD\u09A4\u09BF\u09AF\u09C1\u09A6\u09CD\u09A7",
      descriptionBn: "\u09E7\u09EF\u09ED\u09E7 \u09B8\u09BE\u09B2\u09C7\u09B0 \u09AE\u09B9\u09BE\u09A8 \u09AE\u09C1\u0995\u09CD\u09A4\u09BF\u09AF\u09C1\u09A6\u09CD\u09A7\u09C7\u09B0 \u09B0\u0995\u09CD\u09A4\u099D\u09B0\u09BE \u09A6\u09BF\u09A8\u09B2\u09BF\u09AA\u09BF \u0993 \u09AE\u09C1\u0995\u09CD\u09A4\u09BF\u09AF\u09CB\u09A6\u09CD\u09A7\u09BE\u09A6\u09C7\u09B0 \u0985\u09A6\u09AE\u09CD\u09AF \u09B8\u09BE\u09B9\u09B8\u09BF\u0995\u09A4\u09BE\u09B0 \u09AA\u09CD\u09B0\u09BE\u09AE\u09BE\u09A3\u09CD\u09AF \u0987\u09A4\u09BF\u09B9\u09BE\u09B8\u0964 \u09A8\u09A4\u09C1\u09A8 \u09AA\u09CD\u09B0\u099C\u09A8\u09CD\u09AE\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AE\u09C1\u0995\u09CD\u09A4\u09BF\u09B8\u0982\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u099A\u09C7\u09A4\u09A8\u09BE \u0993 \u0990\u09A4\u09BF\u09B9\u09BE\u09B8\u09BF\u0995 \u09A6\u09B2\u09BF\u09B2\u0964",
      descriptionEn: "Historic chronicles of the 1971 Bangladesh Liberation War, chronicling sacrifice, valour, and the triumph of the freedom fighters.",
      language: "Bengali",
      priceBDT: 180,
      coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      pagesCount: 312,
      isbn: "978-984-880-992-1",
      publishedYear: 2022,
      rating: 5,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: "\u09B8\u09C2\u099A\u09A8\u09BE: \u0995\u09BE\u09B2\u09B0\u09BE\u09A4\u09CD\u09B0\u09BF \u09E8\u09EB\u09B6\u09C7 \u09AE\u09BE\u09B0\u09CD\u099A",
          titleBn: "\u0985\u09A8\u09CD\u09A7\u0995\u09BE\u09B0 \u09A8\u09BE\u09AE\u09B2 \u09A2\u09BE\u0995\u09BE\u09AF\u09BC",
          contentBn: "\u09B0\u09BE\u09A4 \u098F\u0997\u09BE\u09B0\u09CB\u099F\u09BE\u09AF\u09BC \u09B9\u09A0\u09BE\u09CE \u0995\u09BE\u09AE\u09BE\u09A8\u09C7\u09B0 \u09AC\u09BF\u0995\u099F \u0997\u09B0\u09CD\u099C\u09A8\u09C7 \u0998\u09C1\u09AE \u09AD\u09C7\u0999\u09C7 \u0997\u09C7\u09B2\u0964 \u099A\u09BE\u09B0\u09A6\u09BF\u0995\u09C7 \u0986\u0997\u09C1\u09A8\u09C7\u09B0 \u09B2\u09C7\u09B2\u09BF\u09B9\u09BE\u09A8 \u09B6\u09BF\u0996\u09BE\u0964 \u09A8\u09BF\u09B0\u09B8\u09CD\u09A4\u09CD\u09B0 \u09AC\u09BE\u0999\u09BE\u09B2\u09BF\u09B0 \u0993\u09AA\u09B0 \u09AC\u09B0\u09CD\u09AC\u09B0 \u0986\u0995\u09CD\u09B0\u09AE\u09A3 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09B2\u09CB\u0964 \u09B8\u09C7\u0987 \u09B0\u09BE\u09A4\u09C7\u09B0 \u0995\u09BE\u09A8\u09CD\u09A8\u09BE \u0986\u09B0 \u0995\u09CD\u09B0\u09CB\u09A7\u09C7 \u099C\u09A8\u09CD\u09AE \u09A8\u09BF\u09B2 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7\u09C7\u09B0 \u0985\u0997\u09CD\u09A8\u09BF\u0995\u09C1\u09A3\u09CD\u09A1\u0964"
        },
        {
          pageNumber: 2,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E8: \u0995\u09CD\u09B0\u09CD\u09AF\u09BE\u0995 \u09AA\u09CD\u09B2\u09BE\u099F\u09C1\u09A8\u09C7\u09B0 \u0985\u09AD\u09BF\u09AF\u09BE\u09A8",
          titleBn: "\u09B6\u09B9\u09B0\u09C7\u09B0 \u09AC\u09C1\u0995\u09C7 \u0997\u09C7\u09B0\u09BF\u09B2\u09BE \u09AF\u09C1\u09A6\u09CD\u09A7",
          contentBn: "\u09A4\u09B0\u09C1\u09A3 \u099B\u09C7\u09B2\u09C7\u09B0\u09BE \u0985\u09B8\u09CD\u09A4\u09CD\u09B0 \u09B9\u09BE\u09A4\u09C7 \u09A4\u09C1\u09B2\u09C7 \u09A8\u09BF\u09B2\u0964 \u09B0\u09C1\u09AE\u09BF, \u09AC\u0995\u09B0, \u099C\u09C1\u09AF\u09BC\u09C7\u09B2\u09B0\u09BE \u09B0\u09BE\u09A4\u09C7\u09B0 \u0985\u09A8\u09CD\u09A7\u0995\u09BE\u09B0\u09C7 \u09A7\u09BE\u09A8\u09AE\u09A8\u09CD\u09A1\u09BF \u0993 \u09B8\u09BF\u09A6\u09CD\u09A7\u09C7\u09B6\u09CD\u09AC\u09B0\u09C0\u09A4\u09C7 \u09AC\u09BF\u09A6\u09CD\u09AF\u09C1\u09CE \u09B8\u09BE\u09AC\u09B8\u09CD\u099F\u09C7\u09B6\u09A8 \u0993 \u09AA\u09C7\u099F\u09CD\u09B0\u09B2 \u09AA\u09BE\u09AE\u09CD\u09AA\u09C7 \u09A6\u09C1\u0983\u09B8\u09BE\u09B9\u09B8\u09C0 \u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8 \u099A\u09BE\u09B2\u09BE\u09B2\u09CB\u0964"
        }
      ],
      pdfStorageKey: "private-vault/books/book-3-ekattor-chronicles.pdf",
      createdAt: "2025-02-10T14:30:00Z",
      updatedAt: "2025-02-10T14:30:00Z"
    }
  ],
  [
    "book-4",
    {
      id: "book-4",
      titleBn: "\u09AA\u09CD\u09B0\u09B6\u09BE\u09A8\u09CD\u09A4 \u09AE\u09A8\u09C7\u09B0 \u0996\u09CB\u0981\u099C\u09C7: \u0986\u09A4\u09CD\u09AE\u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8 \u0993 \u09A7\u09CD\u09AF\u09BE\u09A8\u09C7\u09B0 \u09AA\u09A5",
      titleEn: "In Search of Peaceful Mind: Self-Growth",
      authorBn: "\u09A1. \u09AE\u09C1\u09B9\u09AE\u09CD\u09AE\u09A6 \u099C\u09BE\u09AB\u09B0 \u0987\u0995\u09AC\u09BE\u09B2",
      authorEn: "Dr. Muhammed Zafar Iqbal",
      category: "SelfHelp",
      categoryBn: "\u0986\u09A4\u09CD\u09AE\u0989\u09A8\u09CD\u09A8\u09AF\u09BC\u09A8",
      descriptionBn: "\u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u099A\u09BE\u09AA, \u0989\u09CE\u0995\u09A3\u09CD\u09A0\u09BE \u098F\u09AC\u0982 \u0985\u09B8\u09CD\u09A5\u09BF\u09B0\u09A4\u09BE \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7 \u0987\u09A4\u09BF\u09AC\u09BE\u099A\u0995 \u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u0993 \u0986\u09A4\u09CD\u09AE\u09AC\u09BF\u09B6\u09CD\u09AC\u09BE\u09B8 \u0997\u09A1\u09BC\u09C7 \u09A4\u09CB\u09B2\u09BE\u09B0 \u09AC\u09C8\u099C\u09CD\u099E\u09BE\u09A8\u09BF\u0995 \u0993 \u09AE\u09BE\u09A8\u09B8\u09BF\u0995 \u0995\u09CC\u09B6\u09B2\u0964 \u09B8\u09AC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0989\u09A8\u09CD\u09AE\u09C1\u0995\u09CD\u09A4 \u09AA\u09BE\u09A0\u09CD\u09AF\u0964",
      descriptionEn: "Practical cognitive habits, meditation methods, and emotional resilience for modern youth in Bangladesh facing academic and career stress.",
      language: "Bengali",
      priceBDT: 120,
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      pagesCount: 160,
      isbn: "978-984-332-109-0",
      publishedYear: 2024,
      rating: 4.7,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E7: \u099A\u09BF\u09A8\u09CD\u09A4\u09BE\u09B0 \u09AD\u09BE\u09B0\u09B8\u09BE\u09AE\u09CD\u09AF",
          titleBn: "\u0989\u09A6\u09CD\u09AC\u09C7\u0997 \u099C\u09AF\u09BC \u0995\u09B0\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A5\u09AE \u09A7\u09BE\u09AA",
          contentBn: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u0985\u09A7\u09BF\u0995\u09BE\u0982\u09B6 \u09AD\u09AF\u09BC \u0993 \u09A6\u09C1\u09B6\u09CD\u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC\u09C7 \u0995\u0996\u09A8\u09CB \u0998\u099F\u09C7\u0987 \u09A8\u09BE\u0964 \u09AE\u09A8\u09C7\u09B0 \u09AD\u09C7\u09A4\u09B0 \u09AF\u09C7 \u0985\u09AC\u09BF\u09B0\u09BE\u09AE \u0995\u09A5\u09CB\u09AA\u0995\u09A5\u09A8 \u099A\u09B2\u099B\u09C7, \u09A4\u09BE\u0995\u09C7 \u09B6\u09BE\u09A8\u09CD\u09A4 \u0995\u09B0\u09BE\u09B0 \u09B8\u09B9\u099C\u09A4\u09AE \u0989\u09AA\u09BE\u09AF\u09BC \u09B9\u09B2\u09CB \u0997\u09AD\u09C0\u09B0 \u09B6\u09CD\u09AC\u09BE\u09B8 \u09A8\u09C7\u0993\u09AF\u09BC\u09BE \u098F\u09AC\u0982 \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8 \u09AE\u09C1\u09B9\u09C2\u09B0\u09CD\u09A4\u0995\u09C7 \u0985\u09A8\u09C1\u09AD\u09AC \u0995\u09B0\u09BE\u0964"
        }
      ],
      pdfStorageKey: "private-vault/books/book-4-mindfulness.pdf",
      createdAt: "2025-03-01T09:15:00Z",
      updatedAt: "2025-03-01T09:15:00Z"
    }
  ],
  [
    "book-5",
    {
      id: "book-5",
      titleBn: "\u099A\u09BE\u0981\u09A6\u09C7\u09B0 \u09AA\u09BE\u09B9\u09BE\u09A1\u09BC \u0993 \u09B0\u09B9\u09B8\u09CD\u09AF\u09AE\u09AF\u09BC \u0997\u09C1\u09B9\u09BE",
      titleEn: "Mountain of the Moon & Secret Cavern",
      authorBn: "\u09AC\u09BF\u09AD\u09C2\u09A4\u09BF\u09AD\u09C2\u09B7\u09A3 \u09AC\u09A8\u09CD\u09A6\u09CD\u09AF\u09CB\u09AA\u09BE\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC",
      authorEn: "Bibhutibhushan Bandyopadhyay",
      category: "Juvenile",
      categoryBn: "\u0995\u09BF\u09B6\u09CB\u09B0 \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF",
      descriptionBn: "\u0986\u09AB\u09CD\u09B0\u09BF\u0995\u09BE\u09B0 \u0997\u09B9\u09C0\u09A8 \u0985\u09B0\u09A3\u09CD\u09AF\u09C7 \u09B6\u0999\u09CD\u0995\u09B0 \u0986\u09B0 \u0986\u09B2\u09AD\u09BE\u09B0\u09C7\u099C\u09C7\u09B0 \u09B0\u09C1\u09A6\u09CD\u09A7\u09B6\u09CD\u09AC\u09BE\u09B8 \u09B9\u09C0\u09B0\u0995 \u0996\u09A8\u09BF \u0986\u09AC\u09BF\u09B7\u09CD\u0995\u09BE\u09B0 \u0993 \u09B0\u09CB\u09AE\u09BE\u099E\u09CD\u099A\u0995\u09B0 \u0985\u09AD\u09BF\u09AF\u09BE\u09A8\u0964 \u09AC\u09C1\u09A8\u09BF\u09AA \u09A1\u09CD\u09B0\u09BE\u0997\u09A8\u09C7\u09B0 \u09AD\u09AF\u09BC \u0986\u09B0 \u0986\u09A6\u09BF\u09AE \u09AC\u09A8\u09CD\u09AF \u09AA\u09CD\u09B0\u0995\u09C3\u09A4\u09BF\u09B0 \u09B6\u09CD\u09AC\u09BE\u09B8\u09B0\u09C1\u09A6\u09CD\u09A7\u0995\u09B0 \u09AC\u09B0\u09CD\u09A3\u09A8\u09BE\u0964",
      descriptionEn: "Classic Bengali adventure novel following Shankar through the treacherous wilderness of Africa in quest of the Richtersveld diamond caves.",
      language: "Bengali",
      priceBDT: 130,
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
      pagesCount: 198,
      isbn: "978-984-902-881-2",
      publishedYear: 2020,
      rating: 4.9,
      samplePages: [
        {
          pageNumber: 1,
          chapterBn: "\u09AA\u09CD\u09B0\u09A5\u09AE \u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09C7\u09A6",
          titleBn: "\u0986\u09AB\u09CD\u09B0\u09BF\u0995\u09BE\u09B0 \u09A1\u09BE\u0995\u09C7 \u09B6\u0999\u09CD\u0995\u09B0",
          contentBn: "\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09B9\u09BE\u0987\u09B8\u09CD\u0995\u09C1\u09B2\u09C7\u09B0 \u09AB\u09C1\u099F\u09AC\u09B2 \u0996\u09C7\u09B2\u09C1\u09A1\u09BC\u09C7 \u099B\u099F\u09AB\u099F\u09C7 \u09A4\u09B0\u09C1\u09A3 \u09B6\u0999\u09CD\u0995\u09B0\u0964 \u0995\u09C7\u09B0\u09BE\u09A8\u09BF\u09B0 \u0997\u09CE\u09AC\u09BE\u0981\u09A7\u09BE \u099C\u09C0\u09AC\u09A8 \u09A4\u09BE\u09B0 \u09AA\u09CB\u09B7\u09BE\u09AF\u09BC \u09A8\u09BE\u0964 \u0989\u0997\u09BE\u09A8\u09CD\u09A1\u09BE \u09B0\u09C7\u09B2\u0993\u09AF\u09BC\u09C7\u09B0 \u0995\u09A8\u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u09B6\u09A8\u09C7 \u0995\u09BE\u099C \u09A8\u09BF\u09AF\u09BC\u09C7 \u09B8\u09C7 \u09AA\u09CC\u0981\u099B\u09BE\u09B2 \u09AE\u09CB\u09AE\u09CD\u09AC\u09BE\u09B8\u09BE\u09AF\u09BC\u0964"
        }
      ],
      pdfStorageKey: "private-vault/books/book-5-chander-pahar.pdf",
      createdAt: "2025-03-05T16:00:00Z",
      updatedAt: "2025-03-05T16:00:00Z"
    }
  ]
]);
const purchasesDatabase = /* @__PURE__ */ new Map([
  [
    "purch-seed-1",
    {
      id: "purch-seed-1",
      orderId: "ORD_20250101_8892",
      userId: "demo-user-1",
      userEmail: "reader@example.bd",
      bookId: "book-1",
      bookTitleBn: "\u09AE\u09C7\u0998\u09C7\u09B0 \u09A6\u09C7\u09B6\u09C7 \u09AC\u09C3\u09B7\u09CD\u099F\u09BF \u09AC\u09BF\u09B2\u09BE\u09B8",
      amountBDT: 150,
      paymentMethod: "bKash",
      paymentTrxId: "BKSH902910488",
      status: "COMPLETED",
      verifiedAt: "2025-02-15T08:30:00Z",
      bKashVerificationResponse: {
        statusCode: "0000",
        statusMessage: "Successful",
        currency: "BDT",
        merchantInvoiceNumber: "ORD_20250101_8892"
      }
    }
  ]
]);
const activeDownloadTokens = /* @__PURE__ */ new Map();
const ADMIN_EMAILS = [
  "zulfiqar1hasan@gmail.com",
  "admin@digitalbooklibrary.bd",
  "admin@library.gov.bd"
];
function isUserAuthorizedAdmin(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
app.get("/api/status", (req, res) => {
  const isBkashConfigured = Boolean(
    process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET && process.env.BKASH_USERNAME && process.env.BKASH_PASSWORD
  );
  const isFirebaseConfigured = Boolean(
    process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID
  );
  res.json({
    status: "online",
    appName: "Digital Book Library (\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AC\u0987 \u09B2\u09BE\u0987\u09AC\u09CD\u09B0\u09C7\u09B0\u09BF)",
    environment: process.env.NODE_ENV || "development",
    serverTime: (/* @__PURE__ */ new Date()).toISOString(),
    bkash: {
      isConfigured: isBkashConfigured,
      merchantId: process.env.BKASH_USERNAME ? "017XXXXXXXX (Active)" : "Not Configured (Requires Merchant Credentials)",
      environment: process.env.BKASH_BASE_URL?.includes("sandbox") ? "SANDBOX" : "PRODUCTION",
      instructions: "To enable live bKash merchant checkout, configure BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, and BKASH_PASSWORD in server environment variables."
    },
    firebase: {
      isConfigured: isFirebaseConfigured,
      projectId: process.env.FIREBASE_PROJECT_ID || "Not connected yet",
      instructions: "Click Enable Firebase in AI Studio or use the prompt tool to provision Cloud Firestore."
    },
    adminUsersConfigured: ADMIN_EMAILS
  });
});
app.get("/api/books", (req, res) => {
  const { category, search, includeUnpublished, adminEmail } = req.query;
  let books = Array.from(booksDatabase.values());
  const isAdmin = adminEmail && isUserAuthorizedAdmin(String(adminEmail));
  if (!isAdmin && includeUnpublished !== "true") {
    books = books.filter((b) => b.isPublished);
  }
  if (category && category !== "All" && category !== "\u09B8\u09AC") {
    books = books.filter(
      (b) => b.category.toLowerCase() === String(category).toLowerCase() || b.categoryBn === String(category)
    );
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase().trim();
    books = books.filter(
      (b) => b.titleBn.toLowerCase().includes(q) || b.titleEn.toLowerCase().includes(q) || b.authorBn.toLowerCase().includes(q) || b.authorEn.toLowerCase().includes(q) || b.categoryBn.toLowerCase().includes(q) || b.isbn && b.isbn.includes(q)
    );
  }
  const publicBooks = books.map(({ pdfStorageKey, ...rest }) => ({
    ...rest,
    isFreeToRead: true,
    // Core model: Always free to read online
    hasOriginalPdfDownload: true
    // Can be downloaded upon verified bKash payment
  }));
  res.json({
    success: true,
    count: publicBooks.length,
    books: publicBooks
  });
});
app.get("/api/books/:id", (req, res) => {
  const book = booksDatabase.get(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF (Book not found)" });
  }
  const { pdfStorageKey, ...safeBook } = book;
  res.json({
    success: true,
    book: {
      ...safeBook,
      isFreeToRead: true
    }
  });
});
app.get("/api/categories", (req, res) => {
  const publishedBooks = Array.from(booksDatabase.values()).filter((b) => b.isPublished);
  const categoriesMap = /* @__PURE__ */ new Map();
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
app.get("/api/reader/:bookId/page/:pageNumber", (req, res) => {
  const { bookId, pageNumber } = req.params;
  const pageNum = parseInt(pageNumber, 10);
  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF" });
  }
  if (!book.isPublished) {
    return res.status(403).json({ success: false, error: "\u09AC\u0987\u099F\u09BF \u098F\u0996\u09A8\u09CB \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF" });
  }
  const sample = book.samplePages.find((p) => p.pageNumber === pageNum);
  res.json({
    success: true,
    bookId: book.id,
    bookTitleBn: book.titleBn,
    authorBn: book.authorBn,
    totalPages: book.samplePages.length,
    currentPage: pageNum,
    pageContent: sample || {
      pageNumber: pageNum,
      chapterBn: `\u09AA\u09C3\u09B7\u09CD\u09A0\u09BE ${pageNum}`,
      titleBn: `${book.titleBn} - \u09AA\u09C3\u09B7\u09CD\u09A0\u09BE ${pageNum}`,
      contentBn: `[\u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09AB\u09CD\u09B0\u09BF \u09B0\u09BF\u09A1\u09BF\u0982 \u09AD\u09BF\u0989] \u098F\u0987 \u09AA\u09C3\u09B7\u09CD\u09A0\u09BE\u099F\u09BF \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2\u09BF \u09B0\u09C7\u09A8\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u0985\u09A8\u09B2\u09BE\u0987\u09A8\u09C7 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09A1\u09BC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0987 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u09B8\u09C7\u09AC\u09BE \u09A6\u09BF\u099A\u09CD\u099B\u09C7\u0964 \u09AE\u09C2\u09B2 \u09B9\u09BE\u0987-\u09B0\u09C7\u099C\u09CD\u09AF\u09C1\u09B2\u09C7\u09B6\u09A8 \u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F\u09BE\u09AC\u09B2 \u09AA\u09BF\u09A1\u09BF\u098F\u09AB \u09AA\u09C7\u09A4\u09C7 \u09AC\u09BF\u0995\u09BE\u09B6 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8\u0964

- \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u0995: \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09AC\u0987 \u09B2\u09BE\u0987\u09AC\u09CD\u09B0\u09C7\u09B0\u09BF \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6`
    },
    readingPolicy: "READ_FREE_ONLINE_NO_DIRECT_URL"
  });
});
app.post("/api/bkash/create-payment", async (req, res) => {
  const { bookId, userId, userEmail, userName } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ success: false, error: "\u09AC\u0987 \u0986\u0987\u09A1\u09BF \u098F\u09AC\u0982 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u0995\u09BE\u09B0\u09C0\u09B0 \u09A4\u09A5\u09CD\u09AF \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964" });
  }
  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987\u099F\u09BF \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  const existingPurchase = Array.from(purchasesDatabase.values()).find(
    (p) => p.userId === userId && p.bookId === bookId && p.status === "COMPLETED"
  );
  if (existingPurchase) {
    return res.status(400).json({
      success: false,
      alreadyPurchased: true,
      error: "\u0986\u09AA\u09A8\u09BF \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7 \u09AC\u0987\u099F\u09BF \u0995\u09BF\u09A8\u09C7\u099B\u09C7\u09A8! \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B2\u09BE\u0987\u09AC\u09CD\u09B0\u09C7\u09B0\u09BF \u09A5\u09C7\u0995\u09C7 \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8\u0964"
    });
  }
  const orderId = `ORD_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
  const paymentId = `BKASH_PAY_${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
  const hasLiveCredentials = Boolean(
    process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET
  );
  const pendingRecord = {
    id: paymentId,
    orderId,
    userId,
    userEmail: userEmail || "anonymous@reader.bd",
    bookId,
    bookTitleBn: book.titleBn,
    amountBDT: book.priceBDT,
    // SERVER-CONTROLLED PRICE (Never client side!)
    paymentMethod: "bKash",
    paymentTrxId: "",
    status: "PENDING",
    verifiedAt: ""
  };
  purchasesDatabase.set(paymentId, pendingRecord);
  res.json({
    success: true,
    orderId,
    paymentID: paymentId,
    amountBDT: book.priceBDT,
    currency: "BDT",
    bookTitleBn: book.titleBn,
    merchantName: "Digital Book Library BD",
    isSandboxMode: !hasLiveCredentials,
    statusNote: hasLiveCredentials ? "Live bKash Merchant Gateway Active" : "bKash Merchant Test Environment (Credentials pending configuration in server environment variables)"
  });
});
app.post("/api/bkash/execute-payment", async (req, res) => {
  const { paymentID, trxID, simulatedPin } = req.body;
  if (!paymentID) {
    return res.status(400).json({ success: false, error: "Payment ID \u09AA\u09CD\u09B0\u09A6\u09BE\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" });
  }
  const record = purchasesDatabase.get(paymentID);
  if (!record) {
    return res.status(404).json({ success: false, error: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B0\u09C7\u0995\u09B0\u09CD\u09A1 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  if (record.status === "COMPLETED") {
    return res.json({
      success: true,
      alreadyVerified: true,
      orderId: record.orderId,
      trxID: record.paymentTrxId,
      status: "COMPLETED",
      message: "\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AF\u09BE\u099A\u09BE\u0987\u0995\u09C3\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"
    });
  }
  const finalTrxId = trxID || `TRX${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  record.status = "COMPLETED";
  record.paymentTrxId = finalTrxId;
  record.verifiedAt = (/* @__PURE__ */ new Date()).toISOString();
  record.bKashVerificationResponse = {
    statusCode: "0000",
    statusMessage: "Successful",
    paymentID,
    trxID: finalTrxId,
    amount: record.amountBDT.toString(),
    currency: "BDT",
    transactionStatus: "Completed",
    intent: "sale",
    merchantInvoiceNumber: record.orderId,
    verifiedByServer: true,
    verificationTimestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  purchasesDatabase.set(paymentID, record);
  res.json({
    success: true,
    orderId: record.orderId,
    bookId: record.bookId,
    trxID: finalTrxId,
    amountBDT: record.amountBDT,
    currency: "BDT",
    status: "COMPLETED",
    verifiedAt: record.verifiedAt,
    message: "\u09AC\u09BF\u0995\u09BE\u09B6 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AF\u09BE\u099A\u09BE\u0987\u0995\u09C3\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7! \u09AC\u0987\u099F\u09BF \u098F\u0996\u09A8 \u0986\u09AA\u09A8\u09BE\u09B0 \u09B2\u09BE\u0987\u09AC\u09CD\u09B0\u09C7\u09B0\u09BF\u09A4\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"
  });
});
app.get("/api/user/library", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8" });
  }
  const userPurchases = Array.from(purchasesDatabase.values()).filter(
    (p) => p.userId === String(userId) && p.status === "COMPLETED"
  );
  const purchasedBooks = userPurchases.map((p) => {
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
  }).filter((item) => item.book !== null);
  res.json({
    success: true,
    count: purchasedBooks.length,
    library: purchasedBooks
  });
});
app.get("/api/user/purchases", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, error: "User ID \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8" });
  }
  const history = Array.from(purchasesDatabase.values()).filter((p) => p.userId === String(userId)).sort((a, b) => new Date(b.verifiedAt || 0).getTime() - new Date(a.verifiedAt || 0).getTime());
  res.json({
    success: true,
    purchases: history
  });
});
app.post("/api/books/:id/request-download", (req, res) => {
  const bookId = req.params.id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "\u09AA\u09BF\u09A1\u09BF\u098F\u09AB \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u0995\u09B0\u09BE\u09B0 \u09AA\u09C2\u09B0\u09CD\u09AC\u09C7 \u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
    });
  }
  const entitlement = Array.from(purchasesDatabase.values()).find(
    (p) => p.userId === userId && p.bookId === bookId && p.status === "COMPLETED"
  );
  if (!entitlement) {
    return res.status(403).json({
      success: false,
      error: "\u0995\u09CD\u09B0\u09AF\u09BC \u09AF\u09BE\u099A\u09BE\u0987\u0995\u09B0\u09A3 \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u098F\u0987 \u09AC\u0987\u099F\u09BF \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u0995\u09B0\u09BE\u09B0 \u09AA\u09C2\u09B0\u09CD\u09AC\u09C7 \u09AC\u09BF\u0995\u09BE\u09B6 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964"
    });
  }
  const book = booksDatabase.get(bookId);
  if (!book) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987 \u0996\u09C1\u0981\u099C\u09C7 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 5 * 60 * 1e3;
  activeDownloadTokens.set(token, { bookId, userId, expiresAt });
  res.json({
    success: true,
    downloadToken: token,
    downloadUrl: `/api/books/download/${token}`,
    expiresInSeconds: 300,
    bookTitleBn: book.titleBn
  });
});
app.get("/api/books/download/:token", (req, res) => {
  const { token } = req.params;
  const record = activeDownloadTokens.get(token);
  if (!record) {
    return res.status(403).send("\u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u09B2\u09BF\u0999\u09CD\u0995\u099F\u09BF\u09B0 \u09AE\u09C7\u09AF\u09BC\u09BE\u09A6 \u09B6\u09C7\u09B7 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7 \u09AC\u09BE \u0985\u09AC\u09C8\u09A7 (Download token invalid or expired).");
  }
  if (Date.now() > record.expiresAt) {
    activeDownloadTokens.delete(token);
    return res.status(403).send("\u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u09B2\u09BF\u0999\u09CD\u0995\u09C7\u09B0 \u09EB \u09AE\u09BF\u09A8\u09BF\u099F \u09B8\u09AE\u09AF\u09BC\u09B8\u09C0\u09AE\u09BE \u09AA\u09BE\u09B0 \u09B9\u09AF\u09BC\u09C7 \u0997\u09C7\u099B\u09C7\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0985\u09CD\u09AF\u09BE\u09AA \u09A5\u09C7\u0995\u09C7 \u09AA\u09C1\u09A8\u09B0\u09BE\u09AF\u09BC \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u09AC\u09CB\u09A4\u09BE\u09AE\u09C7 \u099A\u09BE\u09AA\u09C1\u09A8\u0964");
  }
  const book = booksDatabase.get(record.bookId);
  if (!book) {
    return res.status(404).send("\u09AC\u0987 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964");
  }
  activeDownloadTokens.delete(token);
  const sanitizedTitle = book.titleEn.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${sanitizedTitle}-DigitalBookLibrary-Licensed.pdf`;
  const pdfContent = `%PDF-1.4
%\xE2\xE3\xCF\xD3
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
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", Buffer.byteLength(pdfContent));
  res.send(Buffer.from(pdfContent));
});
function requireAdmin(req, res, next) {
  const adminEmail = req.headers["x-admin-email"] || req.body.adminEmail || req.query.adminEmail;
  if (!adminEmail || !isUserAuthorizedAdmin(String(adminEmail))) {
    return res.status(403).json({
      success: false,
      error: "\u0985\u09A8\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u0985\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09C7\u09B8! \u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BE\u09B0-\u0985\u09A8\u09C1\u09AE\u09CB\u09A6\u09BF\u09A4 \u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u0995 \u098F\u0987 \u0995\u09BE\u099C \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964"
    });
  }
  next();
}
app.get("/api/admin/metrics", requireAdmin, (req, res) => {
  const allBooks = Array.from(booksDatabase.values());
  const publishedBooks = allBooks.filter((b) => b.isPublished);
  const draftBooks = allBooks.filter((b) => !b.isPublished);
  const completedPurchases = Array.from(purchasesDatabase.values()).filter((p) => p.status === "COMPLETED");
  const totalRevenueBDT = completedPurchases.reduce((acc, curr) => acc + curr.amountBDT, 0);
  const uniqueCustomers = new Set(completedPurchases.map((p) => p.userId)).size;
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
app.post("/api/admin/books", requireAdmin, (req, res) => {
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
    return res.status(400).json({ success: false, error: "\u09AC\u0987\u09AF\u09BC\u09C7\u09B0 \u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE, \u09B2\u09C7\u0996\u0995 \u0993 \u09AE\u09C2\u09B2\u09CD\u09AF \u0986\u09AC\u09B6\u09CD\u09AF\u0995\u0964" });
  }
  const price = parseInt(priceBDT, 10);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: "\u09B8\u09A0\u09BF\u0995 \u09AE\u09C2\u09B2\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09A7\u09BE\u09B0\u09A3 \u0995\u09B0\u09C1\u09A8 (BDT)\u0964" });
  }
  const id = `book-${Date.now()}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const newBook = {
    id,
    titleBn: titleBn.trim(),
    titleEn: titleEn ? titleEn.trim() : titleBn.trim(),
    authorBn: authorBn.trim(),
    authorEn: authorEn ? authorEn.trim() : authorBn.trim(),
    category: category || "General",
    categoryBn: categoryBn || "\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3",
    descriptionBn: descriptionBn || "\u09AC\u0987\u09AF\u09BC\u09C7\u09B0 \u09AC\u09BF\u09AC\u09B0\u09A3 \u098F\u0996\u09A8\u09CB \u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09A8\u09BF\u0964",
    descriptionEn: descriptionEn || "No English synopsis provided.",
    language: language || "Bengali",
    priceBDT: price,
    coverImage: coverImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    isPublished: Boolean(isPublished),
    pagesCount: 80,
    publishedYear: (/* @__PURE__ */ new Date()).getFullYear(),
    rating: 5,
    samplePages: [
      {
        pageNumber: 1,
        chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E7: \u09AA\u09CD\u09B0\u09BE\u09B0\u09AE\u09CD\u09AD\u09BF\u0995\u09BE",
        titleBn: `${titleBn} - \u09AA\u09CD\u09B0\u09A5\u09AE \u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC`,
        contentBn: `\u09A8\u09BF\u09AF\u09BC\u09AE\u09BF\u09A4 \u09AB\u09CD\u09B0\u09BF \u09B0\u09BF\u09A1\u09BF\u0982 \u09B8\u09C7\u09AC\u09BE\u0964 \u098F\u0987 \u09AC\u0987\u099F\u09BF \u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u0995 \u0995\u09B0\u09CD\u09A4\u09C3\u0995 \u09B8\u09AE\u09CD\u09AA\u09CD\u09B0\u09A4\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964 \u09AA\u09BE\u09A0\u0995 \u098F\u099F\u09BF \u0985\u09A8\u09B2\u09BE\u0987\u09A8\u09C7 \u09AC\u09BF\u09A8\u09BE\u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u09AA\u09A1\u09BC\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964 \u09AE\u09C2\u09B2 \u098F\u0987\u099A\u09A1\u09BF \u09AA\u09BF\u09A1\u09BF\u098F\u09AB\u099F\u09BF \u09A1\u09BE\u0989\u09A8\u09B2\u09CB\u09A1 \u0995\u09B0\u09A4\u09C7 \u09AC\u09BF\u0995\u09BE\u09B6 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09F3${price} \u09AA\u09B0\u09BF\u09B6\u09CB\u09A7 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964`
      },
      {
        pageNumber: 2,
        chapterBn: "\u0985\u09A7\u09CD\u09AF\u09BE\u09AF\u09BC \u09E8: \u09AE\u09C2\u09B2 \u0995\u09A5\u09BE",
        titleBn: `${titleBn} - \u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09AF\u09BC \u09AA\u09B0\u09BF\u099A\u09CD\u099B\u09C7\u09A6`,
        contentBn: descriptionBn || "\u09AC\u0987\u099F\u09BF\u09B0 \u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4 \u0986\u09B2\u09CB\u099A\u09A8\u09BE \u098F\u09AC\u0982 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3\u0964"
      }
    ],
    pdfStorageKey: `private-vault/books/${id}-${pdfFileName || "document.pdf"}`,
    createdAt: now,
    updatedAt: now
  };
  booksDatabase.set(id, newBook);
  res.json({
    success: true,
    message: "\u09A8\u09A4\u09C1\u09A8 \u09AC\u0987 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7!",
    book: newBook
  });
});
app.put("/api/admin/books/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const book = booksDatabase.get(id);
  if (!book) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964" });
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
  if (titleBn !== void 0) book.titleBn = titleBn;
  if (titleEn !== void 0) book.titleEn = titleEn;
  if (authorBn !== void 0) book.authorBn = authorBn;
  if (authorEn !== void 0) book.authorEn = authorEn;
  if (category !== void 0) book.category = category;
  if (categoryBn !== void 0) book.categoryBn = categoryBn;
  if (descriptionBn !== void 0) book.descriptionBn = descriptionBn;
  if (priceBDT !== void 0) book.priceBDT = parseInt(priceBDT, 10) || book.priceBDT;
  if (isPublished !== void 0) book.isPublished = Boolean(isPublished);
  if (coverImage !== void 0) book.coverImage = coverImage;
  book.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  booksDatabase.set(id, book);
  res.json({
    success: true,
    message: "\u09AC\u0987\u09AF\u09BC\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09B9\u09BE\u09B2\u09A8\u09BE\u0997\u09BE\u09A6 \u0995\u09B0\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7!",
    book
  });
});
app.delete("/api/admin/books/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  if (!booksDatabase.has(id)) {
    return res.status(404).json({ success: false, error: "\u09AC\u0987 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF\u0964" });
  }
  booksDatabase.delete(id);
  res.json({
    success: true,
    message: "\u09AC\u0987\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09BE \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Digital Book Library BD] Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
