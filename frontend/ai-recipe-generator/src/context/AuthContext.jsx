import { createContext, useContext, useEffect, useState } from "react";
import { dummyUser } from "../data/dummyData";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UseAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(dummyUser);
  }, []);

  const login = async (email, password) => {
    setUser(dummyUser);
    return { success: true };
  };

  const register = async (name, emai, password) => {
    setUser({ ...dummyUser, name });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
