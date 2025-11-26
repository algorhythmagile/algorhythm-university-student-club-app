import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateClub = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/clubs', formData);
            navigate('/'); // Redirect to home after success
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create club');
        }
    };

    return (
        <div className="create-club-container">
            <h2>Create a New Club</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Club Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create Club</button>
            </form>
        </div>
    );
};

export default CreateClub;
