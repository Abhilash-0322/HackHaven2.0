import { ArrowDownLeft, ArrowUpRight, ChevronRight, CircleDollarSign, Clock3, HeartPulse, LineChart, LockKeyhole, MessageCircle, Plus, Sparkles, TrendingUp, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Card, Pill, SectionHeading } from '../components/ui'

const activities = [
  { icon: MessageCircle, title: 'CalmBot session', meta: 'Today · 09:42 AM', amount: '+5 ZEN', positive: true },
  { icon: HeartPulse, title: 'Journal reflection', meta: 'Yesterday · 08:16 PM', amount: '+10 ZEN', positive: true },
  { icon: LockKeyhole, title: 'Stake deposit', meta: 'Aug 28 · 11:03 AM', amount: '+0.32 ETH', positive: true },
]

const chart = [34, 39, 37, 46, 42, 51, 49, 58, 53, 65, 62, 76, 73, 81, 78, 91, 88, 94, 90, 98]

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.full_name?.split(' ')[0] || user?.username || 'Abhilash'
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Saturday, September 05, 2026" title={`Good evening, ${name}.`} description="Your calm capital is growing quietly. Here’s your sanctuary at a glance." action={<button className="icon-button hidden sm:flex"><Plus size={17} /></button>} />

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="relative min-h-[300px] overflow-hidden bg-gradient-to-br from-[#1d1941] via-[#16152c] to-[#11121c] p-6 sm:p-8" glow>
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-purple/15 blur-3xl" />
          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-acid/10 blur-3xl" />
          <div className="relative flex items-start justify-between"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-purple-200/70">Total sanctuary balance</p><div className="mt-5 flex items-end gap-3"><span className="font-display text-5xl font-semibold tracking-tight text-white">$4,280.64</span><span className="mb-2 text-sm font-medium text-acid">+8.42%</span></div><p className="mono mt-3 text-[11px] text-slate-500">≈ 2.26 ETH · +$332.18 this cycle</p></div><div className="rounded-xl border border-white/10 bg-white/[.06] p-3 text-acid"><WalletCards size={20} strokeWidth={1.5} /></div></div>
          <div className="relative mt-11 grid grid-cols-3 gap-4 border-t border-white/10 pt-5"><div><p className="mono text-[10px] text-slate-500">STAKED</p><p className="mt-1 text-sm font-semibold text-white">2.10 ETH</p></div><div><p className="mono text-[10px] text-slate-500">EARNED</p><p className="mt-1 text-sm font-semibold text-white">0.16 ETH</p></div><div><p className="mono text-[10px] text-slate-500">APY</p><p className="mt-1 text-sm font-semibold text-acid">7.24%</p></div></div>
        </Card>
        <Card className="relative overflow-hidden p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="mono text-[10px] uppercase tracking-[.2em] text-slate-500">Current protocol health</p><p className="mt-4 font-display text-3xl font-semibold text-white">Excellent</p></div><div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-acid/20 bg-acid/10"><HeartPulse size={21} className="text-acid" /><span className="absolute inset-1 rounded-full border border-acid/15" /></div></div><div className="mt-7 h-2 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full w-[91%] rounded-full bg-gradient-to-r from-purple to-acid" /></div><div className="mt-3 flex justify-between text-[11px] text-slate-500"><span>91 / 100 stability</span><span className="text-acid">+2.4% this week</span></div><div className="mt-8 flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3"><Sparkles size={16} className="text-purple" /><p className="text-xs leading-5 text-slate-400">Your wellbeing streak is <span className="font-semibold text-white">12 days</span>. Keep the rhythm.</p></div></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card className="p-6 sm:p-7"><div className="flex items-start justify-between"><div><div className="flex items-center gap-3"><h2 className="font-display text-lg font-semibold text-white">Sanctuary growth</h2><Pill tone="green">LIVE</Pill></div><p className="mt-1 text-xs text-slate-500">Your calm capital · Last 30 days</p></div><button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white">30D <ChevronRight size={13} /></button></div><div className="mt-8 flex h-[190px] items-end gap-1.5 sm:gap-2">{chart.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div style={{ height: `${height}%` }} className={`w-full rounded-t-sm transition-all group-hover:bg-acid ${index > 14 ? 'bg-purple' : 'bg-purple/45'}`} /></div>)}</div><div className="mt-4 flex justify-between border-t border-white/[.06] pt-3 mono text-[10px] text-slate-600"><span>AUG 07</span><span>AUG 14</span><span>AUG 21</span><span>SEP 05</span></div></Card>
        <Card className="p-6 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-display text-lg font-semibold text-white">Quick actions</h2><p className="mt-1 text-xs text-slate-500">Small steps compound.</p></div><CircleDollarSign size={21} className="text-acid" /></div><div className="mt-6 grid grid-cols-2 gap-3">{[{ to: '/chat', label: 'Talk to CalmBot', icon: MessageCircle, tone: 'purple' }, { to: '/journal', label: 'Write reflection', icon: HeartPulse, tone: 'green' }, { to: '/books', label: 'Find a read', icon: LineChart, tone: 'orange' }, { to: '/music', label: 'Settle in', icon: TrendingUp, tone: 'purple' }].map(({ to, label, icon: Icon, tone }) => <Link key={to} to={to} className="group rounded-xl border border-white/[.07] bg-white/[.025] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.05]"><div className={`mb-5 flex h-8 w-8 items-center justify-center rounded-lg ${tone === 'green' ? 'bg-acid/10 text-acid' : tone === 'orange' ? 'bg-orange-400/10 text-orange-300' : 'bg-purple/10 text-purple-300'}`}><Icon size={16} /></div><span className="text-xs font-medium text-slate-300 group-hover:text-white">{label}</span><ArrowUpRight size={13} className="mt-3 text-slate-600 transition group-hover:text-acid" /></Link>)}</div></Card>
      </div>

      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-white/[.07] px-6 py-5"><div><h2 className="font-display text-lg font-semibold text-white">Recent activity</h2><p className="mt-1 text-xs text-slate-500">A quiet ledger of your progress.</p></div><Link to="/coins" className="flex items-center gap-1 text-xs text-slate-400 hover:text-white">View ledger <ChevronRight size={14} /></Link></div><div>{activities.map(({ icon: Icon, title, meta, amount, positive }) => <div key={title} className="flex items-center gap-4 border-b border-white/[.05] px-6 py-4 last:border-0"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[.05] text-slate-400"><Icon size={16} /></div><div className="flex-1"><p className="text-sm font-medium text-slate-200">{title}</p><p className="mono mt-1 text-[10px] text-slate-600">{meta}</p></div><span className={`mono text-xs ${positive ? 'text-acid' : 'text-slate-400'}`}>{amount}</span><ArrowDownLeft size={14} className="text-slate-700" /></div>)}</div></Card>
      <div className="flex items-center justify-between rounded-2xl border border-purple/15 bg-purple/[.06] px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><Clock3 size={17} className="text-purple" /><p className="text-xs text-slate-300">Next personal check-in <span className="ml-1 font-semibold text-white">Tomorrow at 9:00 AM</span></p></div><Link to="/journal" className="hidden text-xs font-semibold text-purple-200 hover:text-white sm:block">Prepare reflection →</Link></div>
    </div>
  )
}
