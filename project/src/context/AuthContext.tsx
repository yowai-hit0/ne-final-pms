import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthService } from '../services/auth.service';
import { AuthState, LoginCredentials, RegisterData, User, VerificationData } from '../types';

// Define the AuthContext state and functions
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (data: VerificationData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state for the auth reducer
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Auth context provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user, token } = await AuthService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await AuthService.register(data);
      dispatch({ type: 'AUTH_FAIL', payload: '' }); // Not logged in yet, need verification
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Registration failed',
      });
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (data: VerificationData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await AuthService.verifyEmail(data);
      dispatch({ type: 'AUTH_FAIL', payload: '' }); // Not logged in yet, need to login
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Verification failed',
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      await AuthService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      // Force logout even if API call fails
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Check authentication state
  const checkAuthState = async () => {
    dispatch({ type: 'AUTH_START' });
    
    const token = AuthService.getToken();
    const storedUser = AuthService.getStoredUser();
    
    if (!token || !storedUser) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return;
    }
    
    try {
      // Verify token is valid by fetching current user profile
      const user = await AuthService.getProfile();
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user, token } 
      });
    } catch (error) {
      // If token is invalid, logout
      AuthService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    verifyEmail,
    logout,
    checkAuthState,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};