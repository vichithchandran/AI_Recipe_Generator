import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid email or password";
      return { success: false, message };
    }
  };

  const demoLogin = async () => {
    try {
      const data = await authService.demoLogin();
      if (data.success) {
        localStorage.setItem("token", data.token);
        // A fresh demo session should always see the banner.
        localStorage.removeItem("demoBannerDismissed");
        setUser(data.user);
        return { success: true, demo: data.demo };
      }
      return { success: false, message: data.message || "Could not start the demo" };
    } catch (error) {
      const message = error.response?.data?.message || "Could not start the demo. Please try again.";
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.signup(name, email, password);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore error on logout
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const data = await authService.forgotPassword(email);
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset email";
      return { success: false, message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const data = await authService.resetPassword(token, password);
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
      }
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    demoLogin,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isDemo: !!user?.is_demo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

