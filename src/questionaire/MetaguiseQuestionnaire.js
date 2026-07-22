/**
 * MetaguiseQuestionnaire.jsx
 * ------------------------------------------------------------------
 * Single-file, drop-in React + Bootstrap questionnaire.
 *
 * Usage:
 *   import MetaguiseQuestionnaire from "./MetaguiseQuestionnaire";
 *
 *   <MetaguiseQuestionnaire
 *     logo={require("./src/assets/metaguise-logo.png")}
 *     onSubmit={(answers) => {
 *       console.log("Brief submitted", answers);
 *       // POST to your backend / CRM here
 *     }}
 *   />
 *
 * Requirements in the host project:
 *   npm i react react-dom bootstrap bootstrap-icons
 *   // then, once in your app entry (e.g. index.js):
 *   import "bootstrap/dist/css/bootstrap.min.css";
 *   import "bootstrap-icons/font/bootstrap-icons.css";
 *
 * Assets:
 *   Copy the images/videos into ./src/assets/ (paths listed in the ASSETS
 *   object below). Any missing image simply won't render — the layout
 *   still works.  Replace the placeholder require() calls with your
 *   own paths / imports as needed.
 * ------------------------------------------------------------------
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/*  ASSETS — edit these paths to match where you drop the files.      */
/*  Using a helper so a missing file doesn't crash the bundler.       */
/* ------------------------------------------------------------------ */
const safe = (fn) => {
  try { return fn(); } catch { return ""; }
};

const A = {
  hero:            safe(() => require("./src/assets/hero.jpg")),
  heroVideo:       safe(() => require("./src/assets/hero.mp4")),
  step8Video:      safe(() => require("./src/assets/step_8.mp4")),
  contact:         safe(() => require("./src/assets/contact-intro.jpg")),
  visionHero:      safe(() => require("./src/assets/step-vision.jpg")),
  complete:        safe(() => require("./src/assets/step-complete.jpg")),
  facadeDefault:   safe(() => require("./src/assets/facade-default.jpg")),
  engagement:      safe(() => require("./src/assets/engagement-scope.jpg")),

  type: {
    residence:     safe(() => require("./src/assets/type-residence.jpg")),
    corporate:     safe(() => require("./src/assets/type-corporate.jpg")),
    retail:        safe(() => require("./src/assets/type-retail.jpg")),
    institutional: safe(() => require("./src/assets/type-institutional.jpg")),
    hospitality:   safe(() => require("./src/assets/type-hospitality.jpg")),
    healthcare:    safe(() => require("./src/assets/type-healthcare.jpg")),
    mixed:         safe(() => require("./src/assets/type-mixed.jpg")),
    other:         safe(() => require("./src/assets/type-other.jpg")),
  },

  role: {
    architect:  safe(() => require("./src/assets/role-architect.jpg")),
    developer:  safe(() => require("./src/assets/role-developer.jpg")),
    owner:      safe(() => require("./src/assets/role-owner.jpg")),
    contractor: safe(() => require("./src/assets/role-contractor.jpg")),
    consultant: safe(() => require("./src/assets/role-consultant.jpg")),
    other:      safe(() => require("./src/assets/role-other.jpg")),
    default:    safe(() => require("./src/assets/role-default.jpg")),
  },

  scale: {
    accent:   safe(() => require("./src/assets/scale-accent.jpg")),
    boutique: safe(() => require("./src/assets/scale-boutique.jpg")),
    mid:      safe(() => require("./src/assets/scale-mid.jpg")),
    large:    safe(() => require("./src/assets/scale-large.jpg")),
    landmark: safe(() => require("./src/assets/scale-landmark.jpg")),
  },

  timeline: {
    concept:      safe(() => require("./src/assets/timeline-concept.jpg")),
    viz:          safe(() => require("./src/assets/timeline-viz.jpg")),
    tender:       safe(() => require("./src/assets/timeline-tender.jpg")),
    construction: safe(() => require("./src/assets/timeline-construction.jpg")),
    renovation:   safe(() => require("./src/assets/timeline-renovation.jpg")),
  },

  aesthetic: {
    iconic:        safe(() => require("./src/assets/aesthetic-iconic.jpg")),
    refined:       safe(() => require("./src/assets/aesthetic-refined.jpg")),      // Old Money
    minimal:       safe(() => require("./src/assets/aesthetic-minimal.jpg")),      // Japandi
    contemporary:  safe(() => require("./src/assets/aesthetic-contemporary.jpg")),
    artistic:      safe(() => require("./src/assets/aesthetic-artistic.jpg")),     // Avant-garde
    contextual:    safe(() => require("./src/assets/aesthetic-contextual.jpg")),
    valueDriven:   safe(() => require("./src/assets/aesthetic-value-driven.jpg")), // Functional
    oneOfAKind:    safe(() => require("./src/assets/aesthetic-one-of-a-kind.jpg")),
    fluid:         safe(() => require("./src/assets/aesthetic-fluid.jpg")),        // Classic
    monolithic:    safe(() => require("./src/assets/aesthetic-monolithic.webp")),  // Brutalist
    futuristic:    safe(() => require("./src/assets/aesthetic-futuristic.jpg")),   // Neo-futurist
    textural:      safe(() => require("./src/assets/aesthetic-textural.jpg")),     // Maximalist
  },

  logos: [
    // Add / remove logo files as you like — this list drives the marquee.
    safe(() => require("./src/assets/logos/billionaire-homes.png")),
    safe(() => require("./src/assets/logos/hafeez-contractor.png")),
    safe(() => require("./src/assets/logos/dsr-builders.png")),
    safe(() => require("./src/assets/logos/studio-ardete.png")),
    safe(() => require("./src/assets/logos/miraj-group.png")),
    safe(() => require("./src/assets/logos/morphogenesis.png")),
    safe(() => require("./src/assets/logos/fortis.png")),
    safe(() => require("./src/assets/logos/apollo.png")),
    safe(() => require("./src/assets/logos/bmw.png")),
    safe(() => require("./src/assets/logos/ab-jewellers.png")),
    safe(() => require("./src/assets/logos/asro-arcade.png")),
    safe(() => require("./src/assets/logos/bdr.png")),
    safe(() => require("./src/assets/logos/cityspace-82.png")),
    safe(() => require("./src/assets/logos/radisson.png")),
    safe(() => require("./src/assets/logos/gls-university.png")),
    safe(() => require("./src/assets/logos/indian-railways.png")),
    safe(() => require("./src/assets/logos/m3m.png")),
    safe(() => require("./src/assets/logos/odisha-cricket.png")),
    safe(() => require("./src/assets/logos/reliance.png")),
    safe(() => require("./src/assets/logos/tanishq.png")),
    safe(() => require("./src/assets/logos/studio-lotus.png")),
    safe(() => require("./src/assets/logos/westin-residences.png")),
  ].filter(Boolean),
};

