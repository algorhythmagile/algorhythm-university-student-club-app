import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';

const ClubMembers = () => {
    const { id } = useParams();
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get(`/clubs/${id}/members`);
                setMembers(response.data || []);
            } catch (err) {
                setError('Failed to fetch members');
            }
        };

        fetchMembers();
    }, [id]);

    return (
        <div className="club-members-container">
            <h2>Club Members</h2>
            {error && <p className="error">{error}</p>}
            <div className="member-list">
                {members.length === 0 ? <p>No members yet.</p> : (
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>
                                User ID: {member.user_id} (Joined: {new Date(member.joined_at).toLocaleDateString()})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Link to="/my-clubs">Back to My Clubs</Link>
        </div>
    );
};

export default ClubMembers;
