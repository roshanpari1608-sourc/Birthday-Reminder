/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cake, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  Heart, 
  Gift, 
  ArrowRight, 
  PartyPopper,
  CalendarCheck,
  Dices,
  Quote,
  MapPin,
  Compass,
  Lock,
  LogOut
} from 'lucide-react';
import { Birthday, BirthdayCategory, UserProfile } from './types';
import { 
  getDaysUntilBirthday, 
  isBirthdayToday, 
  getAgeTurning, 
  sortBirthdaysUpcoming,
  formatBirthdateNice,
  getGreetingPresets
} from './utils/birthdayUtils';
import AddBirthdayModal from './components/AddBirthdayModal';
import BirthdayCard from './components/BirthdayCard';
import UserProfileModal from './components/UserProfileModal';
import NotificationHub from './components/NotificationHub';
import LoginScreen from './components/LoginScreen';

// Setup reference time of today for pristine calculation
const INITIAL_TODAY = new Date('2026-05-28');

// Rich pre-populated mock birthdays for instant visual polish
const MOCK_BIRTHDAYS: Birthday[] = [
  {
    id: 'mock-1',
    name: 'David Miller',
    birthDate: '1993-05-28',
    includeYear: true,
    category: 'partner',
    isFavorite: true,
    notes: 'Loves red velvet cake, size L shirts, planning a surprise dinner.',
    giftIdeas: ['Gravel bike tires', 'Espresso cups']
  },
  {
    id: 'mock-2',
    name: 'Sarah Jenkins',
    birthDate: '1900-05-29', // Tomorrow
    includeYear: false,
    category: 'friend',
    isFavorite: false,
    notes: 'In town for the weekend! Enjoys indie fiction books and floral arrangements.',
    giftIdeas: ['Custom hand-poured candle', 'Bookshop gift card']
  },
  {
    id: 'mock-3',
    name: 'Grandma Betty',
    birthDate: '1952-06-02', // 5 days away
    includeYear: true,
    category: 'family',
    isFavorite: true,
    notes: 'Enjoys gardening. Call her in afternoon. Crafting a card from grandkids.',
    giftIdeas: ['Premium gardening trowel', 'Handwritten letter']
  },
  {
    id: 'mock-4',
    name: 'Tony Stark',
    birthDate: '1985-06-15', // Colleague
    includeYear: true,
    category: 'colleague',
    isFavorite: false,
    notes: 'Always orders cold brew with extra espresso shot.',
    giftIdeas: ['Smart mug adapter']
  },
  {
    id: 'mock-5',
    name: 'Olivia Wilde',
    birthDate: '1991-11-12',
    includeYear: true,
    category: 'friend',
    isFavorite: false,
    notes: 'Send a voice note! Into outdoor bouldering.',
    giftIdeas: ['Chalk bag']
  }
];

const RANDOM_QUOTES = [
  "“The more you praise and celebrate your life, the more there is in life to celebrate.” — Oprah Winfrey",
  "“Age is merely the number of years the world has been enjoying you.” — Unknown",
  "“Count your age by friends, not years. Count your life by smiles, not tears.” — John Lennon",
  "“Today is the oldest you've ever been, and the youngest you'll ever be again.” — Eleanor Roosevelt",
  "“Birthdays are nature’s way of feeding us more cake.” — Edward Morykwas",
  "“Grow old along with me! The best is yet to be.” — Robert Browning",
  "“A birth-date is a reminder to celebrate the life as well as to update the life.” — Amit Kalantri"
];

const RANDOM_GIFTS = [
  "Custom portrait illustration of their favorite artwork",
  "A high-quality retro leather journal engraved with their initials",
  "An indoor stargazing night-light projector for sweet ambient evenings",
  "A personalized birth-year vinyl records player collection",
  "Gourmet chocolate truffles tasting box containing exotic flavors",
  "An architectural DIY model kit of their favorite city skyline",
  "A cozy premium weighted blanket with self-heating cozy layers",
  "A classic vintage cocktail shaker set with custom martini glasses",
  "Curated coffee sampler box with gourmet beans from around the world"
];

