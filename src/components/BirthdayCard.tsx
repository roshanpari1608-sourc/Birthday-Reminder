/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Trash2, 
  Edit2, 
  Gift, 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { Birthday } from '../types';
import { 
  getDaysUntilBirthday, 
  isBirthdayToday, 
  getAgeTurning, 
  getZodiacSign, 
  formatBirthdateNice,
  getMilestoneDescription,
  getGreetingPresets
} from '../utils/birthdayUtils';

interface BirthdayCardProps {
  key?: React.Key;
  birthday: Birthday;
  onEdit: (birthday: Birthday) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  today?: Date;
  index?: number;
}

const CATEGORY_META = {
  family: { emoji: '🏠', bg: 'bg-amber-50/60 border-amber-100 text-amber-900' },
  friend: { emoji: '✨', bg: 'bg-teal-50/60 border-teal-100 text-teal-900' },
  partner: { emoji: '❤️', bg: 'bg-rose-50/60 border-rose-100 text-rose-900' },
  colleague: { emoji: '💼', bg: 'bg-slate-50/60 border-slate-100 text-slate-900' },
  other: { emoji: '🏷️', bg: 'bg-slate-50 border-slate-100 text-slate-900' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 18,
      delay: Math.min(i * 0.05, 0.45)
    }
  })
};

