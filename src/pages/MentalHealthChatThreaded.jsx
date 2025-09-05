import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Plus, Trash2, Edit3, HelpCircle, Book, X, 
  Mic, MicOff, Volume2, VolumeX, ChevronLeft, ChevronRight, Award, Clock, User, Bot,
  Moon, Sun, Heart, Smile, Frown, Meh, Zap, Coffee, Home, Lightbulb, Shield,
  BookOpen, Music, Calendar, Phone, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const MentalHealthChat = () => {
  // Auth context
  const { updateCalmCoins } = useAuth();
  
  // State management
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [hasStartedChatting, setHasStartedChatting] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  
  // Voice chat state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  
  // Resources state
  const [showResources, setShowResources] = useState(false);
  const [showEmergencyResources, setShowEmergencyResources] = useState(false);
  const [resourcesList, setResourcesList] = useState([]);
  const [coinsEarned, setCoinsEarned] = useState(0);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [thinkingMessage, setThinkingMessage] = useState('');
  const [thinkingHistory, setThinkingHistory] = useState([]);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [showThinkingSidebar, setShowThinkingSidebar] = useState(false);

  // New UX improvement states
  const [darkMode, setDarkMode] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [sessionGoal, setSessionGoal] = useState('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [showWellnessReminders, setShowWellnessReminders] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [messageReactions, setMessageReactions] = useState({});
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatPersonality, setChatPersonality] = useState('supportive'); // supportive, professional, friendly
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // small, normal, large
  const [showProgressTracker, setShowProgressTracker] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [skipLoadMessages, setSkipLoadMessages] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  
  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Helper function to validate and sanitize messages
  const sanitizeMessage = (message) => {
    if (!message || typeof message !== 'object') {
      return null;
    }
    
    return {
      type: message.type || 'system',
      content: message.content || '',
      timestamp: message.timestamp || new Date(),
      coins_earned: message.coins_earned || 0,
      streaming: message.streaming || false,
      isEmergency: message.isEmergency || false
    };
  };

  // Safe message setter
  const setSafeMessages = (messagesOrUpdater) => {
    if (typeof messagesOrUpdater === 'function') {
      setMessages(prev => {
        try {
          const newMessages = messagesOrUpdater(prev);
          if (!Array.isArray(newMessages)) {
            console.warn('Invalid messages array, falling back to previous state');
            return prev;
          }
          return newMessages.map(sanitizeMessage).filter(Boolean);
        } catch (error) {
          console.error('Error updating messages:', error);
          return prev;
        }
      });
    } else {
      if (!Array.isArray(messagesOrUpdater)) {
        console.warn('Invalid messages array provided');
        return;
      }
      setMessages(messagesOrUpdater.map(sanitizeMessage).filter(Boolean));
    }
  };

  // Debug useEffect to track messages changes
  useEffect(() => {
    console.log('DEBUG: Messages state changed, new length:', messages.length);
    console.log('DEBUG: Messages array:', messages);
  }, [messages]);

  // Debug useEffect to track hasStartedChatting changes
  useEffect(() => {
    console.log('DEBUG: hasStartedChatting changed to:', hasStartedChatting);
  }, [hasStartedChatting]);

  // Auto-update hasStartedChatting based on messages (safety net)
  useEffect(() => {
    const hasUserMessages = messages.some(msg => msg.type === 'user');
    if (hasUserMessages && !hasStartedChatting) {
      console.log('DEBUG: Auto-setting hasStartedChatting to true based on user messages');
      setHasStartedChatting(true);
    } else if (!hasUserMessages && hasStartedChatting) {
      console.log('DEBUG: Auto-setting hasStartedChatting to false - no user messages');
      setHasStartedChatting(false);
    }
  }, [messages, hasStartedChatting]);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatContainerRef.current && messagesEndRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Load threads on component mount
  useEffect(() => {
    loadThreads();
  }, []);
  
  // Load thread messages when current thread changes
  useEffect(() => {
    if (currentThread && !skipLoadMessages) {
      loadThreadMessages(currentThread.id);
    }
    if (skipLoadMessages) {
      setSkipLoadMessages(false); // Reset the flag
    }
  }, [currentThread]);
  
  // Sample suggested questions organized by category
  const suggestedQuestions = {
    anxiety: [
      "I've been feeling anxious lately",
      "How can I manage panic attacks?",
      "What are some quick anxiety relief techniques?"
    ],
    sleep: [
      "How can I improve my sleep?",
      "I'm having trouble falling asleep",
      "What's a good bedtime routine?"
    ],
    focus: [
      "I'm having trouble focusing",
      "How can I be more productive?",
      "What are some concentration techniques?"
    ],
    stress: [
      "I feel overwhelmed with work",
      "How do I deal with stress?",
      "What are some stress management tips?"
    ],
    relationships: [
      "I'm feeling lonely",
      "How do I improve my relationships?",
      "I'm having conflict with someone"
    ],
    general: [
      "What are some mindfulness exercises?",
      "Tips for better mental health",
      "How can I practice self-care?"
    ]
  };

  // Quick action buttons for common needs
  const quickActions = [
    { icon: Heart, label: "Feeling Anxious", action: () => sendStreamingMessage("I'm feeling anxious right now. Can you help me?") },
    { icon: Moon, label: "Can't Sleep", action: () => sendStreamingMessage("I'm having trouble sleeping. What can I do?") },
    { icon: Zap, label: "Need Energy", action: () => sendStreamingMessage("I'm feeling low energy today. How can I boost my mood?") },
    { icon: Coffee, label: "Overwhelmed", action: () => sendStreamingMessage("I'm feeling overwhelmed. Can you help me organize my thoughts?") },
  ];

  // Mood options for tracking
  const moodOptions = [
    { emoji: "😊", label: "Great", value: "great", color: "text-green-500" },
    { emoji: "🙂", label: "Good", value: "good", color: "text-blue-500" },
    { emoji: "😐", label: "Okay", value: "okay", color: "text-yellow-500" },
    { emoji: "🙁", label: "Not Good", value: "not_good", color: "text-orange-500" },
    { emoji: "😢", label: "Difficult", value: "difficult", color: "text-red-500" },
  ];

  // Session goals
  const sessionGoals = [
    "Reduce anxiety",
    "Improve sleep",
    "Manage stress",
    "Boost mood",
    "Practice mindfulness",
    "Work through emotions",
    "General support"
  ];

  // Wellness reminders
  const wellnessReminders = [
    { icon: Coffee, text: "Remember to stay hydrated", type: "hydration" },
    { icon: Moon, text: "Consider taking a short break", type: "break" },
    { icon: Heart, text: "Take a deep breath", type: "breathing" },
    { icon: Lightbulb, text: "You're doing great by seeking support", type: "encouragement" }
  ];
  
  // Load user's chat threads
  const loadThreads = async () => {
    setLoadingThreads(true);
    try {
      const response = await authService.authenticatedFetch(`${API_URL}/mental-health/threads`);
      const data = await response.json();
      setThreads(data.threads || []);
      
      // Load the most recent thread if available
      if (data.threads && data.threads.length > 0) {
        setCurrentThread(data.threads[0]);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoadingThreads(false);
    }
  };
  
  // Load messages for a specific thread
  const loadThreadMessages = async (threadId) => {
    try {
      const response = await authService.authenticatedFetch(`${API_URL}/mental-health/threads/${threadId}`);
      const data = await response.json();
      
      // Convert messages to display format
      const formattedMessages = data.messages.map(msg => ({
        type: msg.is_user ? 'user' : 'bot',
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        coins_earned: msg.coins_earned || 0
      }));
      
      setSafeMessages(formattedMessages);
      setHasStartedChatting(formattedMessages.length > 0);
      setShowChatInterface(formattedMessages.some(msg => msg.type === 'user'));
    } catch (error) {
      console.error('Error loading thread messages:', error);
      setSafeMessages([]);
      setHasStartedChatting(false);
      setShowChatInterface(false);
    }
  };
  
  // Create a new thread
  const createNewThread = () => {
    setCurrentThread(null);
    setHasStartedChatting(false); // Reset chatting state for new thread
    setShowChatInterface(false); // Reset chat interface for new thread
    setSafeMessages([{
      type: 'system',
      content: 'Welcome to ZenHeaven Mental Health Support. How are you feeling today?',
      timestamp: new Date(),
    }]);
  };

  // Handle mood selection
  const handleMoodSelection = (mood) => {
    setCurrentMood(mood);
    setShowMoodSelector(false);
    const moodMessage = `I'm feeling ${mood.label.toLowerCase()} today.`;
    sendStreamingMessage(moodMessage);
  };

  // Handle session goal selection
  const handleGoalSelection = (goal) => {
    setSessionGoal(goal);
    setShowGoalSelector(false);
    const goalMessage = `I'd like to focus on: ${goal}`;
    sendStreamingMessage(goalMessage);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save preference to localStorage
    localStorage.setItem('zenheaven-dark-mode', !darkMode);
  };

  // Toggle accessibility mode
  const toggleAccessibilityMode = () => {
    setAccessibilityMode(!accessibilityMode);
    localStorage.setItem('zenheaven-accessibility', !accessibilityMode);
  };

  // Handle message reactions
  const handleMessageReaction = (messageIndex, reaction) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageIndex]: reaction
    }));
  };

  // Load user preferences on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('zenheaven-dark-mode') === 'true';
    const savedAccessibility = localStorage.getItem('zenheaven-accessibility') === 'true';
    const savedFontSize = localStorage.getItem('zenheaven-font-size') || 'normal';
    const hasVisited = localStorage.getItem('zenheaven-visited');
    
    setDarkMode(savedDarkMode);
    setAccessibilityMode(savedAccessibility);
    setFontSize(savedFontSize);
    
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowHelpModal(true);
      localStorage.setItem('zenheaven-visited', 'true');
    }
  }, []);
  
  // Send message to chatbot with streaming
  const sendStreamingMessage = async (messageContent = null) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;
    
    // Immediately show chat interface
    setShowChatInterface(true);
    
    setIsLoading(true);
    setIsStreaming(true);
    setInputMessage('');
    setThinkingMessage('');
    // Only clear thinking history when starting a completely new conversation
    if (!currentThread) {
      setThinkingHistory([]);
    }
    
    // Add user message to display immediately
    const userMessage = {
      type: 'user',
      content: content,
      timestamp: new Date()
    };
    console.log('DEBUG: About to add user message:', userMessage);
    setSafeMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('DEBUG: New messages array:', newMessages);
      console.log('DEBUG: User messages in new array:', newMessages.filter(m => m.type === 'user'));
      return newMessages;
    });
    setHasStartedChatting(true); // Immediately mark that chatting has started
    console.log('DEBUG: Added user message in sendStreamingMessage, new count will be:', messages.length + 1);
    
    try {
      const response = await authService.authenticatedFetch(`${API_URL}/mental-health/chat/stream`, {
        method: 'POST',
        body: JSON.stringify({
          message: content,
          thread_id: currentThread?.id || null
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let currentBotMessage = {
        type: 'bot',
        content: '',
        timestamp: new Date(),
        coins_earned: 0,
        streaming: true
      };
      
      // Add bot message placeholder
      setSafeMessages(prev => [...prev, currentBotMessage]);
      
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'thread_id':
                  if (!currentThread) {
                    // Reload threads to get the new thread
                    await loadThreads();
                  }
                  break;
                  
                case 'thinking':
                  console.log('Thinking message received:', data.data); // Debug log
                  setThinkingMessage(data.data);
                  setThinkingHistory(prev => {
                    const newHistory = [...prev, { 
                      text: data.data, 
                      timestamp: Date.now(),
                      id: Math.random().toString(36).substr(2, 9)
                    }];
                    // Keep last 20 thoughts for detailed analysis
                    return newHistory.slice(-20);
                  });
                  // Auto-show thinking sidebar when AI starts thinking
                  if (!showThinkingSidebar && streamingEnabled) {
                    console.log('Auto-opening thinking sidebar'); // Debug log
                    setShowThinkingSidebar(true);
                    // Auto-hide resources to prevent overlap
                    if (showResources) {
                      setShowResources(false);
                    }
                  }
                  break;
                  
                case 'response_start':
                  setThinkingMessage('');
                  // Don't clear thinking history - keep it for the sidebar
                  break;
                  
                case 'token':
                  // Only update the bot message in real-time, don't use streamingMessage
                  setSafeMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.type === 'bot') {
                      lastMessage.content += data.data;
                    }
                    return newMessages;
                  });
                  break;
                  
                case 'complete':
                  setIsStreaming(false);
                  setThinkingMessage('');
                  // Keep thinking history for sidebar display
                  
                  // Update final message with metadata
                  setSafeMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.type === 'bot') {
                      lastMessage.coins_earned = data.data.coins_earned;
                      lastMessage.streaming = false;
                    }
                    return newMessages;
                  });
                  
                  // Handle emergency resources
                  if (data.data.emergency_contact && data.data.resources) {
                    setResourcesList(data.data.resources);
                    setShowEmergencyResources(true);
                  }
                  
                  // Show coins earned
                  if (data.data.coins_earned > 0) {
                    setCoinsEarned(data.data.coins_earned);
                    setTimeout(() => setCoinsEarned(0), 3000);
                    await updateCalmCoins();
                  }
                  break;
                  
                case 'error':
                  console.error('Streaming error:', data.data);
                  setSafeMessages(prev => [...prev, {
                    type: 'system',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date()
                  }]);
                  break;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error with streaming:', error);
      setSafeMessages(prev => [...prev, {
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setThinkingMessage('');
      // Keep thinking history for sidebar
      console.log('DEBUG: End of sendStreamingMessage, current messages count:', messages.length);
    }
  };

  // Send message to chatbot
  const sendMessage = async (messageContent = null) => {
    if (streamingEnabled) {
      return sendStreamingMessage(messageContent);
    }
    
    // Original non-streaming implementation
    const content = messageContent || inputMessage.trim();
    if (!content) return;
    
    // Immediately show chat interface
    setShowChatInterface(true);
    
    setIsLoading(true);
    setInputMessage('');
    
    // Add user message to display immediately
    const userMessage = {
      type: 'user',
      content: content,
      timestamp: new Date()
    };
    setSafeMessages(prev => [...prev, userMessage]);
    setHasStartedChatting(true); // Immediately mark that chatting has started
    
    try {
      const requestBody = {
        message: content,
        thread_id: currentThread?.id || null
      };
      
      const response = await authService.authenticatedFetch(`${API_URL}/mental-health/chat`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      // Add bot response to messages
      const botMessage = {
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        coins_earned: data.coins_earned || 0
      };
      setSafeMessages(prev => [...prev, botMessage]);
      
      // Update current thread or set new thread
      if (!currentThread && data.thread_id) {
        try {
          // Reload threads to get the new thread
          const threadsResponse = await authService.authenticatedFetch(`${API_URL}/mental-health/threads`);
          const threadsData = await threadsResponse.json();
          const updatedThreads = threadsData.threads || [];
          setThreads(updatedThreads);
          
          // Find and set the new thread as current
          const newThread = updatedThreads.find(t => t.id === data.thread_id);
          if (newThread) {
            // Set flag to prevent loadThreadMessages from being called immediately
            setSkipLoadMessages(true);
            setCurrentThread(newThread);
            // Don't reload messages since we already have them locally
          }
        } catch (error) {
          console.error('Error loading updated threads:', error);
        }
      }
      
      // Handle emergency resources
      if (data.emergency_contact && data.resources) {
        setResourcesList(data.resources);
        setShowEmergencyResources(true);
      }
      
      // Show coins earned
      if (data.coins_earned > 0) {
        setCoinsEarned(data.coins_earned);
        setTimeout(() => setCoinsEarned(0), 3000);
        // Update coins in navbar
        await updateCalmCoins();
      }
      
      // Speak the response if voice is enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSafeMessages(prev => [...prev, {
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      speechRecognition?.stop();
      setIsListening(false);
    } else {
      speechRecognition?.start();
      setIsListening(true);
    }
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Delete thread
  const deleteThread = async (threadId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      await authService.authenticatedFetch(`${API_URL}/mental-health/threads/${threadId}`, {
        method: 'DELETE'
      });
      
      // Remove from local state
      setThreads(prev => prev.filter(t => t.id !== threadId));
      
      // If this was the current thread, clear it
      if (currentThread?.id === threadId) {
        setCurrentThread(null);
        setSafeMessages([{
          type: 'system',
          content: 'Welcome to ZenHeaven Mental Health Support. How are you feeling today?',
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };
  
  // Update thread title
  const updateThreadTitle = async (threadId, title) => {
    try {
      await authService.authenticatedFetch(`${API_URL}/mental-health/threads/${threadId}/title`, {
        method: 'PUT',
        body: JSON.stringify({ title })
      });
      
      // Update local state
      setThreads(prev => prev.map(t => 
        t.id === threadId ? { ...t, title } : t
      ));
      
      if (currentThread?.id === threadId) {
        setCurrentThread(prev => ({ ...prev, title }));
      }
      
      setEditingTitle(null);
      setNewTitle('');
    } catch (error) {
      console.error('Error updating thread title:', error);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today.getTime() - 86400000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-indigo-50 to-white text-gray-900'
    } ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : 'text-base'}`}>
      
      {/* Wellness Reminder Banner */}
      {showWellnessReminders && (
        <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} border-b px-4 py-2`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-indigo-600" />
              <span className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                {wellnessReminders[Math.floor(Math.random() * wellnessReminders.length)].text}
              </span>
            </div>
            <button 
              onClick={() => setShowWellnessReminders(false)}
              className={`text-xs ${darkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
                  Mental Health Support
                </h1>
                {currentThread && (
                  <p className={`text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    {currentThread.title}
                  </p>
                )}
              </div>
              
              {/* Mood and Goal Indicators */}
              <div className="flex items-center space-x-3">
                {currentMood && (
                  <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                    <span className="mr-2">{currentMood.emoji}</span>
                    <span className={`text-sm ${currentMood.color}`}>{currentMood.label}</span>
                  </div>
                )}
                {sessionGoal && (
                  <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
                    <Lightbulb className={`h-3 w-3 mr-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{sessionGoal}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Coins earned notification */}
              {coinsEarned > 0 && (
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full animate-bounce">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+{coinsEarned} coins!</span>
                </div>
              )}
              
              {/* Help Button */}
              <button
                onClick={() => setShowHelpModal(true)}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title="Help & Tips"
              >
                <HelpCircle className="h-5 w-5" />
              </button>

              {/* Accessibility Toggle */}
              <button
                onClick={toggleAccessibilityMode}
                className={`p-2 rounded-full transition-colors ${
                  accessibilityMode 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title="Toggle accessibility mode"
              >
                <Shield className="h-5 w-5" />
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Voice Toggle */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-full ${voiceEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'} hover:opacity-80 transition-colors`}
                title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              
              {/* Streaming Toggle */}
              <button
                onClick={() => setStreamingEnabled(!streamingEnabled)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  streamingEnabled 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={streamingEnabled ? "Disable live streaming" : "Enable live streaming"}
              >
                {streamingEnabled ? '🔴 Live' : '⚫ Standard'}
              </button>
              
              {/* AI Mind Toggle */}
              <button
                onClick={() => {
                  setShowThinkingSidebar(!showThinkingSidebar);
                  if (!showThinkingSidebar && showResources) {
                    setShowResources(false);
                  }
                }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  showThinkingSidebar 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={showThinkingSidebar ? "Hide AI thoughts" : "Show AI thoughts"}
              >
                🧠 AI Mind {showThinkingSidebar && <span className="ml-1 text-xs">●</span>}
              </button>
              
              {/* Sidebar Toggle */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-4 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg flex items-center transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat History
              </button>
              <button
                onClick={() => {
                  setShowResources(!showResources);
                  // If opening Resources, close AI Mind to prevent overlap
                  if (!showResources && showThinkingSidebar) {
                    setShowThinkingSidebar(false);
                  }
                }}
                className="px-4 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg flex items-center transition-colors"
              >
                <Book className="h-4 w-4 mr-2" />
                Resources {showResources && <span className="ml-1 text-xs">●</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Start Section - only show when no current thread */}
      {!currentThread && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b px-4 py-6`}>
          <div className="max-w-4xl mx-auto">
            {/* Mood Check-in */}
            {!currentMood && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  How are you feeling today?
                </h3>
                <div className="flex flex-wrap gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelection(mood)}
                      className={`flex items-center px-4 py-2 rounded-lg border-2 border-transparent hover:border-indigo-300 transition-colors ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl mr-2">{mood.emoji}</span>
                      <span className={`${mood.color} font-medium`}>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Session Goal Selection */}
            {!sessionGoal && currentMood && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  What would you like to focus on today?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sessionGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleGoalSelection(goal)}
                      className={`p-3 rounded-lg border-2 border-transparent hover:border-indigo-300 transition-colors text-center ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Support
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                        darkMode 
                          ? 'bg-indigo-800 hover:bg-indigo-700 text-white' 
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900'
                      }`}
                    >
                      <action.icon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        <aside className={`bg-white border-r border-gray-200 w-80 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static left-0 top-16 bottom-0 z-20 shadow-lg lg:shadow-none`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">Chat History</h2>
              <button
                onClick={createNewThread}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Chat
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : threads.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="p-2">
                {threads.map(thread => (
                  <div
                    key={thread.id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors group ${
                      currentThread?.id === thread.id 
                        ? 'bg-indigo-50 border-indigo-200 border' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentThread(thread)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingTitle === thread.id ? (
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => updateThreadTitle(thread.id, newTitle)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateThreadTitle(thread.id, newTitle);
                              }
                            }}
                            className="w-full px-2 py-1 text-sm font-medium text-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                          />
                        ) : (
                          <h3 
                            className="text-sm font-medium text-gray-800 truncate"
                            onDoubleClick={() => {
                              setEditingTitle(thread.id);
                              setNewTitle(thread.title);
                            }}
                          >
                            {thread.title}
                          </h3>
                        )}
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {thread.last_message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(thread.updated_at)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {thread.message_count} messages
                          </span>
                        </div>
                      </div>
                      <div className="flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitle(thread.id);
                            setNewTitle(thread.title);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </aside>

        {/* Main Chat Area with Thinking Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Container */}
          <main className={`flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 transition-all duration-300 ${
            showThinkingSidebar && showResources ? 'mr-160' : 
            showThinkingSidebar || showResources ? 'mr-80' : ''
          }`}>
            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 px-1 min-h-0"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="space-y-4 min-h-full" key={`messages-${messages.length}-${messages.filter(m => m.type === 'user').length}`}>
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-400 p-2 bg-gray-100 rounded">
                  Debug: currentThread={currentThread?.id}, messages.length={messages.length}, 
                  messageTypes={messages.map(m => m.type).join(',')},
                  hasStartedChatting={hasStartedChatting},
                  hasUserMessages={messages.some(msg => msg.type === 'user')},
                  userMessageCount={messages.filter(m => m.type === 'user').length},
                  isStreaming={isStreaming},
                  isLoading={isLoading},
                  showChatInterface={showChatInterface},
                  showEmpty={!showChatInterface && messages.filter(m => m.type === 'user').length === 0},
                  renderKey={`messages-${messages.length}-${messages.filter(m => m.type === 'user').length}`}
                </div>
              )}
              
              {!showChatInterface && messages.filter(m => m.type === 'user').length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Start a conversation
                  </h3>
                  <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Share what's on your mind. I'm here to listen and provide support.
                  </p>
                  
                  {/* Only show suggested questions if no current thread */}
                  {!currentThread && (
                    <>
                      {/* Categorized Suggested questions */}
                      <div className="max-w-3xl mx-auto">
                        <p className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Choose a topic to get started:
                        </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(suggestedQuestions).map(([category, questions]) => (
                        <div key={category} className={`p-4 rounded-lg border ${
                          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                          <h4 className={`text-sm font-semibold mb-3 capitalize ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {questions.slice(0, 2).map((question, index) => (
                              <button
                                key={index}
                                onClick={() => sendStreamingMessage(question)}
                                className={`w-full text-left p-2 text-xs rounded transition-colors ${
                                  darkMode 
                                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                                    : 'hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'
                                }`}
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                    </>
                  )}
                </div>
              ) : (
                messages.filter(message => message && message.type).map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}>
                    <div 
                      className={`max-w-lg rounded-2xl px-5 py-4 shadow-sm transition-all duration-200 ${
                        message.type === 'user' 
                          ? `${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'} text-white` 
                          : message.type === 'system'
                            ? `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`
                            : `${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border`
                      } ${accessibilityMode ? 'text-lg leading-relaxed' : ''}`}
                    >
                      {/* Message type indicator for accessibility */}
                      {accessibilityMode && (
                        <div className="flex items-center mb-2 text-xs opacity-75">
                          {message.type === 'user' ? (
                            <><User className="h-3 w-3 mr-1" /> You</>
                          ) : (
                            <><Bot className="h-3 w-3 mr-1" /> AI Assistant</>
                          )}
                        </div>
                      )}
                      
                      <p className={`whitespace-pre-wrap ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : 'text-base'}`}>
                        {message.content || ''}
                      </p>
                      
                      {message.streaming && (
                        <div className="flex items-center mt-2">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-blue-600 ml-2">streaming...</span>
                        </div>
                      )}
                      
                      {message.coins_earned && message.coins_earned > 0 && (
                        <div className="flex items-center mt-2 text-xs text-yellow-600">
                          <Award className="h-3 w-3 mr-1" />
                          +{message.coins_earned} coins earned
                        </div>
                      )}
                      
                      {/* Message actions */}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs opacity-70 ${fontSize === 'large' ? 'text-sm' : ''}`}>
                          {message.timestamp ? formatTime(message.timestamp) : ''}
                        </span>
                        
                        {/* Reaction buttons for bot messages */}
                        {message.type === 'bot' && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleMessageReaction(index, 'helpful')}
                              className={`p-1 text-xs rounded transition-colors ${
                                messageReactions[index] === 'helpful'
                                  ? 'bg-green-100 text-green-700'
                                  : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="Helpful"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => handleMessageReaction(index, 'not_helpful')}
                              className={`p-1 text-xs rounded transition-colors ${
                                messageReactions[index] === 'not_helpful'
                                  ? 'bg-red-100 text-red-700'
                                  : 'hover:bg-gray-100 text-gray-500'
                              }`}
                              title="Not helpful"
                            >
                              👎
                            </button>
                            {voiceEnabled && (
                              <button
                                onClick={() => message.content && speakText(message.content)}
                                className="p-1 text-xs rounded hover:bg-gray-100 text-gray-500 transition-colors"
                                title="Read aloud"
                              >
                                <Volume2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* No more inline thinking indicator - moved to sidebar */}
              
              {/* Loading indicator */}
              {(isLoading && !isStreaming) && (
                <div className="flex justify-start">
                  <div className="max-w-lg rounded-2xl px-5 py-4 bg-white border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Form */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            {/* Quick suggestion pills */}
            {currentThread && messages.length > 0 && (
              <div className="mb-3 overflow-x-auto">
                <div className="flex space-x-2 pb-2">
                  {Object.values(suggestedQuestions).flat().slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendStreamingMessage(question)}
                      className={`flex-shrink-0 px-3 py-1 text-xs rounded-full transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700'
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="space-y-3">
              <div className="flex items-end space-x-3 max-w-4xl mx-auto">
                {/* Voice input button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={!speechRecognition}
                  className={`p-3 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : !speechRecognition
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`
                  }`}
                  title={isListening ? "Stop listening" : !speechRecognition ? "Voice not supported" : "Start voice input"}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                {/* Enhanced text input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      isListening 
                        ? "Listening... speak now" 
                        : currentMood 
                          ? `I'm here to help with ${currentMood.label.toLowerCase()} feelings...`
                          : "Share what's on your mind..."
                    }
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${fontSize === 'large' ? 'text-lg' : fontSize === 'small' ? 'text-sm' : 'text-base'}`}
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    disabled={isLoading || isListening}
                  />
                  
                  {/* Character count */}
                  {inputMessage.length > 100 && (
                    <div className={`absolute bottom-1 right-3 text-xs ${
                      inputMessage.length > 500 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {inputMessage.length}/1000
                    </div>
                  )}
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading || isListening}
                  className={`p-3 rounded-full transition-colors ${
                    !inputMessage.trim() || isLoading || isListening
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {/* Status and tips */}
              <div className="text-xs text-center max-w-4xl mx-auto space-y-1">
                {isListening ? (
                  <div className={`flex items-center justify-center space-x-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Listening... Say something or click the mic to stop</span>
                  </div>
                ) : streamingEnabled ? (
                  <div className={`flex items-center justify-center space-x-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live streaming enabled - Watch AI think in real-time!</span>
                  </div>
                ) : (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>This is a supportive AI assistant. For emergencies, contact 911 or your local crisis helpline.</span>
                  </div>
                )}
                
                {accessibilityMode && (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>Accessibility mode enabled. Press Tab to navigate, Space to select.</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </main>

        {/* AI Thinking Sidebar */}
        <aside className={`bg-gradient-to-b from-purple-50 to-indigo-50 border-l border-purple-200 w-80 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out transform ${
          showThinkingSidebar ? 'translate-x-0' : 'translate-x-full'
        } fixed ${showResources ? 'right-80' : 'right-0'} top-16 bottom-0 z-20 shadow-xl`}>
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🧠</span>
                  </div>
                  {isStreaming && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Mind
                </h2>
              </div>
              <button
                onClick={() => setShowThinkingSidebar(false)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors"
                title="Close AI Mind"
              >
                <X className="h-5 w-5 text-purple-600" />
              </button>
            </div>
            
            {/* Current thinking status */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className={`text-sm font-medium ${isStreaming ? 'text-green-600' : 'text-gray-500'}`}>
                  {isStreaming ? 'Actively Thinking' : 'Idle'}
                </span>
              </div>
              
              {thinkingMessage && (
                <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-2 border-indigo-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-800 mb-1">Current Thought</p>
                      <p className="text-sm text-purple-600">{thinkingMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chain of thoughts history */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded"></div>
                <h3 className="text-sm font-semibold text-purple-700">Thought Process</h3>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded"></div>
              </div>
              
              {thinkingHistory.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {thinkingHistory.map((thought, index) => (
                    <div 
                      key={thought.id} 
                      className={`p-3 rounded-lg transition-all duration-500 transform ${
                        index === thinkingHistory.length - 1 
                          ? 'bg-white bg-opacity-90 border border-purple-300 shadow-md scale-105' 
                          : 'bg-white bg-opacity-50 border border-purple-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          index === thinkingHistory.length - 1 
                            ? 'bg-purple-500 animate-pulse' 
                            : 'bg-purple-300'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm transition-all duration-300 break-words ${
                            index === thinkingHistory.length - 1 
                              ? 'text-purple-800 font-medium' 
                              : 'text-purple-600'
                          }`}>
                            {thought.text}
                          </p>
                          <p className="text-xs text-purple-400 mt-1">
                            {new Date(thought.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl opacity-50">💭</span>
                  </div>
                  <p className="text-sm text-purple-500 mb-1">No thoughts yet</p>
                  <p className="text-xs text-purple-400">Send a message to see AI thinking</p>
                </div>
              )}
            </div>
            
            {/* AI insights */}
            <div className="mt-6 p-4 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center">
                <span className="mr-2">✨</span>
                AI Analysis Metrics
              </h4>
              <div className="space-y-2 text-xs text-purple-600">
                <div className="flex justify-between">
                  <span>Processing Mode:</span>
                  <span className="font-medium">{streamingEnabled ? 'Real-time Streaming' : 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emotional Analysis:</span>
                  <span className="font-medium text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span>Crisis Detection:</span>
                  <span className="font-medium text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span>Context Awareness:</span>
                  <span className="font-medium text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span>Thoughts Logged:</span>
                  <span className="font-medium">{thinkingHistory.length}/20</span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Status:</span>
                  <span className={`font-medium ${isStreaming ? 'text-green-600' : 'text-gray-500'}`}>
                    {isStreaming ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>
              
              {/* Clear thinking history button */}
              {thinkingHistory.length > 0 && (
                <button
                  onClick={() => setThinkingHistory([])}
                  className="mt-3 w-full px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                >
                  Clear Thought History
                </button>
              )}
            </div>
          </div>
        </aside>
        </div>

        {/* Resources Sidebar */}
        <aside className={`bg-white border-l border-gray-200 w-80 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out transform ${
          showResources ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed lg:static right-0 top-16 bottom-0 z-10 shadow-lg lg:shadow-none`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-indigo-900">Resources</h2>
              <button
                onClick={() => setShowResources(false)}
                className="lg:hidden p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Voice controls in sidebar */}
            <div className="mb-6 p-3 bg-indigo-50 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-600 mb-2">Voice Controls</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`flex items-center justify-between px-3 py-2 rounded ${
                    voiceEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <span className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Voice Responses
                  </span>
                  <span className="text-xs">{voiceEnabled ? 'On' : 'Off'}</span>
                </button>
                <button
                  onClick={stopSpeaking}
                  className={`flex items-center justify-between px-3 py-2 rounded ${
                    isSpeaking ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
                  }`}
                  disabled={!isSpeaking}
                >
                  <span className="flex items-center">
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop Speaking
                  </span>
                </button>
              </div>
            </div>
            
            {/* Recommended resources based on conversation */}
            {resourcesList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-indigo-600 mb-3">Recommended for You</h3>
                <div className="space-y-3">
                  {resourcesList.map((resource, index) => (
                    <a 
                      key={index}
                      href={resource.url || '#'}
                      className="block p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      <h4 className="font-medium text-indigo-900">{resource.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{resource.type}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* General resources */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">General Resources</h3>
              <div className="space-y-3">
                <a 
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Breathing Techniques</h4>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Simple breathing exercises to reduce stress</p>
                </a>
                <a 
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Sleep Improvement</h4>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Tips for better sleep quality</p>
                </a>
                <a 
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Meditation Basics</h4>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Introduction to meditation for beginners</p>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Voice accessibility notifications */}
      {isListening && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-50">
          <Mic className="h-4 w-4 animate-pulse" />
          <span>Listening...</span>
        </div>
      )}
      
      {isSpeaking && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 z-50">
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span>Speaking...</span>
          <button onClick={stopSpeaking} className="ml-2 bg-white bg-opacity-20 rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Emergency Resources Modal */}
      {showEmergencyResources && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Crisis Resources</h3>
              <button
                onClick={() => {
                  setResourcesList([]);
                  setShowEmergencyResources(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              If you're in crisis or having thoughts of self-harm, please reach out for immediate help:
            </p>
            <div className="space-y-3">
              {resourcesList.map((resource, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800">{resource.name}</h4>
                  <p className="text-red-700 font-semibold">{resource.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Support Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowEmergencyResources(!showEmergencyResources)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors"
          title="Emergency Support"
        >
          <Phone className="h-6 w-6" />
        </button>
        
        {showEmergencyResources && (
          <div className={`absolute bottom-16 right-0 w-80 p-4 rounded-lg shadow-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency Support
              </h3>
              <button 
                onClick={() => setShowEmergencyResources(false)}
                className={`text-gray-500 hover:text-gray-700`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded border border-red-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Crisis Hotline</span>
                </div>
                <p className="text-red-700 font-semibold">988 (Suicide & Crisis Lifeline)</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center mb-2">
                  <Phone className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Emergency Services</span>
                </div>
                <p className="text-blue-700 font-semibold">911</p>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Text Support</span>
                </div>
                <p className="text-green-700 font-semibold">Text HOME to 741741</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Tracker */}
      {showProgressTracker && currentThread && messages.length > 5 && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className={`p-3 rounded-lg shadow-lg border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Clock className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.floor(messages.length / 2)} exchanges
                </span>
              </div>
              {currentMood && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{currentMood.emoji}</span>
                  <span className={`text-xs ${currentMood.color}`}>
                    {currentMood.label}
                  </span>
                </div>
              )}
              <button 
                onClick={() => setShowProgressTracker(false)}
                className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Status Indicators */}
      {isListening && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50">
          <Mic className="h-5 w-5 animate-pulse" />
          <span>Listening...</span>
          <button 
            onClick={toggleVoiceInput}
            className="ml-2 bg-white bg-opacity-20 rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {isSpeaking && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50">
          <Volume2 className="h-5 w-5 animate-pulse" />
          <span>Speaking...</span>
          <button 
            onClick={stopSpeaking}
            className="ml-2 bg-white bg-opacity-20 rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {isFirstVisit ? 'Welcome to ZenHeaven Mental Health Support!' : 'Help & Tips'}
                </h2>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className={`text-gray-500 hover:text-gray-700`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {isFirstVisit && (
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                      🌟 Get Started
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                      This is your safe space for mental health support. You can share your feelings, get personalized advice, and access helpful resources.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Mood Tracking
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Start by selecting your current mood. This helps personalize your experience.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Mic className="h-4 w-4 mr-2 text-blue-500" />
                      Voice Support
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Use voice input to speak naturally and hear AI responses read aloud.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                      Chat History
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Your conversations are saved as threads. Create new ones or continue previous discussions.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Shield className="h-4 w-4 mr-2 text-purple-500" />
                      Privacy & Safety
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Your conversations are private. For emergencies, use the red emergency button.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    🎯 Quick Tips
                  </h3>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Be honest about your feelings - this AI is here to help, not judge</li>
                    <li>• Use the categorized questions to get started if you're unsure</li>
                    <li>• Enable live streaming to see how the AI processes your concerns</li>
                    <li>• Try voice input for a more natural conversation experience</li>
                    <li>• Use dark mode and accessibility features for comfort</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {isFirstVisit ? "Let's Get Started!" : "Got it!"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthChat;
