import React, { useEffect, useState } from 'react';
import { Drawing } from '../../types';

const Museum: React.FC = () => {
    const [drawings, setDrawings] = useState<Drawing[]>([]);

    useEffect(() => {
        const fetchDrawings = async () => {
            try {
                const response = await fetch('/api/drawings'); // Adjust the API endpoint as needed
                const data = await response.json();
                setDrawings(data);
            } catch (error) {
                console.error('Error fetching drawings:', error);
            }
        };

        fetchDrawings();
    }, []);

    return (
        <div className="museum">
            <h1>Musée des Dessins</h1>
            <div className="drawing-list">
                {drawings.map((drawing) => (
                    <div key={drawing.id} className="drawing-item">
                        <h2>{drawing.title}</h2>
                        <img src={drawing.imageUrl} alt={drawing.title} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Museum;