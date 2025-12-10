import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateClub from './pages/CreateClub';
import ClubList from './pages/ClubList';
import MyClubs from './pages/MyClubs';
import ClubMembers from './pages/ClubMembers';
import Profile from './pages/Profile';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import EventParticipants from './pages/EventParticipants';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-club" element={<CreateClub />} />
          <Route path="/clubs" element={<ClubList />} />
          <Route path="/my-clubs" element={<MyClubs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clubs/:id/members" element={<ClubMembers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/events/:id/participants" element={<EventParticipants />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
