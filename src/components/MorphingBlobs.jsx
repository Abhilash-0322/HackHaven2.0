import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const MorphingBlobs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createMorphingBlobs = () => {
      for (let i = 0; i < 6; i++) {
        const blob = document.createElement('div');
        blob.className = 'absolute rounded-full opacity-20 blur-2xl pointer-events-none';
        
        const colors = [
          'bg-purple-500',
          'bg-pink-500',
          'bg-blue-500',
          'bg-teal-500',
          'bg-indigo-500',
          'bg-emerald-500'
        ];
        
        blob.className += ` ${colors[i]}`;
        
        const size = 100 + Math.random() * 200;
        blob.style.width = size + 'px';
        blob.style.height = size + 'px';
        blob.style.left = Math.random() * 100 + '%';
        blob.style.top = Math.random() * 100 + '%';
        
        container.appendChild(blob);
        blobsRef.current.push(blob);
        
        // Morphing animation
        const morphTimeline = gsap.timeline({ repeat: -1 });
        
        morphTimeline
          .to(blob, {
            scale: 0.5 + Math.random() * 1.5,
            borderRadius: Math.random() * 50 + 25 + '%',
            duration: 3 + Math.random() * 4,
            ease: 'power2.inOut'
          })
          .to(blob, {
            scale: 1 + Math.random() * 0.5,
            borderRadius: Math.random() * 30 + 40 + '%',
            duration: 3 + Math.random() * 4,
            ease: 'power2.inOut'
          })
          .to(blob, {
            scale: 0.8 + Math.random() * 0.7,
            borderRadius: '50%',
            duration: 3 + Math.random() * 4,
            ease: 'power2.inOut'
          });
        
        // Floating movement
        gsap.to(blob, {
          x: -50 + Math.random() * 100,
          y: -50 + Math.random() * 100,
          duration: 8 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    };

    createMorphingBlobs();

    return () => {
      blobsRef.current.forEach(blob => blob.remove());
      blobsRef.current = [];
    };
  }, []);

  // Mouse interaction effect
  useEffect(() => {
    blobsRef.current.forEach((blob, index) => {
      const rect = blob.getBoundingClientRect();
      const blobCenterX = rect.left + rect.width / 2;
      const blobCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - blobCenterX, 2) + 
        Math.pow(mousePosition.y - blobCenterY, 2)
      );
      
      if (distance < 200) {
        gsap.to(blob, {
          scale: 1.5,
          opacity: 0.4,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(blob, {
          scale: 1,
          opacity: 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }, [mousePosition]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    />
  );
};

export default MorphingBlobs;
