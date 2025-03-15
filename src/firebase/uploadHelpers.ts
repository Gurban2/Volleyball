/**
 * Моковые функции для загрузки файлов (без Firebase)
 * Симулируют работу с файлами без подключения к Firebase Storage
 */

/**
 * Универсальная функция для загрузки файлов
 * Возвращает placeholder URL для отображения
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  console.log(`🔧 Симуляция загрузки файла "${file.name}" по пути "${path}"`);
  
  // Имитация задержки при загрузке
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Сохраняем в localStorage для демонстрационных целей
  try {
    // Создаем reader для преобразования файла в data URL
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Сохраняем в localStorage
    localStorage.setItem(`file:${path}`, dataUrl);
    console.log(`✅ Файл "${file.name}" успешно сохранен в localStorage`);
    
    // Возвращаем placeholder URL или data URL для отображения
    return dataUrl;
  } catch (error) {
    console.error('❌ Ошибка при сохранении файла в localStorage:', error);
    return `https://via.placeholder.com/300?text=${encodeURIComponent(file.name)}`;
  }
};

/**
 * Загрузка изображения профиля
 */
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  console.log(`🔧 Симуляция загрузки изображения профиля для пользователя: ${userId}`);
  
  // Используем общую функцию для загрузки файла
  return uploadFile(file, `user-avatars/${userId}`);
};

/**
 * Загрузка изображения игры
 */
export const uploadGameImage = async (file: File, gameId: string): Promise<string> => {
  console.log(`🔧 Симуляция загрузки изображения игры: ${gameId}`);
  
  // Используем общую функцию для загрузки файла
  return uploadFile(file, `game-images/${gameId}`);
};

/**
 * Удаление файла
 */
export const deleteFile = async (path: string): Promise<void> => {
  console.log(`🔧 Симуляция удаления файла по пути: ${path}`);
  
  // Имитация задержки при удалении
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Удаляем из localStorage
  try {
    localStorage.removeItem(`file:${path}`);
    console.log(`✅ Файл по пути "${path}" успешно удален из localStorage`);
  } catch (error) {
    console.error('❌ Ошибка при удалении файла из localStorage:', error);
  }
};

/**
 * Получение файла по пути
 */
export const getFileUrl = async (path: string): Promise<string | null> => {
  console.log(`🔧 Симуляция получения URL файла по пути: ${path}`);
  
  // Получаем из localStorage
  try {
    const fileData = localStorage.getItem(`file:${path}`);
    if (fileData) {
      console.log(`✅ Файл по пути "${path}" успешно получен из localStorage`);
      return fileData;
    } else {
      console.log(`⚠️ Файл по пути "${path}" не найден в localStorage`);
      return null;
    }
  } catch (error) {
    console.error('❌ Ошибка при получении файла из localStorage:', error);
    return null;
  }
}; 