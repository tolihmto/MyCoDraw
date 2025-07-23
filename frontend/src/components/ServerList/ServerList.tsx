import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Server } from '../../types/Server';
import './ServerList.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ServerList: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initial fetch for SSR/SEO fallback
    const fetchServers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/servers`);
        const data = await response.json();
        setServers(Array.isArray(data) ? data : data.servers || []);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServers();

    // Socket.io real-time updates
    const sock = io(API_BASE_URL);
    setSocket(sock);
    sock.on('serverListUpdate', (data: Server[]) => {
      setServers(data);
    });
    sock.on('serverPlayerCountUpdate', (data: { serverId: string; playerCount: number }) => {
      setServers((prev) =>
        prev.map((s) =>
          s.id === data.serverId ? { ...s, playerCount: data.playerCount } : s
        )
      );
    });
    return () => {
      sock.disconnect();
    };
  }, []);

  if (loading) return <div className="server-list-loading">Chargement des serveurs...</div>;

  return (
    <div className="server-list-container">
      {servers.length === 0 ? (
        <div className="server-list-empty">
          <span role="img" aria-label="No server" style={{fontSize: '2rem', marginBottom: 8}}>😴</span>
          <div>Aucun serveur actif pour le moment.</div>
        </div>
      ) : (
        <ul className="server-list-simple">
          {servers.map((server) => (
            <li key={server.id} className={`server-list-item status-${server.status}`}>
              <div className="server-main-info">
                <span className="server-title">{server.name}</span>
                <span className={`server-status-badge ${server.status}`}>{server.status === 'active' ? 'En cours' : 'Musée'}</span>
              </div>
              <div className="server-desc-simple">{server.description || <span style={{color:'#aaa'}}>Aucune description</span>}</div>
              <div className="server-meta-simple">
                <span className="server-players">👥 {server.playerCount} joueur{server.playerCount > 1 ? 's' : ''}</span>
                <button
                  className="server-list-btn"
                  disabled={server.status === 'museum'}
                  onClick={() => navigate(`/drawing/${server.id}`)}
                >
                  {server.status === 'active' ? 'Rejoindre' : 'Consulter'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServerList;