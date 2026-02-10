import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';

const ProtectedRoute = () => {
    const { isAdmin, loading } = useProductContext();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-neutral-600">Verifying session...</p>
                </div>
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
