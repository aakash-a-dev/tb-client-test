import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface ChatProps {
  token: string;
  userId: string | null;
}

interface Message {
  senderId: string;
  message: string;
}

interface User {
  id: string;
  fullName: string;
}

const Chat: React.FC<ChatProps> = ({ token, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (token) {
      const socketIo = io('http://localhost:3000', {
        auth: { token },
      });

      socketIo.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketIo.on('receive_message', (data: { senderId: string; message: string }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      setSocket(socketIo);

      return () => {
        socketIo.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    // Fetch registered users
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSendMessage = () => {
    if (socket && selectedUser && userId) {
      socket.emit('message_user', { recipientId: selectedUser.id, message: newMessage });
      setMessages((prevMessages) => [...prevMessages, { senderId: userId, message: newMessage }]);
      setNewMessage('');
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setMessages([]); // Clear messages when a new user is selected
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        <h3>Select User</h3>
        <ul>
          {users.map(user => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              style={{ cursor: 'pointer', margin: '5px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {user.fullName}
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div>
          <h3>Messages with {selectedUser.fullName}</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                {msg.senderId === userId ? 'You' : 'Other'}: {msg.message}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
