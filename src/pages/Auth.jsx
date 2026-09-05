import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { Button, Logo } from '../components/ui'
import { formatError } from '../lib/api'

function OrbitalArt() {
  return <div className="relative hidden overflow-hidden bg-[#101020] lg:block lg:w-[46%]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(157,123,255,.24),transparent_33%),radial-gradient(circle_at_20%_80%,rgba(215,248,95,.08),transparent_24%)]" /><div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple/20 shadow-[0_0_100px_rgba(157,123,255,.12)]" /><div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-acid/30" /><div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center rounded-[34px] bg-gradient-to-br from-acid to-[#637735] shadow-[0_0_70px_rgba(215,248,95,.32)]"><div className="-rotate-45 text-6xl font-bold text-ink">Z</div></div><div className="absolute left-16 top-20 mono text-[10px] uppercase tracking-[.24em] text-slate-600">01 / CALM CAPITAL</div><div className="absolute bottom-16 left-16 max-w-xs"><p className="font-display text-3xl leading-tight text-white">A quieter way to<br /><span className="text-acid">grow into yourself.</span></p><p className="mt-4 text-sm leading-6 text-slate-500">A private protocol for the daily practices that make a life feel more like yours.</p></div></div>
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const isRegister = location.pathname === '/register'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' })

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await (isRegister ? register(form) : login({ username: form.username, password: form.password }))
      navigate('/dashboard')
    } catch (requestError) {
      setError(formatError(requestError))
    } finally {
      setLoading(false)
    }
  }

  return <div className="flex min-h-screen bg-ink"><OrbitalArt /><main className="flex flex-1 flex-col px-6 py-7 sm:px-12 lg:px-20"><div className="flex items-center justify-between"><Logo /><Link to="/" className="icon-button lg:hidden"><ArrowLeft size={16} /></Link></div><div className="m-auto w-full max-w-[420px] py-14"><div className="mb-10"><div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.04] text-acid"><Sparkles size={18} /></div><p className="mono mb-3 text-[10px] uppercase tracking-[.24em] text-purple">Your sanctuary awaits</p><h1 className="font-display text-4xl font-semibold tracking-tight text-white">{isRegister ? 'Begin your ritual.' : 'Welcome back.'}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{isRegister ? 'Create a private space for your wellbeing journey.' : 'Pick up where your calm left off.'}</p></div><form onSubmit={submit} className="space-y-4">{isRegister && <Field icon={UserRound} label="Full name" name="full_name" value={form.full_name} onChange={update} placeholder="How should we call you?" />}{isRegister && <Field icon={Mail} label="Email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" />}<Field icon={UserRound} label="Username" name="username" value={form.username} onChange={update} placeholder="your calm handle" /><div className="relative"><Field icon={LockKeyhole} label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder={isRegister ? 'At least 6 characters' : 'Enter your password'} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[35px] text-slate-600 hover:text-white">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{error && <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-200">{error}</div>}<Button type="submit" loading={loading} className="mt-3 w-full justify-center">{isRegister ? 'Create your space' : 'Enter ZenHeaven'}<ArrowRight size={15} /></Button></form><p className="mt-7 text-center text-xs text-slate-500">{isRegister ? 'Already have a sanctuary?' : 'New to ZenHeaven?'} <Link to={isRegister ? '/login' : '/register'} className="ml-1 font-semibold text-white hover:text-acid">{isRegister ? 'Sign in' : 'Create account'}</Link></p><p className="mono mt-10 text-center text-[9px] uppercase tracking-[.2em] text-slate-700">Encrypted · private · yours</p></div></main></div>
}

function Field({ icon: Icon, label, ...props }) {
  return <label className="block"><span className="mono mb-2 block text-[9px] uppercase tracking-[.18em] text-slate-500">{label}</span><div className="relative"><Icon size={16} className="absolute left-4 top-3.5 text-slate-600" /><input className="input pl-11" required {...props} /></div></label>
}
