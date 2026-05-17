/* provider.jsx — Service Provider side
   Screens: ProviderHome (dashboard) + overlays:
     - IncomingBookingSheet
     - ActiveJobScreen (with status progression)
     - JobsTab, EarningsTab, ProfileTab (bottom-nav tabs)
*/

const { useState: useSp, useEffect: useEp, useRef: useRp } = React;

/* ─── Mock data ─────────────────────────────────────────────────── */
const MOCK_BOOKING = {
  customer: { name: "Ayesha Khan", initials: "AK", avatarBg: "#DC2626" },
  issue: "Bathroom tap is leaking — losing water fast",
  issueEn: "Bathroom tap is leaking — losing water fast",
  category: "Plumbing",
  diagnosis: "Cartridge replacement likely",
  severity: "Medium",
  severityHi: "Medium",
  distance: "1.4 km",
  driveMin: 12,
  priceRange: { min: 1500, max: 3500 },
  address: {
    short: "House 24-B, Street 8, DHA Phase 5",
    full: "House 24-B, Street 8, DHA Phase 5, Karachi",
    landmark: "Near Khayaban-e-Bukhari & Hilal Park",
  },
  phone: "+92 3XX XXX 5210",
};

const RECENT_JOBS = [
  { id: 1, customer: "Sana Malik",   initials: "SM", bg: "#7C3AED", service: "AC service & gas refill", amount: 2800, status: "completed", time: "2 hours ago",       rating: 5 },
  { id: 2, customer: "Faisal Ahmed", initials: "FA", bg: "#0891B2", service: "Pipe leak fix",            amount: 3200, status: "completed", time: "Yesterday, 4 PM",  rating: 5 },
  { id: 3, customer: "Fatima Tariq", initials: "FT", bg: "#F59E0B", service: "Geyser install",           amount: 4500, status: "completed", time: "Yesterday, 11 AM", rating: 4 },
  { id: 4, customer: "Hamza Riaz",   initials: "HR", bg: "#10B981", service: "Tap repair",               amount: 1200, status: "scheduled", time: "Tomorrow, 10 AM",  rating: null },
];

const SPARK = [3200, 4500, 2800, 5200, 4100, 6900, 4500];

/* ─── Helpers ──────────────────────────────────────────────────── */
function Rupees({ n, big }) {
  const formatted = n.toLocaleString('en-PK');
  return (
    <span className={big ? 'font-display font-extrabold' : 'font-semibold'}>
      Rs. {formatted}
    </span>
  );
}

function SeverityPill({ level, tone }) {
  const map = {
    Mild:   { bg: '#10B98115', fg: '#059669', label: 'Mild' },
    Medium: { bg: '#F59E0B15', fg: '#B45309', label: 'Medium' },
    Severe: { bg: '#DC262615', fg: '#B91C1C', label: 'Severe' },
  };
  const s = map[level] || map.Medium;
  return (
    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1"
          style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }}/>
      {s.label}
    </span>
  );
}

function StatusToggle({ online, onChange, tone }) {
  return (
    <button onClick={() => onChange(!online)}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-[0.97]"
      style={{
        background: online ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.12)',
        border: online ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.18)',
      }}>
      <span className="relative w-8 h-4 rounded-full"
        style={{ background: online ? '#10B981' : 'rgba(255,255,255,0.25)' }}>
        <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all"
          style={{ left: online ? 18 : 2 }}/>
      </span>
      <span className="text-[11.5px] font-bold text-white tracking-tight">
        {online ? ('Online') : ('Offline')}
      </span>
    </button>
  );
}

/* ─── Sparkline (7-day earnings) ─────────────────────────────── */
function Sparkline({ data, accent, width = 220, height = 56 }) {
  const max = Math.max(...data);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - (v / max) * (height - 10) - 4]);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  const area = path + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="sparkG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkG)"/>
      <path d={path} fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.5 : 0}
                fill="white" stroke={accent} strokeWidth="2"/>
      ))}
    </svg>
  );
}

