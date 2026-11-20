import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser, clearSession } from '../utils/storage.js';
import { authApi } from '../api/index.js';
import { getToken, UNAUTHORIZED_EVENT } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Sin token no hay sesión válida (aunque quede un usuario guardado de antes)
  const [user, setUser] = useState(() => (getToken() ? getCurrentUser() : null));

  const setSessionUser = useCallback((u) => {
    setCurrentUser(u);
    setUser(u);
  }, []);

  // Inicia sesión contra el backend (guarda el JWT) y devuelve el usuario
  const signIn = async (correo, password) => {
    const u = await authApi.login(correo, password);
    setSessionUser(u);
    return u;
  };

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Al abrir la app se refrescan rol y puntos desde el servidor
  useEffect(() => {
    if (!getToken()) return;
    authApi.me().then(setSessionUser).catch(() => {});
  }, [setSessionUser]);

  // Token vencido o inválido -> cerrar sesión
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  return <AuthContext.Provider value={{ user, signIn, setSessionUser, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
