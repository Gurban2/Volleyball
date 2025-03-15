/**
 * Мок-модуль для эмуляции Firebase без подключения к реальному Firebase
 * Обеспечивает локальную работу приложения без зависимости от Firebase
 */

// Мок-объект auth для авторизации
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: Function) => {
    console.log('🔄 Вызов мок-функции onAuthStateChanged');
    callback(null);
    return () => {}; // функция отписки
  },
  signInWithEmailAndPassword: async () => {
    console.log('🔄 Вызов мок-функции signInWithEmailAndPassword');
    return { user: null };
  },
  createUserWithEmailAndPassword: async () => {
    console.log('🔄 Вызов мок-функции createUserWithEmailAndPassword');
    return { user: null };
  },
  signOut: async () => {
    console.log('🔄 Вызов мок-функции signOut');
  }
};

// Мок-объект db для работы с Firestore
export const db = {
  collection: (name: string) => {
    console.log(`🔄 Вызов мок-функции collection для "${name}"`);
    return {
      doc: (id: string) => {
        console.log(`🔄 Вызов мок-функции doc для "${id}"`);
        return {
          get: async () => {
            console.log(`🔄 Вызов мок-функции get для документа "${id}"`);
            return {
              exists: false,
              data: () => null
            };
          },
          set: async (data: any) => {
            console.log(`🔄 Вызов мок-функции set с данными:`, data);
          },
          update: async (data: any) => {
            console.log(`🔄 Вызов мок-функции update с данными:`, data);
          }
        };
      }
    };
  },
  doc: (path: string) => {
    console.log(`🔄 Вызов мок-функции doc для пути "${path}"`);
    return {
      get: async () => {
        console.log(`🔄 Вызов мок-функции get для документа по пути "${path}"`);
        return {
          exists: false,
          data: () => null
        };
      },
      set: async (data: any) => {
        console.log(`🔄 Вызов мок-функции set с данными для "${path}":`, data);
      },
      update: async (data: any) => {
        console.log(`🔄 Вызов мок-функции update с данными для "${path}":`, data);
      }
    };
  }
};

// Мок-объект storage для работы с хранилищем файлов
export const storage = {
  ref: (path: string) => {
    console.log(`🔄 Вызов мок-функции ref для пути "${path}"`);
    return {
      put: async (file: File) => {
        console.log(`🔄 Вызов мок-функции put для файла "${file.name}"`);
        return {
          ref: {
            getDownloadURL: async () => {
              console.log(`🔄 Вызов мок-функции getDownloadURL`);
              return `https://via.placeholder.com/300?text=${encodeURIComponent(file.name)}`;
            }
          }
        };
      },
      delete: async () => {
        console.log(`🔄 Вызов мок-функции delete для пути "${path}"`);
      }
    };
  }
};

// Функция-заглушка для проверки соединения с Firestore
export const checkFirestoreConnection = async (): Promise<boolean> => {
  console.log('🔄 Вызов мок-функции checkFirestoreConnection');
  return true;
};

// Функция-заглушка для переключения режима сети
export const toggleNetworkMode = (): boolean => {
  console.log('🔄 Вызов мок-функции toggleNetworkMode');
  return true;
};

// Функция-заглушка для принудительного включения онлайн-режима
export const forceOnline = (): void => {
  console.log('🔄 Вызов мок-функции forceOnline');
};

// Функция-заглушка для проверки онлайн-режима
export const isNetworkOnline = (): boolean => {
  console.log('🔄 Вызов мок-функции isNetworkOnline');
  return true;
}; 