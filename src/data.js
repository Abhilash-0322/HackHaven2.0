export const fallbackJournals = [
  { _id: "1", title: "A softer start", content: "I took a walk before work and remembered that small moments count.", mood: "hopeful", created_at: new Date().toISOString(), tags: ["reflection"] },
  { _id: "2", title: "Making room for rest", content: "Today felt full, but I let myself slow down without feeling guilty.", mood: "calm", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), tags: ["self-care"] },
];

export const fallbackBooks = [
  { id: "book-1", title: "The Comfort Book", author: "Matt Haig", description: "A gentle collection of notes, lists and stories for difficult days.", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80" },
  { id: "book-2", title: "Wintering", author: "Katherine May", description: "The quiet power of rest and retreat in difficult seasons.", image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80" },
  { id: "book-3", title: "Atomic Habits", author: "James Clear", description: "Tiny changes, remarkable results. A practical guide to building better habits.", image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80" },
];

export const fallbackTherapists = [
  { _id: "therapist-1", name: "Dr. Sarah Johnson", specializations: ["Anxiety", "Depression", "Stress Management"], experience_years: 12, education: "Ph.D in Clinical Psychology", bio: "A warm, evidence-based therapist who blends CBT with mindfulness to help you feel steadier.", photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80", hourly_rate: 120, languages: ["English", "Spanish"], rating: 4.8, total_sessions: 1247 },
  { _id: "therapist-2", name: "Maya Rodriguez, LMFT", specializations: ["Relationships", "Self-Esteem"], experience_years: 8, education: "M.S. Marriage and Family Therapy", bio: "Maya helps people build healthier connections and more compassionate relationships with themselves.", photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80", hourly_rate: 100, languages: ["English", "Spanish"], rating: 4.9, total_sessions: 654 },
  { _id: "therapist-3", name: "Aisha Patel, LCSW", specializations: ["Grief & Loss", "Life Transitions"], experience_years: 7, education: "MSW, University of Chicago", bio: "Culturally sensitive support for finding meaning and your footing through change.", photo_url: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&q=80", hourly_rate: 95, languages: ["English", "Hindi"], rating: 4.8, total_sessions: 445 },
];

export const moods = [
  { label: "Calm", emoji: "🌿", color: "bg-sage/30" },
  { label: "Hopeful", emoji: "☀️", color: "bg-[#f8e4be]" },
  { label: "Anxious", emoji: "〰️", color: "bg-[#e9e1f0]" },
  { label: "Tired", emoji: "☁️", color: "bg-[#dde7ed]" },
  { label: "Low", emoji: "🌧️", color: "bg-[#e2e1e9]" },
];
