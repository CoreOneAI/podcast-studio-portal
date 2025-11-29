// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

// Import your VideoRoom component
import VideoRoom from './components/VideoRoom';
// Import the new AuthManager component
import AuthManager from './components/AuthManager';

// Home component (no change)
const Home = () => (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#333' }}>
        <h2>Welcome to the Encore Portal Home!</h2>
        <p>This is where your dashboard and other portal features will reside.</p>
    </div>
);

// Navbar component (no change)
const Navbar = () => {
    const defaultRoomName = "internal-team-meeting-room";
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: '#222',
            padding: '15px 0',
            borderBottom: '1px solid #444'
        }}>
            <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.1em' }}>Home</Link>
            <Link to={`/video-room/${defaultRoomName}`} style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.1em' }}>Video Chat</Link>
        </nav>
    );
};

// Wrapper component for VideoRoom (no change)
const VideoRoomPage = () => {
    const { roomName } = useParams();
    return <VideoRoom roomName={roomName} />;
};


function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate an initial authentication check or data load
        // You might integrate Firebase auth's onAuthStateChanged here if you want to delay showing the app until auth status is known
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'blue',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3em',
                zIndex: 9999
            }}>
                Loading application...
            </div>
        );
    }

    return (
        <Router>
            <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
                <Navbar />
                <AuthManager /> {/* <--- Insert AuthManager here! */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/video-room/:roomName" element={<VideoRoomPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
