import React, { useState } from 'react';
import axios from 'axios';
import './CreateServerModal.css';

interface Props {
  onClose: () => void;
  onServerCreated: () => void;
}

const CreateServerModal: React.FC<Props> = ({ onClose, onServerCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/servers`, { name, description });
      onServerCreated();
    } catch (err: any) {
      setError('Erreur lors de la création du serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Créer un nouveau serveur</h2>
        <form onSubmit={handleSubmit} className="create-server-form">
          <div className="form-group">
            <label htmlFor="name">Nom du serveur</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={32}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (optionnelle)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={128}
              disabled={isLoading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="create-btn" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateServerModal;
