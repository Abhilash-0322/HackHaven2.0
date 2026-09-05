import { ArrowUpRight, Check, Copy, LoaderCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-acid text-ink shadow-[0_0_24px_rgba(215,248,95,.2)]">
        <span className="font-display text-lg font-bold">Z</span>
        <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-ink bg-purple" />
      </div>
      {!compact && <div><p className="font-display text-[15px] font-bold tracking-[.2em] text-white">ZENHEAVEN</p><p className="mono text-[9px] uppercase tracking-[.2em] text-slate-500">Protocol for wellbeing</p></div>}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mono mb-2 text-[10px] uppercase tracking-[.24em] text-acid">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '', glow = false }) {
  return <div className={`card ${glow ? 'card-glow' : ''} ${className}`}>{children}</div>
}

export function Pill({ children, tone = 'default' }) {
  const tones = {
    default: 'border-white/10 bg-white/[.04] text-slate-300',
    green: 'border-acid/20 bg-acid/10 text-acid',
    purple: 'border-purple/20 bg-purple/10 text-purple-200',
    orange: 'border-orange-400/20 bg-orange-400/10 text-orange-200',
  }
  return <span className={`pill ${tones[tone] || tones.default}`}>{children}</span>
}

export function Button({ children, variant = 'primary', className = '', loading = false, ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <LoaderCircle size={15} className="animate-spin" />}
      {children}
    </button>
  )
}

export function CopyAddress({ address = '0x8b4...91e2' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard?.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return <button onClick={copy} className="mono flex items-center gap-2 text-xs text-slate-400 transition hover:text-white">{copied ? <Check size={13} className="text-acid" /> : <Copy size={13} />}{copied ? 'Copied' : address}</button>
}

export function EmptyState({ icon: Icon = Sparkles, title, description, action }) {
  return <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[.015] p-8 text-center"><Icon size={22} className="mb-4 text-purple" /><h3 className="font-display text-lg text-white">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}

export function ArrowLink({ children }) {
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition group-hover:text-acid">{children}<ArrowUpRight size={14} /></span>
}
