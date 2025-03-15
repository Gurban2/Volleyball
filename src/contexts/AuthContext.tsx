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

// Мокнутые данные пользователя для разработки
const MOCK_USER: User = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Тестовый Пользователь',
  photoURL: 'https://via.placeholder.com/150'
};

const MOCK_ADMIN_USER: User = {
  uid: 'mock-admin-123',
  email: 'admin@example.com',
  displayName: 'Администратор',
  photoURL: 'https://via.placeholder.com/150'
};

const MOCK_ORGANIZER_USER: User = {
  uid: 'mock-organizer-123',
  email: 'organizer@example.com',
  displayName: 'Организатор',
  photoURL: 'https://via.placeholder.com/150'
};

// Мокнутые данные пользователя
const MOCK_USER_DATA: UserData = {
  uid: MOCK_USER.uid,
  email: MOCK_USER.email,
  displayName: MOCK_USER.displayName,
  role: 'user',
  photoURL: MOCK_USER.photoURL,
  profileCompleted: true,
  nickname: 'Volleyball_Player',
  age: 25,
  height: 180
};

// Мокнутые данные администратора
const MOCK_ADMIN_DATA: UserData = {
  uid: MOCK_ADMIN_USER.uid,
  email: MOCK_ADMIN_USER.email,
  displayName: MOCK_ADMIN_USER.displayName,
  role: 'admin',
  photoURL: MOCK_ADMIN_USER.photoURL,
  profileCompleted: true
};

// Мокнутые данные организатора
const MOCK_ORGANIZER_DATA: UserData = {
  uid: MOCK_ORGANIZER_USER.uid,
  email: MOCK_ORGANIZER_USER.email,
  displayName: MOCK_ORGANIZER_USER.displayName,
  role: 'organizer',
  photoURL: MOCK_ORGANIZER_USER.photoURL,
  profileCompleted: true
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Заглушка для обновления данных пользователя
  const refreshUserData = async () => {
    console.log('🔄 Обновление данных пользователя (локальные данные)');
    // В этой заглушке ничего не делаем, просто возвращаем успешный результат
    return;
  };

  // Заглушка для регистрации
  const register = async (email: string, password: string, displayName: string) => {
    console.log('🔄 Регистрация нового пользователя (локальные данные)');
    setAuthError(null);

    // Эмулируем процесс регистрации
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки

    // Создаем нового пользователя
    const newUser: User = {
      uid: `user-${Date.now()}`,
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
      photoURL: null,
      profileCompleted: false,
      createdAt: new Date().toISOString()
    };

    // Сохраняем в локальном хранилище
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('userData', JSON.stringify(newUserData));
    
    // Устанавливаем состояние
    setCurrentUser(newUser);
    setUserData(newUserData);
    setLoading(false);

    return newUser;
  };

  // Заглушка для входа
  const login = async (email: string, password: string) => {
    console.log('🔄 Вход пользователя (локальные данные)');
    setAuthError(null);

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
    
    // В зависимости от email выбираем тип пользователя
    let user: User;
    let userDataMock: UserData;
    
    if (email === 'admin@example.com') {
      user = MOCK_ADMIN_USER;
      userDataMock = MOCK_ADMIN_DATA;
    } else if (email === 'organizer@example.com') {
      user = MOCK_ORGANIZER_USER;
      userDataMock = MOCK_ORGANIZER_DATA;
    } else {
      user = MOCK_USER;
      userDataMock = MOCK_USER_DATA;
    }
    
    // Сохраняем в локальном хранилище
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(userDataMock));
    
    setCurrentUser(user);
    setUserData(userDataMock);
    setLoading(false);
    
    return user;
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