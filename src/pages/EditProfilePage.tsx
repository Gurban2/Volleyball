import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiArrowLeft, FiUpload, FiWifi, FiWifiOff, FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  // email: string;
  // phone: string;
  avatar: string | null;
}

// Стилизованные компоненты для отображения загрузки
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: ${({ theme }) => theme.space.md};
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.backgroundDark};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.space.md};
`;

// Простая проверка интернет-соединения
const checkInternetConnection = async (): Promise<boolean> => {
  try {
    await fetch('/api/health', { method: 'HEAD' });
    return true;
  } catch (error) {
    return false;
  }
};

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    // email: string;
    // phone: string;
    avatar: File | null;
    avatarPreview: string | null;
  }>({
    name: '',
    // email: '',
    // phone: '',
    avatar: null,
    avatarPreview: null,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    // email?: string;
    // phone?: string;
  }>({});

  // Загрузка данных пользователя
  useEffect(() => {
    setIsLoading(true);

    if (userData) {
      setFormData({
        name: userData.displayName || '',
        // email: userData.email || '',
        // phone: '',  // Предполагаем, что этого поля нет в userData
        avatar: null,
        avatarPreview: userData.photoURL || null,
      });
      setIsLoading(false);
    } else {
      // Если данные пользователя недоступны, редирект на страницу входа
      navigate('/login');
    }
  }, [userData, navigate]);

  // При загрузке проверим состояние сети
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const connectionStatus = await checkInternetConnection();
        setIsOnline(connectionStatus);
      } catch (error) {
        setIsOnline(false);
      }
    };
    
    checkNetworkStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: file,
          avatarPreview: reader.result as string,
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }
    
    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email обязателен для заполнения';
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Введите корректный email';
    // }
    
    // if (formData.phone && !/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
    //   newErrors.phone = 'Введите корректный номер телефона';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) {
      return;
    }
    
    setIsSaving(true);
    console.log('Начало сохранения профиля');
    console.log('Текущее фото в userData:', userData?.photoURL);
    
    try {
      let photoURL = userData?.photoURL || null;
      
      // Обработка фотографии, если она была изменена
      if (formData.avatar) {
        try {
          console.log('Загрузка нового фото...');
          
          // Загрузка фото через API
          const fileFormData = new FormData();
          fileFormData.append('file', formData.avatar);
          
          // Добавляем путь пользователя для организации файлов
          if (currentUser?.uid) {
            fileFormData.append('path', `users/${currentUser.uid}`);
          }
          
          const uploadResponse = await fetch('http://localhost:5000/api/users/me', {
            method: 'POST',
            body: fileFormData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('Ошибка загрузки файла:', errorData.message || 'Неизвестная ошибка');
            throw new Error('Ошибка загрузки файла');
          }
          
          const data = await uploadResponse.json();
          console.log('Ответ сервера при загрузке файла:', data);
          photoURL = data.fileUrl; // API возвращает URL загруженного файла
          console.log('Новый URL фото:', photoURL);
          
        } catch (uploadError) {
          console.error('Ошибка при загрузке фото:', uploadError);
          alert('Произошла ошибка при обработке фото. Пожалуйста, попробуйте позже.');
        }
      } else {
        console.log('Фото не изменено, используем существующее:', photoURL);
      }
      
      // Создаем объект с новыми данными
      const updatedUserData = {
        ...userData,
        displayName: formData.name,
        photoURL: photoURL
      };
      
      console.log('Обновленные данные перед сохранением:', updatedUserData);
      
      // Сохраняем в localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Также отправляем на сервер обновление профиля с новым изображением
      try {
        const updateResponse = await fetch('http://localhost:5000/api/users/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            username: formData.name,
            profileImage: photoURL // Это поле profileImage в MongoDB
          })
        });
        
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error('Ошибка обновления профиля на сервере:', errorData.msg || 'Неизвестная ошибка');
          throw new Error('Ошибка обновления профиля на сервере');
        }
        
        const updatedUser = await updateResponse.json();
        console.log('Ответ сервера после обновления профиля:', updatedUser);
        console.log('profileImage в ответе сервера:', updatedUser.profileImage);
      } catch (updateError) {
        console.error('Ошибка при обновлении профиля на сервере:', updateError);
      }
      
      // Обновляем состояние пользователя
      await refreshUserData();
      console.log('Данные пользователя после refreshUserData:', userData);
      
      // Показываем сообщение об успехе
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Общая ошибка сохранения профиля:', error);
      alert('Произошла ошибка при сохранении профиля. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Загрузка профиля...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton to="/profile">
          <FiArrowLeft size={20} />
          <span>Назад к профилю</span>
        </BackButton>
        <PageTitle>Редактирование профиля</PageTitle>
      </Header>

      <FormContainer
        as={motion.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FormSection>
          <SectionTitle>Основная информация</SectionTitle>
          
          <AvatarSection>
            <AvatarPreview>
              {formData.avatarPreview ? (
                <img src={formData.avatarPreview} alt="Аватар" />
              ) : (
                <FiUser size={48} />
              )}
            </AvatarPreview>
            <AvatarUpload>
              <AvatarUploadLabel htmlFor="avatar">
                <FiUpload />
                <span>Загрузить фото</span>
              </AvatarUploadLabel>
              <AvatarUploadInput
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <AvatarUploadHint>
                Рекомендуемый размер: 200x200 пикселей, JPG или PNG
              </AvatarUploadHint>
            </AvatarUpload>
          </AvatarSection>

          <FormGroup>
            <FormLabel htmlFor="name">Имя</FormLabel>
            <FormInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              hasError={!!errors.name}
            />
            {errors.name && <FormError>{errors.name}</FormError>}
          </FormGroup>

          {/* <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              hasError={!!errors.email}
            />
            {errors.email && <FormError>{errors.email}</FormError>}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="phone">Телефон</FormLabel>
            <FormInput
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Введите ваш номер телефона"
              hasError={!!errors.phone}
            />
            {errors.phone && <FormError>{errors.phone}</FormError>}
            <FormHint>Например: +7 (999) 123-45-67</FormHint>
          </FormGroup> */}
        </FormSection>
        
        <FormActions>
          <Button
            type="button"
            variant="outlined"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </FormActions>
      </FormContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding-bottom: ${({ theme }) => theme.space['2xl']};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space.sm};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.round};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const AvatarUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AvatarUploadInput = styled.input`
  display: none;
`;

const AvatarUploadHint = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundInput};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ hasError, theme }) => 
      hasError ? `${theme.colors.danger}33` : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const FormError = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const FormHint = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
`;

export default EditProfilePage;