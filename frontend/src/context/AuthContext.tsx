import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";

interface DecodedToken {
  user_id: number;
  exp: number;
}

interface AuthContextType {
  authenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Helper function to clear storage
  const clearAuth = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setAuthenticated(false);
    setUserId(null);
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setAuthenticated(true);
        setUserId(decoded.user_id);
      } else {
        // Token expired, so clear the storage
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    const decoded = jwtDecode<DecodedToken>(access);
    setUserId(decoded.user_id);
    setAuthenticated(true);
    navigate("/", { replace: true });
  };

  const logout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, isLoading, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
