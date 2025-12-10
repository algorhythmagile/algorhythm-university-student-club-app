import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyEvents = () => {
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [managedEvents, setManagedEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('joined');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const joinedRes = await api.get('/events/my-joined');
                setJoinedEvents(joinedRes.data || []);

                const managedRes = await api.get('/events/my-managed');
                setManagedEvents(managedRes.data || []);
            } catch (err) {
                setError('Failed to fetch your events');
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">My Events</h2>
                <p className="page-subtitle">Track events you're attending or hosting.</p>
            </div>

            {error && <div className="alert alert-error" style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'joined' ? 'active' : ''}`}
                    onClick={() => setActiveTab('joined')}
                >
                    Attending
                </button>
                <button
                    className={`tab-btn ${activeTab === 'managed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('managed')}
                >
                    Hosting
                </button>
            </div>

            <div className="grid-container">
                {activeTab === 'joined' && (
                    <>
                        {joinedEvents.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>You haven't joined any events yet.</p>
                                <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Events</Link>
                            </div>
                        ) : (
                            joinedEvents.map((event) => (
                                <div key={event.id} className="card">
                                    <h3>{event.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {new Date(event.event_date).toLocaleString()}
                                    </p>
                                    <p style={{ fontWeight: '500', marginBottom: '1rem' }}>📍 {event.location}</p>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {event.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'managed' && (
                    <>
                        {managedEvents.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>You aren't hosting any events.</p>
                                <Link to="/create-event" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Event</Link>
                            </div>
                        ) : (
                            managedEvents.map((event) => (
                                <div key={event.id} className="card">
                                    <h3>{event.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        {new Date(event.event_date).toLocaleString()}
                                    </p>
                                    <p style={{ fontWeight: '500', marginBottom: '1rem' }}>📍 {event.location}</p>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                        {event.description}
                                    </p>
                                    <Link to={`/events/${event.id}/participants`} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                                        View Participants
                                    </Link>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyEvents;
