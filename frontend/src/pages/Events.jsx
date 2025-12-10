import { useEffect, useState } from 'react';
import api from '../utils/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data || []);
            } catch (err) {
                setError('Failed to fetch events');
            }
        };

        fetchEvents();
    }, []);

    const handleJoin = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/join`);
            alert('Successfully joined the event!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to join event');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Upcoming Events</h2>
                <p className="page-subtitle">Discover what's happening on campus.</p>
            </div>

            {error && <div className="alert alert-error" style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

            <div className="grid-container">
                {events.map((event) => (
                    <div key={event.id} className="card">
                        <h3>{event.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {new Date(event.event_date).toLocaleString()}
                        </p>
                        <p style={{ fontWeight: '500', marginBottom: '1rem' }}>📍 {event.location}</p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            {event.description}
                        </p>
                        <button
                            onClick={() => handleJoin(event.id)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Join Event
                        </button>
                    </div>
                ))}
            </div>

            {events.length === 0 && !error && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
                    <p>No upcoming events found.</p>
                </div>
            )}
        </div>
    );
};

export default Events;
