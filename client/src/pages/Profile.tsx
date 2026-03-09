import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data.user);
      } catch (err: any) {
        alert('Please login first');
        navigate('/login');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}