export default function BirthdayCard({
  birthday,
  onEdit,
  onDelete,
  onToggleFavorite,
  today = new Date(),
  index = 0,
}: BirthdayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const daysRemaining = getDaysUntilBirthday(birthday.birthDate, today);
  const isToday = isBirthdayToday(birthday.birthDate, today);
  const ageTurning = getAgeTurning(birthday.birthDate, birthday.includeYear, today);
  const zodiac = getZodiacSign(birthday.birthDate);
  const milestone = getMilestoneDescription(ageTurning);
  const cat = CATEGORY_META[birthday.category] || CATEGORY_META.other;

  const handleCopyPreset = (text: string, presetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(presetId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const presets = getGreetingPresets(birthday.name, ageTurning);

  // Helper to split name for editorial design
  const nameParts = birthday.name.split(' ');
  const firstName = nameParts[0] || '';
  const remainingName = nameParts.slice(1).join(' ');

  return (
    <motion.div 
      id={`bday-card-${birthday.id}`}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-[28px] bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isToday 
          ? 'ring-2 ring-rose-200/80 shadow-glow scale-[1.01]' 
          : 'border border-white/40 shadow-soft hover:-translate-y-1 hover:shadow-[14px_14px_32px_rgba(180,190,210,0.38),-14px_-14px_32px_rgba(255,255,255,0.98)]'
      }`}
    >
      {/* Inline delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-md flex flex-col justify-center items-center p-6 text-center animate-fadeIn">
          <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-3 animate-bounce">
            <Trash2 className="w-6 h-6" />
          </div>
          <h4 className="text-white text-sm font-bold">Remove Birthday?</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-[200px] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-white">{birthday.name}</span>?
          </p>
          <div className="flex gap-2.5 mt-5">
            <button
              id={`confirm-delete-no-${birthday.id}`}
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-slate-700 active:scale-95"
            >
              Cancel
            </button>
            <button
              id={`confirm-delete-yes-${birthday.id}`}
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete(birthday.id);
              }}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-glow active:scale-95"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}
      {/* Soft color decorative glowing bubble anchor */}
      <div className={`absolute -right-6 -top-6 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none transition-all duration-300 group-hover:scale-125 ${
        isToday 
          ? 'bg-rose-400' 
          : birthday.category === 'partner' ? 'bg-rose-300'
          : birthday.category === 'family' ? 'bg-amber-300'
          : birthday.category === 'friend' ? 'bg-teal-300'
          : 'bg-slate-300'
      }`} />

      <div className="p-6 space-y-4">
        {/* Row 1: Category Tag & Favorite & Actions panel */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/60 text-xs font-semibold shadow-soft-inset ${cat.bg}`}>
            <span className="text-sm leading-none">{cat.emoji}</span>
            <span className="capitalize tracking-wide">{birthday.category}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              id={`favorite-btn-${birthday.id}`}
              onClick={() => onToggleFavorite(birthday.id)}
              className="p-2 rounded-full bg-slate-50 hover:bg-rose-50 hover:shadow-soft-inset text-slate-300 hover:text-rose-500 transition-all cursor-pointer active:scale-90"
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-all ${
                  birthday.isFavorite 
                    ? 'fill-rose-500 text-rose-500 scale-105' 
                    : 'text-slate-300 hover:text-slate-400'
                }`} 
              />
            </button>
            <button
              id={`edit-btn-${birthday.id}`}
              onClick={() => onEdit(birthday)}
              className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 hover:shadow-soft-inset text-slate-400 hover:text-slate-800 transition-all cursor-pointer active:scale-95"
              title="Edit details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              id={`delete-btn-${birthday.id}`}
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-full bg-slate-50 hover:bg-rose-50 hover:shadow-soft-inset text-slate-400 hover:text-rose-500 transition-all cursor-pointer active:scale-90"
              title="Delete birthday"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Name & Countdown with Profile Avatar */}
        <div className="flex gap-4 items-center">
          {/* Circular Photo or Gradient Preset Preview */}
          <div className="shrink-0">
            {birthday.photoUrl ? (
              birthday.photoUrl.startsWith('preset:') ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft transition-transform group-hover:scale-105 duration-300 ${
                  birthday.photoUrl === 'preset:rose' ? 'bg-gradient-to-tr from-rose-400/90 to-rose-600'
                  : birthday.photoUrl === 'preset:amber' ? 'bg-gradient-to-tr from-amber-400/90 to-amber-600'
                  : birthday.photoUrl === 'preset:teal' ? 'bg-gradient-to-tr from-teal-400/90 to-teal-600'
                  : birthday.photoUrl === 'preset:indigo' ? 'bg-gradient-to-tr from-indigo-400/90 to-indigo-600'
                  : 'bg-gradient-to-tr from-slate-400/90 to-slate-600'
                }`}>
                  {birthday.name.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <img 
                  src={birthday.photoUrl} 
                  alt={birthday.name} 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-soft transition-transform group-hover:scale-105 duration-300"
                />
              )
            ) : (
              // Default elegant fallback with initials
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-500 font-bold text-sm flex items-center justify-center border-2 border-white shadow-soft transition-transform group-hover:scale-105 duration-300">
                {birthday.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <h3 id={`name-${birthday.id}`} className="text-base font-sans font-bold tracking-tight text-slate-800 leading-tight truncate">
                {firstName} <span className="font-light italic text-slate-500">{remainingName}</span>
              </h3>
              
              {/* Elegant countdown capsule */}
              <div className="shrink-0">
                {isToday ? (
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-450 to-pink-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-full shadow-glow">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>TODAY!</span>
                  </span>
                ) : (
                  <span className={`inline-flex items-center py-1.5 px-3 rounded-full text-xs font-bold shadow-soft-inset ${
                    daysRemaining <= 7 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/60' 
                      : 'bg-slate-50 text-slate-500 border border-slate-100/30'
                    }`}
                  >
                    {daysRemaining === 1 ? 'In 1 day' : `In ${daysRemaining} days`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-350 shrink-0" />
              <span className="text-slate-500 font-medium">{formatBirthdateNice(birthday.birthDate, birthday.includeYear)}</span>
              {ageTurning !== null && (
                <>
                  <span className="text-slate-250">•</span>
                  <span className="text-slate-600 bg-slate-50 border border-slate-100/55 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                    Turning {ageTurning}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Highlight Milestone Alerts or Zodiac */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-slate-500 flex items-center gap-1.5 shadow-soft-inset font-mono">
            <span className="text-xs">{zodiac.icon}</span>
            <span>{zodiac.name}</span>
          </span>
          {milestone && (
            <span className="text-[11px] font-bold bg-rose-50 border border-rose-100 text-rose-600 rounded-lg px-2.5 py-1 shadow-soft-inset">
              🏆 {milestone}
            </span>
          )}
        </div>

        {/* Expandable celebratory section */}
        <div className="border-t border-slate-100/80 pt-3">
          <button
            id={`toggle-details-btn-${birthday.id}`}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              <span>{isExpanded ? 'Hide dynamic gift deck' : 'View gift & custom words'}</span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {isExpanded && (
            <div id={`details-${birthday.id}`} className="mt-4 space-y-4 animate-fadeIn">
              {/* Personal notes */}
              {birthday.notes && (
                <div className="p-3.5 bg-slate-50/60 border border-slate-100 rounded-2xl text-xs leading-relaxed text-slate-600 italic">
                  <strong>Notes &amp; bio:</strong> {birthday.notes}
                </div>
              )}

              {/* Gift checklist */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold font-mono">
                  Personalized Wishlist
                </h4>
                {birthday.giftIdeas && birthday.giftIdeas.length > 0 ? (
                  <ul className="space-y-1.5">
                    {birthday.giftIdeas.map((gift, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-rose-50/20 border border-dashed border-rose-150/60 rounded-xl p-3">
                        <span className="text-sm shrink-0">🎁</span>
                        <span className="italic font-medium text-slate-800">{gift}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400 italic font-medium pl-1">No custom gift ideas logged yet. Try adding some!</p>
                )}
              </div>

              {/* Copy Cards Greeting Presets */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold font-mono flex items-center gap-1">
                  💡 Ready-to-Send Words
                </h4>
                
                <div className="space-y-2">
                  {presets.slice(0, 2).map((preset) => (
                    <div 
                      key={preset.id} 
                      className="p-3.5 rounded-2xl border border-white/60 bg-white/60 shadow-soft-inset text-xs space-y-2 hover:border-slate-150 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          {preset.label}
                        </span>
                        <button
                          id={`copy-btn-${birthday.id}-${preset.id}`}
                          onClick={() => handleCopyPreset(preset.text, preset.id)}
                          className="flex items-center gap-1 font-bold text-[10px] px-3 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-full cursor-pointer transition-colors shadow-2xs active:scale-95"
                        >
                          {copiedId === preset.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                        {preset.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
