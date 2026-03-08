import { useEffect, useState } from 'react';
import { api } from '../api/axios';

export default function Profile({ token }: { token: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!token) return <p>Please login</p>;

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>UserID: {user.userId}</p>
          <p>Email: {user.email}</p>
            <p>Name: {user.name}</p>
            <p>Role: {user.role}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}