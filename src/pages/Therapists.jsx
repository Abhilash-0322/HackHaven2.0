import { useState, useEffect } from 'react';
import { therapistsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

export default function Therapists() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { therapistsApi.list().then((d) => setList(Array.isArray(d) ? d : d?.therapists || [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);

  const bookSlot = async (slot) => {
    if (!user?.id || !selected) return;
    setBooking(true);
    try {
      await therapistsApi.bookAppointment({ user_id: user.id, therapist_id: selected._id, date: slot.start_time, start_time: slot.start_time, end_time: slot.end_time, session_type: 'video' });
      setSelected(await therapistsApi.get(selected._id));
    } catch (e) { setError(e.message); }
    finally { setBooking(false); }
  };

  return (
    <div>
      <PageHeader title="Therapists" subtitle="Book video sessions" />
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">{loading ? <Spinner /> : list.map((t) => (
          <button key={t._id} type="button" onClick={async () => setSelected(await therapistsApi.get(t._id))} className={`editorial-card w-full p-4 text-left ${selected?._id === t._id ? 'border-terracotta' : ''}`}><p className="font-serif text-sm font-medium">{t.name}</p></button>
        ))}</div>
        <div className="lg:col-span-2">{selected ? (
          <Card><h3 className="font-serif text-xl font-semibold">{selected.name}</h3><p className="mt-2 text-sm text-charcoal-muted">{selected.bio}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">{selected.available_slots?.slice(0, 12).map((s, i) => (
              <Button key={i} variant="secondary" size="sm" loading={booking} onClick={() => bookSlot(s)}>{new Date(s.start_time).toLocaleString()}</Button>
            ))}</div>
          </Card>
        ) : <p className="text-sm text-charcoal-muted">Select a therapist.</p>}</div>
      </div>
    </div>
  );
}
