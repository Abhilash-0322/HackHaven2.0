import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const OrbitingElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create orbiting elements
    const createOrbitingElements = () => {
      for (let i = 0; i < 8; i++) {
        const orbit = document.createElement('div');
        orbit.className = 'absolute inset-0 pointer-events-none';
        
        const element = document.createElement('div');
        const size = 8 + Math.random() * 16;
        
        const gradients = [
          'bg-gradient-to-r from-purple-400 to-pink-400',
          'bg-gradient-to-r from-blue-400 to-teal-400',
          'bg-gradient-to-r from-pink-400 to-purple-400',
          'bg-gradient-to-r from-teal-400 to-emerald-400',
          'bg-gradient-to-r from-indigo-400 to-blue-400'
        ];
        
        element.className = `absolute w-${Math.floor(size/4)} h-${Math.floor(size/4)} rounded-full ${gradients[Math.floor(Math.random() * gradients.length)]} opacity-30 blur-sm`;
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        
        // Position element on the orbit circle
        const angle = (i / 8) * 360;
        const radius = 200 + Math.random() * 100;
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = `translate(-50%, -50%) translateX(${radius}px)`;
        
        orbit.appendChild(element);
        container.appendChild(orbit);
        
        // Animate orbit rotation
        gsap.to(orbit, {
          rotation: 360,
          duration: 20 + Math.random() * 20,
          ease: 'none',
          repeat: -1
        });
        
        // Animate element scale and opacity
        gsap.to(element, {
          scale: 0.5 + Math.random(),
          opacity: 0.1 + Math.random() * 0.3,
          duration: 3 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
      }
    };

    createOrbitingElements();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    />
  );
};

export default OrbitingElements;
