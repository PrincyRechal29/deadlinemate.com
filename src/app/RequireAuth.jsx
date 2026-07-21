import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './lib/AuthProvider.jsx';
import Spinner from './components/Spinner.jsx';

export default function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <Spinner label="Loading your deadlines…" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
