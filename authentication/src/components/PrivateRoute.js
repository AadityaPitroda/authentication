import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
