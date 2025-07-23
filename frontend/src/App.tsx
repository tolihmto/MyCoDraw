import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import DrawingSession from './pages/DrawingSession';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Museum from './pages/Museum';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/drawing/:serverId" element={<DrawingSession />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/museum" element={<Museum />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;