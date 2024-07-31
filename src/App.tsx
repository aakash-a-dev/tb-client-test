import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleLogin = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
  };

  return (
    <div>
      {token && userId ? (
        <Chat token={token} userId={userId} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
