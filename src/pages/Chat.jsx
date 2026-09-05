import { useEffect, useRef, useState } from 'react';
import { Plus, Send, Trash2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import Spinner from '../components/ui/Spinner';
import { chatApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Chat() {
  const { updateCalmCoins } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState('online');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    chatApi.getThreads()
      .then((data) => setThreads(data.threads || []))
      .catch(() => setThreads([]))
      .finally(() => setLoadingThreads(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const loadThread = async (threadId) => {
    const data = await chatApi.getThread(threadId);
    setActiveThread(threadId);
    setMessages(data.messages || []);
    setThinking([]);
  };

  const handleNewChat = () => {
    setActiveThread(null);
    setMessages([]);
    setThinking([]);
    setInput('');
  };

  const handleDelete = async (threadId, e) => {
    e.stopPropagation();
    await chatApi.deleteThread(threadId);
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThread === threadId) handleNewChat();
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { content: userMsg, is_user: true }]);
    setThinking([]);
    setStreaming(true);
    setAgentStatus('thinking');

    let botContent = '';
    let threadId = activeThread;

    abortRef.current = chatApi.streamChat(userMsg, activeThread, (event) => {
      if (event.type === 'thread_id') {
        threadId = event.data;
        setActiveThread(event.data);
      } else if (event.type === 'thinking') {
        setThinking((prev) => [...prev, event.data]);
        setAgentStatus('thinking');
      } else if (event.type === 'response_start') {
        setAgentStatus('streaming');
        setThinking([]);
        setMessages((prev) => [...prev, { content: '', is_user: false }]);
      } else if (event.type === 'token') {
        botContent += event.data;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && !last.is_user) updated[updated.length - 1] = { ...last, content: botContent };
          return updated;
        });
      } else if (event.type === 'complete') {
        setStreaming(false);
        setAgentStatus('online');
        if (event.data?.coins_earned) {
          updateCalmCoins((prev) => (prev?.calm_coins ?? 0) + event.data.coins_earned);
        }
        chatApi.getThreads().then((data) => setThreads(data.threads || [])).catch(() => {});
      } else if (event.type === 'error') {
        setStreaming(false);
        setAgentStatus('offline');
        setMessages((prev) => [...prev, { content: `Error: ${event.data}`, is_user: false, error: true }]);
      }
    });
  };

  return (
    <AppShell
      title="CalmBot Agent"
      subtitle="// SSE mental health companion"
      actions={<StatusBadge status={agentStatus} label={agentStatus === 'thinking' ? 'Analyzing...' : agentStatus === 'streaming' ? 'Streaming' : 'Online'} />}
    >
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <GlassCard className="w-64 shrink-0 hidden md:flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-gray-500">threads</span>
            <button type="button" onClick={handleNewChat} className="neon-btn-ghost p-1"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {loadingThreads ? <Spinner label="Loading..." /> : threads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => loadThread(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs group flex justify-between gap-2 ${activeThread === t.id ? 'bg-violet-glow/15 text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <span className="truncate">{t.title}</span>
                <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" onClick={(e) => handleDelete(t.id, e)} />
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="flex-1 flex flex-col min-w-0">
          {thinking.length > 0 && (
            <GlassCard className="mb-3 max-h-32 overflow-y-auto">
              <p className="text-[10px] font-mono text-gray-600 mb-2">// agent_thinking.log</p>
              {thinking.map((line, i) => (
                <p key={i} className="terminal-line">
                  <span className="text-violet-glow/50">&gt;</span> {line}
                </p>
              ))}
              <span className="terminal-line animate-blink">_</span>
            </GlassCard>
          )}

          <GlassCard className="flex-1 flex flex-col overflow-hidden mb-3">
            <div className="flex-1 overflow-y-auto space-y-4 p-1">
              {messages.length === 0 && (
                <div className="text-center text-gray-600 font-mono text-sm mt-12">
                  <p>// awaiting input</p>
                  <p className="text-xs mt-2">Start a conversation with CalmBot</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.is_user ? 'bg-violet-glow/20 text-white border border-violet-glow/30' : msg.error ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 'bg-surface text-gray-200 border border-border'}`}>
                    {!msg.is_user && <p className="text-[10px] font-mono text-cyan-glow/60 mb-1">calmbot</p>}
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </GlassCard>

          <div className="flex gap-2">
            <input
              className="neon-input flex-1"
              placeholder="Message CalmBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={streaming}
            />
            <button type="button" onClick={handleSend} className="neon-btn" disabled={streaming || !input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
