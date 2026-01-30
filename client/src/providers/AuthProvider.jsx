import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { createContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          if (
            error.message?.includes('auth') ||
            error.message?.includes('token')
          ) {
            toast.error('You need to login first');
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [getToken]);
  return (
    <AuthContext.Provider value={{ getToken }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
