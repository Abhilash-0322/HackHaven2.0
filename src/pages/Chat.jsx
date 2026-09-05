import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Trash2, MessageSquare } from 'lucide-react';
import { chatApi, streamChat } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';

export default function Chat() {
  const { updateCalmCoins } = useAuth();
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadThreads(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadThreads = async () => {
    try {
      const data = await chatApi.getThreads();
      setThreads(data.threads || []);
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  const selectThread = async (thread) => {
    setCurrentThread(thread);
    setLoading(true);
    try {
      const data = await chatApi.getThread(thread.id);
      setMessages((data.messages || []).map((m) => ({
        type: m.role === 'user' ? 'user' : 'bot',
        content: m.content,
        timestamp: new Date(m.timestamp || Date.now()),
      })));
    } catch {
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => { setCurrentThread(null); setMessages([]); setError(''); };

  const deleteThread = async (threadId) => {
    try {
      await chatApi.deleteThread(threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      if (currentThread?.id === threadId) startNewChat();
    } catch {
      setError('Failed to delete conversation');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || streaming) return;
    setInput('');
    setError('');
    setMessages((prev) => [...prev, { type: 'user', content, timestamp: new Date() }]);
    setStreaming(true);
    let botContent = '';
    setMessages((prev) => [...prev, { type: 'bot', content: '', streaming: true, timestamp: new Date() }]);

    try {
      await streamChat(content, currentThread?.id || null, async (event) => {
        switch (event.type) {
          case 'thread_id':
            await loadThreads();
            break;
          case 'token':
            botContent += event.data;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.type === 'bot') last.content = botContent;
              return updated;
            });
            break;
          case 'complete':
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.type === 'bot') {
                last.streaming = false;
                last.coins_earned = event.data?.coins_earned;
              }
              return updated;
            });
            if (event.data?.coins_earned > 0) await updateCalmCoins();
            break;
          case 'error':
            setError(event.data || 'An error occurred');
            break;
          default:
            break;
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setMessages((prev) => prev.filter((m) => !m.streaming));
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Conversation" title="Mindful Chat" subtitle="A compassionate space to explore your thoughts and feelings." />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 min-h-[60vh]">
        <aside className="border border-editorial-border rounded-sm bg-cream-light p-4">
          <Button variant="secondary" size="sm" onClick={startNewChat} className="w-full mb-4">
            <Plus className="w-4 h-4" /> New conversation
          </Button>
          {loadingThreads ? <Spinner size="sm" /> : threads.length === 0 ? (
            <p className="font-serif text-sm text-charcoal-muted text-center py-4">No conversations yet</p>
          ) : (
            <ul className="space-y-1 max-h-[50vh] overflow-y-auto">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button type="button" onClick={() => selectThread(thread)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm font-sans truncate flex items-center justify-between group ${
                      currentThread?.id === thread.id ? 'bg-terracotta-muted text-terracotta' : 'hover:bg-cream-dark text-charcoal-light'
                    }`}>
                    <span className="truncate">{thread.title || 'Untitled'}</span>
                    <button type="button" onClick={(ev) => { ev.stopPropagation(); deleteThread(thread.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-terracotta" aria-label="Delete thread">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="border border-editorial-border rounded-sm bg-cream-light flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[400px]">
            {messages.length === 0 && !loading ? (
              <EmptyState icon={MessageSquare} title="Start a conversation" description="Share what's on your mind. I'm here to listen and support you." />
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-sm font-serif text-sm leading-relaxed ${
                    msg.type === 'user' ? 'bg-terracotta text-cream' : 'bg-cream-dark text-charcoal border border-editorial-border'
                  }`}>
                    {msg.content || (msg.streaming ? '...' : '')}
                    {msg.coins_earned > 0 && <Badge variant="success" className="mt-2">+{msg.coins_earned} coins</Badge>}
                  </div>
                </div>
              ))
            )}
            {loading && <Spinner size="sm" />}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="border-t border-editorial-border p-4 flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={streaming} className="editorial-input flex-1" />
            <Button type="submit" disabled={streaming || !input.trim()}><Send className="w-4 h-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
}
