import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { login as loginService, getCurrentUser, logout as logoutService } from "../services/authService";
import { seedStore } from "../services/dataStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seed the store once on mount.
  useEffect(() => {
    seedStore(false);
    const stored = getCurrentUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedIn = await loginService(email, password);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null,
    userId: user?.id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const RequireAuth = ({ children, roles: _roles }) => {
  // Used by protected route wrappers.
  return children;
};

export default AuthContext;
