import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthToken } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 