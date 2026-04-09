import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = () => {
  const liquidRef = useRef(null);
  const percentageRef = useRef(null);
  const preloaderRef = useRef(null);
  const circleRef = useRef(null);
  const tweenRef = useRef(null);        // ✅ store tween reference
  const percentageObj = useRef({ value: 0 }); // ✅ stable ref, not recreated

  useEffect(() => {
    const circumference = 2 * Math.PI * 90;

    // ✅ Kill any existing tween before starting
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // ✅ Reset to 0 before animating
    percentageObj.current.value = 0;

    tweenRef.current = gsap.to(percentageObj.current, {
      value: 100,
      duration: 2.5,
      ease: 'power1.inOut',             // ✅ smooth easing
      onUpdate: () => {
        const val = percentageObj.current.value;

        if (percentageRef.current) {
          percentageRef.current.textContent = `${Math.floor(val)}%`;
        }
        if (liquidRef.current) {
          liquidRef.current.style.clipPath = `inset(${100 - val}% 0 0 0)`;
        }
        if (circleRef.current) {
          const progress = ((100 - val) / 100) * circumference;
          circleRef.current.style.strokeDashoffset = progress;
        }
      },
      onComplete: () => {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = 'none';
            }
          },
        });
      },
    });

    // ✅ Cleanup on unmount
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, []); // ✅ empty deps — runs once only

  return (
    <div
      id="preloader"
      ref={preloaderRef}
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000',
        padding: '0 10px',
      }}
    >
      <div
        className="container preloader-container"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '200px',
          maxHeight: '200px',
          position: 'relative',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90} // ✅ start at 0% visually
            ref={circleRef}
          />
        </svg>
        <div
          ref={liquidRef}
          style={{
            width: '50%',
            height: '50%',
            background: `url("https://ik.imagekit.io/ylx9qggcp/download%20(1).png") no-repeat center center`,
            backgroundSize: 'contain',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            clipPath: 'inset(100% 0 0 0)',
          }}
        />
      </div>
      <div
        ref={percentageRef}
        style={{
          marginTop: '20px',
          color: '#fff',
          fontSize: '2rem',
        }}
      >
        0%
      </div>
    </div>
  );
};

export default Preloader;