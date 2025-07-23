import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Museum.css';

interface ImmortalizedDrawing {
  id: string;
  title: string;
  serverId: string;
  serverName: string;
  imageUrl: string;
  createdAt: string;
  contributors: string[];
}

const Museum: React.FC = () => {
  const [drawings, setDrawings] = useState<ImmortalizedDrawing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchImmortalizedDrawings();
  }, []);

  const fetchImmortalizedDrawings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drawings/immortalized`);
      setDrawings(response.data);
    } catch (error) {
      console.error('Failed to fetch immortalized drawings:', error);
      setError('Erreur lors du chargement des dessins immortalisés');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="museum-container">
        <div className="loading">Chargement du musée...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="museum-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="museum-container">
      <header className="museum-header">
        <h1>🎨 Musée CoDraw</h1>
        <p>Découvrez les œuvres immortalisées par la communauté</p>
        <Link to="/" className="back-button">← Retour à l'accueil</Link>
      </header>

      <div className="museum-grid">
        {drawings.length === 0 ? (
          <div className="no-drawings">
            <p>Aucun dessin immortalisé pour le moment.</p>
            <p>Soyez le premier à créer une œuvre d'art collaborative !</p>
          </div>
        ) : (
          drawings.map((drawing) => (
            <div key={drawing.id} className="museum-card">
              <div className="drawing-image">
                <img src={drawing.imageUrl} alt={drawing.title} />
              </div>
              <div className="drawing-info">
                <h3>{drawing.title}</h3>
                <p className="server-name">Serveur: {drawing.serverName}</p>
                <p className="contributors">
                  Contributeurs: {drawing.contributors.join(', ')}
                </p>
                <p className="creation-date">
                  Immortalisé le: {new Date(drawing.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Museum;
