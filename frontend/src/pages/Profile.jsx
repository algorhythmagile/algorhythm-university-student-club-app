import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [myMemberships, setMyMemberships] = useState([]);
    const [managedClubs, setManagedClubs] = useState([]);
    const [activeTab, setActiveTab] = useState('memberships');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/auth/me');
                setUser(userRes.data);

                const membershipsRes = await api.get('/clubs/my-memberships');
                setMyMemberships(membershipsRes.data || []);

                const managedRes = await api.get('/clubs/my-clubs');
                setManagedClubs(managedRes.data || []);
            } catch (err) {
                setError('Failed to fetch profile data');
            }
        };

        fetchData();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p className="error">{error}</p>}

            <div className="profile-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'memberships' ? 'active' : ''}
                    onClick={() => setActiveTab('memberships')}
                >
                    Joined Clubs
                </button>
                <button
                    className={activeTab === 'managed' ? 'active' : ''}
                    onClick={() => setActiveTab('managed')}
                >
                    Created Clubs
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

export default Profile;
