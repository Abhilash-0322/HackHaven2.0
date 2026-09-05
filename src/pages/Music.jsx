import { useState, useEffect } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { musicApi } from '../lib/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { musicApi.getSongs().then((d) => setSongs(Array.isArray(d) ? d : d?.songs || [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <PageHeader title="Music" subtitle="Therapeutic song recommendations" />
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-h-[28rem] overflow-y-auto p-4">
          {loading ? <Spinner /> : songs.slice(0, 100).map((s) => (
            <button key={s} type="button" onClick={async () => { setLoadingRecs(true); try { setRecs(await musicApi.getRecommendations(s)); } catch (e) { setError(e.message); } finally { setLoadingRecs(false); } }} className="block w-full rounded-sm px-2 py-1.5 text-left text-xs hover:bg-cream-muted">{s}</button>
          ))}
        </Card>
        <div>
          {loadingRecs && <Spinner />}
          {recs?.recommendations?.map((r, i) => (
            <Card key={i} className="mb-2 flex gap-3 p-4">
              {r.album_cover_url && <img src={r.album_cover_url} alt="" className="h-14 w-14 rounded-sm object-cover" />}
              <div><p className="font-serif text-sm font-medium">{r.name}</p>{r.spotify_uri && <a href={`https://open.spotify.com/track/${r.spotify_uri.split(':').pop()}`} target="_blank" rel="noreferrer" className="text-xs text-terracotta flex gap-1 mt-1"><Play className="h-3 w-3" /> Spotify <ExternalLink className="h-3 w-3" /></a>}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
