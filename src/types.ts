/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BirthdayCategory = 'family' | 'friend' | 'colleague' | 'partner' | 'other';

export interface Birthday {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD or MM-DD (if year is unknown)
  includeYear: boolean; // if false, birthDate is stored as MM-DD or pseudo year like 1000-MM-DD
  category: BirthdayCategory;
  isFavorite: boolean;
  notes?: string;
  giftIdeas: string[]; // list of tracking items
  photoUrl?: string; // custom base64 photo or preset avatar indicator
}

export interface GreetingPreset {
  id: string;
  label: string;
  text: string;
}

export interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  avatarUrl: string; // base64 or preset:rose, preset:amber, preset:emerald, etc.
  favoriteCake: string;
  earlyReminderDays: number; // 1, 3, 5, 7 days
  wishesTheme: string;
  coFounderName?: string;
}

