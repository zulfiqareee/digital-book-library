// Utility functions for Bengali numbering, formatting, and BDT currency

const BENGALI_DIGITS: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '০';
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

export function formatBDT(amount: number | string | undefined | null, useBengaliNumerals = true): string {
  if (amount === undefined || amount === null) return '৳০';
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  if (useBengaliNumerals) {
    return `৳${toBengaliNumber(num)}`;
  }
  return `৳${num}`;
}

export function formatBengaliDate(isoDateString?: string): string {
  if (!isoDateString) return 'অজানা তারিখ';
  try {
    const date = new Date(isoDateString);
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const day = toBengaliNumber(date.getDate());
    const month = monthsBn[date.getMonth()];
    const year = toBengaliNumber(date.getFullYear());
    return `${day} ${month}, ${year}`;
  } catch {
    return isoDateString;
  }
}
