import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [formData, setFormData] = useState({
        club_id: '',
        title: '',
        description: '',
        event_date: '',
        location: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchManagedClubs = async () => {
            try {
                const response = await api.get('/clubs/my-clubs');
                setClubs(response.data || []);
            } catch (err) {
                setError('Failed to fetch your clubs');
            }
        };

        fetchManagedClubs();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/clubs/${formData.club_id}/events`, {
                title: formData.title,
                description: formData.description,
                event_date: new Date(formData.event_date).toISOString(),
                location: formData.location
            });
            alert('Event created successfully!');
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event');
        }
    };

    if (clubs.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h2>Create Event</h2>
                <p>You need to manage at least one club to create an event.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header">
                <h2 className="page-title">Create New Event</h2>
                <p className="page-subtitle">Host an event for your club.</p>
            </div>

            {error && <div className="alert alert-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label className="form-label">Select Club</label>
                    <select
                        name="club_id"
                        value={formData.club_id}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">Select a club...</option>
                        {clubs.map((club) => (
                            <option key={club.id} value={club.id}>
                                {club.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input"
                        rows="4"
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
