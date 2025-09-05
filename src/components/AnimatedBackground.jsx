import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute rounded-full opacity-30`;
        
        // Random colors and sizes
        const colors = ['bg-purple-400', 'bg-pink-400', 'bg-blue-400', 'bg-teal-400', 'bg-indigo-400', 'bg-emerald-400'];
        const sizes = ['w-1 h-1', 'w-2 h-2', 'w-3 h-3', 'w-4 h-4'];
        
        particle.className += ` ${colors[Math.floor(Math.random() * colors.length)]} ${sizes[Math.floor(Math.random() * sizes.length)]}`;
        
        // Random positions
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        container.appendChild(particle);
        particlesRef.current.push(particle);
        
        // Animate each particle
        gsap.to(particle, {
          y: -100 - Math.random() * 200,
          x: -50 + Math.random() * 100,
          rotation: Math.random() * 360,
          scale: Math.random() * 2 + 0.5,
          duration: 10 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 5
        });
      }
    };

    createParticles();

    // Create floating geometric shapes
    const createGeometricShapes = () => {
      for (let i = 0; i < 20; i++) {
        const shape = document.createElement('div');
        const shapes = [
          'rounded-full',
          'rounded-lg rotate-45',
          'rounded-none rotate-12',
          'rounded-full',
          'rounded-xl rotate-45'
        ];
        
        const gradients = [
          'bg-gradient-to-br from-purple-300 to-pink-300',
          'bg-gradient-to-br from-blue-300 to-teal-300',
          'bg-gradient-to-br from-pink-300 to-purple-300',
          'bg-gradient-to-br from-teal-300 to-emerald-300',
          'bg-gradient-to-br from-indigo-300 to-blue-300'
        ];
        
        shape.className = `absolute opacity-10 blur-sm ${shapes[Math.floor(Math.random() * shapes.length)]} ${gradients[Math.floor(Math.random() * gradients.length)]}`;
        
        const size = 20 + Math.random() * 80;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        
        container.appendChild(shape);
        
        gsap.to(shape, {
          rotation: 360,
          scale: Math.random() * 1.5 + 0.5,
          x: -100 + Math.random() * 200,
          y: -100 + Math.random() * 200,
          duration: 15 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 3
        });
      }
    };

    createGeometricShapes();

    return () => {
      particlesRef.current.forEach(particle => particle.remove());
      particlesRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    />
  );
};

export default AnimatedBackground;
