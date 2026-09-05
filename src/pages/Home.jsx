import { ArrowRight, BookOpen, Bot, Check, Coins, Headphones, HeartHandshake, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: MessageCircle, title: 'Talk it out', text: 'A private, always-on space to name what is going on and find a next step.' },
  { icon: BookOpen, title: 'Make room', text: 'Journal freely, spot patterns, and turn a noisy day into something you can hold.' },
  { icon: Headphones, title: 'Change the atmosphere', text: 'Discover music and books that meet your mood where it is.' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="telegram-grid overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-400" /> your calm space is open</div>
            <h1 className="max-w-3xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-slate-900 sm:text-6xl lg:text-[5.25rem]">A softer place<br /><span className="text-brand-500">to be human.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">ZenHeaven brings a little more clarity to the hard days — with a thoughtful AI companion, guided reflection, and support that feels close.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-600">{isAuthenticated ? 'Go to your space' : 'Start for free'} <ArrowRight className="h-4 w-4" /></Link>
              <Link to={isAuthenticated ? '/chat' : '/login'} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50">{isAuthenticated ? 'Open a check-in' : 'I already have an account'}</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400"><span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> private by default</span><span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-500" /> free to begin</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="telegram-dots absolute -right-5 -top-6 h-28 w-28 rounded-3xl opacity-60" />
            <div className="relative rounded-[2rem] border border-sky-100 bg-white p-3 shadow-[0_24px_70px_-28px_rgba(34,158,217,0.5)]">
              <div className="overflow-hidden rounded-[1.45rem] bg-[#eaf6fc]">
                <div className="flex items-center justify-between bg-brand-500 px-5 py-4 text-white"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><Bot className="h-5 w-5" /></div><div><p className="text-sm font-bold">Zen</p><p className="text-[11px] text-sky-100">always here to listen</p></div></div><span className="h-2 w-2 rounded-full bg-emerald-300" /></div>
                <div className="telegram-dots min-h-[370px] space-y-4 p-5">
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">Hey, I&apos;m glad you&apos;re here. What feels heavy today?</div>
                  <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-3 text-sm leading-6 text-white shadow-sm">I&apos;ve been carrying a lot and I don&apos;t know where to start.</div>
                  <div className="max-w-[86%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-sm">You don&apos;t need the perfect words. We can start with one small piece, together.</div>
                  <div className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 text-xs text-brand-600 shadow-sm"><Sparkles className="h-4 w-4" /> finding a gentle next step...</div>
                </div>
                <div className="flex items-center gap-2 border-t border-sky-100 bg-white p-3"><span className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-400">Share what&apos;s on your mind...</span><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white"><ArrowRight className="h-4 w-4" /></div></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-8 hidden items-center gap-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-card sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500"><Coins className="h-4 w-4" /></div><div><p className="text-xs font-bold text-slate-700">Small steps count</p><p className="text-[11px] text-slate-400">earn Calm Coins as you go</p></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white/70">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">One place, many ways forward</p><h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Support for the moment you&apos;re in.</h2><p className="mt-3 text-slate-500">Some days you want to talk. Some days you want quiet. ZenHeaven adapts.</p></div>
          <div className="grid gap-5 md:grid-cols-3">{features.map((feature) => {
            const FeatureIcon = feature.icon;
            return <div key={feature.title} className="group rounded-2xl border border-sky-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-card"><div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white"><FeatureIcon className="h-5 w-5" /></div><h3 className="text-lg font-bold text-slate-900">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p><Link to={isAuthenticated ? '/dashboard' : '/register'} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Explore <ArrowRight className="h-3.5 w-3.5" /></Link></div>;
          })}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[90rem] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500"><HeartHandshake className="h-6 w-6" /></div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Built with care</p><h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The goal isn&apos;t to fix you.</h2><p className="mt-4 max-w-lg text-base leading-7 text-slate-500">It&apos;s to help you hear yourself a little more clearly. Start wherever you are, move at your own pace, and bring the whole story.</p></div>
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-card sm:p-9"><div className="mb-8 flex items-center justify-between"><span className="text-sm font-semibold text-sky-300">your toolkit</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">always available</span></div><div className="space-y-4"><div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"><Bot className="h-5 w-5 text-sky-300" /><span className="text-sm font-medium">An AI companion that listens</span><Check className="ml-auto h-4 w-4 text-emerald-300" /></div><div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"><BookOpen className="h-5 w-5 text-indigo-300" /><span className="text-sm font-medium">Reflection that becomes insight</span><Check className="ml-auto h-4 w-4 text-emerald-300" /></div><div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"><HeartHandshake className="h-5 w-5 text-rose-300" /><span className="text-sm font-medium">A bridge to real support</span><Check className="ml-auto h-4 w-4 text-emerald-300" /></div></div></div>
      </section>
    </div>
  );
}
