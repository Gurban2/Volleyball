/**
 * Конфигурация Firebase для проекта
 * Настройка аутентификации, базы данных Firestore и хранилища Storage
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHpnRMDWPYKQSHKfxNep_WW9-fksYE1vk",
  authDomain: "volleyballshedule.firebaseapp.com",
  projectId: "volleyballshedule",
  storageBucket: "volleyballshedule.appspot.com",
  messagingSenderId: "821925467615",
  appId: "1:821925467615:web:b89a0338f7ef829cd5e06a"
};

// Инициализация Firebase
console.log('Инициализация Firebase...');
const app = initializeApp(firebaseConfig);
console.log('Firebase инициализирован:', app.name);

// Экспорт сервисов Firebase
console.log('Инициализация сервисов Firebase...');
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
console.log('Сервисы Firebase инициализированы');
export default app; 