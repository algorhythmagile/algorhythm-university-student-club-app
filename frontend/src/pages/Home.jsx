import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="hero-title">Welcome to Algorhythm University</h1>
                <p className="hero-subtitle">Discover, Join, and Lead Student Clubs</p>

                {isLoggedIn ? (
                    <div className="hero-actions">
                        <p className="welcome-message">Welcome back! Ready to explore?</p>
                        <Link to="/clubs" className="btn btn-primary">Browse Clubs</Link>
                    </div>
                ) : (
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                    </div>
                )}
            </div>

            <div className="features-section">
                <div className="feature-card">
                    <h3>Join Clubs</h3>
                    <p>Connect with students who share your interests.</p>
                </div>
                <div className="feature-card">
                    <h3>Create Communities</h3>
                    <p>Start your own club and lead the way.</p>
                </div>
                <div className="feature-card">
                    <h3>Manage Events</h3>
                    <p>Organize and participate in exciting events.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
