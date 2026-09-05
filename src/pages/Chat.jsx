import { Bot, ChevronRight, CircleHelp, LoaderCircle, MessageCircle, MoreHorizontal, Plus, Send, Sparkles, Trash2, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api, formatError } from '../lib/api'
import { Button, Card, Pill, SectionHeading } from '../components/ui'

const fallbackThreads = [{ id: 'welcome', title: 'A moment to arrive', message_count: 2, last_message: 'Let’s take this one breath at a time.' }]
const fallbackMessages = [{ id: 'intro', is_user: false, content: 'Hey, I’m CalmBot. This is a quiet, judgment-free space. What feels most present for you today?', timestamp: new Date().toISOString() }]

export default function Chat() {
  const [threads, setThreads] = useState(fallbackThreads)
  const [threadId, setThreadId] = useState(null)
  const [messages, setMessages] = useState(fallbackMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => { api.getThreads().then((data) => setThreads(data.threads || [])).catch(() => {}) }, [])
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])
  const selectThread = async (id) => {
    setThreadId(id)
    try {
      const data = await api.getThread(id)
      setMessages(data.messages || [])
    } catch {
      if (id === 'welcome') setMessages(fallbackMessages)
    }
  }
  const send = async (event) => {
    event?.preventDefault()
    const message = input.trim()
    if (!message || sending) return
    setInput('')
    setSending(true)
    setThinking('Connecting to your calm space…')
    setMessages((current) => [...current, { id: `user-${Date.now()}`, is_user: true, content: message, timestamp: new Date().toISOString() }])
    const botId = `bot-${Date.now()}`
    setMessages((current) => [...current, { id: botId, is_user: false, content: '', timestamp: new Date().toISOString() }])
    try {
      await api.streamChat({ message, thread_id: threadId }, (eventData) => {
        if (eventData.type === 'thread_id') setThreadId(eventData.data)
        if (eventData.type === 'thinking') setThinking(eventData.data)
        if (eventData.type === 'response_start') setThinking('')
        if (eventData.type === 'token') setMessages((current) => current.map((item) => item.id === botId ? { ...item, content: item.content + eventData.data } : item))
        if (eventData.type === 'complete') {
          setThinking('')
          if (eventData.data?.thread_id) setThreadId(eventData.data.thread_id)
          setThreads((current) => current.some((thread) => thread.id === eventData.data.thread_id) ? current : [{ id: eventData.data.thread_id, title: message.slice(0, 32), message_count: 2 }, ...current])
        }
      })
    } catch (error) {
      const offline = "I’m here with you. The connection is resting right now, but you can still take one slow breath and name the feeling that’s asking for attention."
      setMessages((current) => current.map((item) => item.id === botId ? { ...item, content: offline } : item))
      setThinking(formatError(error))
      setTimeout(() => setThinking(''), 3000)
    } finally {
      setSending(false)
    }
  }

  return <div className="space-y-7"><SectionHeading eyebrow="Private support · CalmBot" title="A place to be heard." description="A thoughtful AI companion for the moments that need a little more room." action={<Pill tone="green"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-acid" /> ONLINE</Pill>} /><div className="grid min-h-[650px] gap-5 xl:grid-cols-[265px_1fr]"><Card className="hidden p-3 xl:block"><div className="flex items-center justify-between px-2 py-2"><p className="mono text-[10px] uppercase tracking-[.18em] text-slate-500">Conversations</p><button onClick={() => { setThreadId(null); setMessages(fallbackMessages) }} className="icon-button h-7 w-7"><Plus size={14} /></button></div><div className="mt-3 space-y-1">{threads.map((thread) => <button key={thread.id} onClick={() => selectThread(thread.id)} className={`w-full rounded-xl p-3 text-left transition ${threadId === thread.id ? 'bg-white/[.08]' : 'hover:bg-white/[.04]'}`}><div className="flex items-center gap-2"><MessageCircle size={14} className={threadId === thread.id ? 'text-acid' : 'text-slate-600'} /><p className="truncate text-xs font-medium text-slate-300">{thread.title || 'Untitled reflection'}</p></div><p className="mt-2 truncate pl-6 text-[10px] text-slate-600">{thread.last_message || 'A new conversation'}</p></button>)}</div><div className="mt-auto border-t border-white/[.06] px-2 pt-4"><p className="flex items-center gap-2 text-[10px] leading-5 text-slate-600"><CircleHelp size={13} /> Your chats are private to you.</p></div></Card><Card className="flex min-h-[650px] flex-col overflow-hidden"><div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple/15 text-purple-200"><Bot size={18} /></div><div><p className="text-sm font-semibold text-white">CalmBot <span className="ml-1 text-[10px] font-normal text-slate-600">/ your companion</span></p><p className="mono mt-1 text-[9px] text-acid">AVAILABLE NOW</p></div></div><div className="flex items-center gap-2"><button className="icon-button"><Trash2 size={15} /></button><button className="icon-button"><MoreHorizontal size={16} /></button></div></div><div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-8">{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.is_user ? 'justify-end' : 'justify-start'}`}><div className={`flex max-w-[78%] gap-3 ${message.is_user ? 'flex-row-reverse' : ''}`}><div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${message.is_user ? 'bg-acid text-ink' : 'bg-purple/15 text-purple-200'}`}>{message.is_user ? <UserRound size={14} /> : <Sparkles size={14} />}</div><div><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.is_user ? 'rounded-tr-sm bg-acid text-ink' : 'rounded-tl-sm bg-white/[.055] text-slate-300'}`}>{message.content || (sending && <LoaderCircle size={15} className="animate-spin text-purple" />)}</div><p className={`mono mt-2 text-[9px] text-slate-700 ${message.is_user ? 'text-right' : ''}`}>{message.is_user ? 'YOU' : 'CALMBOT'} · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div></div>)}{thinking && <div className="flex items-center gap-2 text-xs text-slate-600"><LoaderCircle size={13} className="animate-spin text-purple" /> {thinking}</div>}<div ref={scrollRef} /></div><div className="border-t border-white/[.07] p-4 sm:p-5"><form onSubmit={send} className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-2 pl-4 focus-within:border-purple/40"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(event) } }} rows="1" placeholder="Share what’s on your mind…" className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-600" /><Button type="submit" className="h-10 w-10 shrink-0 justify-center p-0" disabled={!input.trim() || sending}><Send size={15} /></Button></form><p className="mono mt-3 text-center text-[9px] text-slate-700">CalmBot is not a replacement for professional care · Press Enter to send</p></div></Card></div></div>
}
