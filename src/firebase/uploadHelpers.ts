/**
 * Функциональность загрузки файлов через Firebase больше не используется.
 * Вместо этого используется локальное хранилище и имитация загрузки через сервис mockApi.
 * 
 * @see src/services/mockApi.ts
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/**
 * Простая загрузка файла в Firebase Storage
 * @param file Файл для загрузки
 * @param path Путь в хранилище
 * @returns URL загруженного файла
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Начинаем загрузку файла...');
    
    // Создаем ссылку для хранилища
    const storageRef = ref(storage, path);
    
    // Загружаем файл
    const uploadResult = await uploadBytes(storageRef, file);
    
    // Получаем публичную ссылку
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw error;
  }
}; 