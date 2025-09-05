import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Heart, Star, Zap, Flower, Sun, Moon, Diamond } from 'lucide-react';

const FloatingIcons = () => {
  const containerRef = useRef(null);
  const iconsRef = useRef([]);

  const icons = [
    { Icon: Sparkles, color: 'text-purple-400' },
    { Icon: Heart, color: 'text-pink-400' },
    { Icon: Star, color: 'text-yellow-400' },
    { Icon: Zap, color: 'text-blue-400' },
    { Icon: Flower, color: 'text-emerald-400' },
    { Icon: Sun, color: 'text-orange-400' },
    { Icon: Moon, color: 'text-indigo-400' },
    { Icon: Diamond, color: 'text-teal-400' }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createFloatingIcons = () => {
      for (let i = 0; i < 30; i++) {
        const iconData = icons[Math.floor(Math.random() * icons.length)];
        const iconElement = document.createElement('div');
        iconElement.className = `absolute ${iconData.color} opacity-20 pointer-events-none`;
        iconElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="m20.2 20.2.707-.707-.707-.707-.707.707.707.707z"/><path d="m3.8 3.8.707-.707-.707-.707-.707.707.707.707z"/><path d="m20.2 3.8-.707-.707-.707.707.707.707.707-.707z"/><path d="m3.8 20.2-.707-.707-.707.707.707.707.707-.707z"/></svg>`;
        
        // Random position
        iconElement.style.left = Math.random() * 100 + '%';
        iconElement.style.top = Math.random() * 100 + '%';
        
        container.appendChild(iconElement);
        iconsRef.current.push(iconElement);
        
        // Complex animation
        const tl = gsap.timeline({ repeat: -1 });
        
        tl.to(iconElement, {
          y: -50 - Math.random() * 100,
          x: -25 + Math.random() * 50,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5,
          duration: 5 + Math.random() * 10,
          ease: "power2.inOut"
        })
        .to(iconElement, {
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 5 + Math.random() * 10,
          ease: "power2.inOut"
        });
        
        // Pulsing effect
        gsap.to(iconElement, {
          opacity: 0.1,
          duration: 2 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 2
        });
      }
    };

    createFloatingIcons();

    return () => {
      iconsRef.current.forEach(icon => icon.remove());
      iconsRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    />
  );
};

export default FloatingIcons;
