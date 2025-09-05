
import { Link } from 'react-router-dom';
import { Music, Book, MessageCircle, BookOpen, Award, Sparkles, Heart, Brain, Star, Zap, Rocket, Crown, Diamond } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';

// Import animated components
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingIcons from '../components/FloatingIcons';
import AnimatedWaves from '../components/AnimatedWaves';
import OrbitingElements from '../components/OrbitingElements';
import MorphingBlobs from '../components/MorphingBlobs';
import TextRevealAnimation from '../components/TextRevealAnimation';
import AnimatedCounter from '../components/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const moodColors = {
  // Positive moods - Bright, warm, and uplifting colors (More vivid for charts)
  'happy':      { bg: 'bg-yellow-300',    text: 'text-yellow-800',    border: 'border-yellow-400' },     // Sunny yellow - classic happiness
  'excited':    { bg: 'bg-orange-300',    text: 'text-orange-800',    border: 'border-orange-400' },     // Vibrant orange - energetic excitement
  'calm':       { bg: 'bg-sky-300',       text: 'text-sky-800',       border: 'border-sky-400' },        // Soft sky blue - tranquil calm
  'grateful':   { bg: 'bg-emerald-300',   text: 'text-emerald-800',   border: 'border-emerald-400' },    // Rich emerald - abundance & gratitude
  'peaceful':   { bg: 'bg-teal-300',      text: 'text-teal-800',      border: 'border-teal-400' },       // Serene teal - inner peace
  'content':    { bg: 'bg-green-300',     text: 'text-green-800',     border: 'border-green-400' },      // Natural green - contentment
  'hopeful':    { bg: 'bg-cyan-300',      text: 'text-cyan-800',      border: 'border-cyan-400' },       // Bright cyan - optimistic hope
  'inspired':   { bg: 'bg-purple-300',    text: 'text-purple-800',    border: 'border-purple-400' },     // Creative purple - inspiration
  'relaxed':    { bg: 'bg-blue-300',      text: 'text-blue-800',      border: 'border-blue-400' },       // Gentle blue - relaxation
  'confident':  { bg: 'bg-indigo-300',    text: 'text-indigo-800',    border: 'border-indigo-400' },     // Strong indigo - confidence
  'loved':      { bg: 'bg-pink-300',      text: 'text-pink-800',      border: 'border-pink-400' },       // Warm pink - feeling loved
  'energetic':  { bg: 'bg-lime-300',      text: 'text-lime-800',      border: 'border-lime-400' },       // Electric lime - high energy

  // Negative/challenging moods - More visible but still distinct colors
  'anxious':    { bg: 'bg-yellow-200',    text: 'text-yellow-700',    border: 'border-yellow-300' },     // Pale yellow - nervous anxiety
  'sad':        { bg: 'bg-slate-300',     text: 'text-slate-700',     border: 'border-slate-400' },      // Cool slate - melancholy sadness
  'angry':      { bg: 'bg-red-300',       text: 'text-red-800',       border: 'border-red-400' },        // Bold red - fiery anger
  'frustrated': { bg: 'bg-rose-300',      text: 'text-rose-800',      border: 'border-rose-400' },       // Deep rose - frustration
  'tired':      { bg: 'bg-gray-300',      text: 'text-gray-700',      border: 'border-gray-400' },       // Neutral gray - exhaustion
  'overwhelmed':{ bg: 'bg-violet-300',    text: 'text-violet-800',    border: 'border-violet-400' },     // Dark violet - feeling overwhelmed
  'confused':   { bg: 'bg-amber-300',     text: 'text-amber-800',     border: 'border-amber-400' },      // Murky amber - confusion
  'worried':    { bg: 'bg-orange-200',    text: 'text-orange-700',    border: 'border-orange-300' },     // Muted orange - worry
  'stressed':   { bg: 'bg-red-200',       text: 'text-red-700',       border: 'border-red-300' },        // Light red - stress tension
  'lonely':     { bg: 'bg-blue-200',      text: 'text-blue-700',      border: 'border-blue-300' },       // Pale blue - loneliness
  'depressed':  { bg: 'bg-gray-400',      text: 'text-gray-800',      border: 'border-gray-500' },       // Darker gray - depression
  'fearful':    { bg: 'bg-stone-300',     text: 'text-stone-800',     border: 'border-stone-400' },      // Stone gray - fear

  // Default for unknown moods
  'default':    { bg: 'bg-neutral-300',   text: 'text-neutral-800',   border: 'border-neutral-400' }     // Neutral tone for unknown
};


