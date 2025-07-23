import React from 'react';

interface ProfileProps {
    user: {
        username: string;
        email: string;
        profileImage: string;
        // add other fields as needed
    };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    return (
        <div className="profile">
            <h2>Mon Profil</h2>
            <form>
                <div>
                    <label>Nom d'utilisateur:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        readOnly
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        readOnly
                    />
                </div>
                <div>
                    <label>Image de profil:</label>
                    <input
                        type="text"
                        name="profileImage"
                        value={user.profileImage}
                        readOnly
                    />
                </div>
            </form>
        </div>
    );
};

export default Profile;