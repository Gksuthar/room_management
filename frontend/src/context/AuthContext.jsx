import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './authContextInstance';

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const response = await api.get('/users');
    setUsers(response.data || []);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.user);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchUsers();
        await restoreSession();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchUsers, restoreSession]);

  const login = useCallback(async (userId) => {
    const response = await api.post('/auth/login', { userId });
    setCurrentUser(response.data.user);
    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setCurrentUser(null);
  }, []);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      loading,
      login,
      logout,
      refreshUsers,
    }),
    [users, currentUser, loading, login, logout, refreshUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