// Function to get mood color classes or default if not found
const getMoodColorClasses = (mood) => {
  const normalizedMood = mood?.toLowerCase();
  return moodColors[normalizedMood] || moodColors.default;
};

const Landing = () => {
  const { isAuthenticated, user, calmCoins } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // GSAP refs
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const heroImageRef = useRef(null);
  const floatingElementsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Add API base URL 
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch insights data when component mounts (only for authenticated users)
  useEffect(() => {
    const fetchInsights = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await authService.authenticatedFetch(`${API_URL}/journal/insights`);
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [isAuthenticated]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      const tl = gsap.timeline();
      
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], { 
        opacity: 0, 
        y: 60 
      });
      gsap.set(heroImageRef.current, { 
        opacity: 0, 
        scale: 0.7, 
        rotation: -10 
      });
      
      // Animate title with stagger effect on words
      const titleWords = titleRef.current?.children;
      if (titleWords) {
        gsap.set(titleWords, { opacity: 0, y: 100, rotation: 5 });
        tl.to(titleWords, {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          stagger: 0.3
        });
      } else {
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "back.out(1.7)"
        });
      }
      
      // Animate subtitle with typewriter effect
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      // Animate buttons
      .to(buttonsRef.current?.children || buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2
      }, "-=0.6")
      // Animate hero image with bounce
      .to(heroImageRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.8,
        ease: "elastic.out(1, 0.6)"
      }, "-=1.2");

      // Continuous floating animation for hero image
      gsap.to(heroImageRef.current, {
        y: -15,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2
      });

      // Floating elements animation
      if (floatingElementsRef.current) {
        const floatingElements = floatingElementsRef.current.children;
        gsap.to(floatingElements, {
          y: -25,
          rotation: 360,
          duration: 4,
          ease: "power2.inOut",
          stagger: 0.3,
          repeat: -1,
          yoyo: true
        });
      }

      // Features scroll animations with magnetic effect
      gsap.fromTo(featuresRef.current?.children || [], {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotation: 5
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Add hover animations for feature cards
      if (featuresRef.current) {
        const featureCards = featuresRef.current.children;
        Array.from(featureCards).forEach((card) => {
          const icon = card.querySelector('.group > div > div > div:first-child');
          
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out"
            });
            gsap.to(icon, {
              scale: 1.2,
              rotation: 10,
              duration: 0.3,
              ease: "power2.out"
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);
  
  const features = [
    {
      title: 'Music Therapy',
      description: 'Discover personalized music recommendations to enhance your mood and promote relaxation.',
      icon: <Music className="h-12 w-12 text-indigo-600" />,
      path: '/musicrecommend',
      gradient: 'from-indigo-400 to-purple-600',
    },
    {
      title: 'Book Recommendations',
      description: 'Find books that inspire, comfort, and support your mental well-being journey.',
      icon: <Book className="h-12 w-12 text-purple-600" />,
      path: '/books',
      gradient: 'from-purple-400 to-pink-600',
    },
    {
      title: 'Mental Health Chat',
      description: 'Connect with our supportive AI chatbot for guidance and mental health resources.',
      icon: <MessageCircle className="h-12 w-12 text-blue-600" />,
      path: '/chat',
      gradient: 'from-blue-400 to-cyan-600',
    },
    {
      title: 'Journaling',
      description: 'Express your thoughts and feelings through guided journaling exercises.',
      icon: <BookOpen className="h-12 w-12 text-teal-600" />,
      path: '/journal',
      gradient: 'from-teal-400 to-emerald-600',
    },
  ];


  return (
    <div className="w-full relative overflow-hidden" ref={heroRef}>
      {/* Animated Background Components */}
      <AnimatedBackground />
      <FloatingIcons />
      <MorphingBlobs />
      
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-bg -z-20"></div>
      
      {/* Multiple Animated Background Layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 animate-gradient-xy"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-128 h-128 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-15 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-10 blur-3xl animate-spin-slow"></div>
        
        {/* Magical particle effects */}
        <div className="absolute top-10 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float neon-glow text-purple-400"></div>
        <div className="absolute top-32 left-20 w-4 h-4 bg-pink-400 rounded-full animate-bounce-slow neon-glow text-pink-400"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-blue-400 rounded-full animate-wiggle neon-glow text-blue-400"></div>
        <div className="absolute bottom-20 right-32 w-5 h-5 bg-teal-400 rounded-full animate-heartbeat neon-glow text-teal-400"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-indigo-400 rounded-full animate-shake neon-glow text-indigo-400"></div>
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-purple-400 rounded-full animate-rainbow neon-glow text-purple-400"></div>
        
        {/* Geometric animated shapes */}
        <div className="absolute top-16 left-1/4 w-16 h-16 border-2 border-purple-400/30 rotate-45 animate-rotate-y"></div>
        <div className="absolute bottom-16 right-1/4 w-12 h-12 border-2 border-pink-400/30 rounded-full animate-rotate-x"></div>
        <div className="absolute top-1/3 right-16 w-10 h-10 border-2 border-blue-400/30 animate-spin-slow"></div>
      </div>

      {/* Orbiting Elements */}
      <OrbitingElements />

      {/* Compact Welcome Section for Authenticated Users */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 animate-slide-in-down">
          <div className="glassmorphism p-4 rounded-2xl shadow-2xl animate-glow magnetic-effect">
            <div className="flex justify-between items-center">
              <div>
                <TextRevealAnimation delay={0.5}>
                  <h1 className="text-lg font-semibold gradient-text-rainbow">
                    Welcome back, {user?.full_name || user?.username}! 🌟
                  </h1>
                </TextRevealAnimation>
              </div>
              <div className="flex items-center glassmorphism px-3 py-1 rounded-full animate-bounce-slow">
                <Award className="h-4 w-4 text-yellow-400 mr-1 animate-rainbow" />
                <span className="font-semibold text-yellow-400 text-sm">
                  <AnimatedCounter end={calmCoins} duration={2} />
                  {' '}Coins
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mood Dashboard */}
      {!loading && insights && insights.total_entries > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 animate-slide-in-up">
          <div className="glassmorphism p-4 rounded-2xl shadow-2xl animate-glow magnetic-effect">
            <div className="flex justify-between items-center mb-3">
              <TextRevealAnimation delay={0.8}>
                <h2 className="text-lg font-semibold gradient-text">Mood Dashboard</h2>
              </TextRevealAnimation>
              <Link 
                to="/journal" 
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-all duration-300 hover:scale-110 animate-wiggle"
              >
                View Journal →
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold gradient-text-rainbow animate-heartbeat">
                  <AnimatedCounter end={insights.total_entries} duration={1.5} delay={1} />
                </span>
                <span className="text-sm text-gray-300 ml-2">entries</span>
              </div>
              
              {insights.top_moods && insights.top_moods.length > 0 && (
                <div className="flex space-x-2">
                  {insights.top_moods.slice(0, 3).map((mood, i) => {
                    const moodClasses = getMoodColorClasses(mood._id);
                    return (
                      <span 
                        key={i} 
                        className={`${moodClasses.bg} ${moodClasses.text} px-2 py-1 rounded-full text-xs font-medium animate-bounce-slow magnetic-effect`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {mood._id}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SPECTACULAR Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* Ultra Enhanced Floating Elements */}
        <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-purple-400/40 animate-float">
            <Sparkles className="h-12 w-12 animate-rainbow neon-glow" />
          </div>
          <div className="absolute top-1/3 right-1/4 text-pink-400/40 animate-bounce-slow">
            <Heart className="h-16 w-16 animate-heartbeat neon-glow" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-blue-400/40 animate-wiggle">
            <Brain className="h-10 w-10 animate-rainbow neon-glow" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-teal-400/40 animate-shake">
            <Star className="h-14 w-14 animate-rainbow neon-glow" />
          </div>
          <div className="absolute top-1/5 right-1/5 text-indigo-400/40 animate-pulse-slow">
            <Zap className="h-8 w-8 animate-rainbow neon-glow" />
          </div>
          <div className="absolute bottom-1/5 left-1/5 text-emerald-400/40 animate-spin-slow">
            <Rocket className="h-12 w-12 animate-rainbow neon-glow" />
          </div>
          <div className="absolute top-2/3 left-1/6 text-purple-400/40 animate-rotate-y">
            <Crown className="h-10 w-10 animate-rainbow neon-glow" />
          </div>
          <div className="absolute top-1/6 left-2/3 text-pink-400/40 animate-rotate-x">
            <Diamond className="h-8 w-8 animate-rainbow neon-glow" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
              <div ref={titleRef} className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl animate-pulse-slow"></div>
                <h1 className="relative text-6xl lg:text-7xl xl:text-9xl font-bold leading-tight">
                  <div className="gradient-text-rainbow animate-heartbeat text-shadow-glow glitch" data-text="ZenHeaven">
                    ZenHeaven
                  </div>
                </h1>
                <div className="mt-4 relative">
                  <TextRevealAnimation delay={1.5}>
                    <div className="text-4xl lg:text-5xl font-light text-gray-300 animate-float">
                      Find Your Inner
                    </div>
                  </TextRevealAnimation>
                  <TextRevealAnimation delay={2}>
                    <div className="text-4xl lg:text-5xl font-bold gradient-text animate-bounce-slow text-shadow-glow">
                      Peace ✨
                    </div>
                  </TextRevealAnimation>
                </div>
              </div>
              
              <div ref={subtitleRef}>
                <TextRevealAnimation delay={2.5}>
                  <p className="mt-8 text-xl lg:text-2xl text-gray-300 max-w-2xl animate-float">
                    A <span className="gradient-text font-semibold">magical sanctuary</span> for your mental well-being. 
                    Experience <span className="gradient-text-rainbow font-semibold">personalized mindfulness</span>, 
                    guided journaling, and <span className="gradient-text font-semibold">holistic wellness</span> tools. ✨🌟
                  </p>
                </TextRevealAnimation>
              </div>
              
              <div ref={buttonsRef} className="mt-12 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/journal"
                      className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 animate-glow magnetic-effect neon-glow overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 animate-rainbow" />
                        Continue Journey
                        <Heart className="ml-2 h-5 w-5 animate-heartbeat" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
                    </Link>
                    <Link
                      to="/chat"
                      className="group px-8 py-4 glassmorphism text-gray-200 font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 magnetic-effect animate-glow"
                    >
                      <span className="flex items-center">
                        <MessageCircle className="mr-2 h-5 w-5 animate-wiggle" />
                        Get Support
                        <Zap className="ml-2 h-5 w-5 animate-shake" />
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 animate-glow magnetic-effect neon-glow overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <Rocket className="mr-2 h-5 w-5 animate-rainbow" />
                        Start Your Journey
                        <Star className="ml-2 h-5 w-5 animate-heartbeat" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
                    </Link>
                    <Link
                      to="/login"
                      className="group px-8 py-4 glassmorphism text-gray-200 font-semibold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 magnetic-effect animate-glow"
                    >
                      <span className="flex items-center">
                        <Crown className="mr-2 h-5 w-5 animate-wiggle" />
                        Sign In
                        <Diamond className="ml-2 h-5 w-5 animate-shake" />
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0 lg:w-1/2">
              <div ref={heroImageRef} className="relative">
                <div className="relative z-10">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-1 animate-glow magnetic-effect neon-glow">
                    <img
                      src="https://nouveaumedics.com/wp-content/uploads/2020/07/mental-health.jpg"
                      alt="ZenHeaven mental wellness"
                      className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-110 animate-rainbow"
                    />
                  </div>
                </div>
                
                {/* Ultra Enhanced decorative elements */}
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30 blur-2xl animate-float neon-glow"></div>
                <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-30 blur-2xl animate-bounce-slow neon-glow"></div>
                <div className="absolute top-1/2 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full opacity-25 blur-xl animate-wiggle neon-glow"></div>
                <div className="absolute bottom-1/4 -left-8 w-28 h-28 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-25 blur-xl animate-heartbeat neon-glow"></div>
                <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 blur-lg animate-rainbow neon-glow"></div>
                <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 blur-lg animate-spin-slow neon-glow"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="flex flex-col items-center text-gray-300 animate-glow">
            <TextRevealAnimation delay={3}>
              <span className="text-sm mb-2 gradient-text animate-wiggle">Scroll to explore ✨</span>
            </TextRevealAnimation>
            <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center neon-glow animate-rainbow">
              <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-bounce-slow neon-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 relative overflow-hidden">
        <AnimatedWaves />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-pink-900/10 animate-gradient-y"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <TextRevealAnimation>
              <h2 className="text-5xl lg:text-7xl font-bold gradient-text-rainbow mb-6 animate-heartbeat text-shadow-glow">
                ✨ Mindful Features ✨
              </h2>
            </TextRevealAnimation>
            <TextRevealAnimation delay={0.5}>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-float">
                <span className="gradient-text font-semibold">Comprehensive tools</span> designed to support your 
                <span className="gradient-text-rainbow font-semibold"> mental health journey</span>, 
                all in one <span className="gradient-text font-semibold">peaceful digital space</span>. 🌟💫
              </p>
            </TextRevealAnimation>
          </div>

          <div ref={featuresRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group relative animate-zoom-in magnetic-effect"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative h-full p-8 glassmorphism rounded-3xl shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-2xl overflow-hidden animate-glow neon-glow">
                  {/* Ultra Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl animate-gradient-xy`}></div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-30 animate-rainbow blur-sm"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 transform group-hover:scale-125 transition-transform duration-300 animate-rainbow">
                      <div className="p-4 rounded-2xl glassmorphism inline-block animate-glow neon-glow">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold gradient-text mb-4 group-hover:gradient-text-rainbow transition-all duration-300 animate-wiggle">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed animate-float">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Ultra Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce-slow">
                    <div className="p-2 rounded-full glassmorphism animate-glow neon-glow">
                      <svg className="w-6 h-6 gradient-text animate-rainbow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Particle effects on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce-slow neon-glow"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full animate-wiggle neon-glow"></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-shake neon-glow"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SPECTACULAR Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                width: Math.random() * 20 + 10 + 'px',
                height: Math.random() * 20 + 10 + 'px',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: (Math.random() * 10 + 5) + 's'
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TextRevealAnimation>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-heartbeat text-shadow-glow">
              ✨ Begin Your Wellness Journey Today ✨
            </h2>
          </TextRevealAnimation>
          <TextRevealAnimation delay={0.5}>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-float">
              Take the first step toward <span className="font-bold text-yellow-300 animate-wiggle">better mental health</span> with our 
              suite of <span className="font-bold text-pink-300 animate-bounce-slow">mindful tools</span> 
              designed to support your <span className="font-bold text-blue-300 animate-shake">unique journey</span>. 🌟💫
            </p>
          </TextRevealAnimation>
          <div className="animate-zoom-in" style={{ animationDelay: '1s' }}>
            <Link
              to={isAuthenticated ? "/journal" : "/register"}
              className="inline-flex items-center px-12 py-6 bg-white text-purple-600 font-bold rounded-2xl shadow-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 text-xl magnetic-effect animate-glow neon-glow group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="mr-3 h-6 w-6 animate-rainbow" />
                {isAuthenticated ? "Continue Journey" : "Get Started"}
                <Sparkles className="ml-3 h-6 w-6 animate-heartbeat" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;