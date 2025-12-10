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

    if (!user) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">User Profile</h2>
                <p className="page-subtitle">Manage your memberships and clubs.</p>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem', color: 'red', textAlign: 'center' }}>{error}</div>}

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <strong className="form-label">Username</strong>
                        <div className="form-input" style={{ backgroundColor: 'var(--bg-body)', border: 'none' }}>
                            {user.username}
                        </div>
                    </div>
                    <div>
                        <strong className="form-label">Email</strong>
                        <div className="form-input" style={{ backgroundColor: 'var(--bg-body)', border: 'none' }}>
                            {user.email}
                        </div>
                    </div>
                    <div>
                        <strong className="form-label">Joined At</strong>
                        <div className="form-input" style={{ backgroundColor: 'var(--bg-body)', border: 'none' }}>
                            {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'memberships' ? 'active' : ''}`}
                    onClick={() => setActiveTab('memberships')}
                >
                    Joined Clubs
                </button>
                <button
                    className={`tab-btn ${activeTab === 'managed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('managed')}
                >
                    Created Clubs
                </button>
            </div>

            <div className="grid-container">
                {activeTab === 'memberships' && (
                    <>
                        {myMemberships.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>You haven't joined any clubs yet.</p>
                                <Link to="/clubs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Clubs</Link>
                            </div>
                        ) : (
                            myMemberships.map((club) => (
                                <div key={club.id} className="card">
                                    <h3>{club.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{club.description}</p>
                                </div>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'managed' && (
                    <>
                        {managedClubs.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>You haven't created any clubs yet.</p>
                                <Link to="/create-club" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Club</Link>
                            </div>
                        ) : (
                            managedClubs.map((club) => (
                                <div key={club.id} className="card">
                                    <h3>{club.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{club.description}</p>
                                    <Link to={`/clubs/${club.id}/members`} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                                        View Members
                                    </Link>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/" style={{ color: 'var(--text-secondary)' }}>&larr; Back to Home</Link>
            </div>
        </div>
    );
};

export default Profile;
