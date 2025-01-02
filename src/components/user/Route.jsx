// Import necessary modules from React and React Router
import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";

// A reusable function to handle role-based authentication logic
const useRoleHandler = (setUserRole) => {
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    // Set user role from localStorage if authenticated
    if (isAuthenticated && storedRole) {
      setUserRole(storedRole);
    }
  }, [setUserRole]);

  return {
    isAuthenticated: localStorage.getItem("isAuthenticated"),
    storedRole: localStorage.getItem("userRole"),
  };
};

// Component to handle user-specific routes
export const UserRoute = ({ children }) => {
  const { setUserRole } = useContext(AppContext);
  const { isAuthenticated, storedRole } = useRoleHandler(setUserRole);

  // Redirect to login if not authenticated or role not found
  if (!isAuthenticated || !storedRole) {
    return <Navigate to="/login" />;
  }

  // Redirect to admin dashboard if user is an admin
  if (storedRole === "admin") {
    return <Navigate to="/admin" />;
  }

  // Render children if user has the appropriate role
  return children;
};

// Component to handle admin-specific routes
export const AdminRoute = ({ children }) => {
  const { setUserRole } = useContext(AppContext);
  const { isAuthenticated, storedRole } = useRoleHandler(setUserRole);

  // Redirect to login if not authenticated or role not found
  if (!isAuthenticated || !storedRole) {
    return <Navigate to="/login" />;
  }

  // Redirect to user dashboard if the role is not admin
  if (storedRole === "user") {
    return <Navigate to="/" />;
  }

  // Render children if user has the appropriate role
  return children;
};
