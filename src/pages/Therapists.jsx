import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Star,
  User,
  Video,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL, parseJsonResponse } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { Select } from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
}

export default function Therapists() {
  const { user } = useAuth();
  const userId = user?.id;

  const [therapists, setTherapists] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    specialization: '',
    sort_by: 'rating',
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialization) params.set('specialization', filters.specialization);
      if (filters.sort_by) params.set('sort_by', filters.sort_by);
      const query = params.toString();
      const response = await fetch(`${API_BASE_URL}/therapists/${query ? `?${query}` : ''}`);
      setTherapists(await parseJsonResponse(response));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/therapists/specializations`);
      const data = await parseJsonResponse(response);
      setSpecializations(data.specializations || []);
    } catch {
      setSpecializations([]);
    }
  };

  const fetchAppointments = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/therapists/appointments/user/${userId}?upcoming_only=true`
      );
      setAppointments(await parseJsonResponse(response));
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    fetchTherapists();
  }, [filters]);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const selectTherapist = async (therapist) => {
    setSelectedTherapist(therapist);
    setSelectedSlot(null);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/therapists/${therapist._id}`);
      const data = await parseJsonResponse(response);
      const slots = (data.available_slots || [])
        .filter((slot) => !slot.is_booked)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setAvailableSlots(slots);
    } catch (err) {
      setError(err.message);
      setAvailableSlots([]);
    }
  };

  const bookAppointment = async () => {
    if (!selectedTherapist || !selectedSlot || !userId) return;
    setBooking(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/therapists/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          therapist_id: selectedTherapist._id,
          date: selectedSlot.start_time,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          session_type: 'video',
          notes: '',
        }),
      });
      await parseJsonResponse(response);
      setSuccess('Appointment booked successfully');
      setSelectedTherapist(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
      await Promise.all([fetchAppointments(), fetchTherapists()]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/therapists/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      await parseJsonResponse(response);
      await fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const groupedSlots = useMemo(() => {
    const groups = {};
    availableSlots.forEach((slot) => {
      const dateKey = new Date(slot.start_time).toLocaleDateString([], { timeZone: 'UTC' });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  }, [availableSlots]);

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="brand" className="mb-3">Professional care</Badge>
        <h1 className="text-3xl font-bold text-slate-900">Therapist Appointments</h1>
        <p className="mt-2 text-slate-600">
          Connect with licensed professionals for secure video sessions.
        </p>
      </div>

      {success && <Alert variant="success" className="mb-6">{success}</Alert>}
      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}

      {appointments.length > 0 && (
        <Card className="mb-8">
          <CardHeader title="Upcoming appointments" />
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
                <div>
                  <p className="font-medium text-slate-900">{appt.therapist_name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(appt.start_time).toLocaleString([], { timeZone: 'UTC' })}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => cancelAppointment(appt._id)}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Select
          label="Specialization"
          value={filters.specialization}
          onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
          className="min-w-[200px]"
        >
          <option value="">All specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </Select>
        <Select
          label="Sort by"
          value={filters.sort_by}
          onChange={(e) => setFilters((prev) => ({ ...prev, sort_by: e.target.value }))}
          className="min-w-[160px]"
        >
          <option value="rating">Rating</option>
          <option value="rate">Price</option>
          <option value="experience">Experience</option>
        </Select>
      </div>

      {loading ? (
        <Spinner label="Loading therapists..." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {therapists.map((therapist) => (
            <Card key={therapist._id}>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <User className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{therapist.name}</h3>
                      <Stars rating={therapist.rating} />
                    </div>
                    <Badge>${therapist.hourly_rate}/hr</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{therapist.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(therapist.specializations || []).slice(0, 3).map((spec) => (
                      <Badge key={spec}>{spec}</Badge>
                    ))}
                  </div>
                  <Button size="sm" className="mt-4" onClick={() => selectTherapist(therapist)}>
                    <Calendar className="h-4 w-4" />
                    Book session
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <Card className="max-h-[85vh] w-full max-w-lg overflow-y-auto">
            <CardHeader
              title={`Book with ${selectedTherapist.name}`}
              action={
                <button
                  type="button"
                  onClick={() => { setSelectedTherapist(null); setSelectedSlot(null); }}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              }
            />
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
              <Video className="h-4 w-4" />
              Video session
            </div>
            {Object.keys(groupedSlots).length === 0 ? (
              <EmptyState icon={Calendar} title="No slots available" description="Try another therapist or check back later." />
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date}>
                    <p className="mb-2 text-sm font-medium text-slate-700">{date}</p>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.start_time}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                            selectedSlot?.start_time === slot.start_time
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-slate-200 hover:border-brand-300'
                          }`}
                        >
                          {formatTime(slot.start_time)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  className="w-full"
                  disabled={!selectedSlot}
                  loading={booking}
                  onClick={bookAppointment}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm booking
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
