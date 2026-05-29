/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Birthday, GreetingPreset } from '../types';

/**
 * Returns the parsed Month (0-11) and Day (1-31) of a birthday.
 * Normalizes formats of YYYY-MM-DD.
 */
export function parseBirthdateParts(birthDateStr: string): { month: number; day: number; year?: number } {
  const parts = birthDateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);
    return { year, month, day };
  }
  return { month: 0, day: 1 };
}

/**
 * Calculates how many days remain until the next birthday sequence.
 * Handles leap years and today's anniversary.
 */
export function getDaysUntilBirthday(birthDateStr: string, today: Date = new Date()): number {
  const { month, day } = parseBirthdateParts(birthDateStr);
  
  // Set time of today to midnight for pure day comparison
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Try this year
  let bdayThisYear = new Date(today.getFullYear(), month, day);
  
  // If birthday has passed this year, look to next year
  if (bdayThisYear < startOfToday) {
    bdayThisYear = new Date(today.getFullYear() + 1, month, day);
  }
  
  const diffTime = bdayThisYear.getTime() - startOfToday.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if the birthday is today.
 */
export function isBirthdayToday(birthDateStr: string, today: Date = new Date()): boolean {
  const { month, day } = parseBirthdateParts(birthDateStr);
  return today.getMonth() === month && today.getDate() === day;
}

/**
 * Calculates current age of a birthday turning this year, or the age they are turning.
 */
export function getAgeTurning(birthDateStr: string, includeYear: boolean, today: Date = new Date()): number | null {
  if (!includeYear) return null;
  const { year, month, day } = parseBirthdateParts(birthDateStr);
  if (!year) return null;
  
  // Age they are turning this year (or next year if their birthday is next year)
  let bdayThisYear = new Date(today.getFullYear(), month, day);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const turningYear = bdayThisYear < startOfToday ? today.getFullYear() + 1 : today.getFullYear();
  return turningYear - year;
}

/**
 * Calculates current age today.
 */
export function getAgeToday(birthDateStr: string, includeYear: boolean, today: Date = new Date()): number | null {
  if (!includeYear) return null;
  const { year, month, day } = parseBirthdateParts(birthDateStr);
  if (!year) return null;

  let age = today.getFullYear() - year;
  const m = today.getMonth() - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }
  return age;
}

/**
 * Computes zodiac sign description and emoji.
 */
export function getZodiacSign(birthDateStr: string): { name: string; icon: string } {
  const { month, day } = parseBirthdateParts(birthDateStr);
  const m = month + 1; // 1-12
  const d = day;

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { name: 'Aries', icon: '♈' };
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { name: 'Taurus', icon: '♉' };
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { name: 'Gemini', icon: '♊' };
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { name: 'Cancer', icon: '♋' };
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { name: 'Leo', icon: '♌' };
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { name: 'Virgo', icon: '♍' };
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { name: 'Libra', icon: '♎' };
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { name: 'Scorpio', icon: '♏' };
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { name: 'Sagittarius', icon: '♐' };
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { name: 'Capricorn', icon: '♑' };
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { name: 'Aquarius', icon: '♒' };
  return { name: 'Pisces', icon: '♓' };
}

/**
 * Sort is sorted by next birthday countdown (soonest first).
 */
export function sortBirthdaysUpcoming(birthdays: Birthday[], today: Date = new Date()): Birthday[] {
  return [...birthdays].sort((a, b) => {
    // Favorites take priority if countdown is within a range, but generally sorting by countdown days is clean.
    // Let's stick strictly to chronological days remaining to prevent order confusion.
    const daysA = getDaysUntilBirthday(a.birthDate, today);
    const daysB = getDaysUntilBirthday(b.birthDate, today);
    return daysA - daysB;
  });
}

/**
 * Format date representation nicely (e.g. "October 16" or "Oct 16, 1995")
 */
export function formatBirthdateNice(birthDateStr: string, includeYear: boolean): string {
  const { year, month, day } = parseBirthdateParts(birthDateStr);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[month] || '';
  if (includeYear && year) {
    return `${monthName} ${day}, ${year}`;
  }
  return `${monthName} ${day}`;
}

export function getMilestoneDescription(age: number | null): string | null {
  if (age === null) return null;
  if (age === 1) return 'First birthday! 🍼';
  if (age === 18) return 'Adult milestone! ✨';
  if (age === 21) return 'Milestone 21st! 🥂';
  if (age % 10 === 0) return `A brand new decade! Big ${age} 🥳`;
  if (age === 25 || age === 50 || age === 75) return `Silver & Golden Milestone! (${age}) 🎉`;
  return null;
}

export function getGreetingPresets(name: string, ageTurning: number | null): GreetingPreset[] {
  const formattedAge = ageTurning ? ` turning ${ageTurning}` : '';
  return [
    {
      id: 'warm',
      label: 'Warm & Heartfelt',
      text: `Happy Birthday, ${name}! 🎉 I hope this year brings you so much love, peace, and endless joy. You deserve the absolute best today and always! 💖`
    },
    {
      id: 'short',
      label: 'Short & Elegant',
      text: `Wishing you a wonderful birthday, ${name}! ✨ Have a beautiful celebration filled with your favorite things.`
    },
    {
      id: 'humorous',
      label: 'Fun & Playful',
      text: `Happy Birthday, ${name}! 🥳 Another year older, wiser, and more fabulous! Don't count the candles, just enjoy the cake! 🍰🎈`
    },
    {
      id: 'professional',
      label: 'Warm Professional',
      text: `Wishing you a very Happy Birthday, ${name}! Hope you have a wonderful day of celebrating and a fantastic, successful year ahead. 💼🌟`
    }
  ];
}
