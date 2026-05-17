/* app.jsx — KaamWala AI: screen router + chat home
   Auth screens live in auth.jsx; shared icons/helpers in lib.jsx. */

const { useState, useEffect, useRef, useMemo } = React;

/* ─── Pull shared bits off window ────────────────────────────────── */
const {
  Icon, IconBot, IconMic, IconSend, IconRefresh, IconStar, IconMapPin, IconCheck,
  IconClock, IconShield, IconSparkle, IconPhone, IconBolt, IconArrowLeft,
  BotAvatar, shade, TONE, PROVIDERS,
} = window;

/* ════════════════════════════════════════════════════════════════
   CHAT WIDGETS
   ════════════════════════════════════════════════════════════════ */

function CausesCard({ accent, onConfirm, disabled }) {
  const causes = [
    { title: 'Refrigerant gas leak',       sub: 'Sabse common — gas khatam ho gayi lagti hai', pct: 65, color: '#DC2626', range: 'Rs. 4,000 – 6,500' },
    { title: 'Compressor / PCB fault',     sub: 'Electrical issue ho sakta hai',                pct: 22, color: '#F59E0B', range: 'Rs. 5,500 – 8,000' },
    { title: 'Filters / coils blocked',    sub: 'Servicing se theek ho jaata hai',              pct: 13, color: '#10B981', range: 'Rs. 3,500 – 4,500' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden max-w-[290px]">
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: `${accent}15`, color: accent }}>
          <IconSparkle size={20}/>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">AI Analysis</div>
          <div className="text-[15px] font-semibold text-slate-900 leading-tight mt-0.5">Top 3 likely causes</div>
        </div>
      </div>

      <div className="px-3 pb-3 space-y-1.5">
        {causes.map((c) => (
          <div key={c.title} className="rounded-xl border border-slate-100 p-2.5 flex items-start gap-2.5">
            <div className="relative w-9 h-9 shrink-0">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke={c.color} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 15}
                        strokeDashoffset={2 * Math.PI * 15 * (1 - c.pct/100)}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: c.color }}>{c.pct}%</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 leading-tight">{c.title}</div>
              <div className="text-[10.5px] text-slate-500 leading-snug mt-0.5">{c.sub}</div>
              <div className="text-[10.5px] text-slate-700 font-semibold mt-1">{c.range}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/70 border-t border-slate-100 px-4 py-2.5 flex items-center gap-1.5">
        <IconShield size={12} stroke="#10B981"/>
        <span className="text-[11px] text-slate-500 leading-tight">Final price technician site pe diagnose ke baad batayega</span>
      </div>

      <button onClick={onConfirm} disabled={disabled}
        className="w-full py-3 font-semibold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
        style={{ background: accent }}>
        {window.TONE_EN.confirmBtn}
        <span className="text-[18px] leading-none">→</span>
      </button>
    </div>
  );
}

function Row({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[13px] text-slate-800 flex items-center gap-1 text-right">
        {icon}{value}
      </span>
    </div>
  );
}

