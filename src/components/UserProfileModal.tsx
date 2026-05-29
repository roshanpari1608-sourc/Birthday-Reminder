/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Cake, 
  Bell, 
  Sparkles, 
  Camera, 
  Upload, 
  Check, 
  Save, 
  ShieldCheck, 
  BarChart3, 
  Heart,
  Award,
  ToggleLeft,
  Settings
} from 'lucide-react';
import { UserProfile, Birthday } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  birthdays: Birthday[];
}

const PRESET_AVATARS = [
  { id: 'preset:rose', bg: 'bg-gradient-to-tr from-rose-450 to-pink-500', name: 'Rose' },
  { id: 'preset:amber', bg: 'bg-gradient-to-tr from-amber-400 to-orange-500', name: 'Coral' },
  { id: 'preset:teal', bg: 'bg-gradient-to-tr from-teal-400 to-emerald-500', name: 'Teal' },
  { id: 'preset:indigo', bg: 'bg-gradient-to-tr from-indigo-400 to-purple-600', name: 'Indigo' },
  { id: 'preset:slate', bg: 'bg-gradient-to-tr from-slate-600 to-slate-800', name: 'Slate' },
];

const WISHES_THEMES = [
  { id: 'Warm Cozy', label: 'Warm Cozy ☕', desc: 'Serene fonts, organic elements, and soft vintage tone presets.' },
  { id: 'Party Neon', label: 'Party Neon 🎈', desc: 'Vibrant neon gradients, exciting emojis, and bold typography presets.' },
  { id: 'Elegant Editorial', label: 'Elegant Editorial ✒️', desc: 'Classy serif accents, expansive negative spaces, and premium spacing.' },
  { id: 'Retro Cosmic', label: 'Retro Cosmic 🪐', desc: 'Futuristic slate themes, terminal monospace alerts, and cosmic symbols.' }
];

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  birthdays,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'stats'>('profile');
  
  // Profile state fields
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [favoriteCake, setFavoriteCake] = useState(profile.favoriteCake);
  const [earlyReminderDays, setEarlyReminderDays] = useState(profile.earlyReminderDays);
  const [wishesTheme, setWishesTheme] = useState(profile.wishesTheme);
  const [coFounderName, setCoFounderName] = useState(profile.coFounderName || '');
  const [passcode, setPasscode] = useState((profile as any).passcode || '1608');

  // File Upload status feedback
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever outer profile changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setBirthDate(profile.birthDate);
      setAvatarUrl(profile.avatarUrl);
      setFavoriteCake(profile.favoriteCake);
      setEarlyReminderDays(profile.earlyReminderDays);
      setWishesTheme(profile.wishesTheme);
      setCoFounderName(profile.coFounderName || '');
      setPasscode((profile as any).passcode || '1608');
      setSaveSuccess(false);
      setUploadError(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) {
      setUploadError('Image size must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read selected image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile = {
      name,
      email,
      birthDate,
      avatarUrl,
      favoriteCake,
      earlyReminderDays,
      wishesTheme,
      coFounderName
    };
    (updatedProfile as any).passcode = passcode;
    onSave(updatedProfile);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Stats calculation
  const totalStarred = birthdays.filter(b => b.isFavorite).length;
  const familyCount = birthdays.filter(b => b.category === 'family').length;
  const friendCount = birthdays.filter(b => b.category === 'friend').length;
  const colleaguesCount = birthdays.filter(b => b.category === 'colleague').length;
  const partnerCount = birthdays.filter(b => b.category === 'partner').length;
  const otherCount = birthdays.filter(b => b.category === 'other').length;

  return (
    <div id="profile-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-md animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        id="profile-modal-content" 
        className="relative w-full max-w-[560px] overflow-hidden border border-white/60 bg-white/95 text-slate-800 rounded-[32px] shadow-soft flex flex-col max-h-[90vh]"
      >
        {/* Colorful Modern Decorative Banner Header */}
        <div className="relative h-28 bg-gradient-to-tr from-rose-450 via-pink-400 to-indigo-400 flex items-end px-6 pb-4">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          
          <button 
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/25 hover:bg-white/40 backdrop-blur-sm hover:shadow-soft text-white rounded-full transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="relative flex items-center gap-4 translate-y-12">
            {/* User Big Avatar Preview */}
            <div className="relative group">
              {avatarUrl ? (
                avatarUrl.startsWith('preset:') ? (
                  <div className={`w-20 h-20 rounded-3xl border-4 border-white shadow-soft flex items-center justify-center text-white font-black text-2xl ${
                    avatarUrl === 'preset:rose' ? 'bg-gradient-to-tr from-rose-450 to-pink-500'
                    : avatarUrl === 'preset:amber' ? 'bg-gradient-to-tr from-amber-400 to-orange-500'
                    : avatarUrl === 'preset:teal' ? 'bg-gradient-to-tr from-teal-400 to-emerald-500'
                    : avatarUrl === 'preset:indigo' ? 'bg-gradient-to-tr from-indigo-400 to-purple-600'
                    : 'bg-gradient-to-tr from-slate-600 to-slate-800'
                  }`}>
                    {name ? name.slice(0, 2).toUpperCase() : '?'}
                  </div>
                ) : (
                  <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-soft">
                    <img 
                      src={avatarUrl} 
                      alt="Profile avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-slate-100 border-4 border-white flex items-center justify-center text-slate-400 shadow-soft">
                  <User className="w-8 h-8" />
                </div>
              )}
              {/* Micro upload overlay */}
              <label className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 border border-white hover:bg-slate-800 rounded-xl text-white shadow-soft cursor-pointer flex items-center justify-center transition-all">
                <Camera className="w-3.5 h-3.5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="flex flex-col text-slate-900 drop-shadow-xs pt-4">
              <h2 className="text-xl font-black tracking-tight">{name || 'Your Profile'}</h2>
              <p className="text-xs font-semibold text-slate-500 bg-white/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/50 w-fit">{email || 'No email set'}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Neumorphic Navigation Tabs inside Modal */}
        <div className="flex items-center gap-1.5 px-6 pt-16 pb-3 border-b border-slate-100 bg-slate-50/20">
          {[
            { id: 'profile', label: 'My Identity', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'stats', label: 'Deck Stats', icon: BarChart3 },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-rose-50 text-rose-600 shadow-soft-inset border border-rose-100/50 scale-[1.01]' 
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Frame */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-[340px]">
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-bold leading-relaxed">
              ⚠️ {uploadError}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Quick Actions / Shuffle Option */}
              <div className="flex items-center justify-between bg-rose-50/40 border border-rose-100/50 p-3 rounded-2xl">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                    <span>🎲</span> Quick Randomizer
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Populate fields with a randomized preset profile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const pool = [
                      { name: 'Aria Sterling', email: 'aria.sterling@cosmos.io', birthDate: '1998-08-14' },
                      { name: 'Liam Thorne', email: 'liam.thorne@nebula.com', birthDate: '1995-11-23' },
                      { name: 'Zara Vance', email: 'vance.zara@quantum.dev', birthDate: '2001-03-30' },
                      { name: 'Oliver Pax', email: 'oliver.pax@helix.net', birthDate: '1992-05-15' },
                      { name: 'Luna Frost', email: 'luna.frost@stardust.org', birthDate: '1999-12-05' },
                      { name: 'Kai Sterling', email: 'kai.sterling@zenith.ai', birthDate: '1996-02-18' },
                      { name: 'Nova Wilde', email: 'nova.wilde@velocity.co', birthDate: '2003-07-27' },
                      { name: 'Silas Vance', email: 'silas.vance@pinnacle.com', birthDate: '1990-10-09' }
                    ];
                    const choice = pool[Math.floor(Math.random() * pool.length)];
                    setName(choice.name);
                    setEmail(choice.email);
                    setBirthDate(choice.birthDate);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-500 rounded-xl text-xs font-extrabold shadow-soft hover:shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Generate Info
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Profile Avatar custom pickers */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-mono block pl-0.5">
                    Choose Quick Avatar Theme:
                  </span>
                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((p) => {
                      const isSelected = avatarUrl === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(p.id);
                            setUploadError(null);
                          }}
                          className={`w-8 h-8 rounded-full ${p.bg} cursor-pointer transition-all border ${
                            isSelected 
                              ? 'ring-2 ring-rose-450 ring-offset-2 scale-110 shadow-soft' 
                              : 'hover:scale-105 border-transparent opacity-80 hover:opacity-100'
                          }`}
                          title={p.name}
                        />
                      );
                    })}
                    
                    {avatarUrl && !avatarUrl.startsWith('preset:') && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('preset:rose')}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold transition-all bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-100/20"
                      >
                        Reset Preset
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Name */}
                <div className="space-y-1.5">
                  <label htmlFor="user-profile-name" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                    👤 Your Full Name
                  </label>
                  <input
                    id="user-profile-name"
                    type="text"
                    required
                    placeholder="e.g. Aria Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Edit Email */}
                <div className="space-y-1.5">
                  <label htmlFor="user-profile-email" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                    ✉️ Your Email Address
                  </label>
                  <input
                    id="user-profile-email"
                    type="email"
                    required
                    placeholder="e.g. aria.sterling@cosmos.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Secure Passcode PIN */}
                <div className="space-y-1.5">
                  <label htmlFor="user-profile-passcode" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                    🔑 Security Passcode PIN
                  </label>
                  <input
                    id="user-profile-passcode"
                    type="text"
                    required
                    maxLength={16}
                    placeholder="e.g. 1608"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold font-mono text-slate-800"
                  />
                </div>

                {/* Edit BirthDate & Favorite Cake */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="user-profile-bdy" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                      📅 Your Birthdate
                    </label>
                    <input
                      id="user-profile-bdy"
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="user-profile-cake" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                      🍰 Favorite Cake
                    </label>
                    <input
                      id="user-profile-cake"
                      type="text"
                      placeholder="e.g. Red Velvet, Cheesecake"
                      value={favoriteCake}
                      onChange={(e) => setFavoriteCake(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-5">
              {/* Early Reminder Setting */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100/70 shadow-soft-inset">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                    Milestone Notification Offset
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] italic leading-tight pl-0.5">
                  Choose how many days prior to celebrate and get reminder cards set up.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[1, 3, 5, 7].map((days) => {
                    const isSelected = earlyReminderDays === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setEarlyReminderDays(days)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-slate-950 text-white shadow-soft scale-[1.01]'
                            : 'bg-white border-slate-150 text-slate-500 hover:border-slate-350 shadow-2xs'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wishes Theme Option */}
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Default Greeting Tone Style
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  {WISHES_THEMES.map((theme) => {
                    const isSelected = wishesTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setWishesTheme(theme.id)}
                        className={`flex flex-col items-start text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-rose-50/50 border-rose-250 ring-1 ring-rose-200' 
                            : 'bg-white hover:bg-slate-50/50 border-slate-150 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-slate-800">{theme.label}</span>
                        <span className="text-[10px] text-slate-400 mt-1 leading-relaxed">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 pl-0.5">
                <BarChart3 className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono">
                  Reminders Ledger Breakdown
                </span>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl shadow-soft-inset text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">Ledger RowCount</span>
                  <span className="text-2xl font-black text-slate-850 block mt-1">{birthdays.length}</span>
                </div>
                <div className="p-4 bg-rose-50/40 border border-rose-100/50 rounded-2xl shadow-soft-inset text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block font-mono">Starred VIP</span>
                  <span className="text-2xl font-black text-rose-600 block mt-1">{totalStarred}</span>
                </div>
                <div className="p-4 bg-amber-50/40 border border-amber-100/50 rounded-2xl shadow-soft-inset text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block font-mono">Notification Offset</span>
                  <span className="text-2xl font-black text-amber-600 block mt-1">{earlyReminderDays}d</span>
                </div>
              </div>

              {/* Comprehensive Bar Details */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-2xs space-y-3.5">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600">🏠 Family Category</span>
                    <span className="text-slate-400 font-semibold">{familyCount} items ({birthdays.length ? Math.round((familyCount/birthdays.length)*100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-450 rounded-full" style={{ width: `${birthdays.length ? (familyCount/birthdays.length)*100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600">✨ Friends Category</span>
                    <span className="text-slate-400 font-semibold">{friendCount} items ({birthdays.length ? Math.round((friendCount/birthdays.length)*100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${birthdays.length ? (friendCount/birthdays.length)*100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600">💖 Partner Category</span>
                    <span className="text-slate-400 font-semibold">{partnerCount} items ({birthdays.length ? Math.round((partnerCount/birthdays.length)*100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-450 rounded-full" style={{ width: `${birthdays.length ? (partnerCount/birthdays.length)*100 : 0}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600">💼 Colleagues Category</span>
                    <span className="text-slate-400 font-semibold">{colleaguesCount} items ({birthdays.length ? Math.round((colleaguesCount/birthdays.length)*100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${birthdays.length ? (colleaguesCount/birthdays.length)*100 : 0}%` }} />
                  </div>
                </div>

                {otherCount > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-600">🏷️ Other Category</span>
                      <span className="text-slate-400 font-semibold">{otherCount} items ({birthdays.length ? Math.round((otherCount/birthdays.length)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: `${birthdays.length ? (otherCount/birthdays.length)*100 : 0}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls layout */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex justify-between items-center rounded-b-[32px]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 pl-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Local Secure Sync</span>
          </div>
          
          <div className="flex gap-2.5">
            <button
              id="cancel-profile-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-3 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-500 transition-colors cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            {activeTab !== 'stats' ? (
              <button
                id="submit-profile-btn"
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 rounded-full text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-soft hover:shadow-2xs active:scale-95"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-450" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saveSuccess ? 'Changes Saved!' : 'Save Details'}</span>
              </button>
            ) : (
              <button
                id="close-profile-btn-stats"
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-rose-450 to-pink-500 hover:opacity-95 rounded-full text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-glow cursor-pointer active:scale-95 animate-pulse"
              >
                <span>Perfect</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
