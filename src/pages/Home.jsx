import { Link } from 'react-router-dom';
import {
  BookOpen, MessageSquare, Music2, NotebookPen, UserRound, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import QuoteBlock from '../components/ui/QuoteBlock';
import Badge from '../components/ui/Badge';

const FEATURES = [
  { number: '01', title: 'Mindful Conversation', description: 'Speak with our AI companion trained in compassionate mental health support.', icon: MessageSquare, path: '/chat' },
  { number: '02', title: 'Reflective Journal', description: 'Capture your thoughts, track moods, and discover patterns in your inner life.', icon: NotebookPen, path: '/journal' },
  { number: '03', title: 'Curated Reading', description: 'Books matched to your emotional landscape and personal growth journey.', icon: BookOpen, path: '/books' },
  { number: '04', title: 'Healing Music', description: 'Discover melodies that resonate with your mood and soothe your spirit.', icon: Music2, path: '/music' },
  { number: '05', title: 'Expert Care', description: 'Connect with licensed therapists for professional guidance when you need it.', icon: UserRound, path: '/therapists' },
];

export default function Home() {
  const { isAuthenticated, calmCoins } = useAuth();

  return (
    <div className="bg-cream">
      <section className="editorial-section border-b border-editorial-border">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <Badge className="mb-6">Editorial Wellness</Badge>
            <h1 className="editorial-headline text-balance mb-6">
              A sanctuary for<br />
              <span className="text-terracotta italic font-serif">mind & spirit</span>
            </h1>
            <p className="editorial-subhead max-w-xl mb-8">
              ZenHeaven is your personal editorial on wellness — blending AI companionship,
              reflective journaling, and curated resources into one thoughtful experience.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to="/chat"><Button>Continue your journey <ArrowRight className="w-4 h-4" /></Button></Link>
              ) : (
                <>
                  <Link to="/register"><Button>Begin your journey</Button></Link>
                  <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
                </>
              )}
            </div>
            {isAuthenticated && (
              <p className="mt-6 font-sans text-sm text-charcoal-muted">
                You have <span className="text-terracotta font-medium">{calmCoins}</span> calm coins
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="editorial-section bg-cream-dark/30">
        <div className="editorial-container-narrow">
          <QuoteBlock
            quote="The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives."
            attribution="William James"
          />
        </div>
      </section>

      <section className="editorial-section">
        <div className="editorial-container">
          <p className="editorial-section-number">What we offer</p>
          <h2 className="font-display text-3xl md:text-4xl mb-12">Five pillars of wellness</h2>
          <div className="space-y-0">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.number} className="grid md:grid-cols-[80px_1fr_auto] gap-6 py-10 border-t border-editorial-border items-start">
                  <span className="font-display text-4xl text-terracotta/40">{feature.number}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-terracotta" />
                      <h3 className="font-display text-xl">{feature.title}</h3>
                    </div>
                    <p className="font-serif text-charcoal-light leading-relaxed max-w-lg">{feature.description}</p>
                  </div>
                  {isAuthenticated && (
                    <Link to={feature.path} className="editorial-link font-sans text-sm self-center">Explore →</Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="editorial-section bg-editorial-ink text-cream">
          <div className="editorial-container text-center">
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Begin writing your story</h2>
            <p className="font-serif text-cream/70 max-w-md mx-auto mb-8">
              Join ZenHeaven today and earn calm coins as you nurture your mental wellness.
            </p>
            <Link to="/register">
              <Button className="bg-terracotta hover:bg-terracotta-light text-cream">Create your account</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
