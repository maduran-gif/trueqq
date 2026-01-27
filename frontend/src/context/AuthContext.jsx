import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getMe();
        setUser(response.data.data);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginAPI({ email, password });
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerAPI(userData);
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrarse';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateBalance = (newBalance) => {
    setUser(prev => ({ ...prev, trueqqBalance: newBalance }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateBalance,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};