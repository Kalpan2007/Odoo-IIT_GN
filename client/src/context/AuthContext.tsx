import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI, roleRequestsAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { fullName: string; email: string; workEmail: string; password: string }) => Promise<void>;
  logout: () => void;
  requestRoleChange: (newRole: string, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user profile
          const response = await authAPI.getProfile();
          
          if (response.success) {
            setUser({
              id: response.user.id,
              email: response.user.email,
              fullName: response.user.full_name,
              workEmail: response.user.email,
              role: response.user.role || 'team_member'
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Save token and user data
        localStorage.setItem('token', response.token);
        setUser({
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.full_name,
          workEmail: response.user.email,
          role: response.user.role || 'team_member'
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { fullName: string; email: string; workEmail: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.signup({
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password
      });
      
      if (response.success) {
        // Auto-login after signup
        await login(userData.email, userData.password);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    
    // Also logout from backend
    authAPI.logout().catch(() => {
      // Ignore errors during logout
    });
  };

  const requestRoleChange = async (newRole: string, reason: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await roleRequestsAPI.create({
        requested_role: newRole,
        reason: reason
      });
      
      if (response.success) {
        // Role request created successfully
        return response;
      } else {
        throw new Error(response.message || 'Failed to request role change');
      }
    } catch (error) {
      console.error('Role change request error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, requestRoleChange }}>
      {children}
    </AuthContext.Provider>
  );
};