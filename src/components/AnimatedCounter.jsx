import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedCounter = ({ end, duration = 2, delay = 0, prefix = '', suffix = '' }) => {
  const counterRef = useRef(null);
  const currentValue = useRef(0);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    gsap.to(currentValue, {
      current: end,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        counter.textContent = prefix + Math.floor(currentValue.current) + suffix;
      }
    });
  }, [end, duration, delay, prefix, suffix]);

  return <span ref={counterRef}>0</span>;
};

export default AnimatedCounter;
