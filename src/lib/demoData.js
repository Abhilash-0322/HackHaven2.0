export const demoThreads = [
  {
    id: "demo-1",
    title: "A softer start to Monday",
    last_message: "I want to feel less rushed this week.",
    message_count: 8,
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Making space for rest",
    last_message: "What does genuine rest look like?",
    message_count: 6,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const demoMessages = [
  {
    id: "demo-message-1",
    content: "Welcome back. What would feel most supportive today?",
    is_user: false,
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
];

export const demoEntries = [
  {
    _id: "entry-1",
    title: "A little more spacious",
    content: "I made tea before opening my laptop today. It was a small choice, but it helped the morning feel like mine.",
    mood: "calm",
    tags: ["ritual", "morning"],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "entry-2",
    title: "Naming the noise",
    content: "There is a lot on my mind. Writing each worry down made it feel more like a list I can meet, not a cloud I have to carry.",
    mood: "hopeful",
    tags: ["reflection"],
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const demoBooks = [
  { id: "book-1", title: "Wintering", author: "Katherine May", description: "The quiet power of rest and retreat in difficult seasons.", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80" },
  { id: "book-2", title: "The Comfort Book", author: "Matt Haig", description: "Notes, lists and stories for difficult days.", image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80" },
  { id: "book-3", title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", description: "A beautiful invitation to attention, reciprocity and wonder.", image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80" },
  { id: "book-4", title: "The Things You Can See Only When You Slow Down", author: "Haemin Sunim", description: "Reflections for finding calm in a busy world.", image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80" },
];

export const demoSongs = [
  { name: "Holocene", artist: "Bon Iver", mood: "Grounded", color: "from-amber-200/40 to-emerald-300/10" },
  { name: "Bloom", artist: "The Paper Kites", mood: "Open", color: "from-rose-200/40 to-orange-300/10" },
  { name: "An Ending (Ascent)", artist: "Brian Eno", mood: "Still", color: "from-sky-200/40 to-indigo-300/10" },
  { name: "Anchor", artist: "Novo Amor", mood: "Held", color: "from-teal-200/40 to-cyan-300/10" },
];

export const demoTherapists = [
  { _id: "therapist-1", name: "Dr. Sarah Johnson", specializations: ["Anxiety", "Stress Management"], experience_years: 12, bio: "Evidence-based support for when your inner world feels loud.", languages: ["English", "Spanish"], rating: 4.8, hourly_rate: 120, photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
  { _id: "therapist-2", name: "Maya Rodriguez, LMFT", specializations: ["Relationships", "Self-Esteem"], experience_years: 8, bio: "Warm, culturally sensitive care for connection and confidence.", languages: ["English", "Spanish"], rating: 4.9, hourly_rate: 100, photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
  { _id: "therapist-3", name: "Aisha Patel, LCSW", specializations: ["Grief & Loss", "Life Transitions"], experience_years: 7, bio: "A steady place to process change and find meaning.", languages: ["English", "Hindi"], rating: 4.8, hourly_rate: 95, photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
];
