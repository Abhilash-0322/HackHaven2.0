import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Loader2,
  MessageCircle,
  Phone,
  Plus,
  Send,
  Trash2,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { API_BASE_URL } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

const QUICK_PROMPTS = [
  "I've been feeling anxious lately",
  'How can I improve my sleep?',
  'I feel overwhelmed with work',
  'What are some mindfulness exercises?',
];

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/mental-health/threads`);
      const data = await response.json();
      setThreads(data.threads || []);
    } catch {
      setError('Failed to load conversations');
    } finally {
      setLoadingThreads(false);
    }
  };

  const loadThreadMessages = async (threadId) => {
    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/mental-health/threads/${threadId}`);
      const data = await response.json();
      setMessages(
        (data.messages || []).map((msg) => ({
          id: msg.id,
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp,
        }))
      );
    } catch {
      setError('Failed to load messages');
      setMessages([]);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (currentThreadId) {
      loadThreadMessages(currentThreadId);
    }
  }, [currentThreadId]);

  const startNewThread = () => {
    setCurrentThreadId(null);
    setMessages([]);
    setCrisisResources(null);
    setError('');
  };

  const selectThread = (threadId) => {
    setCurrentThreadId(threadId);
    setCrisisResources(null);
    setError('');
  };

  const deleteThread = async (threadId, event) => {
    event.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await authService.authenticatedFetch(`${API_BASE_URL}/mental-health/threads/${threadId}`, {
        method: 'DELETE',
      });
      if (currentThreadId === threadId) {
        startNewThread();
      }
      await loadThreads();
    } catch {
      setError('Failed to delete conversation');
    }
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;

    setSending(true);
    setError('');
    setInput('');
    setThinking('');
    setCrisisResources(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const assistantPlaceholder = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await authService.authenticatedFetch(`${API_BASE_URL}/mental-health/chat/stream`, {
        method: 'POST',
        body: JSON.stringify({
          message: content,
          thread_id: currentThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
          if (!chunk.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(chunk.slice(6));
            switch (event.type) {
              case 'thread_id':
                if (!currentThreadId) {
                  await loadThreads();
                  setCurrentThreadId(event.data);
                }
                break;
              case 'thinking':
                setThinking(event.data);
                break;
              case 'response_start':
                setThinking('');
                break;
              case 'token':
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === 'assistant') {
                    next[next.length - 1] = { ...last, content: last.content + event.data };
                  }
                  return next;
                });
                break;
              case 'complete':
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === 'assistant') {
                    next[next.length - 1] = { ...last, streaming: false };
                  }
                  return next;
                });
                if (event.data?.emergency_contact && event.data?.resources) {
                  setCrisisResources(event.data.resources);
                }
                if (event.data?.coins_earned > 0) {
                  await updateCalmCoins();
                }
                break;
              case 'error':
                throw new Error(event.data || 'Streaming error');
              default:
                break;
            }
          } catch (parseError) {
            if (parseError.message !== 'Streaming error') continue;
            throw parseError;
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setMessages((prev) => prev.filter((msg) => !msg.streaming));
    } finally {
      setSending(false);
      setThinking('');
    }
  };

  if (loadingThreads) {
    return <Spinner label="Loading AI support..." />;
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col lg:flex-row">
      <aside className="w-full border-b border-slate-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 className="font-semibold text-slate-900">Conversations</h2>
            <p className="text-xs text-slate-500">Agentic mental health chat</p>
          </div>
          <Button variant="ghost" size="sm" onClick={startNewThread} aria-label="New conversation">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-48 overflow-y-auto lg:max-h-[calc(100vh-8rem)]">
          {threads.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No conversations yet</p>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => selectThread(thread.id)}
                className={`flex w-full items-start justify-between gap-2 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                  currentThreadId === thread.id ? 'bg-brand-50' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{thread.title || 'New chat'}</p>
                  <p className="truncate text-xs text-slate-500">{thread.last_message || 'No messages'}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => deleteThread(thread.id, e)}
                  className="shrink-0 rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Badge variant="agent">AI Agent</Badge>
            <h1 className="font-semibold text-slate-900">Mental Health Support</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Streaming responses with crisis detection and wellness recommendations
          </p>
        </div>

        {crisisResources && (
          <Alert variant="danger" title="Crisis support available" className="m-4">
            <ul className="mt-2 space-y-1">
              {crisisResources.map((resource) => (
                <li key={resource.contact} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">{resource.name}:</span>
                  <a href={`tel:${resource.contact}`} className="underline">{resource.contact}</a>
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {error && <Alert variant="danger" className="mx-4 mt-4">{error}</Alert>}

        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="Start a conversation"
              description="Share how you're feeling. Our AI agent provides supportive guidance and can escalate to crisis resources when needed."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <Button key={prompt} variant="secondary" size="sm" onClick={() => sendMessage(prompt)}>
                      {prompt}
                    </Button>
                  ))}
                </div>
              }
            />
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-agent-100 text-agent-600">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-800 shadow-soft'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {message.content || (message.streaming ? '…' : '')}
                    </p>
                    <p className={`mt-1 text-xs ${message.role === 'user' ? 'text-brand-100' : 'text-slate-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {thinking && (
                <Card className="mx-auto max-w-md border-agent-200 bg-agent-50/50">
                  <div className="flex items-start gap-2 text-sm text-agent-800">
                    <Loader2 className="mt-0.5 h-4 w-4 animate-spin shrink-0" />
                    <span>{thinking}</span>
                  </div>
                </Card>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="mx-auto flex max-w-3xl gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              disabled={sending}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50"
            />
            <Button type="submit" variant="agent" disabled={sending || !input.trim()} loading={sending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
