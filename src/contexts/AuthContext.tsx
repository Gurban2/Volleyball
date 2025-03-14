import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Регистрация нового пользователя
  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('Начинаем регистрацию пользователя:', email);
      // Регистрация пользователя
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Пользователь зарегистрирован, обновляем профиль:', displayName);
      // Обновление профиля пользователя
      await updateProfile(user, { displayName });

      console.log('Создаем документ пользователя в Firestore');
      // Создание документа пользователя в Firestore с расширенными полями
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName,
        role: "user", // По умолчанию обычный пользователь
        createdAt: serverTimestamp(),
        // Поля, которые будут заполнены позже и не могут быть изменены
        height: null,
        age: null,
        nickname: null,
        photoURL: null,
        profileCompleted: false // Флаг, указывающий, заполнил ли пользователь обязательные поля профиля
      });
      
      console.log('Пользователь успешно зарегистрирован и данные сохранены в Firestore');
      return user;
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      setAuthError(`Ошибка при регистрации: ${error.message || 'Неизвестная ошибка'}`);
      throw error;
    }
  };

  // Вход в систему
  const login = async (email: string, password: string) => {
    try {
      console.log('Выполняем вход пользователя:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Пользователь успешно вошел в систему');
      return userCredential.user;
    } catch (error: any) {
      console.error("Ошибка при входе:", error);
      setAuthError(`Ошибка при входе: ${error.message || 'Неизвестная ошибка'}`);
      throw error;
    }
  };

  // Выход из системы
  const logout = async () => {
    try {
      console.log('Выполняем выход из системы');
      await signOut(auth);
      console.log('Пользователь успешно вышел из системы');
    } catch (error: any) {
      console.error('Error during logout:', error);
      setAuthError(`Ошибка при выходе: ${error.message || 'Неизвестная ошибка'}`);
      throw error;
    }
  };

  // Проверяем, является ли пользователь администратором
  const isAdmin = () => {
    if (!userData) return false;
    return userData.role === 'admin' && userData.profileCompleted === true;
  };

  // Проверяем, является ли пользователь организатором
  const isOrganizer = () => {
    if (!userData) return false;
    return (userData.role === 'organizer' || userData.role === 'admin') && userData.profileCompleted === true;
  };

  // Наблюдаем за изменениями состояния аутентификации
  useEffect(() => {
    console.log('🔄 Инициализация AuthContext...');
    console.log('Auth object:', auth);
    console.log('DB object:', db);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Изменение состояния аутентификации:', user ? `Пользователь: ${user.email}` : 'Не авторизован');
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('📚 Получаем данные пользователя из Firestore для:', user.uid);
          // Получаем данные пользователя из Firestore
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            console.log('✅ Данные пользователя найдены в Firestore');
            const userDataFromFirestore = docSnap.data() as UserData;
            console.log('📋 Данные пользователя:', userDataFromFirestore);
            setUserData(userDataFromFirestore);
            
            // Проверка, требуется ли заполнение профиля и перенаправление
            if (window.location.pathname !== '/profile/complete' && 
                userDataFromFirestore.profileCompleted === false && 
                window.location.pathname !== '/login' && 
                window.location.pathname !== '/register') {
              console.log('🔄 Перенаправление на страницу заполнения профиля');
              window.location.href = '/profile/complete';
            }
          } else {
            console.log('❌ Документ пользователя не найден, создаем базовый');
            // Если документ не существует, создаем базовый
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: 'user',
              photoURL: user.photoURL,
              profileCompleted: false
            };
            
            console.log('📝 Сохраняем базовые данные пользователя:', newUserData);
            await setDoc(docRef, newUserData);
            setUserData(newUserData);
            
            // Перенаправляем на страницу заполнения профиля
            if (window.location.pathname !== '/profile/complete' && 
                window.location.pathname !== '/login' && 
                window.location.pathname !== '/register') {
              console.log('🔄 Перенаправление на страницу заполнения профиля');
              window.location.href = '/profile/complete';
            }
          }
        } catch (error: any) {
          console.error('❌ Ошибка при получении данных пользователя:', error);
          setAuthError(`Ошибка при получении данных: ${error.message || 'Неизвестная ошибка'}`);
        }
      } else {
        console.log('👤 Пользователь не авторизован, очищаем userData');
        setUserData(null);
      }
      
      console.log('🏁 Загрузка завершена, установка loading = false');
      setLoading(false);
    });
    
    console.log('🔄 AuthContext инициализирован');
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    isAdmin,
    isOrganizer,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 