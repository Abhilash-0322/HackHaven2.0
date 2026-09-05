import { useState, useEffect } from 'react';
import { Search, Music2, Play, Disc } from 'lucide-react';
import { musicApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    musicApi.getSongs().then((data) => setSongs(data.songs || [])).catch(() => setError('Failed to load songs.')).finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setFiltered([]); setShowDropdown(false); return; }
    const results = songs.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10);
    setFiltered(results);
    setShowDropdown(results.length > 0);
  }, [searchTerm, songs]);

  const getRecommendations = async (song) => {
    setLoading(true);
    setError('');
    setSelectedSong(song);
    setSearchTerm(song);
    setShowDropdown(false);
    try { const data = await musicApi.getRecommendations(song); setRecommendations(data.recommendations || []); }
    catch { setError('Failed to get recommendations'); }
    finally { setLoading(false); }
  };

  const openSpotify = (uri) => { if (uri) window.open(uri.replace('spotify:track:', 'https://open.spotify.com/track/'), '_blank'); };

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Sound" title="Healing Music" subtitle="Discover melodies that resonate with your mood and soothe your spirit." />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}
      <div className="relative max-w-xl mb-10">
        <div className="flex items-center border border-editorial-border rounded-sm bg-cream-light px-4 py-3">
          <Search className="w-4 h-4 text-charcoal-muted mr-3" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a song..." className="flex-1 bg-transparent outline-none font-sans text-charcoal placeholder:text-charcoal-muted" />
          <Disc className="w-4 h-4 text-terracotta" />
        </div>
        {showDropdown && (
          <ul className="absolute z-10 w-full mt-1 border border-editorial-border bg-cream-light rounded-sm shadow-editorial max-h-60 overflow-y-auto">
            {filtered.map((song) => (
              <li key={song}><button type="button" onClick={() => getRecommendations(song)} className="w-full text-left px-4 py-2.5 font-sans text-sm hover:bg-cream-dark transition-colors">{song}</button></li>
            ))}
          </ul>
        )}
      </div>
      {initialLoading ? <div className="flex justify-center py-16"><Spinner size="lg" label="Loading music library..." /></div>
        : loading ? <div className="flex justify-center py-16"><Spinner size="lg" label="Finding recommendations..." /></div>
        : recommendations.length === 0 ? <EmptyState icon={Music2} title="Search for a song" description="Enter a song name above to discover similar tracks." />
        : (
          <div>
            <p className="editorial-section-number mb-2">Recommendations for</p>
            <h2 className="font-display text-2xl mb-8">{selectedSong}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((song, i) => (
                <Card key={i}>
                  {song.album_cover_url && <img src={song.album_cover_url} alt={song.name} className="w-full aspect-square object-cover rounded-sm mb-4" />}
                  <CardTitle>{song.name}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                  {song.spotify_uri && <button type="button" onClick={() => openSpotify(song.spotify_uri)} className="mt-4 flex items-center gap-2 text-sm font-sans text-terracotta hover:text-terracotta-dark"><Play className="w-4 h-4" /> Open in Spotify</button>}
                </Card>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
