import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  Play, 
  Mail, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Copy
} from 'lucide-react';
import { Birthday, UserProfile } from '../types';
import { getDaysUntilBirthday, isBirthdayToday } from '../utils/birthdayUtils';

interface NotificationHubProps {
  birthdays: Birthday[];
  userProfile: UserProfile;
}

interface LogEntry {
  id: string;
  time: string;
  title: string;
  message: string;
  status: 'sent' | 'pending' | 'action';
  type: 'browser' | 'email' | 'upcoming';
  actionEmail?: string;
  actionSubject?: string;
  actionBody?: string;
}

export default function NotificationHub({ birthdays, userProfile }: NotificationHubProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inAppToast, setInAppToast] = useState<{ title: string; desc: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state with HTML5 notifications api
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request notifications permission
  const requestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Unsupported Browser', 'Web notifications are not supported in your browser.');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        triggerBeep(523.25, 0.1, () => triggerBeep(659.25, 0.15));
        showToast('Notifications Enabled! 🎉', 'You will now receive desktop notifications for active reminders.');
        addLog(
          'Desktop Notifications Allowed',
          'Successfully connected browser push channel with the active ceremony ledger.',
          'sent',
          'browser'
        );
      } else {
        showToast('Permission Blocked ⛔', 'Enable permission in your browser address bar to receive push alerts.');
      }
    } catch (e) {
      console.error('Error requesting notification permission', e);
    }
  };

  // Sound generator
  const triggerBeep = (freq = 440, duration = 0.1, thenCallback?: () => void) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
      if (thenCallback) {
        setTimeout(thenCallback, duration * 1000);
      }
    } catch (e) {
      // AudioContext may be suspended before user interaction
    }
  };

  // Show Toast fallback helper
  const showToast = (title: string, desc: string) => {
    setInAppToast({ title, desc });
    setTimeout(() => {
      setInAppToast(null);
    }, 4500);
  };

  // Add Log helper
  const addLog = (title: string, message: string, status: 'sent' | 'pending' | 'action', type: 'browser' | 'email' | 'upcoming', extra?: Partial<LogEntry>) => {
    setLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title,
        message,
        status,
        type,
        ...extra
      },
      ...prev.slice(0, 15) // Keep last 15 logs
    ]);
  };

  // Auto scan birthdays to generate initial active alerts logs when profile changes or birthdays are modified
  useEffect(() => {
    const referenceToday = new Date('2026-05-28'); // Sync with INITIAL_TODAY
    const newlyGenerated: LogEntry[] = [];

    // Filter today's birthdays and near future birthdays
    birthdays.forEach(bday => {
      const daysUntil = getDaysUntilBirthday(bday.birthDate, referenceToday);
      const isToday = daysUntil === 0;
      const isNear = daysUntil > 0 && daysUntil <= userProfile.earlyReminderDays;

      if (isToday) {
        // Today Alert
        newlyGenerated.push({
          id: `bday-${bday.id}-today`,
          time: 'Active Ledger',
          title: `🎉 Today: ${bday.name}!`,
          message: `${bday.name} has their birthday today! Remember to choose ${bday.giftIdeas[0] || 'a nice cake'}!`,
          status: 'action',
          type: 'browser',
          actionEmail: userProfile.email,
          actionSubject: `Birthday greetings helper for ${bday.name}`,
          actionBody: `Hi ${bday.name}, wishing you a fantastic, magical birthday! Hope you have a wonderful time filled with peace and delicious dessert. Best regards!`
        });
      } else if (isNear) {
        // Upcoming Alert
        newlyGenerated.push({
          id: `bday-${bday.id}-upcoming`,
          time: `In ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`,
          title: `⏳ Upcoming Reminder: ${bday.name}`,
          message: `${bday.name}'s birthday is in only ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}! Ensure to arrange gifts early.`,
          status: 'pending',
          type: 'upcoming'
        });
      }
    });

    // Populate active logs with calculated reminders, plus general log
    const seedLogs: LogEntry[] = [
      {
        id: 'system-start',
        time: 'System Live',
        title: '🔔 Reminders Engine Initialized',
        message: `Registered local sync tracking with user ${userProfile.name} in timezone.`,
        status: 'sent',
        type: 'browser'
      },
      ...newlyGenerated
    ];

    setLogs(seedLogs);
  }, [birthdays, userProfile.earlyReminderDays, userProfile.name]);

  // Handle send simulated native push test
  const triggerSimulatedPush = () => {
    const activeAlerts = birthdays.map(bday => ({
      bday,
      days: getDaysUntilBirthday(bday.birthDate, new Date('2026-05-28'))
    })).sort((a, b) => a.days - b.days);

    const match = activeAlerts[0];
    if (!match) {
      showToast('No Members Registered', 'Add a person to your anniversary ledger so you can simulate alerts!');
      return;
    }

    const { bday, days } = match;
    const bodyText = days === 0 
      ? `Today is ${bday.name}'s birthday! 🎉 Make sure to send a heart-warming wish details now!`
      : `Advance Warning: ${bday.name}'s birthday is coming up in ${days} days! 🍰`;

    triggerBeep(587.33, 0.12, () => triggerBeep(698.46, 0.15));

    // Show HTML5 native if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Ceremony Reminder`, {
        body: bodyText,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
      });
      addLog(`Dispatched Browser Push`, `Fired HTML5 native notification alert for ${bday.name}.`, 'sent', 'browser');
    } else {
      // In-App Popup fallback
      showToast('🔔 Desktop Reminder (Simulated)', bodyText);
      addLog(`Toast Dispatched (Permission is ${permission})`, `Encountered default custom app reminder for ${bday.name}.`, 'sent', 'browser');
    }
  };

  // Launch prefilled email
  const initiateEmailWish = (log: LogEntry) => {
    if (!log.actionSubject || !log.actionBody) return;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(log.actionSubject)}&body=${encodeURIComponent(log.actionBody)}`;
    window.location.href = mailtoUrl;
    addLog(`Prepared greeting mail`, `Redirected to default email client with greetings template for celebrant.`, 'sent', 'email');
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-white/60 rounded-[32px] p-6 sm:p-7 shadow-soft transition-all duration-300 hover:shadow-md">
      
      {/* Floating In-App Notify Toast Block */}
      {inAppToast && (
        <div className="fixed top-8 right-8 z-[100] max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 border border-white/10 animate-slide-in">
          <div className="p-2 bg-rose-500 rounded-xl shrink-0">
            <BellRing className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-450 font-mono">
              Live Alert Dispacther
            </h4>
            <h3 className="font-extrabold text-sm mt-0.5">{inAppToast.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{inAppToast.desc}</p>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="text-left">
          <h3 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-500 rounded-xl">
              <Bell className="w-4 h-4" />
            </span>
            <span>Real-time Notification Hub</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-semibold">
            How Ceremony automatically reminds you of essential milestones.
          </p>
        </div>

        {/* Browser Permission Badging */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono transition-transform active:scale-95 cursor-pointer ${
              soundEnabled ? 'bg-amber-50/70 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title="Toggle alerts chime sound audio"
          >
            {soundEnabled ? '🔔 Sound On' : '🔕 Mute Chime'}
          </button>
        </div>
      </div>

      {/* Main Grid: Control Options & Notification Simulation Timeline Logs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
        
        {/* Left Side: Setup control controls (span 5) */}
        <div className="md:col-span-5 space-y-4 text-left">
          <div className="p-4 bg-slate-50/75 border border-slate-100/70 rounded-2xl space-y-3.5">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">
                Browser Desktop Push
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Receive instant popups on your device even if you close the webpage tab. Runs using modern HTML5 Service notifications.
              </p>
            </div>

            {/* State Indicator pill */}
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                Current Status:
              </span>
              {permission === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Granted
                </span>
              ) : permission === 'denied' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  Blocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 font-mono">
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                  Pending Setup
                </span>
              )}
            </div>

            {permission !== 'granted' ? (
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="w-full py-2.5 bg-gradient-to-tr from-rose-500 to-pink-500 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-glow transition-transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <BellRing className="w-3.5 h-3.5" />
                Enable Desktop Alerts
              </button>
            ) : (
              <div className="p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-xl text-[11px] text-emerald-800 font-bold leading-normal flex gap-1.5">
                <span className="text-sm">🌟</span>
                <span>Push notifications are active. You will receive reminder alerts {userProfile.earlyReminderDays} {userProfile.earlyReminderDays === 1 ? 'day' : 'days'} beforehand!</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-amber-50/40 border border-amber-100/30 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest font-mono">
              Live Simulation Lab
            </h4>
            <p className="text-[11px] text-amber-700/80 leading-normal">
              Test alignment right away! Hit the button below to simulate exactly how Ceremony triggers reminders on your desktop.
            </p>
            <button
              type="button"
              onClick={triggerSimulatedPush}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-soft-inset border border-amber-400"
            >
              <Play className="w-3.5 h-3.5 text-white" />
              Simulate Instant Alert
            </button>
          </div>
        </div>

        {/* Right Side: Log timeline lists (span 7) */}
        <div className="md:col-span-7 flex flex-col space-y-3.5 text-left">
          <div className="flex items-center justify-between pl-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono">
              Reminders Timeline Logs
            </h4>
            <span className="text-[10px] bg-slate-100 px-2.5 py-1 text-slate-500 rounded-full font-bold font-mono">
              {logs.length} tracked events
            </span>
          </div>

          {/* Log Containers Box */}
          <div className="flex-1 max-h-[310px] overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/50 p-4 scrollbar-thin space-y-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3.5 rounded-xl border text-xs relative overflow-hidden transition-all flex flex-col justify-between gap-2.5 bg-white shadow-3xs ${
                    log.status === 'action' 
                      ? 'border-rose-200 bg-rose-50/10' 
                      : log.status === 'pending'
                      ? 'border-amber-200 bg-amber-50/10'
                      : 'border-slate-150'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        {log.type === 'browser' && <span className="text-[12px]">🔔</span>}
                        {log.type === 'email' && <span className="text-[12px]">✉️</span>}
                        {log.type === 'upcoming' && <span className="text-[12px]">⏳</span>}
                        <span>{log.title}</span>
                      </h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed max-w-md">
                        {log.message}
                      </p>
                    </div>
                    <span className="text-[9px] font-black font-mono text-slate-400 shrink-0 whitespace-nowrap bg-slate-100/60 px-2 py-0.5 rounded-md">
                      {log.time}
                    </span>
                  </div>

                  {/* Actions associated with log */}
                  {log.status === 'action' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => initiateEmailWish(log)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-glow active:scale-95 cursor-pointer"
                        title="Draft celebratory message prefilled using your device's mail client"
                      >
                        <Mail className="w-3 h-3 text-white" />
                        <span>Send Email Greeting</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (log.actionBody) {
                            navigator.clipboard.writeText(log.actionBody);
                            showToast('Greeting Copied!', 'The pre-filled wishes template copy is placed into your clipboard.');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Copy text of original design"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-12 text-center text-slate-400 space-y-2">
                <span className="text-2xl animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
                <p className="text-[11px] italic font-medium leading-relaxed max-w-xs">Scan pending... Configure birthday values above to pop real scheduled reminders here!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
