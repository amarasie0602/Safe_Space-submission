import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch {
      setError('Unable to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      {loading && <LoadingSpinner />}
      {!loading && error && <><ErrorMessage message={error} /><button className="btn btn-ghost btn-sm" onClick={fetchBookings}>Try again</button></>}
      {!loading && !error && bookings.length === 0 && <div className="empty-state">No bookings yet.</div>}
      {!loading && !error && bookings.map((booking) => (
        <Card key={booking._id}>
          <p>
            <strong>{booking.counselor?.name}</strong>
          </p>
          <span className="badge">{booking.status}</span>
        </Card>
      ))}
    </div>
  );
};

export default AdminBookings;
