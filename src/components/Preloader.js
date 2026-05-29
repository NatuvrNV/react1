import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';
import localLogo from '../assets/Preloader.png';

/**
 * Preloader — Black screen → Reveal → Zoom-out → Page in
 * ────────────────────────────────────────────────────────
 * Phase 0 — Pure black screen held for `blackDuration` seconds
 * Phase 1 — Preloader content fades in, image reveals bottom→top
 *            while percentage counts 0 → 100
 * Phase 2 — Brief hold at 100%
 * Phase 3 — Percentage fades out, image zooms out (scale → 0)
 * Phase 4 — Preloader fades away, onComplete fires
 *
 * Puppeteer / SSR:
 *   window.__SKIP_PRELOADER__ = true  → component returns null instantly
 *
 * Props
 *   imageUrl      {string}   logo/image to reveal
 *   blackDuration {number}   black screen hold in seconds (default 1.2)
 *   duration      {number}   reveal animation duration (default 2.6)
 *   onComplete    {function} called when exit finishes
 */
const Preloader = ({
  imageUrl      = localLogo,
  blackDuration = 1.2,
  duration      = 2.6,
  onComplete,
}) => {
  const rootRef    = useRef(null);
  const stageRef   = useRef(null);   // the inner wrap that fades in
  const wrapRef    = useRef(null);
  const maskRef    = useRef(null);
  const pctRef     = useRef(null);
  const tlRef      = useRef(null);

  useEffect(() => {
    /* ── Skip entirely during Puppeteer prerender ── */
    if (typeof window !== 'undefined' && window.__SKIP_PRELOADER__) {
      if (rootRef.current) rootRef.current.style.display = 'none';
      if (onComplete) onComplete();
      return;
    }

    const root    = rootRef.current;
    const stage   = stageRef.current;
    const wrap    = wrapRef.current;
    const mask    = maskRef.current;
    const pctEl   = pctRef.current;

    /* ── Initial state: everything hidden, black screen showing ── */
    gsap.set(root,  { display: 'flex', opacity: 1, background: '#0d0d0d' });
    gsap.set(stage, { opacity: 0 });                         // content invisible
    gsap.set(wrap,  { scale: 1 });
    gsap.set(mask,  { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(pctEl, { opacity: 1, y: 0 });
    pctEl.textContent = '000%';

    gsap.ticker.lagSmoothing(0);

    const obj = { v: 0 };
    const tl  = gsap.timeline({
      paused: document.visibilityState !== 'visible',
    });
    tlRef.current = tl;

    /* ─────────────────────────────────────────────────────────
       Phase 0 — Black screen hold
    ───────────────────────────────────────────────────────── */
    tl.to({}, { duration: blackDuration })

    /* ─────────────────────────────────────────────────────────
       Phase 1 — Stage fades in + image reveals + counter
    ───────────────────────────────────────────────────────── */
    .to(stage, {
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
    })

    .to(obj, {
      v: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate() {
        const val = obj.v;
        mask.style.clipPath = `inset(${100 - val}% 0 0 0)`;
        pctEl.textContent   = `${String(Math.floor(val)).padStart(3, '0')}%`;
      },
    }, '-=0.3')   // slight overlap so reveal starts while fade-in finishes

    /* ─────────────────────────────────────────────────────────
       Phase 2 — Hold at 100%
    ───────────────────────────────────────────────────────── */
    .to({}, { duration: 0.35 })

    /* ─────────────────────────────────────────────────────────
       Phase 3a — Percentage fades out
    ───────────────────────────────────────────────────────── */
    .to(pctEl, {
      opacity: 0,
      y: 6,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.1')

    /* ─────────────────────────────────────────────────────────
       Phase 3b — Image zooms out
    ───────────────────────────────────────────────────────── */
    .to(wrap, {
      scale: 0,
      duration: 0.85,
      ease: 'expo.in',
    }, '-=0.05')

    /* ─────────────────────────────────────────────────────────
       Phase 4 — Preloader fades out → page appears
    ───────────────────────────────────────────────────────── */
    .to(root, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete() {
        root.style.display = 'none';
        if (onComplete) onComplete();
      },
    });

    /* Tab visibility guard — pause/resume so counter never jumps */
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tl.resume();
      else tl.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (document.visibilityState === 'visible') tl.resume();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  /* Don't render DOM during Puppeteer prerender */
  if (typeof window !== 'undefined' && window.__SKIP_PRELOADER__) {
    return null;
  }

  return (
    <div className="preloader" ref={rootRef}>
      {/* Stage: starts opacity:0 for the black screen hold */}
      <div className="preloader__stage" ref={stageRef}>
        <div className="preloader__wrap" ref={wrapRef}>
          <div className="preloader__mask" ref={maskRef}>
            <img
              className="preloader__logo"
              src={imageUrl}
              alt=""
              draggable={false}
            />
          </div>
          <span className="preloader__pct" ref={pctRef}>000%</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;