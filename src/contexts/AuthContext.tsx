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
    console.log('🔄 Обновление данных пользователя - начало');
    if (!currentUser) {
      console.log('❌ Нет текущего пользователя');
      return;
    }
    try {
      // Получаем сохраненный токен
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ Нет токена авторизации');
        return;
      }
      
      console.log('🔄 Запрос к API /api/users/me с токеном', token.substring(0, 15) + '...');
      
      // Запрос к API с токеном авторизации
      const response = await fetch(`http://localhost:5000/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Данные пользователя получены:', userData);
        
        // Обновляем данные пользователя
        const userDataObj: UserData = {
          uid: currentUser.uid,
          email: userData.email,
          displayName: userData.username,
          role: userData.role || 'user',
          photoURL: userData.profileImage || null,
          profileCompleted: true  // или получать из API
        };
        
        console.log('🖼️ Фото профиля из API:', userData.profileImage);
        console.log('🖼️ Фото профиля для сохранения в контексте:', userDataObj.photoURL);
        
        // Сохраняем предыдущий photoURL для сравнения
        const prevUserData = await JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('📊 Сравнение фото:');
        console.log('   - Предыдущее:', prevUserData.photoURL);
        console.log('   - Новое:', userDataObj.photoURL);
        
        setUserData(userDataObj);
        localStorage.setItem('userData', JSON.stringify(userDataObj));
        console.log('✅ Данные успешно обновлены в контексте');
      } else {
        console.log('❌ Ошибка при получении данных:', response.status);
        const errorText = await response.text();
        console.log('Текст ошибки:', errorText);
      }
    } catch (error) {
      console.error('❌ Ошибка при обновлении данных:', error);
    }
  };

  // Функция регистрации - переделка с заглушки на реальное API
  const register = async (email: string, password: string, displayName: string) => {
    setAuthError(null);

    try {
      setLoading(true);
      
      // Исправленный URL и формат данных
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: displayName, // переименовываем поле как того требует API
          email,
          password
        }),
      });
      
      // Обработка ошибок от сервера
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Ошибка регистрации');
      }
      
      // Получаем токен из ответа
      const { token } = await response.json();
      
      // Декодируем JWT для получения информации о пользователе
      const decoded = parseJwt(token);
      
      // Создаем пользователя из данных токена
      const newUser: User = {
        uid: decoded.user.id,
        email: email,
        displayName: displayName,
        photoURL: null
      };
      
      // Создаем данные пользователя
      const newUserData: UserData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: decoded.user.role || 'user',
        photoURL: newUser.photoURL,
        profileCompleted: false
      };
      
      // Сохраняем токен и информацию о пользователе
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userData', JSON.stringify(newUserData));
      
      setCurrentUser(newUser);
      setUserData(newUserData);
      
      return newUser;
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка регистрации');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Добавить функцию для декодирования JWT токена
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  // Функция для входа - может быть заменена на реальный API call
  const login = async (email: string, password: string) => {
    setAuthError(null);

    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
      
      // Важно: сначала получаем текст ответа
      const responseText = await response.text();
      
      // Потом пробуем его распарсить как JSON
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error('Неверный формат ответа от сервера');
      }
      
      // Проверяем успешность запроса
      if (!response.ok) {
        const errorMessage = data.msg || 'Неверные учетные данные';
        throw new Error(errorMessage);
      }
      
      // Проверяем наличие токена в ответе
      if (!data.token) {
        throw new Error('Токен не получен от сервера');
      }
      
      // Сохраняем токен
      localStorage.setItem('authToken', data.token);
      
      // Получаем информацию о пользователе
      try {
        const decoded = parseJwt(data.token);
        
        // Получаем детальную информацию о пользователе
        const userResponse = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Не удалось получить данные пользователя');
        }
        
        const userData = await userResponse.json();
        
        // Создаем объект пользователя
        const user = {
          uid: decoded.user.id,
          email: userData.email,
          displayName: userData.username,
          photoURL: userData.profileImage || null
        };
        
        // Сохраняем данные пользователя
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        
        // Устанавливаем userData
        const userDataObj = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: decoded.user.role || 'user',
          photoURL: user.photoURL,
          profileCompleted: true
        };
        
        localStorage.setItem('userData', JSON.stringify(userDataObj));
        setUserData(userDataObj);
        
        return user;
      } catch (userError) {
        throw new Error('Ошибка получения данных пользователя после успешного входа');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка входа');
      throw error; // Пробрасываем ошибку дальше
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для выхода
  const logout = async () => {
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
    // Восстанавливаем сохраненную сессию из localStorage, если она есть
    const savedUser = localStorage.getItem('currentUser');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedUser && savedUserData) {
      setCurrentUser(JSON.parse(savedUser));
      setUserData(JSON.parse(savedUserData));
    } else {
      // Удаляем console.log
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