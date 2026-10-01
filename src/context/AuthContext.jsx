import { createContext, useContext, useState, useEffect } from "react";
import { getAdminProfile } from "../services/authService";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminEmail");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is already logged in on mount
  useEffect(() => {
  const verifyAdmin = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getAdminProfile();

      if (response.success && response.user?.role === "admin") {
        setUser(response.user);
        setIsAuthenticated(true);

        localStorage.setItem(
          "adminUser",
          JSON.stringify(response.user)
        );
      } else {
        logout();
      }
    }  catch (error) {
  console.error("Failed to verify admin session:", error);
  logout();
    } finally {
      setLoading(false);
    }
  };

  verifyAdmin();
}, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
