'use client';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('nexfolio_token');
        const storedUser = localStorage.getItem('nexfolio_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('nexfolio_token');
        localStorage.removeItem('nexfolio_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('nexfolio_token', receivedToken);
      localStorage.setItem('nexfolio_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      
      return { success: true, message: response.data.message || 'Logged in successfully!' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, domain) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/register', { name, email, password, domain });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('nexfolio_token', receivedToken);
      localStorage.setItem('nexfolio_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);

      return { success: true, message: response.data.message || 'Account registered successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login handler
  const loginWithGoogle = async (idToken, domain) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/google-login', { idToken, domain });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('nexfolio_token', receivedToken);
      localStorage.setItem('nexfolio_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);

      return { success: true, message: response.data.message || 'Successfully signed in with Google! 🎉' };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      const message = error.response?.data?.message || 'Google Sign In failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeUser = async () => {
    if (!user || !user.id) return { success: false, message: "User is not logged in." };
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/upgrade', { userId: user.id });
      const { user: updatedUser } = response.data;
      
      localStorage.setItem('nexfolio_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, message: response.data.message || 'Successfully upgraded to Premium! 💎' };
    } catch (error) {
      console.error('Upgrade error:', error);
      const message = error.response?.data?.message || 'Upgrade failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('nexfolio_token');
    localStorage.removeItem('nexfolio_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        loginWithGoogle,
        upgradeUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.any
};
