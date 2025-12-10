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
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Create Club</h1>
                <p className="page-subtitle">Start a new community at Algorhythm University.</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Club Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="e.g. Robotics Club"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            placeholder="What is your club about?"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-block">
                            Create Club
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClub;
