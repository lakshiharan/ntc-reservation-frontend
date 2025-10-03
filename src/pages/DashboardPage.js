import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard'; // Import your smaller UI component

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if the user has a token
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    }
  }, [navigate]);

  return (
    <div>
      <Dashboard /> {/* Reuse the Dashboard UI component */}
    </div>
  );
};

export default DashboardPage;
