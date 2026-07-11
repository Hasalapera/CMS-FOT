import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (institutionalId, password) => {
    const response = await api.post('/users/login', { institutionalId, password });
    const { token: newToken } = response.data;
    localStorage.setItem('token', newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
    setToken(newToken);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = { user, token, login, logout, isAuthenticated: !!token, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};