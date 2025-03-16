import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Определяем интерфейс пользователя (без Firebase)
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Определяем интерфейс для пользовательских данных, включая роли
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'organizer' | 'admin';
  photoURL?: string | null;
  profileCompleted: boolean;
  // Дополнительные поля профиля
  nickname?: string | null;
  age?: number | null;
  height?: number | null;
  createdAt?: any;
}

interface AuthContextProps {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isOrganizer: () => boolean;
  authError: string | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Функция для обновления данных пользователя
  const refreshUserData = async () => {
    console.log('🔄 Обновление данных пользователя');
    if (!currentUser) return;
    try {
      // Здесь должен быть запрос к API для получения данных пользователя
      const response = await fetch(`http://localhost:3000/api/users/${currentUser.uid}`);
      if (response.ok) {
        const data = await response.json() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Заглушка для регистрации - может быть заменена на реальный API call
  const register = async (email: string, password: string, displayName: string) => {
    console.log('🔄 Регистрация пользователя');
    setAuthError(null);

    try {
      setLoading(true);
      // Имитация задержки API-запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Здесь должен быть запрос к API для регистрации
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка регистрации');
      }
      
      const data = await response.json() as { uid?: string };
      
      // Создаем пользователя из ответа API
      const newUser: User = {
        uid: data.uid || `user-${Date.now()}`,
        email: email,
        displayName: displayName,
        photoURL: null
      };
      
      // Создаем данные пользователя
      const newUserData: UserData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: 'user',
        photoURL: newUser.photoURL,
        profileCompleted: false
      };
      
      // Сохраняем в локальном хранилище
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userData', JSON.stringify(newUserData));
      
      // Устанавливаем состояние
      setCurrentUser(newUser);
      setUserData(newUserData);
      
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error instanceof Error ? error.message : 'Ошибка регистрации');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Функция для входа - может быть заменена на реальный API call
  const login = async (email: string, password: string) => {
    console.log('🔄 Вход пользователя');
    setAuthError(null);

    try {
      setLoading(true);
      // Имитация задержки API-запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Здесь должен быть запрос к API для входа
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      
      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }
      
      const data = await response.json() as { 
        uid?: string; 
        displayName?: string; 
        photoURL?: string;
        role?: 'user' | 'organizer' | 'admin';
        profileCompleted?: boolean;
      };
      
      // Создаем пользователя из ответа API
      const user: User = {
        uid: data.uid || `user-${Date.now()}`,
        email: email,
        displayName: data.displayName || email.split('@')[0],
        photoURL: data.photoURL || null
      };
      
      // Создаем данные пользователя
      const userDataObj: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: data.role || 'user',
        photoURL: user.photoURL,
        profileCompleted: data.profileCompleted || false
      };
      
      // Сохраняем в локальном хранилище
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userData', JSON.stringify(userDataObj));
      
      setCurrentUser(user);
      setUserData(userDataObj);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error instanceof Error ? error.message : 'Ошибка входа');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для выхода
  const logout = async () => {
    console.log('🔄 Выход пользователя (локальные данные)');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    
    // Очищаем локальное хранилище
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
    
    // Очищаем данные пользователя
    setCurrentUser(null);
    setUserData(null);
    setLoading(false);
  };

  // Загрузка сохраненных данных при инициализации
  useEffect(() => {
    console.log('🔄 Инициализация AuthContext (локальные данные)');
    
    // Восстанавливаем сохраненную сессию из localStorage, если она есть
    const savedUser = localStorage.getItem('currentUser');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedUser && savedUserData) {
      setCurrentUser(JSON.parse(savedUser));
      setUserData(JSON.parse(savedUserData));
      console.log('✅ Восстановлена сохраненная сессия');
    } else {
      console.log('ℹ️ Сохраненная сессия не найдена');
    }
    
    setLoading(false);
  }, []);

  // Проверка на роль администратора
  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  // Проверка на роль организатора
  const isOrganizer = () => {
    return userData?.role === 'organizer' || userData?.role === 'admin';
  };

  const value: AuthContextProps = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    isAdmin,
    isOrganizer,
    authError,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 