/* ------------------------------------------------------------------ */
/*  Local scoped styles (kept inline so the file is fully portable)   */
/* ------------------------------------------------------------------ */
const MQ_STYLES = `
.mq-root { --bg:#0B0B0C; --panel:#121214; --fg:#F4F1EA; --muted:#8a8580;
  --border:rgba(255,255,255,.12); --accent:#FF5A1F; --gold:#C9A961;
  background:var(--bg); color:var(--fg); min-height:100vh;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing:antialiased; }
.mq-root h1,.mq-root h2 { font-family: "Instrument Serif", Georgia, serif; font-weight:300; letter-spacing:-.01em; }
.mq-header { position:sticky; top:0; z-index:50; background:rgba(11,11,12,.85);
  backdrop-filter: blur(14px); border-bottom:1px solid var(--border); }
.mq-progress { height:2px; background:rgba(255,255,255,.1); }
.mq-progress > span { display:block; height:100%; background:var(--fg); transition:width .5s ease; }
.mq-kicker { font-size:10px; letter-spacing:.3em; text-transform:uppercase; color:rgba(244,241,234,.7); }
.mq-panel-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.mq-panel-shade { position:absolute; inset:0; background:linear-gradient(135deg, rgba(11,11,12,.4) 0%, transparent 50%); pointer-events:none; }
.mq-option { display:flex; align-items:center; gap:.75rem; width:100%; text-align:left;
  background:rgba(18,18,20,.4); border:1px solid var(--border); color:var(--fg);
  border-radius:6px; padding:.6rem .75rem; transition:all .25s ease; cursor:pointer; }
.mq-option:hover { border-color:rgba(244,241,234,.35); background:rgba(18,18,20,.9); }
.mq-option.selected { border-color:var(--accent); background:rgba(255,90,31,.08); }
.mq-option .dot { width:20px; height:20px; border-radius:50%; border:1px solid var(--border);
  display:grid; place-items:center; flex:0 0 20px; }
.mq-option.selected .dot { background:var(--accent); border-color:var(--accent); color:#000; }
.mq-thumb { width:56px; height:40px; object-fit:cover; border-radius:3px; border:1px solid var(--border); flex:0 0 56px; }
.mq-input { height:48px; width:100%; background:rgba(18,18,20,.4); color:var(--fg);
  border:1px solid var(--border); border-radius:6px; padding:0 1rem; outline:none; transition:all .2s ease; font-size:14px; }
.mq-input:focus { border-color:var(--accent); background:var(--panel);
  box-shadow:0 0 0 3px rgba(255,90,31,.18); }
.mq-textarea { min-height:180px; width:100%; background:rgba(18,18,20,.4); color:var(--fg);
  border:1px solid var(--border); border-radius:6px; padding:1rem; outline:none; resize:vertical; font-size:14px; line-height:1.6; }
.mq-textarea:focus { border-color:var(--accent); background:var(--panel); box-shadow:0 0 0 3px rgba(255,90,31,.18); }
.mq-btn-primary { display:inline-flex; align-items:center; gap:.75rem; padding:.75rem 1.5rem;
  background:var(--fg); color:#000; border:0; border-radius:999px; font-size:12px;
  letter-spacing:.18em; text-transform:uppercase; font-weight:300; transition:all .3s ease; }
.mq-btn-primary:hover:not(:disabled) { gap:1rem; }
.mq-btn-primary:disabled { background:rgba(244,241,234,.2); color:rgba(244,241,234,.5); cursor:not-allowed; }
.mq-btn-ghost { display:inline-flex; align-items:center; gap:.75rem; padding:.75rem 1.5rem;
  background:transparent; color:var(--fg); border:1px solid var(--fg); border-radius:999px;
  font-size:12px; letter-spacing:.18em; text-transform:uppercase; font-weight:300; transition:.25s; }
.mq-btn-ghost:hover { background:var(--fg); color:#000; }
.mq-nav-btn { width:28px; height:28px; border-radius:50%; border:1px solid rgba(244,241,234,.4);
  background:transparent; color:var(--fg); display:grid; place-items:center; transition:.2s; }
.mq-nav-btn:hover:not(:disabled) { background:var(--fg); color:#000; }
.mq-nav-btn:disabled { opacity:.3; cursor:not-allowed; }
.mq-footer { position:fixed; left:0; right:0; bottom:0; z-index:40;
  background:rgba(11,11,12,.85); backdrop-filter:blur(14px); border-top:1px solid var(--border);
  padding:.75rem 1.5rem; }
.mq-marquee { display:flex; width:max-content; gap:3.5rem; align-items:center;
  animation: mq-scroll 45s linear infinite; }
@keyframes mq-scroll { from { transform:translateX(0);} to { transform:translateX(-50%);} }
.mq-logo { height:50px; max-width:150px; object-fit:contain; opacity:.9; filter:brightness(0) invert(1); }
.mq-country-menu { position:absolute; top:100%; left:0; margin-top:.25rem; width:320px; max-width:calc(100vw - 2rem);
  background:#000; border:1px solid var(--border); border-radius:8px; box-shadow:0 20px 40px rgba(0,0,0,.4);
  z-index:60; overflow:hidden; }
.mq-country-row { display:flex; align-items:center; gap:.75rem; padding:.6rem .75rem; color:#fff; font-size:13px; cursor:pointer; }
.mq-country-row:hover, .mq-country-row.active { background:#27272a; }
.mq-search-wrap { display:flex; align-items:center; gap:.5rem; border-bottom:1px solid #27272a; padding:.6rem .75rem; }
.mq-search-wrap input { flex:1; background:transparent; border:0; color:#fff; outline:none; font-size:14px; }
`;

