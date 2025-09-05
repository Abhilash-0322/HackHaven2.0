import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedWaves = () => {
  const waveRef = useRef(null);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    // Create multiple wave layers
    const createWave = (delay = 0, duration = 8, opacity = 0.1) => {
      return gsap.to(wave, {
        backgroundPosition: '200% 0%',
        duration: duration,
        ease: 'none',
        repeat: -1,
        delay: delay
      });
    };

    createWave(0, 8, 0.1);
    createWave(1, 10, 0.05);
    createWave(2, 12, 0.03);
  }, []);

  return (
    <>
      {/* Wave 1 */}
      <div 
        ref={waveRef}
        className="absolute bottom-0 left-0 w-full h-32 opacity-10"
        style={{
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6, #10b981)',
          backgroundSize: '200% 200%',
          clipPath: 'polygon(0 50%, 100% 80%, 100% 100%, 0% 100%)'
        }}
      />
      
      {/* Wave 2 */}
      <div 
        className="absolute bottom-0 left-0 w-full h-24 opacity-5"
        style={{
          background: 'linear-gradient(-45deg, #f59e0b, #ef4444, #8b5cf6, #06b6d4)',
          backgroundSize: '300% 300%',
          clipPath: 'polygon(0 70%, 100% 40%, 100% 100%, 0% 100%)',
          animation: 'wave-slide 10s ease-in-out infinite'
        }}
      />
      
      {/* Wave 3 */}
      <div 
        className="absolute bottom-0 left-0 w-full h-20 opacity-3"
        style={{
          background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
          backgroundSize: '400% 400%',
          clipPath: 'polygon(0 60%, 100% 90%, 100% 100%, 0% 100%)',
          animation: 'wave-slide 15s ease-in-out infinite reverse'
        }}
      />
      
      <style jsx>{`
        @keyframes wave-slide {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedWaves;
