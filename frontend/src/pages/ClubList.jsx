import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const ClubList = () => {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await api.get('/clubs');
                setClubs(response.data);
            } catch (err) {
                setError('Failed to fetch clubs');
            }
        };

        fetchClubs();
    }, []);

    const handleJoin = async (clubId) => {
        try {
            await api.post(`/clubs/${clubId}/join`);
            alert('Joined club successfully!');
        } catch (err) {
            alert('Failed to join club: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Student Clubs</h2>
                <p className="page-subtitle">Explore and join communities that matter to you.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid-container">
                {clubs.map((club) => (
                    <div key={club.id} className="card">
                        <h3>{club.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
                            {club.description}
                        </p>
                        <button
                            onClick={() => handleJoin(club.id)}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Join Club
                        </button>
                    </div>
                ))}
            </div>

            {clubs.length === 0 && !error && (
                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
                    <p>No clubs found. Be the first to create one!</p>
                    <Link to="/create-club" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Club
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ClubList;
