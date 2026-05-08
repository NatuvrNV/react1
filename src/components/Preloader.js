import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

/**
 * Preloader
 * ─────────
 * Phase 1 — Image reveals bottom→top, percentage counts 0→100
 * Phase 2 — Brief hold so the full image is visible
 * Phase 3 — Image zooms out (scale → 0) with expo.in easing
 * Phase 4 — Preloader fades away, page content fades in
 *
 * Props
 *   imageUrl   {string}   logo/image to reveal
 *   duration   {number}   reveal duration in seconds (default 2.6)
 *   onComplete {function} called when the exit finishes
 */
const Preloader = ({
  imageUrl   = 'https://ik.imagekit.io/ylx9qggcp/download%20(1).png',
  duration   = 2.6,
  onComplete,
}) => {
  const rootRef   = useRef(null);
  const wrapRef   = useRef(null);
  const maskRef   = useRef(null);
  const pctRef    = useRef(null);
  const tlRef     = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    const pctEl = pctRef.current;

    /* ── reset ── */
    gsap.set(root, { display: 'flex', opacity: 1 });
    gsap.set(wrap, { scale: 1, opacity: 1 });
    gsap.set(mask, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(pctEl, { opacity: 1, y: 0 });
    pctEl.textContent = '000%';

    gsap.ticker.lagSmoothing(0);

    const obj = { v: 0 };
    const tl  = gsap.timeline();
    tlRef.current = tl;

    /* ── Phase 1: reveal + counter ── */
    tl.to(obj, {
      v: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate() {
        const val = obj.v;
        mask.style.clipPath = `inset(${100 - val}% 0 0 0)`;
        pctEl.textContent   = `${String(Math.floor(val)).padStart(3, '0')}%`;
      },
    })

    /* ── Phase 2: hold ── */
    .to({}, { duration: 0.35 })

    /* ── Phase 3a: fade percentage ── */
    .to(pctEl, {
      opacity: 0,
      y: 6,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.1')

    /* ── Phase 3b: zoom out ── */
    .to(wrap, {
      scale: 0,
      duration: 0.85,
      ease: 'expo.in',
    }, '-=0.05')

    /* ── Phase 4: exit ── */
    .to(root, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete() {
        root.style.display = 'none';
        if (onComplete) onComplete();
      },
    });

    /* tab visibility guard */
    const onVisibility = () => {
      if (document.visibilityState === 'visible') gsap.globalTimeline.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  return (
    <div className="preloader" ref={rootRef}>
      {/* image + zoom wrapper */}
      <div className="preloader__wrap" ref={wrapRef}>

        {/* clip mask — driven by GSAP clipPath */}
        <div className="preloader__mask" ref={maskRef}>
          <img
            className="preloader__logo"
            src={imageUrl}
            alt=""
            draggable={false}
          />
        </div>

        {/* percentage */}
        <span className="preloader__pct" ref={pctRef}>000%</span>
      </div>
    </div>
  );
};

export default Preloader;