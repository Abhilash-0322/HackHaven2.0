import { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Stethoscope, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { therapistsApi } from '../lib/api';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

export default function Therapists() {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [therapistList, userAppts] = await Promise.all([
        therapistsApi.list(),
        user?.id ? therapistsApi.getUserAppointments(user.id) : Promise.resolve([]),
      ]);
      setTherapists(Array.isArray(therapistList) ? therapistList : []);
      setAppointments(Array.isArray(userAppts) ? userAppts : []);
    } catch (err) {
      setError(err.message || 'Failed to load therapists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const selectTherapist = async (therapist) => {
    setError('');
    setSelectedSlot(null);
    try {
      const details = await therapistsApi.get(therapist.id || therapist._id);
      setSelected(details);
    } catch (err) {
      setError(err.message || 'Failed to load therapist details');
    }
  };

  const handleBook = async () => {
    if (!selected || !selectedSlot || !user?.id) return;
    setBooking(true);
    setError('');
    setSuccess('');
    try {
      await therapistsApi.bookAppointment({
        user_id: user.id,
        therapist_id: selected.id || selected._id,
        date: selectedSlot.start_time,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        session_type: 'video',
      });
      setSuccess('Appointment booked successfully!');
      setSelectedSlot(null);
      await loadData();
      const details = await therapistsApi.get(selected.id || selected._id);
      setSelected(details);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await therapistsApi.cancelAppointment(appointmentId);
      await loadData();
      setSuccess('Appointment cancelled');
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
    }
  };

  if (loading) {
    return <Spinner label="Loading therapists..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-clinical-900">Therapists</h1>
        <p className="mt-1 text-clinical-500">Book sessions with licensed professionals</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-6">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-6">
          {success}
        </Alert>
      )}

      {appointments.length > 0 && (
        <Card className="mb-8">
          <CardHeader title="Your appointments" />
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.appointment_id || appt._id}
                className="flex items-center justify-between rounded-lg border border-clinical-200 p-4"
              >
                <div>
                  <p className="font-medium text-clinical-900">{appt.therapist_name}</p>
                  <p className="text-sm text-clinical-500">
                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                    {new Date(appt.start_time).toLocaleString()}
                  </p>
                  <Badge variant={appt.status === 'scheduled' ? 'accent' : 'default'} className="mt-1">
                    {appt.status}
                  </Badge>
                </div>
                {appt.status === 'scheduled' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(appt.appointment_id || appt._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-semibold text-clinical-900">Available therapists</h2>
          {therapists.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No therapists available"
              description="Check back later for available professionals."
            />
          ) : (
            therapists.map((therapist) => (
              <Card
                key={therapist.id || therapist._id}
                className={`cursor-pointer transition-colors ${
                  (selected?.id || selected?._id) === (therapist.id || therapist._id)
                    ? 'border-accent-300 bg-accent-50/30'
                    : 'hover:border-clinical-300'
                }`}
                onClick={() => selectTherapist(therapist)}
              >
                <div className="flex gap-4">
                  {therapist.photo_url && (
                    <img
                      src={therapist.photo_url}
                      alt={therapist.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-clinical-900">{therapist.name}</h3>
                    <p className="text-sm text-clinical-500">{therapist.education}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(therapist.specializations || []).slice(0, 3).map((s) => (
                        <Badge key={s} variant="accent">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-clinical-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {therapist.rating || 'N/A'}
                      </span>
                      <span>${therapist.hourly_rate}/hr</span>
                      <span>{therapist.experience_years} yrs exp</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div>
          {selected ? (
            <Card>
              <CardHeader title={selected.name} description={selected.bio} />
              <p className="mb-4 text-sm text-clinical-600">{selected.bio}</p>
              <h3 className="mb-3 text-sm font-medium text-clinical-700">Available slots</h3>
              {(selected.available_slots || []).length > 0 ? (
                <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                  {selected.available_slots.map((slot) => {
                    const slotKey = `${slot.start_time}-${slot.end_time}`;
                    return (
                      <button
                        key={slotKey}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                          selectedSlot?.start_time === slot.start_time
                            ? 'border-accent-500 bg-accent-50 text-accent-700'
                            : 'border-clinical-200 hover:border-accent-300'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        {new Date(slot.start_time).toLocaleString()} –{' '}
                        {new Date(slot.end_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mb-4 text-sm text-clinical-500">No available slots</p>
              )}
              <Button onClick={handleBook} loading={booking} disabled={!selectedSlot}>
                Book appointment
              </Button>
            </Card>
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="Select a therapist"
              description="Choose a therapist from the list to view availability and book a session."
            />
          )}
        </div>
      </div>
    </div>
  );
}
