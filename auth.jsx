/* auth.jsx — Welcome, Login, Role Select, Signup (User/Provider), OTP screens
   Each screen renders inside an IOSDevice viewport. Receives:
     { accent, tone, data, setData, goTo, back } */

const { useState: useS, useEffect: useE, useRef: useR } = React;

/* ─── i18n strings ─────────────────────────────────────────────── */
const AUTH_T = {
  hinglish: {
    welcomeTitle: "Ghar ka har kaam,",
    welcomeTitle2: "ab AI ke saath.",
    welcomeSub: "Plumber, electrician, AC mechanic — bas chat karo, baaki KaamWala AI sambhalega.",
    login: "Log in",
    signup: "Naya account banao",
    or: "ya phir",
    google: "Google se continue karo",
    terms: "Aage badhne ka matlab hai aap Terms aur Privacy se sehmat hain.",
    loginTitle: "Wapas aane ke liye shukriya",
    loginSub: "Apna mobile number daalo, OTP bhejenge.",
    phoneLabel: "Mobile number",
    continueBtn: "Aage badho",
    roleTitle: "Aap kaun ho?",
    roleSub: "Yeh sirf ek baar puchenge — baad me badal sakte ho.",
    roleUser: "Kaam karwana hai",
    roleUserSub: "Plumber, electrician, AC mechanic ya koi bhi service chahiye.",
    roleProv: "Kaam karna hai",
    roleProvSub: "Aap technician ho — bookings paao aur kamao.",
    signupUserTitle: "Account banao",
    signupUserSub: "Bas yeh basic details, 30 second me ho jayega.",
    signupProvTitle: "Provider ban'ne ke liye",
    signupProvSub: "Bas yeh basic details, turant account ban jayega.",
    nameLabel: "Pura naam",
    namePh: "jaise: Rohit Sharma",
    cityLabel: "Sheher / Ilaqa",
    cityPh: "jaise: DHA Phase 5, Karachi",
    servicesLabel: "Aap kaun se kaam karte ho?",
    servicesHint: "Ek ya zyada chuno",
    expLabel: "Kitne saal ka tajurba?",
    otpTitle: "OTP daalo",
    otpSub: "Humne 6-digit code bheja hai",
    resend: "Dobara bhejo",
    resendIn: "Dobara bhejo",
    sec: "sec me",
    didnt: "OTP nahi mila?",
    pendingTitle: "Sab mil gaya!",
    pendingSub: "Hum aapki details 24 ghante me verify karenge. Tab tak app explore kar sakte ho.",
    pendingCta: "Demo dashboard dekho",
    skip: "Abhi skip karo",
  },
  english: {
    welcomeTitle: "Every home job,",
    welcomeTitle2: "now powered by AI.",
    welcomeSub: "Plumbers, electricians, AC techs — just chat and KaamWala AI handles the rest.",
    login: "Log in",
    signup: "Create account",
    or: "or",
    google: "Continue with Google",
    terms: "By continuing you agree to our Terms & Privacy.",
    loginTitle: "Welcome back",
    loginSub: "Enter your mobile number, we'll send an OTP.",
    phoneLabel: "Mobile number",
    continueBtn: "Continue",
    roleTitle: "Who are you?",
    roleSub: "We'll only ask once — you can switch later.",
    roleUser: "I need a service",
    roleUserSub: "Plumber, electrician, AC mechanic, or any home help.",
    roleProv: "I provide a service",
    roleProvSub: "You're a technician — get bookings and earn.",
    signupUserTitle: "Create your account",
    signupUserSub: "Just the basics, takes 30 seconds.",
    signupProvTitle: "Become a provider",
    signupProvSub: "Just the basics. Your account is ready in seconds.",
    nameLabel: "Full name",
    namePh: "e.g. Rohit Sharma",
    cityLabel: "City / Area",
    cityPh: "e.g. DHA Phase 5, Karachi",
    servicesLabel: "What services do you offer?",
    servicesHint: "Pick one or more",
    expLabel: "Years of experience",
    otpTitle: "Enter OTP",
    otpSub: "We sent a 6-digit code to",
    resend: "Resend code",
    resendIn: "Resend in",
    sec: "s",
    didnt: "Didn't get it?",
    pendingTitle: "We've got everything",
    pendingSub: "Your details will be verified within 24 hours. Meanwhile, explore the app.",
    pendingCta: "Open demo dashboard",
    skip: "Skip for now",
  },
};

