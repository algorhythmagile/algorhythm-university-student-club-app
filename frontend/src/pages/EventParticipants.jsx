import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const EventParticipants = () => {
    const { id } = useParams();
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await api.get(`/events/${id}/participants`);
                setParticipants(response.data || []);
            } catch (err) {
                setError('Failed to fetch participants');
            }
        };

        fetchParticipants();
    }, [id]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <h2 className="page-title">Event Participants</h2>
                <p className="page-subtitle">See who is attending this event.</p>
            </div>

            {error && <div className="alert alert-error" style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

            <div className="card">
                {participants.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No participants yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>ID</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>User ID</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Joined At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant) => (
                                <tr key={participant.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{participant.id}</td>
                                    <td style={{ padding: '0.75rem' }}>{participant.user_id}</td>
                                    <td style={{ padding: '0.75rem' }}>{new Date(participant.joined_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/my-events" style={{ color: 'var(--text-secondary)' }}>&larr; Back to My Events</Link>
            </div>
        </div>
    );
};

export default EventParticipants;
