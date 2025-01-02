import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(AppContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const DEFAULT_CREDENTIALS = {
    admin: { username: "admin", password: "admin123" },
    user: { username: "user", password: "user123" },
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (isAuthenticated && storedRole) {
      setUserRole(storedRole);
      navigate(storedRole === "admin" ? "/admin" : "/");
    }
  }, [navigate, setUserRole]);

  const validateCredentials = ({ username, password }) => {
    if (
      username === DEFAULT_CREDENTIALS.admin.username &&
      password === DEFAULT_CREDENTIALS.admin.password
    ) {
      return "admin";
    } else if (
      username === DEFAULT_CREDENTIALS.user.username &&
      password === DEFAULT_CREDENTIALS.user.password
    ) {
      return "user";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = validateCredentials(credentials);

    if (role) {
      setUserRole(role);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
      navigate(role === "admin" ? "/admin" : "/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-2xl">
        <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          Welcome Back!
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-lg hover:from-indigo-700 hover:to-blue-800 transition duration-300 ease-in-out"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
