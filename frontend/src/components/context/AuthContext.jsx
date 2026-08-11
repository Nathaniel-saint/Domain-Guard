// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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

  const tokenRef = useRef(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  // Request Interceptor: Attach current token dynamically
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (tokenRef.current) {
          config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => api.interceptors.request.eject(requestInterceptor);
  }, []);

  // Response Interceptor: Refresh token automatically on 401
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
            const res = await axios.post(
              "http://localhost:8000/auth/api/token/refresh/",
              {},
              { withCredentials: true },
            );

            const newAccessToken = res.data.access;
            setAccessToken(newAccessToken);
            tokenRef.current = newAccessToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            setAccessToken(null);
            tokenRef.current = null;
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  // Initial mount check: Restore session using HttpOnly cookie
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/auth/api/token/refresh/",
          {},
          { withCredentials: true },
        );
        setAccessToken(res.data.access);
        tokenRef.current = res.data.access;
      } catch (err) {
        setAccessToken(null);
        tokenRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  const login = (token) => {
    setAccessToken(token);
    tokenRef.current = token;
  };

  const logout = async () => {
    try {
      await api.post("auth/api/logout/");
    } catch (err) {
      console.error(err);
    } finally {
      setAccessToken(null);
      tokenRef.current = null;
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
