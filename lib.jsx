/* lib.jsx — Shared icons, helpers, and constants for KaamWala AI
   Exposed via window so other script files in different Babel scopes can use them. */

const { useState: __useState, useEffect: __useEffect, useRef: __useRef } = React;

/* ─── Inline icon set ─────────────────────────────────────────────── */
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', strokeWidth = 2, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IconBot = (p) => <Icon {...p}><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M8 14h.01M16 14h.01"/><path d="M9 17h6"/></Icon>;
const IconMic = (p) => <Icon {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></Icon>;
const IconSend = (p) => <Icon {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></Icon>;
const IconRefresh = (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></Icon>;
const IconStar = ({ filled, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#CBD5E1'} strokeWidth="2" strokeLinejoin="round">
    <polygon points="12 2 15.1 8.6 22 9.6 17 14.5 18.2 21.5 12 18.2 5.8 21.5 7 14.5 2 9.6 8.9 8.6 12 2"/>
  </svg>
);
const IconMapPin = (p) => <Icon {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M20 6L9 17l-5-5"/></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Icon>;
const IconWrench = (p) => <Icon {...p}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-7-7 8-8 1.7-.7z"/></Icon>;
const IconShield = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></Icon>;
const IconSparkle = (p) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></Icon>;
const IconPhone = (p) => <Icon {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></Icon>;
const IconChat = (p) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>;
const IconRupee = (p) => <Icon {...p}><path d="M6 3h12M6 8h12M6 13h3a5 5 0 0 0 0-10M6 13l9 8"/></Icon>;
const IconBolt = (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const IconUser = (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
const IconBriefcase = (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M12 5l-7 7 7 7"/></Icon>;
const IconHome = (p) => <Icon {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></Icon>;
const IconZap = (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const IconDroplet = (p) => <Icon {...p}><path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z"/></Icon>;
const IconHammer = (p) => <Icon {...p}><path d="M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 6.4L21 9.8 18 13l-3.4-3.4a1 1 0 0 1 0-1.4L17 5.6a1 1 0 0 1 1.4 0z"/></Icon>;
const IconPaint = (p) => <Icon {...p}><rect x="2" y="3" width="14" height="6" rx="1"/><path d="M9 9v4a2 2 0 0 0 2 2h2v3a2 2 0 0 0 4 0v-5h-1"/></Icon>;
const IconSparkles = (p) => <Icon {...p}><path d="M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5L12 3z"/><path d="M19 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L19 14z"/></Icon>;
const IconLock = (p) => <Icon {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
const IconGoogle = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.67-2.26 1.06-3.71 1.06-2.85 0-5.27-1.93-6.13-4.52H2.18v2.84A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC04" d="M5.87 14.12a6.6 6.6 0 0 1 0-4.24V7.05H2.18a11 11 0 0 0 0 9.9l3.69-2.83z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.05l3.69 2.83C6.73 7.31 9.15 5.38 12 5.38z"/>
  </svg>
);

/* ─── Bot avatar ─────────────────────────────────────────────────── */
function BotAvatar({ accent, size = 28 }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0 shadow-sm relative"
         style={{ width: size, height: size, background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
      <IconBot size={size * 0.55} stroke="white"/>
    </div>
  );
}

/* ─── Helper: shade a hex color ───────────────────────────────────── */
function shade(hex, pct) {
  const h = hex.replace('#','');
  const num = parseInt(h, 16);
  let r = (num >> 16) + Math.round(255 * pct / 100);
  let g = ((num >> 8) & 0xff) + Math.round(255 * pct / 100);
  let b = (num & 0xff) + Math.round(255 * pct / 100);
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/* ─── Currency + locale ──────────────────────────────────────────── */
const CURRENCY = 'Rs.';
const fmtPKR = (n) => 'Rs. ' + Number(n).toLocaleString('en-PK');
const PHONE_PREFIX = '🇵🇰 +92';
const SUPPORTED_LANGS = "Urdu, Punjabi, Sindhi, English";

/* ─── App copy (single English variant; bot understands many languages) ─ */
const TONE_EN = {
  greeting: "Assalam-o-Alaikum! Main KaamWala AI hoon 🤖 Ghar ka koi bhi kaam ho — bas batao kya masla hai. Aap Urdu, Punjabi, Sindhi ya English mein likh sakte ho. Photo bhi bhej sakte ho.",
  examples: ["AC mein cooling nahi", "Geyser garam pani nahi de raha", "Pipe leak ho raha hai"],
  userMsg: "AC 2 ghante se chal raha hai par thandi hawa bilkul nahi",
  diagnoseHeader: "Hmm, samajh aaya — yeh aapki problem ke 3 likely causes ho sakte hain:",
  confirmBtn: "Haan, technician dhundo",
  locationHeader: "Aap iss location pe ho? Best route ke liye location trace kar raha hoon 📍",
  locationConfirmBtn: "Haan, yahi location hai",
  locationEditBtn: "Edit karo",
  searchingMsg: "Bohot khoob! Aapke nazdeek available technicians dhund raha hoon...",
  matchHeader: "Mil gaya — aapke 1.2 km ke andar best match yeh hai:",
  bookBtn: "Confirm karo",
  confirmedTitle: "Booking Confirmed",
  etaLabel: "Arriving in",
  rateLabel: "Kaam mukammal? Niche rating de dijiye 👇",
  rateThanks: "Shukriya! Aapka feedback technician tak pohanch gaya.",
  placeholder: "Apni baat batao... (Urdu ya English)",
  postRating: (n, name) => `${n}⭐ rating mil gayi ${name} ke liye. Aur kuch chahiye? Main yahin hoon!`,
  // status updates (from provider's actions)
  st_onway:    (n) => `${n} ne aapki booking accept kar li hai aur raaste mein hai 🛵`,
  st_arriving: (n, m) => `${n} ${m} minute mein pohanch jayega.`,
  st_arrived:  (n) => `${n} aapke ghar pe pohanch gaya hai. Darwaza kholiye 🚪`,
  st_working:  (n) => `${n} ne kaam shuru kar diya hai 🔧`,
  st_done:     (n, amt) => `Kaam mukammal ho gaya! ${n} ne ${fmtPKR(amt)} enter kiya hai final amount. Niche rating de dijiye 👇`,
};
// Keep both keys identical so legacy TONE[tone] references still work
const TONE = { english: TONE_EN, hinglish: TONE_EN };

/* ─── Providers (Pakistan) ───────────────────────────────────────── */
const PROVIDERS = [
  { name: "Kashif AC Services", initials: "KS", avatarBg: "#2563EB", firstName: "Kashif",
    rating: 4.8, jobs: 412, distance: "1.2 km", eta: "22 min",
    skills: ["Split AC", "Gas refill", "PCB repair"],
    reasonEn: "Kashif resolved 3 similar gas-leak cases in DHA this week and has the fastest response time in your area.",
    badge: "Top Rated", quote: "Final price within the diagnosed range" },
  { name: "Ahmed Cool Care", initials: "AC", avatarBg: "#7C3AED", firstName: "Ahmed",
    rating: 4.7, jobs: 289, distance: "0.8 km", eta: "15 min",
    skills: ["Window AC", "Gas refill", "Servicing"],
    reasonEn: "Closest to you with a 14-min avg response, and 9 years of window-AC experience in Karachi.",
    badge: "Fastest ETA", quote: "Cash / direct, paid to technician" },
  { name: "Bilal Refrigeration", initials: "BR", avatarBg: "#0891B2", firstName: "Bilal",
    rating: 4.9, jobs: 678, distance: "1.6 km", eta: "28 min",
    skills: ["All brands", "Commercial", "Warranty work"],
    reasonEn: "Highest-rated technician in your area. Haier authorized partner — work comes with a 1-year warranty.",
    badge: "Verified Pro", quote: "Severity determines the final price" },
];
// Back-compat alias for any code reading reason
PROVIDERS.forEach(p => { p.reason = p.reasonEn; });

/* ─── Export everything to window so other script files can use ──── */
Object.assign(window, {
  Icon, IconBot, IconMic, IconSend, IconRefresh, IconStar, IconMapPin, IconCheck,
  IconClock, IconWrench, IconShield, IconSparkle, IconPhone, IconChat, IconRupee,
  IconBolt, IconUser, IconBriefcase, IconArrowRight, IconArrowLeft, IconHome,
  IconZap, IconDroplet, IconHammer, IconPaint, IconSparkles, IconLock, IconGoogle,
  BotAvatar, shade, TONE, PROVIDERS, CURRENCY, fmtPKR, PHONE_PREFIX, SUPPORTED_LANGS, TONE_EN,
});
