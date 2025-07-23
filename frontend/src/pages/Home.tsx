import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ServerList from '../components/ServerList/ServerList';
import CreateServerModal from '../components/CreateServerModal/CreateServerModal';
import './Home.css';

const Home: React.FC = () => {
    const { user, logout } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content">
                    <h1 className="logo">🎨 CoDraw</h1>
                    <nav className="nav-menu">
                        <Link to="/museum" className="nav-link">Musée</Link>
                        {user ? (
                            <div className="user-menu">
                                <Link to="/profile" className="nav-link">Mon Profil</Link>
                                <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="auth-btn login-btn">Connexion</Link>
                                <Link to="/register" className="auth-btn register-btn">Inscription</Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="home-main">
                <section className="hero-section">
                    <h2>Dessinez ensemble en temps réel</h2>
                    <p>Rejoignez des serveurs de dessin collaboratif ou créez le vôtre !</p>
                </section>

                <section className="servers-section">
                    <div className="section-header">
                        <h3>Serveurs disponibles</h3>
                        {user && (
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="create-server-btn"
                            >
                                + Créer un serveur
                            </button>
                        )}
                    </div>
                    <ServerList />
                </section>
            </main>

            {showCreateModal && (
                <CreateServerModal 
                    onClose={() => setShowCreateModal(false)}
                    onServerCreated={() => {
                        setShowCreateModal(false);
                        // Refresh server list
                    }}
                />
            )}
        </div>
    );
};

export default Home;