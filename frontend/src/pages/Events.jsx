import { useEffect, useState } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';

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

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Upcoming Events</h2>
                <p className="page-subtitle">Discover what's happening on campus.</p>
            </div>

            {error && <div className="alert alert-error" style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

            <div className="grid-container">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
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
