import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h1>Welcome to Algorhythm University Student Club</h1>
            {isLoggedIn ? (
                <div>
                    <h2>Başarıyla giriş yaptınız!</h2>
                    <p>Hoşgeldiniz.</p>
                    <div className="home-buttons">
                        <Link to="/create-club"><button>Create Club</button></Link>
                        <Link to="/clubs"><button>View Clubs</button></Link>
                        <Link to="/my-clubs"><button>My Clubs</button></Link>
                        <Link to="/profile"><button>Profile</button></Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>Please register or login to continue.</p>
                    <nav>
                        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Home;
