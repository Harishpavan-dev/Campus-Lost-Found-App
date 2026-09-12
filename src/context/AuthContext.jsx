import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'student@campus.edu': { userId: 'user1', fullName: 'Ahmed Khan', email: 'student@campus.edu', role: 'student', password: 'student123' },
  'admin@campus.edu': { userId: 'admin1', fullName: 'Admin User', email: 'admin@campus.edu', role: 'admin', password: 'admin123' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus_lf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    const demoUser = DEMO_USERS[email];
    if (demoUser && demoUser.password === password) {
      const { password: _, ...userData } = demoUser;
      setUser(userData);
      localStorage.setItem('campus_lf_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    }
    
    // Also check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('campus_lf_registered') || '[]');
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('campus_lf_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    if (DEMO_USERS[email]) {
      setLoading(false);
      return { success: false, error: 'Email already exists' };
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('campus_lf_registered') || '[]');
    if (registeredUsers.find(u => u.email === email)) {
      setLoading(false);
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      userId: `user_${Date.now()}`,
      fullName,
      email,
      password,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('campus_lf_registered', JSON.stringify(registeredUsers));
    
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('campus_lf_user', JSON.stringify(userData));
    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campus_lf_user');
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