/* ─── Stat chip ────────────────────────────────────────────────── */
function StatChip({ label, value, sub, icon, tint, big }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/70 ${big ? 'p-4' : 'p-3'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
             style={{ background: `${tint}15`, color: tint }}>
          {icon}
        </div>
        <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold truncate">{label}</span>
      </div>
      <div className={`${big ? 'text-[20px]' : 'text-[16px]'} font-bold text-slate-900 leading-none`}>{value}</div>
      {sub && <div className="text-[10.5px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PROVIDER DASHBOARD (with all overlays)
   ════════════════════════════════════════════════════════════════ */
function ProviderHome({ accent, tone, data: authData, signOut }) {
  const [online, setOnline] = useSp(true);
  const [tab, setTab] = useSp('home');
  const [incoming, setIncoming] = useSp(null);
  const [activeJob, setActiveJob] = useSp(null);
  const [earnings, setEarnings] = useSp(4500); // today's earnings counter
  const [jobsToday, setJobsToday] = useSp(3);
  const [showSimHint, setShowSimHint] = useSp(true);

  // Auto-spawn a booking when online (demo)
  useEp(() => {
    if (!online || incoming || activeJob) return;
    const id = setTimeout(() => {
      setIncoming(MOCK_BOOKING);
      setShowSimHint(false);
    }, 4500);
    return () => clearTimeout(id);
  }, [online, incoming, activeJob]);

  const acceptBooking = () => {
    setActiveJob({ ...incoming, stage: 'on-way', startedAt: Date.now() });
    setIncoming(null);
  };
  const declineBooking = () => setIncoming(null);

  const completeJob = (amount) => {
    setEarnings(e => e + amount);
    setJobsToday(j => j + 1);
    setActiveJob(null);
  };

  const userName = authData?.name?.split(' ')[0] || ('Pro');

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: '#F4F6FA' }}>
      {/* Header */}
      <ProviderHeader accent={accent} tone={tone} userName={userName} signOut={signOut}/>

      {/* Active job banner (compact, when job is active) */}
      {activeJob && (
        <ActiveJobBanner job={activeJob} accent={accent} tone={tone}
                         onOpen={() => setActiveJob({ ...activeJob, expanded: true })}/>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'home' && (
          <HomeTab accent={accent} tone={tone} online={online} setOnline={setOnline}
                   earnings={earnings} jobsToday={jobsToday}
                   userName={userName} showSimHint={showSimHint}
                   triggerSim={() => setIncoming(MOCK_BOOKING)}
                   hasActive={!!activeJob}/>
        )}
        {tab === 'jobs' && <JobsTab accent={accent} tone={tone}/>}
        {tab === 'earnings' && <EarningsTab accent={accent} tone={tone} earnings={earnings}/>}
        {tab === 'profile' && <ProfileTab accent={accent} tone={tone} authData={authData} signOut={signOut}/>}
      </div>

      {/* Bottom nav */}
      <ProviderBottomNav accent={accent} tone={tone} tab={tab} setTab={setTab}/>

      {/* Incoming booking sheet */}
      {incoming && (
        <IncomingBookingSheet booking={incoming} accent={accent} tone={tone}
                              onAccept={acceptBooking} onDecline={declineBooking}/>
      )}

      {/* Active job fullscreen (when expanded) */}
      {activeJob?.expanded && (
        <ActiveJobScreen job={activeJob} setJob={setActiveJob}
                         accent={accent} tone={tone} onComplete={completeJob}/>
      )}
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────── */
function ProviderHeader({ accent, tone, userName, signOut }) {
  return (
    <div className="relative shrink-0 text-white"
         style={{ background: `linear-gradient(180deg, ${accent} 0%, ${window.shade(accent, -10)} 100%)`,
                  paddingTop: 54, paddingBottom: 14 }}>
      <div className="px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 font-bold text-[13px]">
          {(userName?.[0] || 'P').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-white/75 leading-none">Welcome,</div>
          <div className="font-bold text-[16px] tracking-tight truncate flex items-center gap-1.5">
            {userName} bhai
            <window.IconCheck size={13} stroke="#86EFAC" strokeWidth={3}/>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20"
          aria-label="Notifications">
          <window.IconBolt size={16} stroke="white"/>
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </button>
        <button onClick={signOut}
          className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20"
          aria-label="Sign out">
          <window.IconRefresh size={15} stroke="white"/>
        </button>
      </div>
    </div>
  );
}

/* ─── Active job banner ──────────────────────────────────────── */
function ActiveJobBanner({ job, accent, tone, onOpen }) {
  const stageLabel = {
    'on-way': 'On the way',
    'arrived': 'Arrived',
    'in-progress': 'Working',
  }[job.stage] || 'Active';

  return (
    <button onClick={onOpen}
      className="mx-3 mt-3 mb-1 rounded-2xl flex items-center gap-3 px-3.5 py-3 border shadow-sm active:scale-[0.99] transition text-left w-[calc(100%-24px)]"
      style={{ background: 'linear-gradient(135deg, #10B98112, #10B98106)', borderColor: '#10B98140' }}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px]"
             style={{ background: job.customer.avatarBg }}>
          {job.customer.initials}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse"/>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">Active</span>
          <span className="text-[10.5px] text-slate-500">· {stageLabel}</span>
        </div>
        <div className="text-[13px] font-semibold text-slate-900 truncate">
          {job.customer.name} · {job.category}
        </div>
      </div>
      <window.IconArrowRight size={18} stroke="#0F172A"/>
    </button>
  );
}

/* ─── Home tab ───────────────────────────────────────────────── */
function HomeTab({ accent, tone, online, setOnline, earnings, jobsToday, userName, showSimHint, triggerSim, hasActive }) {
  return (
    <div className="px-4 pt-4 pb-4 space-y-4">

      {/* ── Prominent Online / Offline toggle card ── */}
      <button onClick={() => setOnline(!online)}
        className="w-full rounded-3xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.99] transition-all text-left relative overflow-hidden"
        style={{
          background: online
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        }}>
        {/* Decorative pulse rings when online */}
        {online && (
          <>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}/>
            <div className="absolute -right-12 top-8 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}/>
          </>
        )}
        {/* Status orb */}
        <div className="relative shrink-0">
          {online && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(255,255,255,0.25)' }}/>
              <span className="absolute -inset-1 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }}/>
            </>
          )}
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center border-2"
               style={{ background: online ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                        borderColor: online ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)' }}>
            <window.IconBolt size={22} stroke="white" fill={online ? 'white' : 'none'}/>
          </div>
        </div>
        {/* Status text */}
        <div className="flex-1 min-w-0 relative">
          <div className="flex items-center gap-1.5">
            <span className="text-white/75 text-[10.5px] uppercase tracking-wider font-bold">Status</span>
            <span className="text-white/60 text-[10.5px]">·</span>
            <span className="text-white/70 text-[10.5px]">{online ? '• Live' : 'Paused'}</span>
          </div>
          <div className="font-display font-extrabold text-[20px] text-white tracking-tight leading-tight">
            {online ? "You're Online" : "You're Offline"}
          </div>
          <div className="text-[11.5px] text-white/80 mt-0.5 leading-snug">
            {online ? 'Naye bookings aate hi notify karenge' : 'Tap to start receiving bookings'}
          </div>
        </div>
        {/* Big toggle switch */}
        <div className="relative w-14 h-8 rounded-full shrink-0 shadow-inner"
             style={{ background: online ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.15)' }}>
          <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all"
                style={{ left: online ? 28 : 4 }}/>
        </div>
      </button>

      {/* Earnings hero card */}
      <div className="rounded-3xl p-5 text-white relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${accent}, ${window.shade(accent, -14)})` }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}/>
        <div className="absolute -right-12 top-12 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}/>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/75 font-semibold">
                {"Today's earnings"}
              </div>
              <div className="font-display text-[34px] font-extrabold leading-none mt-1.5 tracking-tight">
                Rs. {earnings.toLocaleString('en-PK')}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 self-start mt-1">
              <span style={{ fontSize: 11 }}>↑</span>
              <span className="text-[11px] font-bold">18%</span>
            </div>
          </div>
          <div className="text-[12px] text-white/80 mt-1.5">
            {jobsToday} {'jobs done today'}
            {' · '}
            {''} 82%
          </div>

          <div className="mt-4 flex items-end justify-between">
            <Sparkline data={[...SPARK.slice(0,6), earnings]} accent="white" width={210} height={50}/>
            <div className="text-right">
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">7d</div>
              <div className="text-[13px] font-bold">Rs. {(SPARK.reduce((a,b)=>a+b,0) + earnings - 2450).toLocaleString('en-PK')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo simulator hint */}
      {online && !hasActive && showSimHint && (
        <button onClick={triggerSim}
          className="w-full rounded-2xl bg-white border-2 border-dashed border-slate-300 px-4 py-3 flex items-center gap-3 active:bg-slate-50 transition text-left">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#2563EB15' }}>
            <window.IconSparkle size={18} stroke="#2563EB"/>
          </div>
          <div className="flex-1">
            <div className="text-[12.5px] font-semibold text-slate-800">
              {'Waiting for new bookings...'}
            </div>
            <div className="text-[10.5px] text-slate-500">
              {'(Demo: tap to simulate a booking now)'}
            </div>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
        </button>
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatChip label={'Rating'} value="4.8 ★" sub={'412 reviews'}
          icon={<window.IconStar filled size={14}/>} tint="#F59E0B"/>
        <StatChip label={'Response'} value="96%" sub={'under 60s'}
          icon={<window.IconBolt size={14}/>} tint="#10B981"/>
        <StatChip label={'This week'} value="Rs. 14,200" sub={'11 jobs'}
          icon={<window.IconClock size={14}/>} tint={accent}/>
        <StatChip label={'Repeat'} value="34%" sub={'returning'}
          icon={<window.IconShield size={14}/>} tint="#7C3AED"/>
      </div>

      {/* Recent jobs */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <div className="text-[13px] font-bold text-slate-900">{'Recent jobs'}</div>
            <div className="text-[10.5px] text-slate-500">{'Last 48 hours'}</div>
          </div>
          <button className="text-[11px] font-semibold" style={{ color: accent }}>
            {'See all'} →
          </button>
        </div>
        <div>
          {RECENT_JOBS.map((j, i) => (
            <div key={j.id} className={`px-4 py-3 flex items-center gap-3 ${i < RECENT_JOBS.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-[12.5px]"
                   style={{ background: j.bg }}>{j.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-slate-900 truncate">{j.customer}</span>
                  {j.rating && (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600">
                      <window.IconStar filled size={11}/>{j.rating}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{j.service} · {j.time}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-bold text-slate-900">Rs. {j.amount}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${j.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {j.status === 'completed'
                    ? ('Done')
                    : ('Scheduled')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 12 }}/>
    </div>
  );
}

/* ─── Other tabs (compact) ──────────────────────────────────── */
function JobsTab({ accent, tone }) {
  const upcoming = RECENT_JOBS.filter(j => j.status !== 'completed');
  const done = RECENT_JOBS.filter(j => j.status === 'completed');
  return (
    <div className="px-4 pt-4 pb-4 space-y-3">
      <h2 className="font-display text-[22px] font-bold text-slate-900 tracking-tight">
        {'Your jobs'}
      </h2>
      <div className="flex gap-2 text-[12px] font-semibold">
        <span className="px-3 py-1.5 rounded-full text-white" style={{ background: accent }}>
          {'Today'} · {RECENT_JOBS.length}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
          {'This week'} · 11
        </span>
        <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
          {'All'} · 412
        </span>
      </div>

      {upcoming.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold px-1 mb-2">
            {'Upcoming'}
          </div>
          <div className="space-y-2">
            {upcoming.map(j => <JobRow key={j.id} j={j} accent={accent} tone={tone}/>)}
          </div>
        </div>
      )}

      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold px-1 mb-2 mt-4">
          {'Completed'}
        </div>
        <div className="space-y-2">
          {done.map(j => <JobRow key={j.id} j={j} accent={accent} tone={tone}/>)}
        </div>
      </div>
    </div>
  );
}

function JobRow({ j, accent, tone }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-3.5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px]"
           style={{ background: j.bg }}>{j.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold text-slate-900 truncate">{j.customer}</div>
        <div className="text-[11.5px] text-slate-500 truncate">{j.service}</div>
        <div className="text-[10.5px] text-slate-400 mt-0.5">{j.time}</div>
      </div>
      <div className="text-right">
        <div className="text-[14px] font-bold text-slate-900">Rs. {j.amount}</div>
        {j.rating && (
          <div className="flex items-center gap-0.5 justify-end mt-0.5 text-[11px] font-semibold text-amber-600">
            <window.IconStar filled size={11}/>{j.rating}.0
          </div>
        )}
      </div>
    </div>
  );
}

function EarningsTab({ accent, tone, earnings }) {
  const week = SPARK.reduce((a,b)=>a+b,0) + earnings - 2450;
  return (
    <div className="px-4 pt-4 pb-4 space-y-3">
      <h2 className="font-display text-[22px] font-bold text-slate-900 tracking-tight">
        {'Earnings'}
      </h2>

      {/* Big card */}
      <div className="rounded-3xl p-5 text-white relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${accent}, ${window.shade(accent, -14)})` }}>
        <div className="text-[11px] uppercase tracking-wider text-white/75 font-semibold">
          {'This week'}
        </div>
        <div className="font-display text-[36px] font-extrabold tracking-tight leading-none mt-1.5">
          Rs. {week.toLocaleString('en-PK')}
        </div>
        <div className="text-[12px] text-white/80 mt-1">↑ 22% {'vs last week'}</div>
        <div className="mt-4">
          <Sparkline data={[...SPARK.slice(0,6), earnings]} accent="white" width={290} height={64}/>
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/70 font-semibold">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/70">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-[13px] font-bold text-slate-900">
            {'Weekly breakdown'}
          </div>
        </div>
        {[
          { label: 'Service charges', value: 9800, pct: 68, tint: accent },
          { label: 'Parts margin', value: 3200, pct: 22, tint: '#10B981' },
          { label: 'Tips', value: 850, pct: 6, tint: '#F59E0B' },
          { label: 'Bonus', value: 350, pct: 4, tint: '#7C3AED' },
        ].map((row, i) => (
          <div key={i} className={`px-4 py-3 flex items-center gap-3 ${i < 3 ? 'border-b border-slate-100' : ''}`}>
            <div className="w-2 h-10 rounded-full" style={{ background: row.tint }}/>
            <div className="flex-1">
              <div className="text-[12.5px] font-semibold text-slate-900">{row.label}</div>
              <div className="h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.tint }}/>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13px] font-bold text-slate-900">Rs. {row.value.toLocaleString('en-PK')}</div>
              <div className="text-[10.5px] text-slate-500">{row.pct}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 flex items-start gap-3"
           style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#CBD5E170' }}>
          <window.IconShield size={18} stroke="#475569"/>
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-semibold text-slate-800 leading-snug">
            {'Payment is direct from customer'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            {tone === 'hinglish'
              ? 'KaamWala koi paisa hold nahi karta. Yeh sirf record ke liye hai — kamai aap khud rakhte ho.'
              : 'KaamWala does not hold money. This is just a record — you keep your earnings directly.'}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ accent, tone, authData, signOut }) {
  const name = authData?.name || ('Service Pro');
  const phone = authData?.phone ? '+91 ' + authData.phone.replace(/(\d{5})(\d{5})/, '$1 $2') : '+91 98XXX XX210';
  const city = authData?.city || 'Noida, UP';
  return (
    <div className="px-4 pt-4 pb-4 space-y-3">
      <div className="bg-white rounded-3xl p-5 border border-slate-200/70 text-center">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-[28px]"
             style={{ background: `linear-gradient(135deg, ${accent}, ${window.shade(accent, -14)})` }}>
          {name[0]?.toUpperCase() || 'P'}
        </div>
        <div className="font-display text-[20px] font-bold text-slate-900 mt-3 tracking-tight flex items-center gap-1.5 justify-center">
          {name}
          <window.IconCheck size={16} stroke="#10B981" strokeWidth={3}/>
        </div>
        <div className="text-[12px] text-slate-500 mt-0.5">{phone} · {city}</div>
        <div className="flex justify-center gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider" style={{ background: '#10B98115', color: '#059669' }}>
            ⭐ 4.8 Top Pro
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider" style={{ background: `${accent}15`, color: accent }}>
            412 jobs
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
        {[
          { label: 'Services & rates', sub: '4 categories', icon: <window.IconWrench size={16}/> },
          { label: 'Working hours', sub: 'Mon–Sat · 9–8', icon: <window.IconClock size={16}/> },
          { label: 'Service area', sub: '5 km radius', icon: <window.IconMapPin size={16}/> },
          { label: 'Help & support', sub: '24/7', icon: <window.IconShield size={16}/> },
        ].map((row, i, arr) => (
          <button key={i} className={`w-full px-4 py-3.5 flex items-center gap-3 active:bg-slate-50 transition ${i < arr.length - 1 ? 'border-b border-slate-100' : ''} text-left`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9', color: '#475569' }}>
              {row.icon}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-slate-900">{row.label}</div>
              <div className="text-[11px] text-slate-500">{row.sub}</div>
            </div>
            <window.IconArrowRight size={16} stroke="#94A3B8"/>
          </button>
        ))}
      </div>

      <button onClick={signOut} className="w-full text-[12.5px] font-semibold text-red-600 py-3 mt-2">
        {'Sign out'}
      </button>
    </div>
  );
}

/* ─── Bottom nav ─────────────────────────────────────────────── */
function ProviderBottomNav({ accent, tone, tab, setTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: <window.IconHome size={20}/> },
    { id: 'jobs', label: 'Jobs', icon: <window.IconBriefcase size={20}/> },
    { id: 'earnings', label: 'Earnings', icon: <window.IconRupee size={20}/> },
    { id: 'profile', label: 'Profile', icon: <window.IconUser size={20}/> },
  ];
  return (
    <div className="shrink-0 bg-white border-t border-slate-200/70 pt-1.5 pb-7 px-2">
      <div className="flex">
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 active:scale-95 transition">
              <div className={`w-12 h-7 rounded-full flex items-center justify-center transition-all`}
                   style={{ background: active ? `${accent}15` : 'transparent', color: active ? accent : '#94A3B8' }}>
                {t.icon}
              </div>
              <span className="text-[10.5px] font-semibold" style={{ color: active ? accent : '#94A3B8' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   INCOMING BOOKING SHEET — slides up over dashboard
   ════════════════════════════════════════════════════════════════ */
function IncomingBookingSheet({ booking, accent, tone, onAccept, onDecline }) {
  const [secondsLeft, setSecondsLeft] = useSp(30);
  useEp(() => {
    if (secondsLeft <= 0) { onDecline(); return; }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const pct = (secondsLeft / 30) * 100;

  return (
    <div className="absolute inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full bg-white rounded-t-3xl overflow-hidden"
           style={{ animation: 'kw-sheet-up 0.32s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Pulse ring header */}
        <div className="relative pt-4 pb-3 px-5">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-slate-300"/>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="relative flex items-center justify-center">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#10B98140' }}/>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"/>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                {'New booking'}
              </span>
            </div>
            {/* Countdown ring */}
            <div className="relative w-11 h-11">
              <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#E2E8F0" strokeWidth="3"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke={secondsLeft <= 8 ? '#DC2626' : accent}
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={113}
                  strokeDashoffset={113 * (1 - pct / 100)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold"
                   style={{ color: secondsLeft <= 8 ? '#DC2626' : '#0F172A' }}>
                {secondsLeft}
              </div>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="px-5 pb-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-[15px]"
               style={{ background: booking.customer.avatarBg }}>
            {booking.customer.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[15px] text-slate-900">{booking.customer.name}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span className="flex items-center gap-0.5"><window.IconMapPin size={10} stroke="#94A3B8"/>{booking.distance}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><window.IconClock size={10} stroke="#94A3B8"/>{booking.driveMin} min drive</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                style={{ background: '#0891B215', color: '#0891B2' }}>
            {booking.category}
          </span>
        </div>

        {/* Issue */}
        <div className="px-5 pb-3">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              {'Customer said'}
            </div>
            <p className="text-[13.5px] text-slate-800 leading-snug">
              "{booking.issueEn}"
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center gap-1.5">
              <window.IconSparkle size={12} stroke={accent}/>
              <span className="text-[11px] font-semibold" style={{ color: accent }}>AI:</span>
              <span className="text-[11.5px] text-slate-700">{booking.diagnosis}</span>
            </div>
          </div>
        </div>

        {/* Address — visible up front so providers can decide */}
        <div className="px-5 pb-3">
          <div className="rounded-2xl p-3 flex items-start gap-3"
               style={{ background: `${accent}0D`, border: `1px solid ${accent}25` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: `${accent}1F`, color: accent }}>
              <window.IconMapPin size={16}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] uppercase tracking-wider font-bold" style={{ color: accent }}>
                {"Customer address"}
              </div>
              <div className="text-[12.5px] font-semibold text-slate-900 leading-snug mt-0.5">
                {booking.address.full}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5 italic">✏ {booking.address.landmark}</div>
            </div>
          </div>
        </div>

        {/* Severity + Price RANGE */}
        <div className="px-5 pb-4">
          <div className="rounded-2xl p-3 flex items-center justify-between"
               style={{ background: 'linear-gradient(135deg, #10B98112, #10B98106)', border: '1px solid #10B98130' }}>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10.5px] uppercase tracking-wider text-emerald-700 font-bold">
                  {'Estimated price'}
                </span>
                <SeverityPill level={booking.severity} tone={tone}/>
              </div>
              <div className="font-display font-extrabold text-[22px] text-slate-900 tracking-tight leading-none">
                Rs. {booking.priceRange.min.toLocaleString('en-PK')}–Rs. {booking.priceRange.max.toLocaleString('en-PK')}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                {tone === 'hinglish'
                  ? 'Severity ke hisaab se range. Customer cash / direct se pay karega.'
                  : 'Range depends on severity. Customer pays cash / directly to you.'}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 ml-2"
                 style={{ background: 'rgba(16,185,129,0.18)' }}>
              <window.IconRupee size={20} stroke="#059669"/>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-7 flex gap-2.5">
          <button onClick={onDecline}
            className="flex-1 h-14 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-[14px] active:bg-slate-50 transition">
            {'Decline'}
          </button>
          <button onClick={onAccept}
            className="flex-[1.4] h-14 rounded-2xl text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg"
            style={{ background: '#10B981' }}>
            {'Accept'}
            <window.IconArrowRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ACTIVE JOB SCREEN — fullscreen after accept; shows address;
   provider progresses through stages.
   ════════════════════════════════════════════════════════════════ */
const STAGES = ['on-way', 'arrived', 'in-progress', 'collect'];
const STAGE_INFO = (tone) => ({
  'on-way':       { label: 'On the way',
                    cta:   "I've arrived",
                    color: '#2563EB' },
  'arrived':      { label: 'Arrived',
                    cta:   'Start work',
                    color: '#F59E0B' },
  'in-progress':  { label: 'Working',
                    cta:   'Complete & collect',
                    color: '#7C3AED' },
  'collect':      { label: 'Job complete',
                    cta:   'Confirm',
                    color: '#10B981' },
});

function ActiveJobScreen({ job, setJob, accent, tone, onComplete }) {
  const info = STAGE_INFO(tone);
  const stageIdx = STAGES.indexOf(job.stage);
  // Default "collected" amount = midpoint of the range; provider adjusts
  const mid = Math.round((job.priceRange.min + job.priceRange.max) / 2 / 50) * 50;
  const [collected, setCollected] = useSp(mid);

  const next = () => {
    const i = stageIdx + 1;
    if (i < STAGES.length) {
      setJob({ ...job, stage: STAGES[i] });
    } else {
      onComplete(collected);
    }
  };

  const close = () => setJob({ ...job, expanded: false });

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col"
         style={{ animation: 'kw-slide-in-bottom 0.32s cubic-bezier(0.16, 1, 0.3, 1)' }}>

      {/* Map placeholder */}
      <div className="relative shrink-0" style={{ height: 240 }}>
        <div className="absolute inset-0"
             style={{
               background: `
                 linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%),
                 repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.4) 12px 13px),
                 repeating-linear-gradient(-45deg, transparent 0 12px, rgba(255,255,255,0.4) 12px 13px)
               `,
               backgroundBlendMode: 'overlay',
             }}/>
        {/* Mock roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 240" preserveAspectRatio="none">
          <path d="M0 80 Q 195 60 390 110" stroke="white" strokeWidth="14" fill="none"/>
          <path d="M0 80 Q 195 60 390 110" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="6 6"/>
          <path d="M120 0 L 140 240" stroke="white" strokeWidth="10" fill="none"/>
          <path d="M120 0 L 140 240" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeDasharray="6 6"/>
          <path d="M260 0 L 250 240" stroke="white" strokeWidth="8" fill="none"/>
          {/* Route line */}
          <path d="M40 200 Q 110 150 140 110 Q 180 80 280 50" stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="8 6">
            <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.2s" repeatCount="indefinite"/>
          </path>
        </svg>
        {/* You marker */}
        <div className="absolute" style={{ left: 28, top: 188 }}>
          <div className="relative">
            <span className="absolute -inset-2 rounded-full animate-ping" style={{ background: `${accent}33` }}/>
            <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold relative"
                 style={{ background: accent }}>YOU</div>
          </div>
        </div>
        {/* Destination marker */}
        <div className="absolute" style={{ right: 56, top: 28 }}>
          <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center">
            <window.IconMapPin size={18} stroke="white" fill="white"/>
          </div>
        </div>
        {/* Close */}
        <button onClick={close}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
          <window.IconArrowLeft size={18} stroke="#0F172A"/>
        </button>
        {/* ETA pill */}
        <div className="absolute top-12 right-4 bg-white rounded-full shadow-md px-3 py-1.5 flex items-center gap-1.5">
          <window.IconBolt size={12} stroke="#F59E0B" fill="#F59E0B"/>
          <span className="text-[12px] font-bold text-slate-900">{job.driveMin} min</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto -mt-5 relative">
        <div className="bg-white rounded-t-3xl px-5 pt-4 pb-3 relative">
          {/* Stage pill */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: `${info[job.stage].color}15`, color: info[job.stage].color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: info[job.stage].color }}/>
              {info[job.stage].label}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">#KW-8341</span>
          </div>

          {/* Customer block (with phone) */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-[18px]"
                 style={{ background: job.customer.avatarBg }}>
              {job.customer.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[16px] text-slate-900">{job.customer.name}</div>
              <div className="text-[11.5px] text-slate-500">{job.phone}</div>
            </div>
            <button className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-md active:scale-95 transition">
              <window.IconPhone size={18} stroke="white"/>
            </button>
            <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition">
              <window.IconChat size={18} stroke="#475569"/>
            </button>
          </div>

          {/* Address — fully revealed */}
          <div className="mt-4 rounded-2xl p-3.5 flex items-start gap-3"
               style={{ background: `${accent}0D`, border: `1px solid ${accent}25` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: `${accent}1F`, color: accent }}>
              <window.IconMapPin size={18}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] uppercase tracking-wider font-bold" style={{ color: accent }}>
                {"Customer address"}
              </div>
              <div className="text-[13.5px] font-semibold text-slate-900 leading-snug mt-0.5">
                {job.address.full}
              </div>
              <div className="text-[11.5px] text-slate-500 mt-1 italic">
                📍 {job.address.landmark}
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-4">
            <div className="flex items-center">
              {STAGES.map((s, i) => {
                const done = i < stageIdx;
                const current = i === stageIdx;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold relative"
                           style={{
                             background: done ? '#10B981' : current ? info[s].color : '#E2E8F0',
                             color: done || current ? 'white' : '#94A3B8',
                           }}>
                        {done ? <window.IconCheck size={14} stroke="white" strokeWidth={4}/> : i + 1}
                        {current && <span className="absolute inset-0 rounded-full animate-ping"
                                          style={{ background: `${info[s].color}50` }}/>}
                      </div>
                      <span className={`text-[9px] font-semibold tracking-tight ${done || current ? 'text-slate-700' : 'text-slate-400'}`}
                            style={{ maxWidth: 60, textAlign: 'center' }}>
                        {s === 'on-way' ? ('Travel')
                         : s === 'arrived' ? ('Arrived')
                         : s === 'in-progress' ? ('Work')
                         : ('Bill')}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className="flex-1 h-0.5 rounded-full mx-1 -mt-3" style={{ background: done ? '#10B981' : '#E2E8F0' }}/>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Job details */}
          <div className="mt-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
              {'Job details'}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-slate-500">{'Issue'}</span>
                <span className="font-semibold text-slate-900 text-right max-w-[60%]">
                  {job.issueEn}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-slate-500">{'AI diagnosis'}</span>
                <span className="font-semibold text-slate-900">{job.diagnosis}</span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-slate-500">{'Payment'}</span>
                <span className="font-semibold text-slate-900">{'Cash / direct from customer'}</span>
              </div>
              <div className="flex justify-between text-[12.5px] pt-1.5 border-t border-slate-200/70 mt-1">
                <span className="text-slate-700 font-semibold">{'Price range'}</span>
                <span className="font-display font-extrabold text-slate-900">Rs. {job.priceRange.min.toLocaleString('en-PK')}–Rs. {job.priceRange.max.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">{'Severity'}</span>
                <SeverityPill level={job.severity} tone={tone}/>
              </div>
            </div>
          </div>

          {/* "Job complete" stage: provider records what they actually collected */}
          {job.stage === 'collect' && (
            <div className="mt-4 bg-white rounded-2xl border-2 p-4" style={{ borderColor: '#10B98140' }}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">
                  {'Amount collected'}
                </div>
                <SeverityPill level={job.severity} tone={tone}/>
              </div>
              <div className="text-[10.5px] text-slate-500 mb-3">
                {tone === 'hinglish'
                  ? `Range Rs. ${job.priceRange.min}–Rs. ${job.priceRange.max} thi. Aapne customer se direct collect kiya.`
                  : `Range was Rs. ${job.priceRange.min}–Rs. ${job.priceRange.max}. Collected directly from customer.`}
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-3">
                <button onClick={() => setCollected(c => Math.max(job.priceRange.min, c - 50))}
                  className="w-11 h-11 rounded-2xl bg-slate-100 active:bg-slate-200 transition flex items-center justify-center text-[20px] font-bold text-slate-700">–</button>
                <div className="flex-1 text-center rounded-2xl py-3"
                     style={{ background: '#10B98110', border: '1px solid #10B98130' }}>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Rs. </div>
                  <div className="font-display font-extrabold text-[26px] text-slate-900 tracking-tight leading-none">
                    {collected.toLocaleString('en-PK')}
                  </div>
                </div>
                <button onClick={() => setCollected(c => Math.min(job.priceRange.max, c + 50))}
                  className="w-11 h-11 rounded-2xl bg-slate-100 active:bg-slate-200 transition flex items-center justify-center text-[20px] font-bold text-slate-700">+</button>
              </div>

              {/* Slider */}
              <input type="range"
                min={job.priceRange.min} max={job.priceRange.max} step={50}
                value={collected}
                onChange={e => setCollected(Number(e.target.value))}
                className="w-full mt-3"
                style={{ accentColor: '#10B981', color: '#10B981' }}/>
              <div className="flex justify-between text-[10.5px] text-slate-400 mt-1 font-semibold">
                <span>Rs. {job.priceRange.min}</span>
                <span>Rs. {job.priceRange.max}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <window.IconShield size={14} stroke="#64748B"/>
                <span className="text-[10.5px] text-slate-500 flex-1 leading-snug">
                  {'For your records only. KaamWala does not hold any payment.'}
                </span>
              </div>
            </div>
          )}

          <div style={{ height: 10 }}/>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="shrink-0 bg-white border-t border-slate-200/70 px-5 pt-3 pb-7">
        <button onClick={next}
          className="w-full h-14 rounded-2xl text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition"
          style={{ background: info[job.stage].color }}>
          {info[job.stage].cta}
          <window.IconArrowRight size={18}/>
        </button>
      </div>
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────────── */
Object.assign(window, { ProviderHome });
