import React, { useEffect, useState } from 'react';
import { Drawing } from '../../types';

interface GalleryProps {
    userId: string;
}

const Gallery: React.FC<GalleryProps> = ({ userId }) => {
    const [drawings, setDrawings] = useState<Drawing[]>([]);

    useEffect(() => {
        // Fetch user's saved drawings from the backend
        const fetchDrawings = async () => {
            try {
                const response = await fetch(`/api/drawings?userId=${userId}`); // Adjust the endpoint as necessary
                const data = await response.json();
                setDrawings(data);
            } catch (error) {
                console.error('Error fetching drawings:', error);
            }
        };

        fetchDrawings();
    }, []);

    return (
        <div className="gallery">
            <h2>Your Gallery</h2>
            <div className="drawing-list">
                {drawings.map((drawing) => (
                    <div key={drawing.id} className="drawing-item">
                        <img src={drawing.imageUrl} alt={`Drawing ${drawing.id}`} />
                        <p>{drawing.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;