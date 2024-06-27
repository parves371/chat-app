import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ user, children, redirect = "/login" }) => {
  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to={redirect} />;
  }
  // Render the children (protected components) if the user is authenticated
  return children ? children : <Outlet />;
};

export default ProtectRoute;
