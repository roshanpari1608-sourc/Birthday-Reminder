/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Gift, Save, MessageSquareText, Camera, Upload } from 'lucide-react';
import { Birthday, BirthdayCategory } from '../types';

interface AddBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (birthday: Omit<Birthday, 'id'> & { id?: string }) => void;
  editingBirthday: Birthday | null;
}

const CATEGORIES: { value: BirthdayCategory; label: string; emoji: string; color: string }[] = [
  { value: 'family', label: 'Family', emoji: '🏠', color: 'bg-amber-50/60 border-amber-200 text-amber-950 text-xs' },
  { value: 'friend', label: 'Friend', emoji: '✨', color: 'bg-teal-50/60 border-teal-200 text-teal-950 text-xs' },
  { value: 'partner', label: 'Partner', emoji: '❤️', color: 'bg-rose-50/60 border-rose-200 text-rose-950 text-xs' },
  { value: 'colleague', label: 'Colleague', emoji: '💼', color: 'bg-slate-50/60 border-slate-200 text-slate-950 text-xs' },
  { value: 'other', label: 'Other', emoji: '🏷️', color: 'bg-slate-50/60 border-slate-200 text-slate-950 text-xs' },
];

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function AddBirthdayModal({
  isOpen,
  onClose,
  onSave,
  editingBirthday,
}: AddBirthdayModalProps) {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BirthdayCategory>('family');
  const [includeYear, setIncludeYear] = useState(true);
  
  // Custom date selection
  const [birthMonth, setBirthMonth] = useState<number>(5); // Default to current or mid-year
  const [birthDay, setBirthDay] = useState<number>(28);
  const [birthYear, setBirthYear] = useState<number>(new Date().getFullYear() - 25);
  
  const [notes, setNotes] = useState('');
  const [giftInput, setGiftInput] = useState('');
  const [giftIdeas, setGiftIdeas] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  
  useEffect(() => {
    if (editingBirthday) {
      setName(editingBirthday.name);
      setSelectedCategory(editingBirthday.category);
      setIncludeYear(editingBirthday.includeYear);
      setNotes(editingBirthday.notes || '');
      setGiftIdeas(editingBirthday.giftIdeas || []);
      setPhotoUrl(editingBirthday.photoUrl || '');
      
      const parts = editingBirthday.birthDate.split('-');
      if (parts.length === 3) {
        setBirthYear(parseInt(parts[0], 10));
        setBirthMonth(parseInt(parts[1], 10));
        setBirthDay(parseInt(parts[2], 10));
      }
    } else {
      // Reset to defaults
      setName('');
      setSelectedCategory('family');
      setIncludeYear(true);
      const today = new Date();
      setBirthMonth(today.getMonth() + 1);
      setBirthDay(today.getDate());
      setBirthYear(today.getFullYear() - 25);
      setNotes('');
      setGiftIdeas([]);
      setGiftInput('');
      setPhotoUrl('');
    }
  }, [editingBirthday, isOpen]);

  if (!isOpen) return null;

  // Compute maximum days in selected month to prevent choosing invalid dates like Feb 31.
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(includeYear && year ? year : 2024, month, 0).getDate();
  };

  const maxDays = getDaysInMonth(birthMonth, birthYear);
  const adjustedDay = birthDay > maxDays ? maxDays : birthDay;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftInput.trim()) {
      setGiftIdeas([...giftIdeas, giftInput.trim()]);
      setGiftInput('');
    }
  };

  const handleRemoveGift = (index: number) => {
    setGiftIdeas(giftIdeas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pad month and day
    const mStr = String(birthMonth).padStart(2, '0');
    const dStr = String(adjustedDay).padStart(2, '0');
    const yStr = includeYear ? String(birthYear) : '1900'; // Placeholder year

    const birthDate = `${yStr}-${mStr}-${dStr}`;

    onSave({
      id: editingBirthday?.id,
      name: name.trim(),
      birthDate,
      includeYear,
      category: selectedCategory,
      isFavorite: editingBirthday ? editingBirthday.isFavorite : false,
      notes: notes.trim() || undefined,
      giftIdeas,
      photoUrl: photoUrl || undefined,
    });
    
    onClose();
  };

  // Generate days array
  const daysArray = Array.from({ length: maxDays }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  // Generate year array: past 110 years back
  const yearsArray = Array.from({ length: 110 }, (_, i) => currentYear - i);

  return (
    <div id="add-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/15 backdrop-blur-md animate-fadeIn">
      <div 
        id="add-modal-content" 
        className="relative w-full max-w-lg overflow-hidden border border-white/60 bg-white/95 text-slate-800 rounded-[32px] shadow-soft flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/20">
          <h2 id="modal-heading" className="text-lg font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span>{editingBirthday ? 'Edit Birthday Details' : 'Add a New Birthday'}</span>
          </h2>
          <button 
            id="close-modal-btn"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 hover:shadow-soft text-slate-400 hover:text-slate-700 rounded-full transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="bday-name" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono">
              Celebrate Whom? *
            </label>
            <input
              id="bday-name"
              type="text"
              required
              placeholder="e.g. Grandma, Sarah, Tony Stark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-medium text-slate-800"
              autoFocus
            />
          </div>

          {/* Profile Photo / Avatar Options */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono">
              Profile Photo &amp; Style
            </label>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/65 bg-slate-50/45 shadow-soft-inset">
              {/* Preview Circle */}
              <div className="shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  photoUrl.startsWith('preset:') ? (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft ${
                      photoUrl === 'preset:rose' ? 'bg-gradient-to-tr from-rose-450 to-rose-600'
                      : photoUrl === 'preset:amber' ? 'bg-gradient-to-tr from-amber-400 to-amber-600'
                      : photoUrl === 'preset:teal' ? 'bg-gradient-to-tr from-teal-400 to-teal-600'
                      : photoUrl === 'preset:indigo' ? 'bg-gradient-to-tr from-indigo-400 to-indigo-600'
                      : 'bg-gradient-to-tr from-slate-400 to-slate-600'
                    }`}>
                      {name ? name.slice(0, 2).toUpperCase() : '?'}
                    </div>
                  ) : (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/80 shadow-soft">
                      <img 
                        src={photoUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-200 flex items-center justify-center text-slate-400 shadow-soft">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Upload action and carousel of presets */}
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-mono block">
                    Or choose quick preset:
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: 'preset:rose', bg: 'bg-gradient-to-tr from-rose-400 to-rose-600' },
                      { id: 'preset:amber', bg: 'bg-gradient-to-tr from-amber-400 to-amber-600' },
                      { id: 'preset:teal', bg: 'bg-gradient-to-tr from-teal-400 to-teal-600' },
                      { id: 'preset:indigo', bg: 'bg-gradient-to-tr from-indigo-400 to-indigo-600' },
                      { id: 'preset:slate', bg: 'bg-gradient-to-tr from-slate-400 to-slate-600' },
                    ].map((ps) => (
                      <button
                        key={ps.id}
                        type="button"
                        onClick={() => setPhotoUrl(ps.id)}
                        className={`w-6 h-6 rounded-full ${ps.bg} cursor-pointer transition-all ${
                          photoUrl === ps.id ? 'ring-2 ring-rose-350 ring-offset-2 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        title="Select color tag"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Badges */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono">
              Relationship Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  id={`cat-btn-${cat.value}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold cursor-pointer transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-slate-950 border-slate-950 text-white shadow-soft scale-[1.01]'
                      : 'bg-white border-slate-150 text-slate-500 hover:border-slate-350 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <span className="text-sm leading-none">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-3.5 p-5 rounded-2xl bg-slate-50 border border-slate-100/70 shadow-soft-inset">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono">
                Birthday Anniversary
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="bday-include-year"
                  type="checkbox"
                  checked={includeYear}
                  onChange={(e) => setIncludeYear(e.target.checked)}
                  className="w-4 h-4 rounded-md text-rose-500 accent-rose-500 border-slate-200 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-bold">Include birth year</span>
              </label>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-12 gap-2.5">
              {/* Month Dropdown */}
              <div className={includeYear ? 'col-span-12 sm:col-span-5' : 'col-span-12 sm:col-span-7'}>
                <label htmlFor="bday-month" className="sr-only">Month</label>
                <select
                  id="bday-month"
                  value={birthMonth}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10);
                    setBirthMonth(m);
                    // Adjust day if month limit changes (e.g., Feb has 28 vs 31)
                    const tempMax = getDaysInMonth(m, birthYear);
                    if (birthDay > tempMax) setBirthDay(tempMax);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-rose-450 focus:ring-2 focus:ring-rose-200 transition-all font-medium text-slate-700 shadow-2xs cursor-pointer"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Day Dropdown */}
              <div className={includeYear ? 'col-span-6 sm:col-span-3' : 'col-span-12 sm:col-span-5'}>
                <label htmlFor="bday-day" className="sr-only">Day</label>
                <select
                  id="bday-day"
                  value={adjustedDay}
                  onChange={(e) => setBirthDay(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-rose-450 focus:ring-2 focus:ring-rose-200 transition-all font-medium text-slate-700 shadow-2xs cursor-pointer"
                >
                  {daysArray.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              {includeYear && (
                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="bday-year" className="sr-only">Year</label>
                  <select
                     id="bday-year"
                     value={birthYear}
                     onChange={(e) => {
                       const yr = parseInt(e.target.value, 10);
                       setBirthYear(yr);
                       const tempMax = getDaysInMonth(birthMonth, yr);
                       if (birthDay > tempMax) setBirthDay(tempMax);
                     }}
                     className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-rose-450 focus:ring-2 focus:ring-rose-200 transition-all font-medium text-slate-700 shadow-2xs cursor-pointer"
                  >
                    {yearsArray.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {!includeYear && (
              <p className="text-[11px] text-slate-400 font-medium font-mono pl-1">
                Age counting and historical milestones will be hidden, but we'll remind you on this date every year!
              </p>
            )}
          </div>

          {/* Notes Card */}
          <div className="space-y-1.5">
            <label htmlFor="bday-notes" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono">
              Personal Notes
            </label>
            <textarea
              id="bday-notes"
              rows={2}
              placeholder="e.g. Loves carrot cake; size M in t-shirts; busy with gardening..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset font-medium text-slate-800 transition-all text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Gift Tracker */}
          <div className="space-y-2">
            <label htmlFor="gift-input" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              Gift Wishlist
            </label>
            
            <div className="flex gap-2.5">
              <input
                id="gift-input"
                type="text"
                placeholder="e.g. Leather journal, Coffee subscription"
                value={giftInput}
                onChange={(e) => setGiftInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (giftInput.trim()) {
                      setGiftIdeas([...giftIdeas, giftInput.trim()]);
                      setGiftInput('');
                    }
                  }
                }}
                className="flex-1 px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400"
              />
              <button
                id="add-gift-btn"
                type="button"
                onClick={(e) => handleAddGift(e)}
                className="px-5 hover:opacity-95 rounded-2xl bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer text-xs flex items-center justify-center font-bold active:scale-95 shadow-soft"
              >
                Add Option
              </button>
            </div>

            {/* Gift List Grid */}
            {giftIdeas.length > 0 && (
              <ul id="gift-ideas-list" className="mt-2.5 text-xs divide-y divide-slate-100 bg-white/60 border border-slate-150/70 rounded-2xl max-h-36 overflow-y-auto shadow-soft-inset p-1">
                {giftIdeas.map((gift, idx) => (
                  <li key={idx} id={`gift-idea-row-${idx}`} className="flex items-center justify-between px-3 py-2 text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="text-rose-500 text-base leading-none">🎁</span>
                      <span className="font-semibold text-slate-700">{gift}</span>
                    </span>
                    <button
                      id={`remove-gift-btn-${idx}`}
                      type="button"
                      onClick={() => handleRemoveGift(idx)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-end gap-3 rounded-b-[32px]">
          <button
            id="cancel-modal-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-3 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-500 transition-colors cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            id="submit-modal-btn"
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-rose-450 to-pink-500 hover:opacity-95 rounded-full text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-glow cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingBirthday ? 'Save Changes' : 'Create Reminder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
