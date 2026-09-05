import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Coins, MessageCircle, Music, NotebookPen, Shield, Stethoscope } from 'lucide-react';
import calmLogo from '../assets/Calm.png';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  { icon: MessageCircle, title: 'AI Mental Health Support', description: 'Streaming conversational support with crisis detection and evidence-based guidance.' },
  { icon: NotebookPen, title: 'Clinical Journaling', description: 'Mood analysis, guided prompts, and longitudinal insights from your entries.' },
  { icon: Stethoscope, title: 'Therapist Booking', description: 'Browse licensed professionals and schedule sessions with real-time availability.' },
  { icon: BookOpen, title: 'Mood-Based Books', description: 'Personalized reading recommendations aligned with your emotional state.' },
  { icon: Music, title: 'Therapeutic Music', description: 'Curated song recommendations to support relaxation and emotional regulation.' },
  { icon: Coins, title: 'Calm Coins Rewards', description: 'Earn wellness coins through daily activities and redeem for premium features.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-clinical-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={calmLogo} alt="ZenHeaven" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-lg font-semibold text-clinical-900">ZenHeaven</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="clinical-btn-ghost text-sm">Sign in</Link>
            <Link to="/register" className="clinical-btn-primary text-sm">Get started</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
            <Shield className="h-3.5 w-3.5" />Clinical-precision wellness platform
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-clinical-900 sm:text-5xl">Mental health support, designed with clinical precision</h1>
          <p className="mt-6 text-lg text-clinical-500">ZenHeaven combines AI-guided support, structured journaling, therapist access, and personalized wellness content in one secure platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register"><Button size="lg">Start your journey<ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">Sign in</Button></Link>
          </div>
        </div>
      </section>
      <section className="border-t border-clinical-200 bg-clinical-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-clinical-900">Comprehensive wellness toolkit</h2>
            <p className="mt-2 text-clinical-500">Every feature designed for measurable mental health outcomes</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-clinical-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600"><feature.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-clinical-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-clinical-500">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Card className="flex flex-col items-center bg-clinical-900 p-10 text-center text-white sm:flex-row sm:text-left">
            <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-600 sm:mb-0 sm:mr-8"><Brain className="h-8 w-8" /></div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Ready to prioritize your mental health?</h2>
              <p className="mt-2 text-clinical-300">Join ZenHeaven today and access clinical-grade tools for your wellness journey.</p>
            </div>
            <Link to="/register" className="mt-6 sm:mt-0 sm:ml-8"><Button className="bg-white text-clinical-900 hover:bg-clinical-100">Create free account</Button></Link>
          </Card>
        </div>
      </section>
      <footer className="border-t border-clinical-200 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-clinical-400">&copy; {new Date().getFullYear()} ZenHeaven. Not a substitute for emergency medical care.</div>
      </footer>
    </div>
  );
}
