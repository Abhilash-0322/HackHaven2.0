import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Phone, Plus, Send, Trash2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chatApi, streamChat } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

const QUICK_PROMPTS = ["I've been feeling anxious lately", 'How can I improve my sleep?', 'I feel overwhelmed with work', 'What are some mindfulness exercises?'];

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const { updateCalmCoins } = useAuth();
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState('');
  const [error, setError] = useState('');
  const [crisisResources, setCrisisResources] = useState(null);
  const messagesEndRef = useRef(null);
  const threadIdRef = useRef(null);

  useEffect(() => { threadIdRef.current = currentThreadId; }, [currentThreadId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try { const data = await chatApi.getThreads(); setThreads(data.threads || []); }
    catch { setError('Failed to load conversations'); }
    finally { setLoadingThreads(false); }
  };

  const loadThreadMessages = async (threadId) => {
    try {
      const data = await chatApi.getThread(threadId);
      setMessages((data.messages || []).map((msg) => ({ id: msg.id, role: msg.is_user ? 'user' : 'assistant', content: msg.content, timestamp: msg.timestamp })));
    } catch { setError('Failed to load messages'); setMessages([]); }
  };

  useEffect(() => { loadThreads(); }, []);
  useEffect(() => { if (currentThreadId) loadThreadMessages(currentThreadId); }, [currentThreadId]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;
    setSending(true); setError(''); setInput(''); setThinking(''); setCrisisResources(null);
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() }, { id: `assistant-${Date.now()}`, role: 'assistant', content: '', timestamp: new Date().toISOString(), streaming: true }]);
    try {
      await streamChat(content, threadIdRef.current, async (event) => {
        switch (event.type) {
          case 'thread_id':
            if (!threadIdRef.current) { setCurrentThreadId(event.data); threadIdRef.current = event.data; await loadThreads(); }
            break;
          case 'thinking': setThinking(event.data); break;
          case 'response_start': setThinking(''); break;
          case 'token':
            setMessages((prev) => { const next = [...prev]; const last = next[next.length - 1]; if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: last.content + event.data }; return next; });
            break;
          case 'complete':
            setMessages((prev) => { const next = [...prev]; const last = next[next.length - 1]; if (last?.role === 'assistant') next[next.length - 1] = { ...last, streaming: false }; return next; });
            if (event.data?.emergency_contact && event.data?.resources) setCrisisResources(event.data.resources);
            if (event.data?.coins_earned > 0) await updateCalmCoins();
            break;
          case 'error': throw new Error(event.data || 'Streaming error');
          default: break;
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setMessages((prev) => prev.filter((msg) => !msg.streaming));
    } finally { setSending(false); setThinking(''); }
  };

  if (loadingThreads) return <Spinner label="Loading AI support..." />;

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-7xl flex-col lg:h-screen lg:flex-row">
      <aside className="w-full border-b border-clinical-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-clinical-100 p-4">
          <div><h2 className="font-semibold text-clinical-900">Conversations</h2><p className="text-xs text-clinical-500">AI mental health support</p></div>
          <Button variant="ghost" size="sm" onClick={() => { setCurrentThreadId(null); setMessages([]); setCrisisResources(null); setError(''); }} aria-label="New conversation"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="max-h-48 overflow-y-auto lg:max-h-[calc(100vh-8rem)]">
          {threads.length === 0 ? <p className="p-4 text-sm text-clinical-500">No conversations yet</p> : threads.map((thread) => (
            <button key={thread.id} type="button" onClick={() => { setCurrentThreadId(thread.id); setCrisisResources(null); setError(''); }} className={`flex w-full items-start justify-between gap-2 border-b border-clinical-50 px-4 py-3 text-left hover:bg-clinical-50 ${currentThreadId === thread.id ? 'bg-accent-50' : ''}`}>
              <div className="min-w-0"><p className="truncate text-sm font-medium text-clinical-900">{thread.title || 'New chat'}</p><p className="truncate text-xs text-clinical-500">{thread.last_message || 'No messages'}</p></div>
              <button type="button" onClick={async (e) => { e.stopPropagation(); if (!window.confirm('Delete this conversation?')) return; try { await chatApi.deleteThread(thread.id); if (currentThreadId === thread.id) { setCurrentThreadId(null); setMessages([]); } await loadThreads(); } catch { setError('Failed to delete conversation'); } }} className="shrink-0 rounded p-1 text-clinical-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete conversation"><Trash2 className="h-3.5 w-3.5" /></button>
            </button>
          ))}
        </div>
      </aside>
      <div className="flex min-h-0 flex-1 flex-col bg-clinical-50">
        <div className="border-b border-clinical-200 bg-white px-4 py-3"><div className="flex items-center gap-2"><Badge variant="agent">AI Agent</Badge><h1 className="font-semibold text-clinical-900">Mental Health Support</h1></div><p className="mt-1 text-sm text-clinical-500">Streaming responses with crisis detection</p></div>
        {crisisResources && <Alert variant="danger" title="Crisis support available" className="m-4"><ul className="mt-2 space-y-1">{crisisResources.map((r) => (<li key={r.contact} className="flex items-center gap-2"><Phone className="h-4 w-4" /><span className="font-medium">{r.name}:</span><a href={`tel:${r.contact}`} className="underline">{r.contact}</a></li>))}</ul></Alert>}
        {error && <Alert variant="danger" className="mx-4 mt-4">{error}</Alert>}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? <EmptyState icon={MessageCircle} title="Start a conversation" description="Share how you're feeling." action={<div className="flex flex-wrap justify-center gap-2">{QUICK_PROMPTS.map((p) => <Button key={p} variant="secondary" size="sm" onClick={() => sendMessage(p)}>{p}</Button>)}</div>} /> : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"><Bot className="h-4 w-4" /></div>}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-accent-600 text-white' : 'border border-clinical-200 bg-white text-clinical-800 shadow-clinical'}`}>
                    <p className="whitespace-pre-wrap">{message.content || (message.streaming ? '…' : '')}</p>
                    <p className={`mt-1 text-xs ${message.role === 'user' ? 'text-accent-100' : 'text-clinical-400'}`}>{formatTime(message.timestamp)}</p>
                  </div>
                  {message.role === 'user' && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700"><User className="h-4 w-4" /></div>}
                </div>
              ))}
              {thinking && <Card className="mx-auto max-w-md border-violet-200 bg-violet-50/50"><div className="flex items-start gap-2 text-sm text-violet-800"><Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" /><span>{thinking}</span></div></Card>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="border-t border-clinical-200 bg-white p-4">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mx-auto flex max-w-3xl gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what's on your mind..." disabled={sending} className="clinical-input flex-1" />
            <Button type="submit" disabled={sending || !input.trim()} loading={sending}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
}