function LocationVerifyCard({ accent, address, landmark, onAddressChange, onConfirm, disabled }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(address);
  useEffect(() => { setVal(address); }, [address]);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden max-w-[290px]">
      <div className="px-4 pt-4 pb-2.5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: `${accent}15`, color: accent }}>
          <IconMapPin size={20}/>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Your Location</div>
          <div className="text-[14px] font-semibold text-slate-900 leading-tight mt-0.5">Confirm to send request</div>
        </div>
      </div>

      {/* Mini map */}
      <div className="relative mx-3 rounded-2xl overflow-hidden" style={{ height: 110 }}>
        <div className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)`,
          }}/>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="none">
          <path d="M0 60 Q 140 40 280 80" stroke="white" strokeWidth="14" fill="none"/>
          <path d="M0 60 Q 140 40 280 80" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeDasharray="6 6"/>
          <path d="M140 0 L 160 110" stroke="white" strokeWidth="10" fill="none"/>
          <path d="M140 0 L 160 110" stroke="#94A3B8" strokeWidth="1.2" fill="none" strokeDasharray="6 6"/>
          <rect x="20" y="15" width="36" height="22" rx="3" fill="white" opacity="0.6"/>
          <rect x="220" y="20" width="40" height="20" rx="3" fill="white" opacity="0.6"/>
          <rect x="60" y="78" width="32" height="18" rx="3" fill="white" opacity="0.6"/>
        </svg>
        <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <span className="absolute -inset-6 rounded-full animate-ping" style={{ background: `${accent}25` }}/>
          <span className="absolute -inset-3 rounded-full" style={{ background: `${accent}25` }}/>
          <div className="relative w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
               style={{ background: accent }}>
            <IconMapPin size={18} stroke="white" fill="white"/>
          </div>
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
          GPS ±8m
        </div>
      </div>

      {/* Address text / edit */}
      <div className="px-4 pt-3">
        {editing ? (
          <textarea value={val} onChange={(e) => setVal(e.target.value)}
            className="w-full p-2.5 rounded-xl border-2 text-[13px] outline-none resize-none bg-white text-slate-900"
            rows={2} autoFocus
            style={{ borderColor: accent }}/>
        ) : (
          <div className="text-[13px] font-semibold text-slate-900 leading-snug">{address}</div>
        )}
        {!editing && landmark && (
          <div className="text-[11px] text-slate-500 mt-1 italic">📍 {landmark}</div>
        )}
      </div>

      <div className="px-3 pt-3 pb-3 flex gap-2">
        {editing ? (
          <button onClick={() => { onAddressChange(val); setEditing(false); }}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-[12.5px] font-semibold active:scale-[0.99] transition">
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} disabled={disabled}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[12.5px] font-semibold disabled:opacity-50">
            Edit karo
          </button>
        )}
        <button onClick={onConfirm} disabled={disabled || editing}
          className="flex-[1.4] py-2.5 rounded-xl text-white text-[13px] font-semibold disabled:opacity-50 active:scale-[0.99] transition flex items-center justify-center gap-1"
          style={{ background: accent }}>
          Haan, yahi hai
          <span className="text-[16px] leading-none">→</span>
        </button>
      </div>
    </div>
  );
}

function SearchingBubble({ accent }) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-100 px-3.5 py-2.5 max-w-[78%]">
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 shrink-0">
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `${accent}30` }}/>
          <span className="absolute inset-1.5 rounded-full" style={{ background: `${accent}30` }}/>
          <span className="absolute inset-3 rounded-full" style={{ background: accent }}/>
        </div>
        <p className="text-[13px] text-slate-800 leading-snug">{window.TONE_EN.searchingMsg}</p>
      </div>
    </div>
  );
}

function ProviderCard({ provider, accent, tone, onBook, disabled }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden max-w-[300px]">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-[15px] shrink-0"
               style={{ background: provider.avatarBg }}>
            {provider.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-[15px] truncate">{provider.name}</span>
              <IconCheck size={14} stroke="#2563EB" strokeWidth={3}/>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                <IconStar filled size={12}/>
                <span className="text-[12px] font-semibold text-slate-800">{provider.rating}</span>
              </div>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500">{provider.jobs} jobs</span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                <IconMapPin size={10} stroke="#94A3B8"/>{provider.distance}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {provider.skills.map(s => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{s}</span>
          ))}
        </div>

        <div className="mt-3 rounded-xl p-3 relative" style={{ background: `${accent}0D`, borderLeft: `3px solid ${accent}` }}>
          <div className="flex items-center gap-1.5 mb-1">
            <IconSparkle size={11} stroke={accent}/>
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accent }}>
              Why this match?
            </span>
          </div>
          <p className="text-[12.5px] text-slate-700 leading-snug">{provider.reasonEn}</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Pricing</div>
            <div className="text-[12px] text-slate-800 font-medium leading-tight mt-0.5">{provider.quote}</div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: '#FEF3C7' }}>
            <IconBolt size={11} stroke="#B45309" fill="#F59E0B"/>
            <span className="text-[11px] font-bold text-amber-700">ETA {provider.eta}</span>
          </div>
        </div>
      </div>

      <button onClick={onBook} disabled={disabled}
        className="w-full py-3 font-semibold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: accent }}>
        {TONE[tone].bookBtn}
      </button>
    </div>
  );
}

function ReceiptCard({ provider, accent, tone, onRate, ratingGiven, jobStatus, finalAmount }) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(ratingGiven || 0);
  const submitted = ratingGiven > 0;
  const status = jobStatus || 'on-way';
  const completed = status === 'completed';

  const STAT = {
    'on-way':         { dot: '#10B981', pulse: true,  text: 'On the way',                  etaLabel: 'Arriving in',  etaValue: provider.eta },
    'arriving-soon':  { dot: '#10B981', pulse: true,  text: 'Almost there',                etaLabel: 'Arriving in',  etaValue: '~5 min' },
    'arrived':        { dot: '#0891B2', pulse: false, text: 'Arrived at your address',     etaLabel: 'Status',       etaValue: 'At your door' },
    'working':        { dot: '#F59E0B', pulse: true,  text: 'Work in progress',            etaLabel: 'Status',       etaValue: 'Fixing the issue' },
    'completed':      { dot: '#10B981', pulse: false, text: 'Job completed',               etaLabel: 'Final amount', etaValue: finalAmount ? `Rs. ${finalAmount.toLocaleString('en-PK')}` : '—' },
  };
  const s = STAT[status];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden max-w-[300px]">
      <div className="px-4 py-3 text-white relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
        <div className="absolute -right-8 top-8 w-16 h-16 rounded-full bg-white/5"/>
        <div className="flex items-center gap-2 relative">
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
            <IconCheck size={16} stroke="white" strokeWidth={3}/>
          </div>
          <div>
            <div className="font-bold text-[15px] leading-tight">{TONE[tone].confirmedTitle}</div>
            <div className="text-[11px] text-white/85">#KW-8341 · {provider.name.split(' ')[0]}</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: `${s.dot}15` }}>
          {completed
            ? <IconCheck size={20} stroke={s.dot} strokeWidth={3}/>
            : <IconClock size={20} stroke={s.dot}/>}
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{s.etaLabel}</div>
          <div className="text-[15px] font-bold text-slate-900">{s.etaValue}</div>
        </div>
        <button className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[12px] font-semibold flex items-center gap-1.5">
          <IconPhone size={12} stroke="white"/> Call
        </button>
      </div>

      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[13px]"
             style={{ background: provider.avatarBg }}>
          {provider.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 truncate">{provider.name}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.pulse ? 'animate-pulse' : ''}`}
                  style={{ background: s.dot }}/>
            {s.text}
          </div>
        </div>
        {!completed && (
          <div className="text-right">
            <div className="text-[11px] text-slate-400">OTP</div>
            <div className="text-[13px] font-bold tracking-widest text-slate-900">4827</div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100">
        <div className="text-[12px] text-slate-600 mb-2 font-medium">
          {submitted ? TONE[tone].rateThanks
            : completed ? TONE[tone].rateLabel
            : 'Rating kaam khatam hone ke baad open hogi'}
        </div>
        <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
          {[1,2,3,4,5].map(n => (
            <button key={n} disabled={submitted || !completed}
              onMouseEnter={() => completed && setHover(n)}
              onClick={() => { if (!completed) return; setRating(n); onRate(n); }}
              className="transition-transform hover:scale-110 disabled:hover:scale-100"
              style={{ opacity: completed ? 1 : 0.45, cursor: completed ? 'pointer' : 'not-allowed' }}>
              <IconStar filled={n <= (hover || rating)} size={26}/>
            </button>
          ))}
          {submitted && <span className="ml-auto text-[11px] text-emerald-600 font-semibold">✓ Submitted</span>}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}/>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '120ms' }}/>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '240ms' }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CHAT HOME SCREEN — conversational, Pakistan, Roman Urdu copy
   Step machine:
     0  idle/greeting
     1  typing after user msg
     2  causes card
     3  typing after "find technician"
     4  location verify card
     5  searching providers (typing + searching bubble)
     6  provider match
     7  typing after confirm
     8  receipt + live status updates from provider
   ════════════════════════════════════════════════════════════════ */
