import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Automatically match base URL depending on local/host environments
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8282'
  : '/backend';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('relms_token'));
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          setUser(data.data.user);
        } else {
          // Token expired or invalid, invalidate locally
          logout();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [token]);

  const login = async (email, password, remember = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, remember })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { token: newToken, user: newUser } = data.data;
        localStorage.setItem('relms_token', newToken);
        setToken(newToken);
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        return { success: false, message: data.message || 'Login failed. Please verify credentials.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network connection failed. Please check internet access.' };
    }
  };

  const signup = async (fullName, email, phone, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
          confirm_password: confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Sign-up failed.' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network connection failed. Please check internet access.' };
    }
  };

  const loginWithGoogle = async (idToken, remember = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: idToken, remember })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { token: newToken, user: newUser } = data.data;
        localStorage.setItem('relms_token', newToken);
        setToken(newToken);
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        return { success: false, message: data.message || 'Google login failed.' };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, message: 'Network connection failed. Please check internet access.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('relms_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, loginWithGoogle, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
