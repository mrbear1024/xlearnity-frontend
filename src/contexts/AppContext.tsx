import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserProfile } from '@/hooks/useApi';
import { UserProfile } from '@/types';

// 应用状态接口
interface AppState {
  user: UserProfile | null;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'zh';
  isLoading: boolean;
  error: string | null;
}

// 应用动作类型
type AppAction = 
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'zh' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// 初始状态
const initialState: AppState = {
  user: null,
  theme: 'system',
  language: 'zh',
  isLoading: false,
  error: null,
};

// 在 initialState 下方添加
const USER_STORAGE_KEY = 'user_profile';

// 状态reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// 上下文接口
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // 便捷方法
  setUser: (user: UserProfile | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'en' | 'zh') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
  logout: () => void; // 新增
}

// 创建上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

// 上下文提供者组件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { data: userProfile, isLoading: userLoading } = useUserProfile();
  const { currentLanguage, changeLanguage } = useLanguage();

  // 同步用户数据
  useEffect(() => {
    console.log("userProfile: " + userProfile);
    if (userProfile) {
      dispatch({ type: 'SET_USER', payload: userProfile });
    }
    dispatch({ type: 'SET_LOADING', payload: userLoading });
  }, [userProfile, userLoading]);

  // 同步语言设置
  useEffect(() => {
    if (currentLanguage !== state.language && (currentLanguage === 'en' || currentLanguage === 'zh')) {
      dispatch({ type: 'SET_LANGUAGE', payload: currentLanguage });
    }
  }, [currentLanguage, state.language]);

  // 自动登录：初始化时从 localStorage 读取用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    console.log("savedUser: " + savedUser);
    console.log("state.user: " + state.user);
    if (savedUser) {
      try {
        dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
      } catch {}
    }
  }, []);

  // 登录后保存用户信息到 localStorage
  const setUser = (user: UserProfile | null) => {
    dispatch({ type: 'SET_USER', payload: user });
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      console.log("setUser: " + localStorage.getItem(USER_STORAGE_KEY));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  // 新增登出方法
  const logout = () => {
    console.log("logout");
    setUser(null);
    // 可选：清理其他状态
    localStorage.removeItem(USER_STORAGE_KEY);
    dispatch({ type: 'RESET_STATE' });
  };

  // 便捷方法
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // 可以在这里添加主题切换逻辑
    localStorage.setItem('theme', theme);
  };

  const setLanguage = (language: 'en' | 'zh') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    changeLanguage(language);
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setUser,
    setTheme,
    setLanguage,
    setLoading,
    setError,
    resetState,
    logout, // 新增
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// 导出上下文
export { AppContext }; 