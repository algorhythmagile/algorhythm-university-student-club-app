import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateClub from './pages/CreateClub';
import ClubList from './pages/ClubList';
import MyClubs from './pages/MyClubs';
import ClubMembers from './pages/ClubMembers';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/my-clubs" element={<MyClubs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clubs/:id/members" element={<ClubMembers />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
