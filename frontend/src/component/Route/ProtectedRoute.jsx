import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, isAdmin, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isAdmin && user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
