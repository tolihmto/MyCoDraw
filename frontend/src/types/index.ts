// This file exports TypeScript types and interfaces used throughout the frontend application.

export interface User {
    id: string;
    username: string;
    email: string;
    profileImage: string;
    gallery: string[];
}

export interface Server {
    id: string;
    name: string;
    playerCount: number;
    status: 'active' | 'museum';
}

export interface Drawing {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: Date;
    userId: string;
}

export interface CanvasTool {
    type: 'brush' | 'eraser' | 'fill';
    color: string;
    size: number;
}

export interface DrawingSession {
    serverId: string;
    users: User[];
    drawings: Drawing[];
    timer: number;
}