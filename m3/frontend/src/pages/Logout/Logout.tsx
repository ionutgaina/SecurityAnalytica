import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  localStorage.removeItem('accessToken');
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    nav('/');
  }, []);

  return null;
}