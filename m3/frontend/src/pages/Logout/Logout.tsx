import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userEmail');
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    nav('/');
  }, []);

  return null;
}