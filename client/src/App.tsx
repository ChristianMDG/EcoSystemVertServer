import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

export default function App() {
  const [token, setToken] = useState<string>('');

  return (
    <div>
      <Register />
      <Login setToken={setToken} />
      <Profile token={token} />
    </div>
  );
}