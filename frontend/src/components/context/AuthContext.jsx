// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const api = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inject Bearer token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => api.interceptors.request.eject(requestInterceptor);
  }, [accessToken]);

  // Handle Token Refresh on 401
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("auth/api/token/refresh/")
        ) {
          originalRequest._retry = true;

          try {
            const res = await api.post("auth/api/token/refresh/");
            const newAccessToken = res.data.access;
            setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await api.post("auth/api/token/refresh/");
        setAccessToken(res.data.access);
      } catch (err) {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  const login = (token) => {
    setAccessToken(token);
  };

  const logout = async () => {
    try {
      await api.post("auth/api/logout/");
    } catch (err) {
      console.error(err);
    } finally {
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, isAuthenticated: !!accessToken }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
