import React, { useEffect, useState } from 'react';
import Canvas from '../components/Canvas/Canvas';
import './DrawingSession.css';
import { useParams, useNavigate } from 'react-router-dom';

type Player = {
  id: string;
  name: string;
  // add other properties if needed
};

const DrawingSession = () => {
    const { serverId } = useParams();
    const [timer, setTimer] = useState(0);
    const [isDrawing, setIsDrawing] = useState(true);
    const [players, setPlayers] = useState<Player[]>([]);
    const [drawingId, setDrawingId] = useState<string | null>(null);

    // Initialisation du serveur et du drawingId
    useEffect(() => {
        async function setupSession() {
            if (!serverId) return;
            // On tente de récupérer le serveur existant
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/servers/${serverId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.drawings && data.drawings.length > 0) {
                    // Prend le dernier drawingId associé au serveur
                    setDrawingId(data.drawings[data.drawings.length - 1]);
                    return;
                }
            }
            // Sinon, crée un nouveau serveur + drawing
            const createRes = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/servers/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: serverId, maxPlayers: 8 }),
            });
            if (createRes.ok) {
                const createData = await createRes.json();
                setDrawingId(createData.drawingId);
            }
        }
        setupSession();
    }, [serverId]);

    useEffect(() => {
        // Charger timer persistant
        const stored = localStorage.getItem(`codraw-timer-${serverId}`);
        if (stored) setTimer(Number(stored));
        const interval = setInterval(() => {
            if (isDrawing) {
                setTimer(prevTimer => {
                    const next = prevTimer + 1;
                    localStorage.setItem(`codraw-timer-${serverId}`, String(next));
                    return next;
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isDrawing, serverId]);

    const immortalizeDrawing = () => {
        setIsDrawing(false);
        // Logic to save the drawing and update the gallery
    };

    const navigate = useNavigate();
    return (
        <div className="drawing-session-container">
            <nav className="drawing-navbar">
                <button onClick={() => navigate(-1)}>&larr; Back</button>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Drawing Session</span>
            </nav>
            <div className="drawing-canvas-area">
                <div className="drawing-timer">Timer: {timer}s</div>
                <button className="drawing-immortalize-btn" onClick={immortalizeDrawing} disabled={!isDrawing}>
                    Immortalize Drawing
                </button>
                {drawingId ? (
                    <Canvas drawingId={drawingId} />
                ) : (
                    <div>Chargement du dessin...</div>
                )}
            </div>
            <div className="drawing-players-list">
                <h3>Players in this session:</h3>
                <ul>
                    {players.map(player => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DrawingSession;