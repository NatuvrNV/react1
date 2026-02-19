import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';
const Preloader = () => {
  const liquidRef = useRef(null);
  const percentageRef = useRef(null);
  const preloaderRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    let percentage = { value: 0 };
    const circumference = 2 * Math.PI * 90; // For a radius of 90 in the SVG circle

    gsap.to(percentage, {
      value: 100,
      duration: 2.5,
      onUpdate: () => {
        if (percentageRef.current) {
          percentageRef.current.textContent = `${Math.floor(percentage.value)}%`;
        }
        if (liquidRef.current) {
          liquidRef.current.style.clipPath = `inset(${100 - percentage.value}% 0 0 0)`;
        }
        if (circleRef.current) {
          const progress = (100 - percentage.value) / 100 * circumference;
          circleRef.current.style.strokeDashoffset = progress;
        }
      },
      onComplete: () => {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => preloaderRef.current.style.display = 'none',
        });
      },
    });
  }, []);

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
        className="container preloader-container "
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
            ref={circleRef}
          />
        </svg>
        <div
          ref={liquidRef}
          style={{
            width: '50%',
            height: '50%',
            background: `url(https://ik.imagekit.io/ylx9qggcp/download%20(1).png) no-repeat center center`,
            backgroundSize: 'contain',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            clipPath: 'inset(100% 0 0 0)',
          }}
        ></div>
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
