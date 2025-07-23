import React from 'react';
import { useState, useEffect } from 'react';
import Profile from '../components/Profile/Profile';
import Gallery from '../components/Gallery/Gallery';

const UserProfile: React.FC = () => {
    interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImage: string;
    // Add other user properties as needed
}

const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/api/user/profile');
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <Profile user={user} />
            <Gallery userId={user.id} />
        </div>
    );
};

export default UserProfile;