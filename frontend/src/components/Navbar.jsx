import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Algorhythm Club
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/clubs" className="nav-link">Clubs</Link>
                            <Link to="/create-club" className="nav-link">Create Club</Link>
                            <Link to="/events" className="nav-link">Events</Link>
                            <Link to="/create-event" className="nav-link">Create Event</Link>
                            <Link to="/my-events" className="nav-link">My Events</Link>
                            <Link to="/my-clubs" className="nav-link">My Clubs</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <button onClick={handleLogout} className="nav-button logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-button register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