const RANDOM_PLACES = [
  "An intimate rooftop stargazing lounge with specialty custom mocktails",
  "A charming vintage record store cafe for cozy coffee & cake anniversary",
  "A local secret botanical conservatory garden under glass domes",
  "A retro neon-lit arcade lounge for some nostalgic competition",
  "A scenic riverside dining terrace playing live acoustic soft jazz",
  "An immersive state-of-the-art escape room studio for a collaborative thrill",
  "An old school bookstore with a hidden high-tea service parlor",
  "A boutique gourmet cooking workshop session with master chefs",
  "A candlelit indie theater screening classic nostalgic milestones"
];

const RANDOM_EXPERIENCES = [
  "Create a memory lane jar filled with 50 sweet handwritten memories",
  "Arrange a surprise picnic with fresh pastries in a nearby meadow",
  "Bake a custom multi-tiered signature sponge cake with their favorite fruit",
  "Set up a cozy room loaded with 100 colorful bio-degradable balloons",
  "Design a customized newspaper front page detailing their life milestones",
  "Organize a secret live music serenade with friends in the living room",
  "Gift an adventure booklet with redeemable tokens for custom sweet gestures"
];

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Roshan Pari',
  email: 'roshanpari1608@gmail.com',
  birthDate: '1998-08-16',
  avatarUrl: 'preset:rose',
  favoriteCake: 'Chocolate Truffle Cake',
  earlyReminderDays: 3,
  wishesTheme: 'Warm Cozy',
  coFounderName: 'Roshan kumar sahu'
};

