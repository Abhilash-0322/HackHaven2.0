import { useState, useEffect } from 'react';
import { Calendar, UserRound, Clock, X } from 'lucide-react';
import { therapistsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

export default function Therapists() {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingTherapist, setBookingTherapist] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => { loadData(); }, [selectedSpec]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = selectedSpec ? { specialization: selectedSpec } : {};
      const [therapistsData, specsData] = await Promise.all([
        therapistsApi.getAll(params), therapistsApi.getSpecializations(),
      ]);
      setTherapists(therapistsData || []);
      setSpecializations(specsData?.specializations || specsData || []);
      const userId = user?.id || user?._id;
      if (userId) setAppointments(await therapistsApi.getUserAppointments(userId) || []);
    } catch { setError('Failed to load therapists'); }
    finally { setLoading(false); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    try {
      await therapistsApi.bookAppointment({
        therapist_id: bookingTherapist._id || bookingTherapist.id,
        user_id: user.id || user._id,
        date: bookingForm.date, time: bookingForm.time, notes: bookingForm.notes,
      });
      setBookingTherapist(null);
      setBookingForm({ date: '', time: '', notes: '' });
      await loadData();
    } catch (err) { setError(err.message || 'Failed to book appointment'); }
    finally { setBookingLoading(false); }
  };

  const cancelAppointment = async (id) => {
    try { await therapistsApi.cancelAppointment(id); await loadData(); }
    catch { setError('Failed to cancel appointment'); }
  };

  return (
    <div className="editorial-container py-8 md:py-12">
      <PageHeader number="Care" title="Therapist Appointments" subtitle="Connect with licensed professionals for guidance and support." />
      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button type="button" onClick={() => setSelectedSpec('')}
            className={`px-3 py-1.5 text-sm font-sans rounded-sm border transition-colors ${!selectedSpec ? 'bg-terracotta-muted border-terracotta text-terracotta' : 'border-editorial-border text-charcoal-light hover:border-terracotta'}`}>All</button>
          {specializations.map((spec) => (
            <button key={spec} type="button" onClick={() => setSelectedSpec(spec)}
              className={`px-3 py-1.5 text-sm font-sans rounded-sm border transition-colors ${selectedSpec === spec ? 'bg-terracotta-muted border-terracotta text-terracotta' : 'border-editorial-border text-charcoal-light hover:border-terracotta'}`}>{spec}</button>
          ))}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="mb-10">
          <p className="editorial-section-number">Your appointments</p>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <Card key={appt._id || appt.id} className="flex justify-between items-center !py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-terracotta" />
                  <div>
                    <p className="font-sans text-sm font-medium">{appt.therapist_name || 'Therapist'}</p>
                    <p className="font-serif text-xs text-charcoal-muted">{appt.date} at {appt.time}</p>
                  </div>
                </div>
                <button type="button" onClick={() => cancelAppointment(appt._id || appt.id)} className="p-2 text-charcoal-muted hover:text-terracotta" aria-label="Cancel appointment">
                  <X className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-16"><Spinner size="lg" label="Loading therapists..." /></div>
        : therapists.length === 0 ? <EmptyState icon={UserRound} title="No therapists available" description="Check back soon for available professionals." />
        : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <Card key={therapist._id || therapist.id}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-terracotta-muted flex items-center justify-center shrink-0">
                    <UserRound className="w-6 h-6 text-terracotta" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{therapist.name}</CardTitle>
                    <CardDescription>{therapist.specialization}</CardDescription>
                    {therapist.rating && <Badge className="mt-2">{therapist.rating} ★</Badge>}
                    {therapist.bio && <p className="font-serif text-sm text-charcoal-muted mt-3 line-clamp-3">{therapist.bio}</p>}
                    <div className="flex items-center gap-2 mt-3 text-xs font-sans text-charcoal-muted">
                      <Clock className="w-3 h-3" />{therapist.availability || 'Check availability'}
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => setBookingTherapist(therapist)}>Book session</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      {bookingTherapist && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardTitle>Book with {bookingTherapist.name}</CardTitle>
            <form onSubmit={handleBook} className="mt-4 space-y-4">
              <Input label="Date" type="date" required value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
              <Input label="Time" type="time" required value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} />
              <div>
                <label className="block text-sm font-sans font-medium text-charcoal mb-1.5">Notes</label>
                <textarea className="editorial-input min-h-[80px]" value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} placeholder="Anything you'd like the therapist to know..." />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={bookingLoading}>Confirm booking</Button>
                <Button type="button" variant="ghost" onClick={() => setBookingTherapist(null)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