/* ─── Service categories ────────────────────────────────────────── */
const SERVICE_CATS = [
  { id: 'ac', label: 'AC Repair', Icon: window.IconBolt, tint: '#2563EB' },
  { id: 'plumb', label: 'Plumbing', Icon: window.IconDroplet, tint: '#0891B2' },
  { id: 'elec', label: 'Electrical', Icon: window.IconZap, tint: '#F59E0B' },
  { id: 'carp', label: 'Carpentry', Icon: window.IconHammer, tint: '#92400E' },
  { id: 'paint', label: 'Painting', Icon: window.IconPaint, tint: '#7C3AED' },
  { id: 'clean', label: 'Cleaning', Icon: window.IconSparkles, tint: '#10B981' },
  { id: 'appli', label: 'Appliances', Icon: window.IconRefresh, tint: '#DC2626' },
  { id: 'pest', label: 'Pest Control', Icon: window.IconShield, tint: '#0F766E' },
];

/* ─── Shared chrome ─────────────────────────────────────────────── */
function ScreenShell({ children, bg = '#FFFFFF', topSafe = 54 }) {
  return (
    <div className="h-full flex flex-col relative" style={{ background: bg }}>
      <div style={{ height: topSafe }} className="shrink-0"/>
      {children}
    </div>
  );
}