/* ------------------------------------------------------------------ */
/*  Shared primitives                                                  */
/* ------------------------------------------------------------------ */
const TOTAL_STEPS = 10;

function Option({ label, selected, onClick, onMouseEnter, thumb }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      className={`mq-option ${selected ? "selected" : ""}`}
    >
      {thumb && <img src={thumb} alt="" className="mq-thumb d-none d-md-block" />}
      <span className="flex-fill" style={{ fontSize: 14, fontWeight: 300 }}>{label}</span>
      <span className="dot">
        {selected && <i className="bi bi-check-lg" style={{ fontSize: 12 }} />}
      </span>
    </button>
  );
}

function StepHeading({ kicker, title, sub }) {
  return (
    <div className="mb-4">
      {kicker && <div className="mq-kicker mb-2">{kicker}</div>}
      <h1 className="h3 mb-3" style={{ fontSize: "1.75rem", lineHeight: 1.15 }}>{title}</h1>
      {sub && <p className="text-white-50" style={{ fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

function Split({ children, imageSrc, videoSrc, step, prev, next }) {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: "calc(100vh - 98px)" }}>
        <div className="col-lg-7 order-2 order-lg-1 position-relative d-flex align-items-center" style={{ padding: "4rem 1.5rem 6rem" }}>
          <div className="position-absolute d-flex align-items-center gap-2" style={{ top: 12, right: 24, fontSize: 12 }}>
            <button className="mq-nav-btn" onClick={prev} disabled={step === 1}><i className="bi bi-chevron-left" /></button>
            <span>{String(step).padStart(2, "0")}<span className="text-white-50 mx-1">/</span><span className="text-white-50">{String(TOTAL_STEPS).padStart(2, "0")}</span></span>
            <button className="mq-nav-btn" onClick={next} disabled={step === TOTAL_STEPS}><i className="bi bi-chevron-right" /></button>
          </div>
          <div className="w-100" style={{ maxWidth: 680 }}>{children}</div>
        </div>
        <div className="col-lg-5 order-1 order-lg-2 position-relative overflow-hidden" style={{ minHeight: "34vh", borderLeft: "1px solid var(--border)" }}>
          {videoSrc ? (
            <video src={videoSrc} autoPlay loop muted playsInline className="mq-panel-img" />
          ) : (
            imageSrc && <img src={imageSrc} alt="" className="mq-panel-img" />
          )}
          <div className="mq-panel-shade" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Options data                                                       */
/* ------------------------------------------------------------------ */
const PROJECT_TYPES = [
  { key: "residence", label: "Luxury Residence: Villa/Bungalow facade", img: A.type.residence },
  { key: "corporate", label: "Commercial & Corporate: HQ/Office facade", img: A.type.corporate },
  { key: "retail", label: "Retail & Flagship: Luxury retail/Jewellery showroom", img: A.type.retail },
  { key: "institutional", label: "Institutional: University/Public architecture", img: A.type.institutional },
  { key: "hospitality", label: "Hospitality: Hotel/Resort", img: A.type.hospitality },
  { key: "healthcare", label: "Healthcare: Premium hospital facade", img: A.type.healthcare },
  { key: "mixed", label: "Mixed Use/Township: Podiums & towers", img: A.type.mixed },
  { key: "other", label: "Other", img: A.type.other },
];

const ROLES = [
  { key: "Architect", label: "Architect", img: A.role.architect },
  { key: "Real Estate Developer", label: "Real Estate Developer", img: A.role.developer },
  { key: "End User/Owner", label: "End User/Owner", img: A.role.owner },
  { key: "Main Contractor", label: "Main Contractor", img: A.role.contractor },
  { key: "Facade Consultant", label: "Facade Consultant", img: A.role.consultant },
  { key: "Other", label: "Other", img: A.role.other },
];

const SCALES = [
  { key: "accent", label: "Accent: Under 1,000 sqft", img: A.scale.accent },
  { key: "boutique", label: "Boutique: Under 3,000 sqft", img: A.scale.boutique },
  { key: "mid", label: "Premium Mid-Scale: 3,000 to 10,000 sqft", img: A.scale.mid },
  { key: "large", label: "Large Scale: 10,000 to 30,000 sqft", img: A.scale.large },
  { key: "landmark", label: "Landmark/Mega Project: 30,000 sqft and above", img: A.scale.landmark },
];

const TIMELINES = [
  { key: "concept", label: "Concept Design", img: A.timeline.concept },
  { key: "viz", label: "3D Visualization Ready", img: A.timeline.viz },
  { key: "tender", label: "Tendering Stage", img: A.timeline.tender },
  { key: "construction", label: "Under Construction", img: A.timeline.construction },
  { key: "renovation", label: "Renovation/Facade Upgrade", img: A.timeline.renovation },
];

const AESTHETICS = [
  { key: "iconic", label: "Iconic", img: A.aesthetic.iconic },
  { key: "refined", label: "Old Money", img: A.aesthetic.refined },
  { key: "minimal", label: "Japandi", img: A.aesthetic.minimal },
  { key: "contemporary", label: "Contemporary", img: A.aesthetic.contemporary },
  { key: "artistic", label: "Avant-garde", img: A.aesthetic.artistic },
  { key: "contextual", label: "Contextual", img: A.aesthetic.contextual },
  { key: "value-driven", label: "Functional", img: A.aesthetic.valueDriven },
  { key: "one-of-a-kind", label: "One of a kind", img: A.aesthetic.oneOfAKind },
  { key: "fluid", label: "Classic", img: A.aesthetic.fluid },
  { key: "monolithic", label: "Brutalist", img: A.aesthetic.monolithic },
  { key: "futuristic", label: "Neo-futurist", img: A.aesthetic.futuristic },
  { key: "textural", label: "Maximalist", img: A.aesthetic.textural },
];

const ENGAGEMENTS = [
  { key: "immediate", label: "Immediate" },
  { key: "next-month", label: "Next month" },
  { key: "design-only", label: "Would like to engage on design, though civil is not ready yet" },
  { key: "other", label: "Other" },
];

const COUNTRIES = [
  { code: "IN", name: "India", dial: "+91" }, { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" }, { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" }, { code: "QA", name: "Qatar", dial: "+974" },
  { code: "KW", name: "Kuwait", dial: "+965" }, { code: "OM", name: "Oman", dial: "+968" },
  { code: "BH", name: "Bahrain", dial: "+973" }, { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" }, { code: "AU", name: "Australia", dial: "+61" },
  { code: "CA", name: "Canada", dial: "+1" }, { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" }, { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" }, { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "CH", name: "Switzerland", dial: "+41" }, { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" }, { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "KR", name: "South Korea", dial: "+82" }, { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "TH", name: "Thailand", dial: "+66" }, { code: "PH", name: "Philippines", dial: "+63" },
  { code: "VN", name: "Vietnam", dial: "+84" }, { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "BD", name: "Bangladesh", dial: "+880" }, { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "NP", name: "Nepal", dial: "+977" }, { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "NG", name: "Nigeria", dial: "+234" }, { code: "KE", name: "Kenya", dial: "+254" },
  { code: "EG", name: "Egypt", dial: "+20" }, { code: "TR", name: "Turkey", dial: "+90" },
  { code: "BR", name: "Brazil", dial: "+55" }, { code: "MX", name: "Mexico", dial: "+52" },
  { code: "AR", name: "Argentina", dial: "+54" }, { code: "NZ", name: "New Zealand", dial: "+64" },
];

const flagEmoji = (code) =>
  code.toUpperCase().split("").map(ch => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65)).join("");

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ------------------------------------------------------------------ */
/*  Country / phone control                                            */
/* ------------------------------------------------------------------ */
function PhoneCountry({ dial, onDialChange, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);
  const selected = COUNTRIES.find(c => c.dial === dial) || COUNTRIES[0];
  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search))
    : COUNTRIES;

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setSearch(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div className="position-relative">
      <div className="d-flex align-items-stretch mq-input" style={{ padding: 0, overflow: "visible" }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="d-flex align-items-center gap-2 px-3"
          style={{ background: "transparent", border: 0, borderRight: "1px solid var(--border)", color: "var(--fg)" }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{flagEmoji(selected.code)}</span>
          <span>{selected.dial}</span>
        </button>
        {open && (
          <div ref={wrapRef} className="mq-country-menu">
            <div className="mq-search-wrap">
              <i className="bi bi-search text-white-50" />
              <input autoFocus placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {filtered.map(c => (
                <div
                  key={c.code}
                  className={`mq-country-row ${c.dial === dial ? "active" : ""}`}
                  onClick={() => { onDialChange(c.dial); setOpen(false); setSearch(""); }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{flagEmoji(c.code)}</span>
                  <span className="flex-fill">{c.name}</span>
                  <span className="text-white-50">{c.code}</span>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-center text-white-50 py-3">No results</div>}
            </div>
          </div>
        )}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Phone number"
          autoComplete="tel"
          className="flex-fill px-3"
          style={{ background: "transparent", border: 0, color: "var(--fg)", outline: "none" }}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */
export default function MetaguiseQuestionnaire({
  logo,
  onSubmit,
  whatsappNumber = "919811604449",
  portfolioUrl = "https://metaguise.com/",
  initialStep = 1,
}) {
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState({
    projectType: "residence",
    scale: "accent",
    facadeStyle: "iconic",
    timeline: "concept",
    phoneCountry: "+91",
  });

  const setAnswer = useCallback((k, v) => setAnswers(a => ({ ...a, [k]: v })), []);
  const next = useCallback(() => setStep(s => Math.min(TOTAL_STEPS, s + 1)), []);
  const prev = useCallback(() => setStep(s => Math.max(1, s - 1)), []);
  const reset = useCallback(() => { setStep(1); setAnswers({}); }, []);

  // Hover previews for the right pane
  const [hover, setHover] = useState(null);
  useEffect(() => { setHover(null); }, [step]);

  const progress = Math.min(1, step / TOTAL_STEPS);

  /* ---------- header ---------- */
  const Header = (
    <header className="mq-header">
      <div className="position-relative d-flex align-items-center justify-content-center px-3" style={{ height: 96 }}>
        {logo && <img src={logo} alt="Metaguise" style={{ height: 60, objectFit: "contain" }} />}
      </div>
      <div className="mq-progress"><span style={{ width: `${progress * 100}%` }} /></div>
    </header>
  );

  /* ---------- step 1: welcome ---------- */
  const Welcome = (
    <div className="container-fluid p-0">
      <div className="row g-0" style={{ minHeight: "calc(100vh - 98px)" }}>
        <div className="col-lg-8 order-2 order-lg-1 d-flex align-items-center" style={{ padding: "3rem 1.5rem" }}>
          <div className="w-100" style={{ maxWidth: 900 }}>
            <div className="mq-kicker mb-4">India's original metal facade brand.</div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 3rem)", lineHeight: 1.1 }}>
              A Metaguise facade isn't just measured in square feet,
              it's measured in recognition and prestige.
            </h1>
            <p className="my-4 text-white-75" style={{ fontSize: 17 }}>
              This is where you begin your journey of creating legacy through architecture.
            </p>
            <button className="mq-btn-ghost" onClick={next}>
              Start Your Journey <i className="bi bi-arrow-right" />
            </button>

            {A.logos.length > 0 && (
              <div className="mt-5 pt-4">
                <div className="mq-kicker mb-3">
                  1800+ Projects Delivered. Trusted choice of the greatest architectural minds of the world.
                </div>
                <div className="overflow-hidden position-relative">
                  <div className="mq-marquee">
                    {[...A.logos, ...A.logos].map((src, i) => (
                      <img key={i} src={src} alt="" className="mq-logo" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4 order-1 order-lg-2 position-relative overflow-hidden" style={{ minHeight: "34vh", borderLeft: "1px solid var(--border)" }}>
          {A.heroVideo ? (
            <video src={A.heroVideo} poster={A.hero} autoPlay muted loop playsInline className="mq-panel-img" />
          ) : (
            A.hero && <img src={A.hero} alt="" className="mq-panel-img" />
          )}
          <div className="mq-panel-shade" />
        </div>
      </div>
    </div>
  );

  /* ---------- step 2: project type ---------- */
  const ProjectTypeStep = (() => {
    const active = PROJECT_TYPES.find(o => o.key === (hover || answers.projectType)) || PROJECT_TYPES[0];
    const otherInvalid = answers.projectType === "other" && !(answers.projectTypeOther || "").trim();
    return (
      <Split imageSrc={active.img} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 02: Project Classification" title="What best describes your project?" sub="Hover to preview the typology. Select one to continue." />
        <div className="row g-2">
          {PROJECT_TYPES.map(o => (
            <div key={o.key} className="col-md-6">
              <Option label={o.label} selected={answers.projectType === o.key}
                onClick={() => setAnswer("projectType", o.key)}
                onMouseEnter={() => setHover(o.key)} />
            </div>
          ))}
        </div>
        {answers.projectType === "other" && (
          <input autoFocus className="mq-input mt-3" placeholder="Please specify your project type"
            value={answers.projectTypeOther || ""} onChange={(e) => setAnswer("projectTypeOther", e.target.value)} />
        )}
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={otherInvalid} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 3: contact ---------- */
  const ContactStep = (() => {
    const nameOk = (answers.fullName || "").trim().length >= 2;
    const phoneOk = (answers.phone || "").trim().length >= 7;
    const emailOk = validEmail(answers.email || "");
    const canGo = nameOk && phoneOk && emailOk;
    return (
      <Split imageSrc={A.contact} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 03: Introduction" title="Tell us about yourself"
          sub="Our principal architects will reach out personally within 24 hours." />
        <div className="d-flex flex-column gap-3">
          <input className="mq-input" placeholder="Full name" autoComplete="name"
            value={answers.fullName || ""} onChange={(e) => setAnswer("fullName", e.target.value)} />
          <PhoneCountry dial={answers.phoneCountry || "+91"} onDialChange={(d) => setAnswer("phoneCountry", d)}
            value={answers.phone || ""} onChange={(v) => setAnswer("phone", v)} />
          <input className="mq-input" placeholder="Email address" type="email" autoComplete="email"
            value={answers.email || ""} onChange={(e) => setAnswer("email", e.target.value)} />
        </div>
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!canGo} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 4: role ---------- */
  const RoleStep = (() => {
    const active = ROLES.find(r => r.key === answers.role) || ROLES[0];
    const otherInvalid = answers.role === "Other" && !(answers.roleOther || "").trim();
    return (
      <Split imageSrc={active.img || A.role.default} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 04: Your Role" title="What is your role in this project?" sub="Select the description that best fits you." />
        <div className="row g-2">
          {ROLES.map(r => (
            <div key={r.key} className="col-md-6">
              <Option label={r.label} thumb={r.img} selected={answers.role === r.key}
                onClick={() => setAnswer("role", r.key)} />
            </div>
          ))}
        </div>
        {answers.role === "Other" && (
          <input autoFocus className="mq-input mt-3" placeholder="Please specify your role"
            value={answers.roleOther || ""} onChange={(e) => setAnswer("roleOther", e.target.value)} />
        )}
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!answers.role || otherInvalid} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 5: scale ---------- */
  const ScaleStep = (() => {
    const active = SCALES.find(o => o.key === (hover || answers.scale)) || SCALES[0];
    return (
      <Split imageSrc={active.img} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 05: Project Scale" title="What is the approximate surface area of your facade?" />
        <div className="row g-2">
          {SCALES.map(o => (
            <div key={o.key} className="col-md-6">
              <Option label={o.label} selected={answers.scale === o.key}
                onClick={() => setAnswer("scale", o.key)} onMouseEnter={() => setHover(o.key)} />
            </div>
          ))}
        </div>
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!answers.scale} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 6: aesthetic ---------- */
  const AestheticStep = (() => {
    const active = AESTHETICS.find(s => s.key === (hover || answers.facadeStyle));
    return (
      <Split imageSrc={active?.img || A.facadeDefault} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 06: Aesthetic Resonance" title="What's your facade vision?" />
        <div className="row g-2">
          {AESTHETICS.map(s => (
            <div key={s.key} className="col-6">
              <Option label={s.label} selected={answers.facadeStyle === s.key}
                onClick={() => setAnswer("facadeStyle", s.key)} onMouseEnter={() => setHover(s.key)} />
            </div>
          ))}
        </div>
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!answers.facadeStyle} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 7: timeline + hasAssets ---------- */
  const TimelineStep = (() => {
    const active = TIMELINES.find(o => o.key === (hover || answers.timeline)) || TIMELINES[0];
    return (
      <Split imageSrc={active.img} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 07: Project Lifecycle" title="What stage is your project currently in?" />
        <div className="row g-2">
          {TIMELINES.map(o => (
            <div key={o.key} className="col-md-6">
              <Option label={o.label} selected={answers.timeline === o.key}
                onClick={() => setAnswer("timeline", o.key)} onMouseEnter={() => setHover(o.key)} />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="mq-kicker mb-3">Do you have any 3D renders or architectural drawings?</div>
          <div className="row g-2">
            {[{ key: "yes", label: "Yes" }, { key: "no", label: "No" }].map(o => (
              <div key={o.key} className="col-md-6">
                <Option label={o.label} selected={answers.hasAssets === o.key} onClick={() => setAnswer("hasAssets", o.key)} />
              </div>
            ))}
          </div>
        </div>
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!answers.timeline || !answers.hasAssets} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 8: engagement ---------- */
  const EngagementStep = (() => {
    const isOther = answers.engagement === "other";
    const canGo = !!answers.engagement && (!isOther || (answers.engagementOther || "").trim().length > 0);
    return (
      <Split imageSrc={A.engagement} videoSrc={A.step8Video} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 08: Engagement Timing" title="How soon would you like to engage Metaguise in your project?" />
        <div className="d-flex flex-column gap-2">
          {ENGAGEMENTS.map(o => (
            <Option key={o.key} label={o.label} selected={answers.engagement === o.key} onClick={() => setAnswer("engagement", o.key)} />
          ))}
          {isOther && (
            <textarea autoFocus className="mq-textarea mt-2" rows={3} placeholder="Please share your timing..."
              value={answers.engagementOther || ""} onChange={(e) => setAnswer("engagementOther", e.target.value)} />
          )}
        </div>
        <div className="mq-footer">
          <button className="mq-btn-primary" disabled={!canGo} onClick={next}>Continue <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 9: vision ---------- */
  const VisionStep = (() => {
    const vision = answers.vision || "";
    const submit = () => { if (onSubmit) onSubmit(answers); else console.info("[Metaguise] Brief:", answers); next(); };
    return (
      <Split imageSrc={A.visionHero} step={step} prev={prev} next={next}>
        <StepHeading kicker="Step 09: Design Vision" title="Tell us your facade goals." />
        <textarea className="mq-textarea"
          value={vision} onChange={(e) => setAnswer("vision", e.target.value.slice(0, 1200))}
          placeholder="Describe your vision, material preferences, or the architectural statement you want to make..." />
        <div className="text-end text-white-50 mt-2" style={{ fontSize: 12 }}>{vision.length}/1200</div>
        <div className="mq-footer">
          <button className="mq-btn-primary" onClick={submit}>Submit Project Brief <i className="bi bi-arrow-right" /></button>
        </div>
      </Split>
    );
  })();

  /* ---------- step 10: complete ---------- */
  const Complete = (
    <div className="position-relative overflow-hidden" style={{ minHeight: "calc(100vh - 98px)" }}>
      {A.complete && <img src={A.complete} alt="" className="mq-panel-img" />}
      <div className="position-absolute" style={{ inset: 0, background: "linear-gradient(to bottom, rgba(11,11,12,.7), rgba(11,11,12,.95))" }} />
      <div className="position-relative d-flex flex-column align-items-center justify-content-center text-center px-3"
           style={{ minHeight: "calc(100vh - 98px)", zIndex: 2 }}>
        <div style={{ color: "var(--gold)", fontSize: 11, letterSpacing: ".32em", textTransform: "uppercase" }}>Brief received</div>
        <h1 className="mt-4" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, maxWidth: 900 }}>
          <span className="d-block">Thank you. Your architectural</span>
          <span className="d-block">vision has been received.</span>
        </h1>
        <p className="mt-4 text-white-75" style={{ maxWidth: 640, fontSize: 17 }}>
          Our engineering and design team will review your project requirements personally.<br />
          <span className="text-white">Estimated callback time: within 24 hours.</span>
        </p>
        <div className="mt-5 d-flex flex-wrap justify-content-center gap-3">
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"
             className="mq-btn-primary" style={{ background: "#25D366", color: "#000" }}>
            <i className="bi bi-whatsapp" /> Connect via WhatsApp
          </a>
          <a href={portfolioUrl} target="_blank" rel="noreferrer" className="mq-btn-ghost">
            Explore Our Portfolio <i className="bi bi-arrow-up-right" />
          </a>
        </div>
        <button onClick={reset} className="mt-5 btn btn-link text-white-50"
                style={{ textDecoration: "none", fontSize: 12, letterSpacing: ".25em", textTransform: "uppercase" }}>
          Start a new project brief
        </button>
      </div>
    </div>
  );

  const screens = {
    1: Welcome, 2: ProjectTypeStep, 3: ContactStep, 4: RoleStep, 5: ScaleStep,
    6: AestheticStep, 7: TimelineStep, 8: EngagementStep, 9: VisionStep, 10: Complete,
  };

  return (
    <div className="mq-root">
      <style>{MQ_STYLES}</style>
      {Header}
      {screens[step]}
    </div>
  );
}