export default function App() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync session authentication state on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('ceremony_auth') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('user_profile_data', JSON.stringify(profile));
    sessionStorage.setItem('ceremony_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleRegister = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('user_profile_data', JSON.stringify(newProfile));
    sessionStorage.setItem('ceremony_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ceremony_auth');
    setIsAuthenticated(false);
  };

  // User Profile States
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('user_profile_data');
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        if (parsed.coFounderName === 'DeepMind Antigravity' || !parsed.coFounderName) {
          parsed.coFounderName = 'Roshan kumar sahu';
          localStorage.setItem('user_profile_data', JSON.stringify(parsed));
        }
        setUserProfile(parsed);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    } else {
      localStorage.setItem('user_profile_data', JSON.stringify(DEFAULT_USER_PROFILE));
    }
  }, []);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('user_profile_data', JSON.stringify(updatedProfile));
  };

  // States for randomized suggestions matching Spotlight Panel design
  const [randomQuote, setRandomQuote] = useState(RANDOM_QUOTES[0]);
  const [randomGift, setRandomGift] = useState(RANDOM_GIFTS[0]);
  const [randomPlace, setRandomPlace] = useState(RANDOM_PLACES[0]);
  const [randomExperience, setRandomExperience] = useState(RANDOM_EXPERIENCES[0]);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<'quote' | 'gift' | 'place' | 'experience'>('quote');
  const [spotlightCopied, setSpotlightCopied] = useState(false);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | BirthdayCategory | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'upcoming' | 'alphabetical'>('upcoming');

  // Load birthdays from localStorage or pre-populate with mock data
  useEffect(() => {
    const stored = localStorage.getItem('birthday_reminders');
    if (stored) {
      try {
        setBirthdays(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse birthdays from localStorage', e);
        setBirthdays(MOCK_BIRTHDAYS);
      }
    } else {
      setBirthdays(MOCK_BIRTHDAYS);
      localStorage.setItem('birthday_reminders', JSON.stringify(MOCK_BIRTHDAYS));
    }
  }, []);

  // Save changes helper
  const saveAndSync = (updatedBirthdays: Birthday[]) => {
    setBirthdays(updatedBirthdays);
    localStorage.setItem('birthday_reminders', JSON.stringify(updatedBirthdays));
  };

  const handleSaveBirthday = (data: Omit<Birthday, 'id'> & { id?: string }) => {
    if (data.id) {
      // Edit mode
      const updated = birthdays.map((item) =>
        item.id === data.id ? { ...item, ...data } : item
      );
      saveAndSync(updated as Birthday[]);
    } else {
      // Add mode
      const newBday: Birthday = {
        ...data,
        id: `bday-${Date.now()}`,
        isFavorite: false,
      };
      saveAndSync([...birthdays, newBday]);
    }
    setEditingBirthday(null);
  };

  const handleDeleteBirthday = (id: string) => {
    const filtered = birthdays.filter((item) => item.id !== id);
    saveAndSync(filtered);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = birthdays.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveAndSync(updated);
  };

  const handleEditClick = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingBirthday(null);
    setIsAddModalOpen(true);
  };

  // Compute calculated metrics
  const sortedUpcoming = sortBirthdaysUpcoming(birthdays, INITIAL_TODAY);
  const birthdaysToday = birthdays.filter((b) => isBirthdayToday(b.birthDate, INITIAL_TODAY));
  
  // Categorized counts
  const categoryCounts = birthdays.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoritesCount = birthdays.filter((b) => b.isFavorite).length;

  // Filter & Sort final view list
  let processedBirthdays = [...birthdays];
  
  // Apply Search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    processedBirthdays = processedBirthdays.filter((b) => 
      b.name.toLowerCase().includes(query) || (b.notes && b.notes.toLowerCase().includes(query))
    );
  }

  // Apply Filter
  if (selectedFilter !== 'all') {
    if (selectedFilter === 'favorites') {
      processedBirthdays = processedBirthdays.filter((b) => b.isFavorite);
    } else {
      processedBirthdays = processedBirthdays.filter((b) => b.category === selectedFilter);
    }
  }

  // Apply Sorting
  if (sortBy === 'upcoming') {
    processedBirthdays = sortBirthdaysUpcoming(processedBirthdays, INITIAL_TODAY);
  } else {
    processedBirthdays.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Next up reference
  const nextUp = sortedUpcoming.find((b) => !isBirthdayToday(b.birthDate, INITIAL_TODAY));

  const rollRandomSuggestion = (tabToRoll = activeSuggestionTab) => {
    if (tabToRoll === 'quote') {
      const idx = Math.floor(Math.random() * RANDOM_QUOTES.length);
      setRandomQuote(RANDOM_QUOTES[idx]);
    } else if (tabToRoll === 'gift') {
      const idx = Math.floor(Math.random() * RANDOM_GIFTS.length);
      setRandomGift(RANDOM_GIFTS[idx]);
    } else if (tabToRoll === 'place') {
      const idx = Math.floor(Math.random() * RANDOM_PLACES.length);
      setRandomPlace(RANDOM_PLACES[idx]);
    } else if (tabToRoll === 'experience') {
      const idx = Math.floor(Math.random() * RANDOM_EXPERIENCES.length);
      setRandomExperience(RANDOM_EXPERIENCES[idx]);
    }
  };

  const spotlightBday = birthdaysToday.length > 0 ? birthdaysToday[0] : nextUp;

  useEffect(() => {
    if (spotlightBday) {
      setRandomQuote(RANDOM_QUOTES[Math.floor(Math.random() * RANDOM_QUOTES.length)]);
      setRandomGift(RANDOM_GIFTS[Math.floor(Math.random() * RANDOM_GIFTS.length)]);
      setRandomPlace(RANDOM_PLACES[Math.floor(Math.random() * RANDOM_PLACES.length)]);
      setRandomExperience(RANDOM_EXPERIENCES[Math.floor(Math.random() * RANDOM_EXPERIENCES.length)]);
    }
  }, [spotlightBday?.id]);

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        userProfile={userProfile} 
        onLoginSuccess={handleLoginSuccess}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div id="app-root-container" className="relative min-h-screen bg-gradient-to-tr from-[#FFF7ED] via-[#FCE7F3]/70 to-[#EADFFF]/50 text-slate-800 font-sans antialiased pb-32 overflow-hidden selection:bg-rose-100 selection:text-rose-900">
      
      {/* Playful Floating 3D/Gradient Decorative Bubbles as requested */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-[#EADFFF]/40 blur-3xl animate-float pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[5%] w-96 h-96 rounded-full bg-[#3BA7FF]/15 blur-3xl animate-float-delayed pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[25%] w-[320px] h-[320px] rounded-full bg-[#FF4D8D]/10 blur-3xl animate-float pointer-events-none z-0" />
      <div className="absolute bottom-[5%] right-[10%] w-80 h-80 rounded-full bg-[#FFD84D]/20 blur-3xl animate-float-delayed pointer-events-none z-0" />
      
      {/* Floating Glassmorphic Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="h-20 px-6 sm:px-8 border border-white/60 bg-white/70 backdrop-blur-md rounded-[28px] shadow-soft flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow transition-transform group-hover:rotate-12 duration-300">
              <Cake className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-tr from-slate-900 to-slate-700 bg-clip-text text-transparent font-display">Ceremony</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">Milestone Engine</span>
            </div>
          </div>

          {/* Quick desktop filters with neumorphic active pills */}
          <div className="hidden md:flex items-center gap-2 p-1.5 bg-slate-100/60 border border-white/50 rounded-full shadow-soft-inset">
            {[
              { id: 'all', label: 'All Ledgers' },
              { id: 'favorites', label: 'Starred' },
              { id: 'family', label: 'Family' },
              { id: 'friend', label: 'Friends' },
            ].map((tab) => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="add-bday-top-nav-btn"
              onClick={handleAddClick}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-450 to-pink-500 hover:opacity-95 text-white rounded-full text-xs font-bold cursor-pointer transition-all shadow-glow flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Birthday</span>
            </button>

            {/* Lock/Logout Session button */}
            <button
              id="header-lock-btn"
              onClick={handleLogout}
              className="p-2.5 rounded-full border border-slate-250/60 bg-white hover:bg-rose-50/80 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Lock Vault & Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Dynamic Interactive Profile Bubble */}
            <button
              id="profile-trigger-bubble"
              onClick={() => setIsProfileModalOpen(true)}
              className="relative w-10 h-10 rounded-full border border-white/80 shadow-soft overflow-hidden flex items-center justify-center text-xs font-black text-white hover:scale-105 active:scale-95 transition-all outline-hidden pr-[0.5px] cursor-pointer animate-float-delayed"
              title="Open My Profile Section"
            >
              {userProfile.avatarUrl ? (
                userProfile.avatarUrl.startsWith('preset:') ? (
                  <div className={`w-full h-full flex items-center justify-center ${
                    userProfile.avatarUrl === 'preset:rose' ? 'bg-gradient-to-tr from-rose-450 to-pink-500 text-white font-black'
                    : userProfile.avatarUrl === 'preset:amber' ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black'
                    : userProfile.avatarUrl === 'preset:teal' ? 'bg-gradient-to-tr from-teal-400 to-emerald-500 text-white font-black'
                    : userProfile.avatarUrl === 'preset:indigo' ? 'bg-gradient-to-tr from-indigo-400 to-purple-600 text-white font-black'
                    : 'bg-gradient-to-tr from-slate-600 to-slate-800 text-white font-black'
                  }`}>
                    {userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'ME'}
                  </div>
                ) : (
                  <img 
                    src={userProfile.avatarUrl} 
                    alt="My avatar" 
                    className="w-full h-full object-cover animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="w-full h-full bg-rose-500 flex items-center justify-center text-white">
                  {userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'ME'}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Desktop Workspace Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Featured Spotlight Row */}
        <section className="w-full lg:w-[42%] flex flex-col gap-6">
          <div className="flex flex-col pl-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-rose-500 mb-1 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{birthdaysToday.length > 0 ? '🎉 Celebrating Today' : '⏳ Spotlight Coming Up'}</span>
            </span>
            {nextUp || birthdaysToday.length > 0 ? (
              (() => {
                const bday = birthdaysToday.length > 0 ? birthdaysToday[0] : nextUp;
                if (!bday) return null;
                const parts = bday.name.split(' ');
                const first = parts[0] || '';
                const last = parts.slice(1).join(' ');
                return (
                  <h1 className="text-4xl sm:text-5xl font-light leading-tight tracking-tight text-slate-900 font-display">
                    {first} <br/>
                    <span className="font-extrabold italic bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">{last}</span>
                  </h1>
                );
              })()
            ) : (
              <h1 className="text-4xl sm:text-5xl font-light leading-tight tracking-tight text-slate-300 font-display">
                Ceremony <br/>
                <span className="font-bold italic text-slate-200">Anniversary</span>
              </h1>
            )}
          </div>

          {/* Large decorative Featured envelope card */}
          {(() => {
            const bday = birthdaysToday.length > 0 ? birthdaysToday[0] : nextUp;
            if (!bday) {
              return (
                <div className="flex-1 bg-white/70 backdrop-blur-md border border-white/60 rounded-[32px] p-10 min-h-[380px] flex flex-col justify-center items-center text-center space-y-4 shadow-soft">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-soft-inset">📝</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700">All quiet in the galaxy</p>
                    <p className="text-xs text-slate-400 italic max-w-xs leading-relaxed">No upcoming birthdays found. Start by adding a reminder to seed this beautiful deck!</p>
                  </div>
                </div>
              );
            }
            
            const daysRemainingValue = getDaysUntilBirthday(bday.birthDate, INITIAL_TODAY);
            const isToday = daysRemainingValue === 0;
            const turningAge = getAgeTurning(bday.birthDate, bday.includeYear, INITIAL_TODAY);
            const firstPreset = getGreetingPresets(bday.name, turningAge)[0]?.text;

             return (
              <div className="relative flex-1 bg-white/80 backdrop-blur-md border border-white/40 rounded-[32px] p-8 sm:p-9 overflow-hidden flex flex-col justify-between min-h-[500px] shadow-soft transition-all duration-300 hover:shadow-[14px_14px_36px_rgba(180,190,210,0.32)]">
                {/* Decorative numeric countdown watermark */}
                <div className="absolute top-8 right-8 select-none pointer-events-none">
                  <span className="text-[130px] font-black text-rose-500/5 leading-none font-mono tracking-tighter">
                    {isToday ? '00' : String(daysRemainingValue).padStart(2, '0')}
                  </span>
                </div>

                <div className="z-10 space-y-6 flex-1 flex flex-col justify-between">
                  {/* Part 1: Top Bio details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 text-[10px] font-bold uppercase tracking-widest text-rose-500 rounded-full font-mono shadow-soft-inset">
                        {isToday ? '🎉 Celebrating Today' : '⏳ Next Spotlight'}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {bday.name}</span>
                    </div>

                    <p className="text-base text-slate-700 leading-relaxed max-w-sm">
                      {bday.notes ? (
                        <span className="font-medium italic text-slate-600 font-serif">"{bday.notes}"</span>
                      ) : (
                        <span className="text-slate-400 italic">No special notes recorded. Use the "Edit" action to add personal preferences.</span>
                      )}
                    </p>

                    {bday.giftIdeas && bday.giftIdeas.length > 0 && (
                      <div className="flex items-center gap-3 bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4 text-xs text-amber-900 shadow-soft-inset">
                        <span className="text-2xl">🎁</span>
                        <div>
                          <div className="font-extrabold text-[10px] uppercase tracking-wider text-amber-700 font-mono">Specified Gift Idea</div>
                          <span className="italic font-medium">"{bday.giftIdeas[0]}"</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part 2: Dynamic Celebration Inspiration Lab */}
                  <div className="bg-white/90 border border-white/60 rounded-[24px] p-5 shadow-soft space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Inspiration Deck</span>
                      </h4>
                      
                      {/* Randomizer Shuffle button */}
                      <button
                        type="button"
                        onClick={() => rollRandomSuggestion()}
                        className="p-1 px-3 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FFD84D]/30 text-amber-950 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                        title="Roll random suggestion"
                      >
                        <Dices className="w-3.5 h-3.5 text-rose-500" />
                        <span>Shuffle idea</span>
                      </button>
                    </div>

                    {/* Tabs Segment */}
                    <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/60 border border-slate-100/30 rounded-2xl shadow-soft-inset">
                      {[
                        { id: 'quote', label: 'Quote', icon: Quote },
                        { id: 'gift', label: 'Gift', icon: Gift },
                        { id: 'place', label: 'Place', icon: MapPin },
                        { id: 'experience', label: 'Action', icon: Compass },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = activeSuggestionTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setActiveSuggestionTab(tab.id as any);
                              rollRandomSuggestion(tab.id as any);
                            }}
                            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-white text-slate-900 shadow-2xs scale-[1.02]' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`} />
                            <span className="hidden sm:inline font-mono">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active dynamic suggestion content card */}
                    <div className="min-h-[96px] flex flex-col justify-center bg-slate-50/50 border border-white/60 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed font-sans shadow-soft-inset">
                      {activeSuggestionTab === 'quote' && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-[#ff255a] uppercase font-mono tracking-widest block">Inspirational Words</span>
                          <p className="no-underline italic font-bold text-[#5a4646] font-serif leading-relaxed text-xs">
                            {randomQuote}
                          </p>
                        </div>
                      )}

                      {activeSuggestionTab === 'gift' && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-[#ff255a] uppercase font-mono tracking-widest block">Surprise Wishlist Generator</span>
                          <p className="no-underline italic font-bold text-[#5a4646] flex items-center gap-2 text-xs">
                            <span className="shrink-0 text-lg">💡</span>
                            <span>{randomGift}</span>
                          </p>
                        </div>
                      )}

                      {activeSuggestionTab === 'place' && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-[#ff255a] uppercase font-mono tracking-widest block font-bold">Anniversary Venue concept</span>
                          <p className="no-underline italic font-bold text-[#5a4646] flex items-center gap-2 text-xs">
                            <span className="shrink-0 text-lg">📍</span>
                            <span>{randomPlace}</span>
                          </p>
                        </div>
                      )}

                      {activeSuggestionTab === 'experience' && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-[#ff255a] uppercase font-mono tracking-widest block font-bold">Unforgettable Gesture</span>
                          <p className="no-underline italic font-bold text-[#5a4646] flex items-center gap-2 text-xs">
                            <span className="shrink-0 text-lg">✨</span>
                            <span>{randomExperience}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part 3: Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {firstPreset && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(firstPreset);
                          setSpotlightCopied(true);
                          setTimeout(() => setSpotlightCopied(false), 2000);
                        }}
                        className={`px-6 py-3 border rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs active:scale-95 duration-200 ${
                          spotlightCopied 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'bg-slate-900 border-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {spotlightCopied ? '✓ Greeting Copied!' : 'Copy Greeting Preset'}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSearchQuery(bday.name);
                        setSelectedFilter('all');
                      }}
                      className="px-5 py-3 bg-white hover:bg-slate-50 border border-white/80 text-slate-700 rounded-full text-xs font-bold cursor-pointer transition-all shadow-soft active:scale-95"
                    >
                      Focus Card
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
          <NotificationHub birthdays={birthdays} userProfile={userProfile} />
        </section>

        {/* Right Column: Active Ledger Timeline Search Section */}
        <section className="w-full lg:w-[58%] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
                Anniversary Ledger
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Explore schedules and curated gift profiles</p>
            </div>

            {/* Quick Sorter */}
            <div className="flex items-center gap-1 p-1 bg-white/70 border border-white/60 rounded-full shadow-soft text-xs">
              <button
                id="sort-btn-upcoming"
                onClick={() => setSortBy('upcoming')}
                className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all ${
                  sortBy === 'upcoming' 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Timeline Queue
              </button>
              <button
                id="sort-btn-alphabetical"
                onClick={() => setSortBy('alphabetical')}
                className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all ${
                  sortBy === 'alphabetical' 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                A-Z Sorted
              </button>
            </div>
          </div>

          {/* Clean minimal Searching bar */}
          <div className="relative w-full">
            <Search className="absolute left-4.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Search birthdays to prepare gifts or greeting cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-sm bg-white/75 border border-white/40 shadow-soft-inset rounded-2xl focus:border-rose-400 focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Categories Filter Line */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: 'all', label: 'All Reminders 🍰' },
              { id: 'favorites', label: 'Starred ❤️' },
              { id: 'family', label: 'Family 🏠' },
              { id: 'friend', label: 'Friends ✨' },
              { id: 'partner', label: 'Partner 💖' },
              { id: 'colleague', label: 'Colleagues 💼' },
            ].map((filterTab) => (
              <button
                key={filterTab.id}
                onClick={() => setSelectedFilter(filterTab.id as any)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                  selectedFilter === filterTab.id 
                    ? 'bg-rose-500 text-white shadow-glow' 
                    : 'bg-white/80 hover:bg-white border border-white/60 text-slate-600 shadow-2xs'
                }`}
              >
                {filterTab.label}
              </button>
            ))}
          </div>

          {/* Search Result Ledger Grid */}
          {processedBirthdays.length > 0 ? (
            <div id="birthdays-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {processedBirthdays.map((bday, idx) => (
                <BirthdayCard
                  key={bday.id}
                  index={idx}
                  birthday={bday}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteBirthday}
                  onToggleFavorite={handleToggleFavorite}
                  today={INITIAL_TODAY}
                />
              ))}
            </div>
          ) : (
            <div id="empty-state-card" className="border border-dashed border-slate-200 rounded-[32px] bg-white/60 backdrop-blur-md p-12 text-center max-w-sm mx-auto space-y-4 shadow-soft">
              <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl shadow-soft-inset">
                🎂
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">No matching search query found</h3>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Clear or widen your categories to search and display active ledger rows.
                </p>
              </div>
              
              {(searchQuery || selectedFilter !== 'all') && (
                <button
                  id="clear-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-semibold cursor-pointer transition-colors"
                >
                  Reset parameters
                </button>
              )}
            </div>
          )}

          {/* Premium banner exactly mimicking premium upgrade of the design spec */}
          <div className="mt-auto">
            <div className="p-6 bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] flex items-center justify-between shadow-soft">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-slate-800">Premium Wishlists Sync</span>
                <span className="text-xs text-slate-400">Sync with Amazon, Etsy, &amp; Gift certificates</span>
              </div>
              <button 
                onClick={() => alert("Premium integrations (Amazon & Etsy wishlists sync) are arriving soon in the next stable build!")}
                className="px-4 py-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FFD84D]/30 text-amber-950 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                Upgrade now
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* Floating Bottom Control Bar following strict mobile/tablet concept */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-[calc(100%-2.5rem)] h-16 bg-white/80 backdrop-blur-lg border border-white/70 rounded-full shadow-soft flex items-center justify-between px-6 z-50">
        
        {/* Left Side: status indicators */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex flex-col items-start leading-none text-left cursor-pointer group outline-hidden"
            title="Update profile & co-founder details"
          >
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono group-hover:text-slate-500 transition-colors">
              Co-Founder
            </span>
            <span className="text-[11px] font-extrabold text-rose-500 group-hover:text-rose-600 transition-colors truncate max-w-[110px]">
              {userProfile.coFounderName || 'Roshan kumar sahu'}
            </span>
          </button>
          <span className="text-xs font-bold text-slate-700 bg-slate-100/60 shadow-soft-inset px-2.5 py-1 rounded-full">{birthdays.length} Active</span>
        </div>

        {/* Central Plus action button with 3D gradient look */}
        <button
          id="floating-plus-btn"
          onClick={handleAddClick}
          className="absolute left-1/2 -translate-x-1/2 -top-5 w-14 h-14 bg-gradient-to-tr from-[#FF4D8D] to-rose-600 text-white rounded-full shadow-glow flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
          title="Create a reminder"
        >
          <Plus className="w-7 h-7" />
        </button>

        {/* Right Side: shortcuts */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              setSelectedFilter('favorites');
              const grid = document.getElementById('birthdays-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`p-2 rounded-full transition-all text-xs font-bold flex items-center gap-1 ${
              selectedFilter === 'favorites' ? 'text-rose-500 bg-rose-50/70' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>❤️ Starred</span>
          </button>
        </div>
      </div>

      {/* Embedded Form Overlay */}
      <AddBirthdayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBirthday}
        editingBirthday={editingBirthday}
      />

      {/* Embedded User Profile Modal Overlay */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSave={handleSaveProfile}
        birthdays={birthdays}
      />
    </div>
  );
}
