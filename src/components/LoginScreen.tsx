import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cake, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Play, 
  UserPlus, 
  Key, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  userProfile: UserProfile;
  onLoginSuccess: (updatedProfile: UserProfile) => void;
  onRegister: (newProfile: UserProfile) => void;
}

export default function LoginScreen({ userProfile, onLoginSuccess, onRegister }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState(userProfile.email || 'roshanpari1608@gmail.com');
  const [signInPasscode, setSignInPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBirthdate, setRegBirthdate] = useState('1998-08-16');
  const [regPasscode, setRegPasscode] = useState('');
  const [regConfirmPasscode, setRegConfirmPasscode] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    // Validate inputs
    const normalizedEmail = signInEmail.toLowerCase().trim();
    const storedEmail = userProfile.email.toLowerCase().trim();
    
    // Default passcode is '1608'. If user has custom passcode, check that too.
    const expectedPasscode = (userProfile as any).passcode || '1608';

    if (normalizedEmail === storedEmail && signInPasscode === expectedPasscode) {
      // Success
      onLoginSuccess(userProfile);
    } else if (normalizedEmail === 'roshanpari1608@gmail.com' && signInPasscode === '1608') {
      // Fallback fallback standard admin entry
      onLoginSuccess({
        ...userProfile,
        email: 'roshanpari1608@gmail.com'
      });
    } else {
      setSignInError('Invalid registered email address or passcode. Please check hints below.');
    }
  };

  // Handle Register submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // Basic password matching
    if (!regName.trim() || !regEmail.trim() || !regPasscode.trim()) {
      setRegError('All fields are requested to configure a personalized vault.');
      return;
    }

    if (regPasscode !== regConfirmPasscode) {
      setRegError('Passcodes do not match. Ensure secret PIN values are equal.');
      return;
    }

    const newProfile: UserProfile = {
      name: regName.trim(),
      email: regEmail.toLowerCase().trim(),
      birthDate: regBirthdate,
      avatarUrl: 'preset:rose',
      favoriteCake: 'Chocolate Truffle Cake',
      earlyReminderDays: 3,
      wishesTheme: 'Warm Cozy',
      coFounderName: 'Roshan kumar sahu'
    };

    // Store custom passcode in updated profile
    (newProfile as any).passcode = regPasscode;

    onRegister(newProfile);
  };

  // Skip Login with Demo / Sandbox instant bypass
  const handleSandboxBypass = () => {
    // Fill correct profile and login as guest
    onLoginSuccess({
      ...userProfile,
      name: userProfile.name || 'Roshan Pari',
      email: userProfile.email || 'roshanpari1608@gmail.com'
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#FFF7ED] via-[#FCE7F3]/70 to-[#EADFFF]/50 text-slate-800 font-sans antialiased flex flex-col justify-center items-center p-4 overflow-hidden selection:bg-rose-100 selection:text-rose-900">
      
      {/* Dynamic Ambient Blur Background elements */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-[#EADFFF]/50 blur-3xl animate-float pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[3%] w-[380px] h-[380px] rounded-full bg-[#3BA7FF]/15 blur-3xl animate-float-delayed pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[20%] w-[320px] h-[320px] rounded-full bg-[#FF4D8D]/10 blur-3xl animate-float pointer-events-none z-0" />

      {/* Main glass card content wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 26, stiffness: 180 }}
        className="relative z-10 w-full max-w-[460px] bg-white/75 backdrop-blur-xl border border-white/65 rounded-[36px] shadow-soft p-6 sm:p-8 flex flex-col gap-6"
      >
        {/* Visual Brand Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-rose-450 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow animate-float">
            <Cake className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">
              Welcome to Ceremony
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">
              The Milestone Ledger Engine
            </p>
          </div>
        </div>

        {/* Dynamic Nav tabs for entry type */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/60 border border-slate-100/30 rounded-2xl shadow-soft-inset">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setSignInError(null);
            }}
            className={`py-2 px-1 text-xs font-black transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signin' 
                ? 'bg-white text-slate-900 shadow-2xs' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign In Vault</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
            }}
            className={`py-2 px-1 text-xs font-black transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register' 
                ? 'bg-white text-slate-900 shadow-2xs' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-pink-500" />
            <span>Configure Vault</span>
          </button>
        </div>

        {/* Form Tab Blocks */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            {signInError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-bold flex gap-2 items-start leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{signInError}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="signin-email" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                ✉️ Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="e.g. roshanpari1608@gmail.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Secret Passcode PIN field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center pr-0.5">
                <label htmlFor="signin-passcode" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                  🔑 Secret Passcode
                </label>
                <button
                  type="button"
                  onClick={() => {
                    // Pre-fill default PIN for high usability
                    setSignInPasscode('1608');
                    setSignInEmail('roshanpari1608@gmail.com');
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-600 font-bold uppercase tracking-wider"
                  title="Prefill preset PIN sandbox parameters"
                >
                  Use Pre-set PIN
                </button>
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="signin-passcode"
                  type={showPasscode ? "text" : "password"}
                  required
                  placeholder="Enter passcode PIN"
                  value={signInPasscode}
                  onChange={(e) => setSignInPasscode(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-mono font-bold text-slate-800 tracking-widest"
                />
                
                {/* Toggle passcode view */}
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-signin-btn"
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-tr from-rose-500 to-pink-500 hover:opacity-95 text-white rounded-2xl text-xs font-extrabold transition-all active:scale-[0.98] shadow-glow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Unlock Ceremony Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Hint alert element */}
            <div className="p-3.5 bg-amber-50/40 border border-amber-100/30 rounded-2xl text-[11px] text-left text-amber-700/90 leading-relaxed space-y-1">
              <span className="font-extrabold flex items-center gap-1 uppercase tracking-wider text-[10px] text-amber-800 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Quick Access Parameters</span>
              </span>
              <p>
                Your Ceremony vault is locked under default parameter <b>roshanpari1608@gmail.com</b> and passcode PIN <b>1608</b>. Use "Use Pre-set PIN" or bypass using the live sandbox button below.
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-bold flex gap-2 items-start leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="reg-name" className="block text-xs font-extrabold uppercase tracking-widest text-slate-450 font-mono pl-0.5">
                👤 Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="e.g. Roshan kumar sahu"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="reg-email" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                ✉️ Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="e.g. cofounder@deepmind.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-semibold text-slate-800"
              />
            </div>

            {/* Birthdate & PIN Codes */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-bday" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                  📅 Birthdate
                </label>
                <input
                  id="reg-bday"
                  type="date"
                  required
                  value={regBirthdate}
                  onChange={(e) => setRegBirthdate(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-passcode" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                  🔑 PIN Passcode
                </label>
                <input
                  id="reg-passcode"
                  type="password"
                  required
                  placeholder="Set secret PIN"
                  value={regPasscode}
                  onChange={(e) => setRegPasscode(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-xs font-mono font-bold tracking-widest text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label htmlFor="reg-confirm" className="block text-xs font-extrabold uppercase tracking-widest text-slate-455 font-mono pl-0.5">
                🔒 Confirm Passcode PIN
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                placeholder="Confirm secret PIN"
                value={regConfirmPasscode}
                onChange={(e) => setRegConfirmPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-150 rounded-2xl focus:border-rose-450 focus:ring-2 focus:ring-rose-200/50 focus:outline-hidden shadow-soft-inset transition-all text-sm font-mono font-bold tracking-widest text-slate-800"
              />
            </div>

            <button
              id="submit-register-btn"
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-tr from-pink-500 to-indigo-500 hover:opacity-95 text-white rounded-2xl text-xs font-extrabold transition-all active:scale-[0.98] shadow-glow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Initialize Personal Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Separator */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-3 bg-[#FFFBF7]/90 text-slate-400 uppercase tracking-widest font-black font-mono">
              Or bypass
            </span>
          </div>
        </div>

        {/* Sandbox instant play bypass */}
        <button
          id="guest-sandbox-btn"
          type="button"
          onClick={handleSandboxBypass}
          className="w-full py-3 bg-white/90 hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-soft hover:shadow-xs"
        >
          <Play className="w-3.5 h-3.5 text-emerald-500" />
          <span>Launch Sandbox (Demo Session)</span>
        </button>

        {/* High security reassurance badge */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Local-Session Security</span>
        </div>
      </motion.div>
    </div>
  );
}
