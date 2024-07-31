// src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/v1/list');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleMessage = (recipientId: string) => {
        const message = prompt('Enter your message:');
        if (message && socket) {
            socket.emit('message_user', { recipientId, message });
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.fullName} 
                        <button onClick={() => handleMessage(user.id)}>Message</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
