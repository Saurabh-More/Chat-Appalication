import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
    // Check if user is not authenticated
    if (!user) 
    {
        return <Navigate to={redirect} replace />;
    }

    // Render children if provided, otherwise use Outlet for nested routes
    return children ? children : <Outlet />;
};

export default ProtectRoute;
