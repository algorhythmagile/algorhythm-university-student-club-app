import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyClubs = () => {
    const [myMemberships, setMyMemberships] = useState([]);
    const [managedClubs, setManagedClubs] = useState([]);
    const [activeTab, setActiveTab] = useState('memberships');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const membershipsRes = await api.get('/clubs/my-memberships');
                setMyMemberships(membershipsRes.data || []);

                const managedRes = await api.get('/clubs/my-clubs');
                setManagedClubs(managedRes.data || []);
            } catch (err) {
                setError('Failed to fetch clubs');
            }
        };

        fetchClubs();
    }, []);

    return (
        <div className="my-clubs-container">
            <h2>My Clubs</h2>
            {error && <p className="error">{error}</p>}

            <div className="tabs">
                <button
                    className={activeTab === 'memberships' ? 'active' : ''}
                    onClick={() => setActiveTab('memberships')}
                >
                    Member Of
                </button>
                <button
                    className={activeTab === 'managed' ? 'active' : ''}
                    onClick={() => setActiveTab('managed')}
                >
                    Managed By Me
                </button>
            </div>

            <div className="club-list">
                {activeTab === 'memberships' && (
                    <div>
                        {myMemberships.length === 0 ? <p>You haven't joined any clubs yet.</p> : (
                            myMemberships.map((club) => (
                                <div key={club.id} className="club-card">
                                    <h3>{club.name}</h3>
                                    <p>{club.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'managed' && (
                    <div>
                        {managedClubs.length === 0 ? <p>You haven't created any clubs yet.</p> : (
                            managedClubs.map((club) => (
                                <div key={club.id} className="club-card">
                                    <h3>{club.name}</h3>
                                    <p>{club.description}</p>
                                    <Link to={`/clubs/${club.id}/members`}>View Members</Link>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default MyClubs;
