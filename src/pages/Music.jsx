import { useEffect, useState } from 'react';
import { Music as MusicIcon, Play, Search } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch(`${API_BASE_URL}/songs`);
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to load songs');
        setSongs(data.songs || []);
      } catch (err) {
        setError(err.message || 'Failed to load song catalog');
      } finally {
        setLoadingSongs(false);
      }
    }
    fetchSongs();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSongs([]);
      setShowDropdown(false);
      return;
    }
    const matches = songs
      .filter((song) => song.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 8);
    setFilteredSongs(matches);
    setShowDropdown(matches.length > 0);
  }, [searchTerm, songs]);

  const getRecommendations = async (song) => {
    setLoading(true);
    setError('');
    setSelectedSong(song);
    setShowDropdown(false);
    setSearchTerm(song);
    try {
      const response = await fetch(`${API_BASE_URL}/recommend?song=${encodeURIComponent(song)}`);
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to get recommendations');
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message || 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const openInSpotify = (uri) => {
    if (!uri) return;
    const url = uri.replace('spotify:track:', 'https://open.spotify.com/track/');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loadingSongs) return <Spinner label="Loading music catalog..." />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="agent" className="mb-3">Recommendation system</Badge>
        <h1 className="text-3xl font-bold text-slate-900">Music Therapy</h1>
        <p className="mt-2 text-slate-600">
          Discover calming tracks through similarity-based recommendations tailored to your mood.
        </p>
      </div>

      <Card className="relative mb-8 max-w-xl">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a song..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        {showDropdown && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-card">
            {filteredSongs.map((song) => (
              <li key={song}>
                <button
                  type="button"
                  onClick={() => getRecommendations(song)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-slate-50"
                >
                  <MusicIcon className="h-4 w-4 text-brand-500" />
                  {song}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}

      {loading && <Spinner label="Finding similar tracks..." />}

      {!loading && selectedSong && recommendations.length > 0 && (
        <section>
          <CardHeader
            title="Recommended for you"
            description={`Based on "${selectedSong}"`}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recommendations.map((song, index) => (
              <Card key={`${song.name}-${index}`} padding={false} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={song.album_cover_url}
                    alt={song.name}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  {song.spotify_uri && (
                    <button
                      type="button"
                      onClick={() => openInSpotify(song.spotify_uri)}
                      className="absolute bottom-2 right-2 rounded-full bg-brand-600 p-2 text-white shadow-md hover:bg-brand-700"
                      aria-label={`Play ${song.name} on Spotify`}
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-slate-900">{song.name}</p>
                  <p className="truncate text-xs text-slate-500">{song.artist}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {!loading && !selectedSong && (
        <EmptyState
          icon={MusicIcon}
          title="Search for a song"
          description="Pick a track you enjoy and we'll recommend similar music for relaxation and focus."
        />
      )}
    </div>
  );
}
