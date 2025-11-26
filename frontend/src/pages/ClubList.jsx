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
            alert('Failed to join club');
        }
    };

    return (
        <div className="club-list-container">
            <h2>Student Clubs</h2>
            {error && <p className="error">{error}</p>}
            <div className="club-list">
                {clubs.map((club) => (
                    <div key={club.id} className="club-card">
                        <h3>{club.name}</h3>
                        <p>{club.description}</p>
                        <button onClick={() => handleJoin(club.id)}>Join</button>
                    </div>
                ))}
            </div>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default ClubList;
