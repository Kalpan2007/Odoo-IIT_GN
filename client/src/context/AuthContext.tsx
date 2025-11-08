import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { fullName: string; email: string; workEmail: string; password: string }) => Promise<void>;
  logout: () => void;
  requestRoleChange: (newRole: string) => Promise<void>; // Add role change request
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - adjust as needed for your environment
const API_BASE_URL = 'http://localhost:5000/api';

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
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data.user.id,
              email: data.user.email,
              fullName: data.user.full_name,
              workEmail: data.user.email,
              role: data.user.role || 'team_member'
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.full_name,
          workEmail: data.user.email,
          role: data.user.role || 'team_member'
        });
      } else {
        throw new Error(data.message || 'Login failed');
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
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: userData.fullName,
          email: userData.email,
          password: userData.password,
          role: 'team_member' // Default role is always team_member
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Auto-login after signup
        await login(userData.email, userData.password);
      } else {
        throw new Error(data.message || 'Signup failed');
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
    
    // Also logout from Supabase if needed
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => {
      // Ignore errors during logout
    });
  };

  const requestRoleChange = async (newRole: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real implementation, this would send a request to admins
    // For now, we'll just simulate it
    console.log(`User ${user.id} requested role change to ${newRole}`);
    
    // In a real app, you would:
    // 1. Send a request to the backend to create a role change request
    // 2. Notify admins
    // 3. Wait for admin approval
    
    // For demo purposes, we'll just show a message
    alert(`Role change request to ${newRole} has been sent to administrators for approval.`);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, requestRoleChange }}>
      {children}
    </AuthContext.Provider>
  );
};