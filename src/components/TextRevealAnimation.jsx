import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextRevealAnimation = ({ children, className = '', delay = 0 }) => {
  const textRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    const mask = maskRef.current;
    if (!text || !mask) return;

    const tl = gsap.timeline({ delay });

    // Initial states
    gsap.set(text, { y: 100, opacity: 0 });
    gsap.set(mask, { scaleX: 0, transformOrigin: 'left center' });

    // Animation sequence
    tl.to(mask, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.inOut'
    })
    .to(text, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .to(mask, {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.2');

  }, [delay]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={textRef}>
        {children}
      </div>
      <div 
        ref={maskRef}
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );
};

export default TextRevealAnimation;