function BackBar({ onBack, accent, title, step, totalSteps }) {
  return (
    <div className="px-4 pt-1 pb-2 flex items-center gap-3 shrink-0">
      <button onClick={onBack}
        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200 transition">
        <window.IconArrowLeft size={18} stroke="#0F172A"/>
      </button>
      <div className="flex-1">
        {title && <div className="text-[13px] font-semibold text-slate-700">{title}</div>}
        {step != null && (
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="h-1 rounded-full flex-1 transition-all"
                style={{ background: i <= step ? accent : '#E2E8F0', maxWidth: 28 }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text', prefix, maxLength, autoFocus, hint, accent, error }) {
  const [focused, setFocused] = useS(false);
  return (
    <div>
      {label && <div className="text-[12px] font-semibold text-slate-600 mb-1.5 px-1">{label}</div>}
      <div className={`flex items-center gap-2 px-3.5 rounded-2xl border-2 transition-all bg-white`}
           style={{
             borderColor: error ? '#DC2626' : focused ? accent : '#E2E8F0',
             boxShadow: focused ? `0 0 0 4px ${accent}1A` : 'none',
           }}>
        {prefix && <span className="text-slate-500 text-[15px] font-medium select-none">{prefix}</span>}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          maxLength={maxLength} autoFocus={autoFocus}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 py-3.5 outline-none bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 min-w-0"/>
      </div>
      {hint && !error && <div className="text-[11px] text-slate-500 mt-1.5 px-1">{hint}</div>}
      {error && <div className="text-[11px] text-red-600 mt-1.5 px-1 font-medium">{error}</div>}
    </div>
  );
}

function BigBtn({ children, onClick, accent, variant = 'solid', disabled, icon }) {
  const styles = variant === 'solid'
    ? { background: accent, color: 'white' }
    : variant === 'outline'
      ? { background: 'white', color: '#0F172A', border: `1.5px solid #E2E8F0` }
      : { background: '#F1F5F9', color: '#0F172A' };
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full h-14 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.99] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      style={styles}>
      {icon}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════════════════════════════ */
function WelcomeScreen({ accent, tone, goTo }) {
  const t = AUTH_T[tone];
  return (
    <div className="h-full flex flex-col relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${accent} 0%, ${window.shade(accent, -12)} 100%)` }}>

      {/* Decorative blobs */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}/>
      <div className="absolute -left-20 top-40 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}/>
      <div className="absolute right-10 bottom-72 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}/>

      <div style={{ height: 54 }} className="shrink-0"/>

      {/* Hero */}
      <div className="flex-1 flex flex-col px-6 pt-6">
        <div className="flex items-center gap-2.5 mb-auto">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/25">
            <window.IconBot size={24} stroke="white"/>
          </div>
          <div>
            <div className="text-white font-bold text-[18px] tracking-tight">KaamWala AI</div>
            <div className="text-white/70 text-[11px]">Pakistan's first multilingual AI services agent</div>
          </div>
        </div>

        {/* Floating chat preview */}
        <div className="relative my-6" style={{ height: 220 }}>
          <div className="absolute left-0 top-2 bg-white rounded-2xl rounded-bl-md shadow-xl px-3.5 py-2.5 max-w-[80%]">
            <div className="text-[12px] text-slate-800 leading-snug">
              {"Assalam-o-Alaikum! What’s broken at home?"}
            </div>
          </div>
          <div className="absolute right-0 top-20 rounded-2xl rounded-br-md shadow-xl px-3.5 py-2.5 max-w-[75%]"
               style={{ background: window.shade(accent, -20) }}>
            <div className="text-[12px] text-white leading-snug">
              {"AC ٹھنڈی ہوا نہیں دے رہا 🥵"}
            </div>
          </div>
          <div className="absolute left-0 bottom-0 bg-white rounded-2xl rounded-bl-md shadow-xl p-3 max-w-[85%] border border-slate-100">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#2563EB15' }}>
                <window.IconSparkle size={14} stroke="#2563EB"/>
              </div>
              <span className="text-[11px] font-bold text-slate-900">Diagnosis</span>
              <span className="ml-auto text-[10px] text-emerald-600 font-semibold">99% match</span>
            </div>
            <div className="text-[11.5px] text-slate-600 leading-snug">Gas leak likely · Rs. 3.5K–8K · 22 min away</div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-white text-[28px] leading-[1.1] font-extrabold tracking-tight">
            {t.welcomeTitle}<br/>{t.welcomeTitle2}
          </h1>
          <p className="text-white/75 text-[13.5px] mt-3 leading-relaxed">{t.welcomeSub}</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-6 pt-4 pb-8 space-y-2.5 relative">
        <button onClick={() => goTo('signup-role')}
          className="w-full h-14 rounded-2xl bg-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg"
          style={{ color: accent }}>
          {t.signup}
          <window.IconArrowRight size={18}/>
        </button>
        <button onClick={() => goTo('login')}
          className="w-full h-14 rounded-2xl border border-white/30 bg-white/10 backdrop-blur text-white font-semibold text-[15px] flex items-center justify-center active:scale-[0.99] transition">
          {t.login}
        </button>
        <p className="text-center text-white/60 text-[10.5px] mt-3 px-4 leading-relaxed">{t.terms}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN SCREEN — phone entry
   ═══════════════════════════════════════════════════════════════ */
function LoginScreen({ accent, tone, data, setData, goTo, back }) {
  const t = AUTH_T[tone];
  const phoneOk = data.phone && data.phone.replace(/\D/g, '').length === 10;
  const onPhone = (e) => setData({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });

  return (
    <ScreenShell>
      <BackBar onBack={back} accent={accent}/>
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
             style={{ background: `${accent}15` }}>
          <window.IconPhone size={26} stroke={accent}/>
        </div>
        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.loginTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">{t.loginSub}</p>

        <div className="mt-7 space-y-3">
          <FormInput accent={accent} label={t.phoneLabel} prefix="🇵🇰 +92"
            value={data.phone || ''} onChange={onPhone}
            placeholder="98765 43210" maxLength={10} type="tel" autoFocus/>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200"/>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">{t.or}</span>
          <div className="flex-1 h-px bg-slate-200"/>
        </div>

        <BigBtn variant="outline" accent={accent} icon={<window.IconGoogle size={18}/>}>{t.google}</BigBtn>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0">
        <BigBtn accent={accent} disabled={!phoneOk}
          onClick={() => goTo('otp', { from: 'login' })}>
          {t.continueBtn} <window.IconArrowRight size={18}/>
        </BigBtn>
        <p className="text-center text-slate-400 text-[11px] mt-3">
          {"New here?"}{' '}
          <button onClick={() => goTo('signup-role')} className="font-semibold" style={{ color: accent }}>
            {t.signup}
          </button>
        </p>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROLE SELECT
   ═══════════════════════════════════════════════════════════════ */
function RoleScreen({ accent, tone, data, setData, goTo, back }) {
  const t = AUTH_T[tone];
  const [selected, setSelected] = useS(data.role || null);

  const RoleCard = ({ id, title, sub, icon, badge, badgeColor, accentTint }) => {
    const active = selected === id;
    return (
      <button onClick={() => setSelected(id)}
        className="w-full text-left rounded-3xl p-5 transition-all active:scale-[0.99] relative overflow-hidden"
        style={{
          background: active ? `${accentTint}10` : 'white',
          border: `2px solid ${active ? accentTint : '#E2E8F0'}`,
          boxShadow: active ? `0 8px 24px ${accentTint}25` : '0 1px 2px rgba(0,0,0,0.04)',
        }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
               style={{ background: active ? accentTint : `${accentTint}15`, color: active ? 'white' : accentTint }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-bold text-[16px] text-slate-900">{title}</div>
              {badge && (
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                      style={{ background: `${badgeColor}1A`, color: badgeColor }}>{badge}</span>
              )}
            </div>
            <p className="text-[13px] text-slate-500 mt-1 leading-snug">{sub}</p>
          </div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
               style={{ background: active ? accentTint : '#F1F5F9', border: active ? 'none' : '1.5px solid #E2E8F0' }}>
            {active && <window.IconCheck size={14} stroke="white" strokeWidth={3.5}/>}
          </div>
        </div>
      </button>
    );
  };

  return (
    <ScreenShell bg="#F8FAFC">
      <BackBar onBack={back} accent={accent} step={0} totalSteps={3}/>
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto">
        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.roleTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">{t.roleSub}</p>

        <div className="mt-6 space-y-3">
          <RoleCard id="user"
            title={t.roleUser} sub={t.roleUserSub}
            icon={<window.IconUser size={26}/>}
            accentTint={accent}/>
          <RoleCard id="provider"
            title={t.roleProv} sub={t.roleProvSub}
            icon={<window.IconBriefcase size={26}/>}
            badge={'Earn'} badgeColor="#10B981"
            accentTint="#0F766E"/>
        </div>

        {/* Stat strip */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { v: '12K+', l: 'Pros' },
            { v: '4.8★', l: 'Avg rating' },
            { v: '24/7', l: 'Support' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl px-3 py-3 text-center border border-slate-200/60">
              <div className="font-bold text-[15px] text-slate-900">{s.v}</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0">
        <BigBtn accent={accent} disabled={!selected}
          onClick={() => {
            setData({ ...data, role: selected });
            goTo(selected === 'user' ? 'signup-user' : 'signup-provider');
          }}>
          {'Continue'} <window.IconArrowRight size={18}/>
        </BigBtn>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   USER SIGNUP
   ═══════════════════════════════════════════════════════════════ */
function UserSignupScreen({ accent, tone, data, setData, goTo, back }) {
  const t = AUTH_T[tone];
  const valid = (data.name || '').trim().length > 1
              && (data.phone || '').replace(/\D/g,'').length === 10
              && (data.city || '').trim().length > 1;

  return (
    <ScreenShell>
      <BackBar onBack={back} accent={accent} step={1} totalSteps={3}/>
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
             style={{ background: `${accent}15` }}>
          <window.IconUser size={26} stroke={accent}/>
        </div>
        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.signupUserTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">{t.signupUserSub}</p>

        <div className="mt-6 space-y-4">
          <FormInput accent={accent} label={t.nameLabel}
            value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder={t.namePh} autoFocus/>
          <FormInput accent={accent} label={t.phoneLabel} prefix="🇵🇰 +92"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}
            placeholder="98765 43210" maxLength={10} type="tel"/>
          <FormInput accent={accent} label={t.cityLabel}
            value={data.city || ''} onChange={(e) => setData({ ...data, city: e.target.value })}
            placeholder={t.cityPh}
            hint={"We'll find providers near you"}/>
        </div>

        <div className="mt-5 rounded-2xl p-3.5 flex items-center gap-3" style={{ background: '#10B98112' }}>
          <window.IconShield size={20} stroke="#10B981"/>
          <p className="text-[11.5px] text-emerald-800 leading-snug flex-1">
            {"Your number is only used for bookings. No spam, ever."}
          </p>
        </div>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0">
        <BigBtn accent={accent} disabled={!valid}
          onClick={() => goTo('otp', { from: 'signup-user' })}>
          {t.continueBtn} <window.IconArrowRight size={18}/>
        </BigBtn>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROVIDER SIGNUP
   ═══════════════════════════════════════════════════════════════ */
function ProviderSignupScreen({ accent, tone, data, setData, goTo, back }) {
  const t = AUTH_T[tone];
  const services = data.services || [];
  const exp = data.exp ?? 2;

  const toggleService = (id) => {
    const next = services.includes(id) ? services.filter(s => s !== id) : [...services, id];
    setData({ ...data, services: next });
  };

  const valid = (data.name || '').trim().length > 1
              && (data.phone || '').replace(/\D/g,'').length === 10
              && (data.city || '').trim().length > 1
              && services.length > 0;

  return (
    <ScreenShell bg="#F8FAFC">
      <BackBar onBack={back} accent={accent} step={1} totalSteps={3}/>
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto pb-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
             style={{ background: '#0F766E15' }}>
          <window.IconBriefcase size={26} stroke="#0F766E"/>
        </div>
        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.signupProvTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">{t.signupProvSub}</p>

        <div className="mt-6 space-y-4">
          <FormInput accent={accent} label={t.nameLabel}
            value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder={'e.g. Imran Khan'}/>
          <FormInput accent={accent} label={t.phoneLabel} prefix="🇵🇰 +92"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}
            placeholder="98765 43210" maxLength={10} type="tel"/>
          <FormInput accent={accent} label={t.cityLabel}
            value={data.city || ''} onChange={(e) => setData({ ...data, city: e.target.value })}
            placeholder={t.cityPh}/>

          {/* Services chips */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[12px] font-semibold text-slate-600">{t.servicesLabel}</span>
              <span className="text-[10.5px] text-slate-400">{services.length} {'selected'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_CATS.map(cat => {
                const on = services.includes(cat.id);
                const I = cat.Icon;
                return (
                  <button key={cat.id} onClick={() => toggleService(cat.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition active:scale-[0.98] text-left"
                    style={{
                      background: on ? `${cat.tint}10` : 'white',
                      border: `1.5px solid ${on ? cat.tint : '#E2E8F0'}`,
                    }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                         style={{ background: on ? cat.tint : `${cat.tint}15`, color: on ? 'white' : cat.tint }}>
                      <I size={16}/>
                    </div>
                    <span className="text-[12.5px] font-semibold text-slate-800 truncate flex-1">{cat.label}</span>
                    {on && <window.IconCheck size={14} stroke={cat.tint} strokeWidth={3}/>}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 px-1">{t.servicesHint}</div>
          </div>

          {/* Experience stepper */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[12px] font-semibold text-slate-600">{t.expLabel}</span>
              <span className="text-[12px] font-bold" style={{ color: accent }}>
                {exp}+ {'yrs'}
              </span>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5">
              <input type="range" min={0} max={25} value={exp}
                onChange={(e) => setData({ ...data, exp: Number(e.target.value) })}
                className="w-full"
                style={{ accentColor: accent, color: accent }}/>
              <div className="flex justify-between text-[10.5px] text-slate-400 mt-1">
                <span>0</span><span>5</span><span>10</span><span>15</span><span>20+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl p-3.5 flex items-start gap-3" style={{ background: '#10B98112' }}>
          <window.IconShield size={20} stroke="#10B981"/>
          <p className="text-[11.5px] text-emerald-800 leading-snug flex-1">
            {tone === 'hinglish'
              ? 'Account turant ban jayega. Pehli booking ke saath kamai shuru!'
              : "Account is created instantly. Earn from your first booking!"}
          </p>
        </div>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0 bg-white/80 backdrop-blur border-t border-slate-200/60">
        <BigBtn accent={accent} disabled={!valid}
          onClick={() => goTo('otp', { from: 'signup-provider' })}>
          {t.continueBtn} <window.IconArrowRight size={18}/>
        </BigBtn>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OTP SCREEN — 6 boxes with auto-advance
   ═══════════════════════════════════════════════════════════════ */
function OTPScreen({ accent, tone, data, setData, goTo, back, meta }) {
  const t = AUTH_T[tone];
  const [otp, setOtp] = useS(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useS(28);
  const refs = useR([]);

  useE(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  // Auto-focus first box
  useE(() => { refs.current[0]?.focus(); }, []);

  // Auto-submit on complete
  useE(() => {
    if (otp.every(v => v.length === 1)) {
      const dest = meta?.from === 'signup-provider' ? 'provider-home' : 'home';
      setTimeout(() => goTo(dest), 350);
    }
  }, [otp]);

  const onChange = (i, v) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      refs.current[5]?.focus();
    }
  };

  const phoneDisplay = (data.phone || '').replace(/(\d{5})(\d{5})/, '$1 $2');

  return (
    <ScreenShell>
      <BackBar onBack={back} accent={accent} step={meta?.from === 'login' ? null : 2} totalSteps={3}/>
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
             style={{ background: `${accent}15` }}>
          <window.IconLock size={26} stroke={accent}/>
        </div>
        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.otpTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">
          {t.otpSub} <span className="font-semibold text-slate-900">+91 {phoneDisplay || '98765 43210'}</span>
        </p>

        <div className="flex justify-between gap-2 mt-7" onPaste={onPaste}>
          {otp.map((v, i) => (
            <input key={i} ref={el => refs.current[i] = el}
              value={v} onChange={e => onChange(i, e.target.value)}
              onKeyDown={e => onKey(i, e)}
              inputMode="numeric" maxLength={1}
              className="w-12 h-14 rounded-2xl border-2 text-center font-bold text-[22px] text-slate-900 outline-none transition-all bg-white"
              style={{
                borderColor: v ? accent : '#E2E8F0',
                boxShadow: v ? `0 0 0 4px ${accent}1A` : 'none',
              }}/>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px]">
          <span className="text-slate-500">{t.didnt}</span>
          {resendIn > 0 ? (
            <span className="text-slate-400">{t.resendIn} {resendIn}{t.sec}</span>
          ) : (
            <button onClick={() => setResendIn(28)} className="font-semibold" style={{ color: accent }}>
              {t.resend}
            </button>
          )}
        </div>

        {/* Helper for demo */}
        <button onClick={() => setOtp(['1','2','3','4','5','6'])}
          className="mt-6 mx-auto text-[11px] text-slate-400 underline-offset-2 hover:underline">
          {'(Demo: auto-fill 123456)'}
        </button>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0">
        <button onClick={() => goTo(meta?.from === 'signup-provider' ? 'provider-home' : 'home')}
          className="w-full text-center text-[12.5px] text-slate-500 py-2">
          {t.skip} →
        </button>
      </div>
    </ScreenShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROVIDER PENDING — after provider OTP verification
   ═══════════════════════════════════════════════════════════════ */
function ProviderPendingScreen({ accent, tone, data, goTo }) {
  const t = AUTH_T[tone];
  return (
    <ScreenShell bg="#F8FAFC">
      <div style={{ height: 24 }}/>
      <div className="flex-1 flex flex-col px-6 pt-4 overflow-y-auto items-center text-center">
        {/* Animated check */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 relative"
             style={{ background: '#10B98115' }}>
          <div className="absolute inset-2 rounded-full" style={{ background: '#10B98125' }}/>
          <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: '#10B981' }}>
            <window.IconCheck size={36} stroke="white" strokeWidth={3.5}/>
          </div>
        </div>

        <h1 className="font-display text-[26px] font-bold text-slate-900 leading-tight tracking-tight">{t.pendingTitle}</h1>
        <p className="text-slate-500 text-[14px] mt-2 max-w-xs leading-relaxed">{t.pendingSub}</p>

        {/* Verification steps timeline */}
        <div className="w-full mt-7 bg-white rounded-2xl p-4 border border-slate-200/70 space-y-3.5 text-left">
          <TimelineStep done label={'Phone verified'} sub={`+91 ${(data.phone || '').replace(/(\d{5})(\d{5})/,'$1 $2')}`}/>
          <TimelineStep done label={'Profile submitted'} sub={`${(data.services || []).length} services · ${data.exp ?? 2}+ ${'yrs'}`}/>
          <TimelineStep current label={'Document verification'} sub={'Aadhaar/PAN upload pending'} accent={accent}/>
          <TimelineStep label={'Background check'} sub={'~24 hours'}/>
          <TimelineStep label={'First booking!'} sub={'Right after verification'} last/>
        </div>
      </div>

      <div className="px-6 pt-3 pb-8 shrink-0 space-y-2.5">
        <BigBtn accent={accent} onClick={() => goTo('home')}>
          {t.pendingCta} <window.IconArrowRight size={18}/>
        </BigBtn>
        <button className="w-full py-2 text-[12.5px] text-slate-500 font-medium">
          {'Upload documents now'}
        </button>
      </div>
    </ScreenShell>
  );
}

function TimelineStep({ done, current, label, sub, last, accent = '#2563EB' }) {
  const dotColor = done ? '#10B981' : current ? accent : '#CBD5E1';
  return (
    <div className="flex items-start gap-3 relative">
      <div className="flex flex-col items-center shrink-0" style={{ minHeight: 36 }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10"
             style={{ background: done ? '#10B981' : current ? accent : '#F1F5F9',
                      border: done || current ? 'none' : '1.5px solid #CBD5E1' }}>
          {done ? <window.IconCheck size={13} stroke="white" strokeWidth={4}/> :
            current ? <div className="w-2 h-2 rounded-full bg-white animate-pulse"/> :
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"/>}
        </div>
        {!last && <div className="w-px flex-1 mt-0.5" style={{ background: done ? '#10B981' : '#E2E8F0', minHeight: 14 }}/>}
      </div>
      <div className="flex-1 pb-1">
        <div className={`text-[13px] font-semibold ${done || current ? 'text-slate-900' : 'text-slate-400'}`}>{label}</div>
        <div className="text-[11.5px] text-slate-500 mt-0.5">{sub}</div>
      </div>
      {current && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider self-start"
              style={{ background: `${accent}15`, color: accent }}>
          {accent === '#2563EB' ? 'Now' : 'Now'}
        </span>
      )}
    </div>
  );
}

/* ─── Export ─────────────────────────────────────────────────────── */
Object.assign(window, {
  WelcomeScreen, LoginScreen, RoleScreen, UserSignupScreen,
  ProviderSignupScreen, OTPScreen, ProviderPendingScreen, AUTH_T,
});