function ChatApp({ accent, tone, providerIndex, density, authData, onSignOut }) {
  const provider = PROVIDERS[providerIndex % PROVIDERS.length];
  const t = TONE[tone];
  const T = window.TONE_EN;
  const providerFirst = provider.firstName || provider.name.split(' ')[0];

  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [userText, setUserText] = useState('');
  const [typing, setTyping] = useState(false);
  const [rating, setRating] = useState(0);
  const [address, setAddress] = useState('House 24-B, Street 8, DHA Phase 5, Karachi');
  const landmark = 'Near Khayaban-e-Bukhari & Hilal Park';
  // Live status from provider
  const [jobStatus, setJobStatus] = useState(null);
  const [statusMsgs, setStatusMsgs] = useState([]);
  const [finalAmount, setFinalAmount] = useState(null);
  const scrollRef = useRef(null);

  const reset = () => {
    setStep(0); setInput(''); setUserText(''); setTyping(false); setRating(0);
    setJobStatus(null); setStatusMsgs([]); setFinalAmount(null);
  };
  useEffect(() => { reset(); }, [tone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [step, typing, statusMsgs.length]);

  // Status sequence after booking confirmed (step 8)
  useEffect(() => {
    if (step !== 8) return;
    const amount = 4200;
    const seq = [
      { at: 1500,  status: 'on-way',        msg: T.st_onway(providerFirst) },
      { at: 5500,  status: 'arriving-soon', msg: T.st_arriving(providerFirst, 5) },
      { at: 10500, status: 'arrived',       msg: T.st_arrived(providerFirst) },
      { at: 15500, status: 'working',       msg: T.st_working(providerFirst) },
      { at: 22000, status: 'completed',     msg: T.st_done(providerFirst, amount), amount },
    ];
    const ids = seq.map(item => setTimeout(() => {
      setJobStatus(item.status);
      setStatusMsgs(prev => [...prev, { text: item.msg, status: item.status }]);
      if (item.amount) setFinalAmount(item.amount);
    }, item.at));
    return () => ids.forEach(clearTimeout);
  }, [step, providerFirst]);

  // Transitions
  const send = () => {
    if (!input.trim() && step !== 0) return;
    setUserText(input || t.userMsg);
    setInput('');
    setStep(1); setTyping(true);
    setTimeout(() => { setTyping(false); setStep(2); }, 1300);
  };
  const onCausesConfirm = () => {
    setStep(3); setTyping(true);
    setTimeout(() => { setTyping(false); setStep(4); }, 1100);
  };
  const onLocationConfirm = () => {
    setStep(5); setTyping(true);
    // Brief "searching" beat then show match
    setTimeout(() => { setTyping(false); setStep(6); }, 2200);
  };
  const onBook = () => {
    setStep(7); setTyping(true);
    setTimeout(() => { setTyping(false); setStep(8); }, 1100);
  };

  const bubbleGap = density === 'compact' ? 'space-y-2' : 'space-y-3';

  const BotBubble = ({ children, narrow, accentBg }) => (
    <div className="flex items-end gap-1.5 max-w-full">
      <BotAvatar accent={accent}/>
      <div className={`${narrow ? '' : (accentBg ? 'bg-white' : 'bg-white')} ${narrow ? '' : 'rounded-2xl rounded-bl-md shadow-sm border border-slate-100 px-3.5 py-2.5'} max-w-[78%]`}>
        {children}
      </div>
    </div>
  );
  const UserBubble = ({ children }) => (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-br-md shadow-sm px-3.5 py-2.5 max-w-[78%] text-white text-[14px] leading-snug"
           style={{ background: accent }}>
        {children}
      </div>
    </div>
  );
  const SystemBubble = ({ children, color = accent }) => (
    <div className="flex items-end gap-1.5">
      <BotAvatar accent={accent}/>
      <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-100 px-3.5 py-2.5 max-w-[78%]">
        {children}
      </div>
    </div>
  );

  const userName = authData?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex flex-col h-full" style={{ background: '#F4F6FA' }}>
      {/* Top bar */}
      <div className="relative shrink-0 text-white"
           style={{ background: `linear-gradient(180deg, ${accent} 0%, ${shade(accent, -8)} 100%)`,
                    paddingTop: 54, paddingBottom: 12 }}>
        <div className="px-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <IconBot size={22} stroke="white"/>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: accent }}/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[17px] tracking-tight">KaamWala AI</span>
              <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md tracking-wider">BETA</span>
            </div>
            <div className="text-[11px] text-white/80 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"/>
              {`Online · Speaks ${window.SUPPORTED_LANGS}`}
            </div>
          </div>
          <button onClick={reset}
            className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 active:bg-white/25 transition-colors"
            aria-label="Reset chat">
            <IconRefresh size={16} stroke="white"/>
          </button>
          <button onClick={onSignOut}
            className="text-[10.5px] font-semibold text-white/80 px-2"
            aria-label="Sign out">
            Sign out
          </button>
        </div>
      </div>

      {/* Scroll area */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto px-3 py-4 ${bubbleGap}`}>
        <div className="flex justify-center mb-1">
          <span className="text-[10.5px] text-slate-500 bg-white/70 backdrop-blur px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
            Today · 11:42 AM
          </span>
        </div>

        {/* 0: Greeting */}
        <BotBubble>
          <p className="text-[14px] text-slate-800 leading-snug">{t.greeting}</p>
        </BotBubble>

        {step === 0 && (
          <div className="flex items-end gap-1.5">
            <div style={{ width: 28 }}/>
            <div className="flex flex-wrap gap-1.5">
              {t.examples.map(ex => (
                <button key={ex} onClick={() => setInput(ex)}
                  className="text-[12px] px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium shadow-sm active:bg-slate-50 transition-colors">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1+ user msg */}
        {step >= 1 && <UserBubble>{userText}</UserBubble>}

        {step === 1 && typing && (
          <div className="flex items-end gap-1.5"><BotAvatar accent={accent}/><TypingDots/></div>
        )}

        {/* 2+ causes */}
        {step >= 2 && (
          <>
            <BotBubble>
              <p className="text-[14px] text-slate-800 leading-snug">{t.diagnoseHeader}</p>
            </BotBubble>
            <div className="flex items-end gap-1.5">
              <div style={{ width: 28 }}/>
              <CausesCard accent={accent} onConfirm={onCausesConfirm} disabled={step > 2}/>
            </div>
          </>
        )}

        {/* 3 typing after find */}
        {step === 3 && typing && (
          <>
            <UserBubble>{T.confirmBtn} ✓</UserBubble>
            <div className="flex items-end gap-1.5"><BotAvatar accent={accent}/><TypingDots/></div>
          </>
        )}

        {/* 4+ location card */}
        {step >= 4 && (
          <>
            <UserBubble>{T.confirmBtn} ✓</UserBubble>
            <BotBubble>
              <p className="text-[14px] text-slate-800 leading-snug">{T.locationHeader}</p>
            </BotBubble>
            <div className="flex items-end gap-1.5">
              <div style={{ width: 28 }}/>
              <LocationVerifyCard accent={accent} address={address} landmark={landmark}
                onAddressChange={setAddress} onConfirm={onLocationConfirm} disabled={step > 4}/>
            </div>
          </>
        )}

        {/* 5 searching */}
        {step === 5 && (
          <>
            <UserBubble>{T.locationConfirmBtn} ✓</UserBubble>
            <div className="flex items-end gap-1.5">
              <BotAvatar accent={accent}/>
              <SearchingBubble accent={accent}/>
            </div>
          </>
        )}

        {/* 6+ provider match */}
        {step >= 6 && (
          <>
            {step !== 5 && <UserBubble>{T.locationConfirmBtn} ✓</UserBubble>}
            <BotBubble>
              <p className="text-[14px] text-slate-800 leading-snug">{T.matchHeader}</p>
            </BotBubble>
            <div className="flex items-end gap-1.5">
              <div style={{ width: 28 }}/>
              <ProviderCard provider={provider} accent={accent} tone={tone} onBook={onBook} disabled={step > 6}/>
            </div>
          </>
        )}

        {/* 7 typing after book */}
        {step === 7 && typing && (
          <>
            <UserBubble>{T.bookBtn} ✓</UserBubble>
            <div className="flex items-end gap-1.5"><BotAvatar accent={accent}/><TypingDots/></div>
          </>
        )}

        {/* 8 receipt + status messages */}
        {step >= 8 && (
          <>
            <UserBubble>{T.bookBtn} ✓</UserBubble>
            <div className="flex items-end gap-1.5">
              <div style={{ width: 28 }}/>
              <ReceiptCard provider={provider} accent={accent} tone={tone}
                           jobStatus={jobStatus} finalAmount={finalAmount}
                           onRate={(n) => setRating(n)} ratingGiven={rating}/>
            </div>

            {statusMsgs.map((m, i) => {
              const dotColor = {
                'on-way':        '#10B981',
                'arriving-soon': '#10B981',
                'arrived':       '#0891B2',
                'working':       '#F59E0B',
                'completed':     '#10B981',
              }[m.status] || accent;
              return (
                <BotBubble key={i}>
                  <div className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                          style={{ background: dotColor }}/>
                    <p className="text-[14px] text-slate-800 leading-snug">{m.text}</p>
                  </div>
                </BotBubble>
              );
            })}

            {rating > 0 && (
              <BotBubble>
                <p className="text-[14px] text-slate-800 leading-snug">
                  {T.postRating(rating, providerFirst)}
                </p>
              </BotBubble>
            )}
          </>
        )}

        <div style={{ height: 8 }}/>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-slate-200/70 px-3 pt-2.5 pb-7">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200 transition-colors shrink-0"
                  aria-label="Voice">
            <IconMic size={18} stroke="#475569"/>
          </button>
          <div className="flex-1 relative">
            <input value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={t.placeholder}
              className="w-full bg-slate-100 rounded-full text-[14px] px-4 py-2.5 pr-10 outline-none border border-transparent focus:border-slate-300 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"/>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600">
              <Icon size={16}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></Icon>
            </button>
          </div>
          <button onClick={send}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
            style={{ background: accent }}
            aria-label="Send">
            <IconSend size={17} stroke="white" style={{ transform: 'translateX(-1px)' }}/>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400">🔒 Verified providers · 100% guarantee</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SCREEN ROUTER  
   ════════════════════════════════════════════════════════════════ */
function ScreenRouter({ accent, tone, providerIndex, density, initialScreen = 'welcome' }) {
  const [stack, setStack] = useState([initialScreen]);
  const [data, setData] = useState({});
  const [meta, setMeta] = useState({});
  const [trans, setTrans] = useState({ dir: 0, prev: null }); // for slide animation

  const screen = stack[stack.length - 1];

  const goTo = (next, m = {}) => {
    setTrans({ dir: 1, prev: screen });
    setMeta(m);
    setStack(s => [...s, next]);
  };
  const back = () => {
    if (stack.length <= 1) return;
    setTrans({ dir: -1, prev: screen });
    setStack(s => s.slice(0, -1));
  };
  const signOut = () => {
    setStack(['welcome']);
    setData({});
  };

  // Reset transition flag after animation
  useEffect(() => {
    const id = setTimeout(() => setTrans({ dir: 0, prev: null }), 320);
    return () => clearTimeout(id);
  }, [screen]);

  const shared = { accent, tone, data, setData, goTo, back, meta };

  const renderScreen = (name) => {
    switch (name) {
      case 'welcome': return <window.WelcomeScreen {...shared}/>;
      case 'login': return <window.LoginScreen {...shared}/>;
      case 'signup-role': return <window.RoleScreen {...shared}/>;
      case 'signup-user': return <window.UserSignupScreen {...shared}/>;
      case 'signup-provider': return <window.ProviderSignupScreen {...shared}/>;
      case 'otp': return <window.OTPScreen {...shared}/>;
      case 'provider-home':
        return <window.ProviderHome accent={accent} tone={tone} data={data} signOut={signOut}/>;
      case 'home':
        return <ChatApp accent={accent} tone={tone} providerIndex={providerIndex}
                        density={density} authData={data} onSignOut={signOut}/>;
      default: return null;
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Outgoing screen */}
      {trans.dir !== 0 && trans.prev && (
        <div className="absolute inset-0"
             style={{
               animation: `kw-slide-out-${trans.dir > 0 ? 'left' : 'right'} 0.3s ease both`,
               zIndex: 1,
             }}>
          {renderScreen(trans.prev)}
        </div>
      )}
      {/* Current screen */}
      <div className="absolute inset-0"
           style={{
             animation: trans.dir !== 0
               ? `kw-slide-in-${trans.dir > 0 ? 'right' : 'left'} 0.3s ease both`
               : 'none',
             zIndex: 2,
           }}>
        {renderScreen(screen)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════════════════════ */
function App() {
  const defaults = /*EDITMODE-BEGIN*/{
    "accent": "#2563EB",
    "tone": "english",
    "providerIndex": 0,
    "density": "comfortable",
    "startScreen": "welcome"
  }/*EDITMODE-END*/;

  const [t, setTweak] = window.useTweaks(defaults);
  const [resetKey, setResetKey] = useState(0);

  // When startScreen tweak changes, remount router so it picks up new initial.
  // But we want router to manage its own state; instead expose a jump method.
  // Simpler: pass startScreen as a prop and let router seed its stack from it.
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-10 px-4"
         style={{ background: 'radial-gradient(1200px 700px at 50% -10%, #E2E8F0 0%, #F1F5F9 60%, #E2E8F0 100%)' }}>

      <window.IOSDevice width={390} height={820}>
        <ScreenRouter key={resetKey + '-' + t.startScreen} accent={t.accent} tone={t.tone}
                      providerIndex={t.providerIndex} density={t.density}
                      initialScreen={t.startScreen}/>
      </window.IOSDevice>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Start at">
          <window.TweakSelect label="Screen" value={t.startScreen}
            onChange={v => { setTweak('startScreen', v); setResetKey(k => k + 1); }}
            options={[
              { value: 'welcome', label: 'Welcome' },
              { value: 'login', label: 'Login' },
              { value: 'signup-role', label: 'Signup — role' },
              { value: 'signup-user', label: 'Signup — user' },
              { value: 'signup-provider', label: 'Signup — provider' },
              { value: 'otp', label: 'OTP' },
              { value: 'provider-home', label: 'Provider — dashboard' },
              { value: 'home', label: 'Chat home' },
            ]}/>
        </window.TweakSection>

        <window.TweakSection label="Accent">
          <window.TweakColor label="Brand color" value={t.accent} onChange={v => setTweak('accent', v)}
            options={['#2563EB', '#0F766E', '#7C3AED', '#DC2626', '#0891B2']}/>
        </window.TweakSection>

        <window.TweakSection label="Conversation">
          <window.TweakRadio label="Density" value={t.density} onChange={v => setTweak('density', v)}
            options={[{ value: 'comfortable', label: 'Comfy' }, { value: 'compact', label: 'Compact' }]}/>
        </window.TweakSection>

        <window.TweakSection label="Provider variant">
          <window.TweakSelect label="Match shown" value={String(t.providerIndex)}
            onChange={v => setTweak('providerIndex', Number(v))}
            options={PROVIDERS.map((p, i) => ({ value: String(i), label: `${p.name} · ${p.badge}` }))}/>
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
