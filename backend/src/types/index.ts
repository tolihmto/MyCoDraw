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
    createdBy: string;
    imageUrl: string;
    immortalized: boolean;
}

export interface DrawingSession {
    serverId: string;
    users: User[];
    drawings: Drawing[];
    timer: number;
}