import { type SearchParamsData } from '@/types';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergedQueryParamUrl(
  url: string,
  params: SearchParamsData = {}
) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      urlParams.set(key, String(value));
    }
  });

  if (urlParams.toString()) url += `?${urlParams.toString()}`;

  return url;
}

export function getNameInitial(name: string | null | undefined): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function maskText(
  text: string,
  unmaskedStart = 2,
  unmaskedEnd = 2,
  maskChar = '*'
): string {
  if (text.length <= unmaskedStart + unmaskedEnd) {
    return text;
  }
  const start = text.slice(0, unmaskedStart);
  const end = text.slice(-unmaskedEnd);
  const maskedSection = maskChar.repeat(
    text.length - unmaskedStart - unmaskedEnd
  );
  return `${start}${maskedSection}${end}`;
}

export function getTwoWordName(fullname: string): string {
  if (!fullname) return '';
  const words = fullname.trim().split(/\s+/);
  if (words.length === 1) return words[0] || '';
  return `${words[0]} ${words[1]}`;
}

export function getPlaceholderImageUrl({
  width = 400,
  height = 300,
  text = 'Placeholder',
}: {
  width?: number;
  height?: number;
  text?: string;
} = {}): string {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}?text=${encodedText}`;
}

export function whatsappMessageFormatter(message: string) {
  return encodeURIComponent(message);
}

export function sendWhatsappMessage(phoneNumber: string, message: string) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessageFormatter(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export function getWhatsappMessageUrl(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${whatsappMessageFormatter(message)}`;
}

export function formatNumber(value: number, locale = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(
  value: number,
  locale = 'id-ID',
  currency: string | null = 'IDR'
): string {
  if (!Number.isFinite(value)) return '-';
  if (!currency) {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 0 }).format(
      value
    );
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPhone(phone: string | null): string {
  if (!phone) return '';

  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Normalize Indonesian phone numbers to international format (+62)
  if (cleaned.startsWith('+62')) {
    return cleaned;
  }
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('08')) {
    // Replace leading '08' with '+628'
    return `+62${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('8')) {
    // Add '+62' prefix for numbers starting with '8'
    return `+62${cleaned}`;
  }
  // Ensure the number starts with '+'
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

export const formatTotalSales = (total: number) => {
  if (total) {
    // make the result is like 4K+ or 1M+ or 1B+ if the total is more than 1000
    if (total >= 1000 && total < 1000000) {
      return `${(total / 1000).toFixed(1)}K+`;
    }

    if (total >= 1000000 && total < 1000000000) {
      return `${(total / 1000000).toFixed(1)}M+`;
    }

    if (total >= 1000000000) {
      return `${(total / 1000000000).toFixed(1)}B+`;
    }

    return total;
  } else {
    return 0;
  }
};
