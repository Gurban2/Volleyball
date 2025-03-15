import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiArrowLeft, FiUpload, FiShield, FiWifi, FiWifiOff, FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../firebase/uploadHelpers';
import { 
  checkFirestoreConnection, 
  toggleNetworkMode, 
  forceOnline, 
  isNetworkOnline 
} from '../firebase/config';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

// Временные данные для демонстрации
const MOCK_USER_PROFILE: UserProfile = {
  id: 'user1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  avatar: null,
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
    email: string;
    phone: string;
    avatar: File | null;
    avatarPreview: string | null;
  }>({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    avatarPreview: null,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Загрузка данных пользователя
  useEffect(() => {
    setIsLoading(true);

    if (userData) {
      setFormData({
        name: userData.displayName || '',
        email: userData.email || '',
        phone: '',  // Предполагаем, что этого поля нет в userData
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
        const connectionStatus = await checkFirestoreConnection();
        setIsOnline(connectionStatus);
        console.log('Начальный статус сети:', connectionStatus ? 'онлайн' : 'офлайн');
      } catch (error) {
        console.error('Ошибка при проверке статуса сети:', error);
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (formData.phone && !/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      let photoURL = userData?.photoURL || null;
      
      // Загрузка фотографии в Firebase Storage, если она была изменена
      if (formData.avatar) {
        try {
          console.log('🔄 Начинаем загрузку фото...');
          
          // Используем функцию загрузки из uploadHelpers
          photoURL = await uploadFile(
            formData.avatar, 
            `user-avatars/${currentUser.uid}`
          );
          
          console.log('✅ Файл успешно загружен, получен URL:', photoURL);
        } catch (uploadError) {
          console.error('❌ Ошибка при загрузке файла:', uploadError);
          alert('Произошла ошибка при загрузке фото. Пожалуйста, попробуйте позже.');
          
          // Продолжаем сохранять профиль с предыдущим фото
          console.log('Продолжаем сохранение профиля с текущим фото');
        }
      }
      
      console.log('🔄 Сохраняем данные профиля...');
      
      // Создаем объект с новыми данными
      const updatedUserData = {
        ...userData,
        displayName: formData.name,
        email: formData.email,
        photoURL: photoURL
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Обновляем состояние пользователя
      await refreshUserData();
      
      console.log('✅ Профиль успешно сохранен');
      
      // Показываем сообщение об успехе
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('❌ Ошибка при сохранении профиля:', error);
      alert('Произошла ошибка при сохранении профиля. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  // Функция для изменения роли пользователя на администратора
  const makeUserAdmin = async () => {
    if (!currentUser) {
      alert('Для изменения роли нужно войти в систему');
      return;
    }
    
    const confirmed = window.confirm('Вы уверены, что хотите стать администратором? Это предоставит вам расширенные права в системе.');
    if (!confirmed) return;
    
    try {
      // Принудительно проверяем подключение перед любыми операциями
      console.log('🔄 Назначение пользователя администратором...');
      
      // Обновляем данные в localStorage
      const updatedUserData = {
        ...userData,
        role: 'admin'
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Обновляем состояние пользователя
      await refreshUserData();
      
      console.log('✅ Пользователь назначен администратором');
      alert('Вы стали администратором!');
    } catch (error) {
      console.error('❌ Ошибка при назначении администратора:', error);
      alert('Произошла ошибка при назначении администратора.');
    }
  };

  // Функция для изменения роли пользователя на организатора
  const makeUserOrganizer = async () => {
    if (!currentUser) {
      alert('Для изменения роли нужно войти в систему');
      return;
    }
    
    const confirmed = window.confirm('Вы уверены, что хотите стать организатором? Это позволит вам создавать и управлять играми.');
    if (!confirmed) return;
    
    try {
      // Принудительно проверяем подключение перед любыми операциями
      console.log('🔄 Назначение пользователя организатором...');
      
      // Обновляем данные в localStorage
      const updatedUserData = {
        ...userData,
        role: 'organizer'
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Обновляем состояние пользователя
      await refreshUserData();
      
      console.log('✅ Пользователь назначен организатором');
      alert('Вы стали организатором!');
    } catch (error) {
      console.error('❌ Ошибка при назначении организатора:', error);
      alert('Произошла ошибка при назначении организатора.');
    }
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

      <NetworkStatusBar online={isOnline}>
        <NetworkStatusIcon>
          {isOnline ? <FiWifi size={18} /> : <FiWifiOff size={18} />}
        </NetworkStatusIcon>
        <NetworkStatusText>
          {isOnline 
            ? 'Онлайн режим: подключение к Firebase установлено' 
            : 'Офлайн режим: нет подключения к Firebase'}
        </NetworkStatusText>
        {!isOnline && (
          <NetworkWarningIcon>
            <FiAlertTriangle size={18} />
          </NetworkWarningIcon>
        )}
      </NetworkStatusBar>

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

          <FormGroup>
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
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Управление ролью</SectionTitle>
          <InfoText>
            Роли определяют ваши возможности в приложении. Выберите роль, соответствующую вашим потребностям:
          </InfoText>

          <ConnectSection>
            <ConnectButtons>
              <ConnectButton 
                type="button"
                variant="outlined"
                onClick={async () => {
                  try {
                    const isConnected = await checkFirestoreConnection();
                    if (isConnected) {
                      setIsOnline(true);
                      alert('Подключение к Firebase установлено успешно!');
                    } else {
                      setIsOnline(false);
                      alert('Не удалось подключиться к Firebase. Проверьте интернет-соединение.');
                    }
                  } catch (error: any) {
                    setIsOnline(false);
                    alert(`Ошибка проверки подключения: ${error.message}`);
                  }
                }}
                leftIcon={<FiWifi />}
              >
                Проверить подключение
              </ConnectButton>
              
              <ConnectButton 
                type="button"
                variant={isOnline ? "danger" : "success"}
                onClick={async () => {
                  try {
                    const newState = !isOnline;
                    const success = await toggleNetworkMode(newState);
                    if (success) {
                      setIsOnline(newState);
                      alert(`${newState ? 'Онлайн' : 'Офлайн'}-режим успешно включен`);
                    }
                  } catch (error: any) {
                    alert(`Ошибка переключения режима: ${error.message}`);
                  }
                }}
                leftIcon={isOnline ? <FiWifiOff /> : <FiWifi />}
              >
                {isOnline ? 'Перейти в офлайн-режим' : 'Перейти в онлайн-режим'}
              </ConnectButton>
              
              <ConnectButton 
                type="button" 
                variant="primary"
                onClick={async () => {
                  try {
                    alert('Запуск процедуры восстановления соединения...');
                    
                    // Деактивируем и затем активируем сеть
                    await toggleNetworkMode(false);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Принудительное подключение с несколькими попытками
                    const success = await forceOnline();
                    
                    if (success) {
                      // Дополнительная проверка реального подключения
                      const connectionOk = await checkFirestoreConnection();
                      setIsOnline(connectionOk);
                      
                      if (connectionOk) {
                        alert('Подключение к Firebase полностью восстановлено! Теперь вы можете изменять роли и работать с базой данных.');
                      } else {
                        alert('Частичное восстановление подключения. Повторите попытку еще раз.');
                      }
                    } else {
                      alert('Не удалось восстановить подключение. Попробуйте перезагрузить страницу или приложение.');
                      setIsOnline(false);
                    }
                  } catch (error: any) {
                    alert(`Ошибка при восстановлении подключения: ${error.message}`);
                    console.error('Ошибка при восстановлении подключения:', error);
                  }
                }}
                leftIcon={<FiWifi />}
              >
                Принудительно восстановить подключение
              </ConnectButton>
            </ConnectButtons>
            
            <ConnectionInfo>
              {isOnline 
                ? 'Вы находитесь в онлайн-режиме. Все функции доступны.' 
                : 'Если вы испытываете проблемы с изменением роли, попробуйте проверить подключение к серверу.'}
              {!isOnline && (
                <ConnectionWarning>
                  Вы находитесь в офлайн-режиме! Изменение ролей недоступно.
                </ConnectionWarning>
              )}
            </ConnectionInfo>
          </ConnectSection>
          
          <RoleContainer>
            <RoleOption>
              <RoleOptionTitle isActive={userData?.role === 'user'}>Пользователь</RoleOptionTitle>
              <RoleOptionDescription>
                Базовая роль. Позволяет просматривать игры и присоединяться к ним.
              </RoleOptionDescription>
            </RoleOption>
            
            <RoleOption>
              <RoleOptionTitle isActive={userData?.role === 'organizer'}>Организатор</RoleOptionTitle>
              <RoleOptionDescription>
                Позволяет создавать и управлять играми, приглашать игроков.
              </RoleOptionDescription>
              {userData?.role !== 'organizer' && userData?.role !== 'admin' && (
                <RoleButton
                  type="button"
                  onClick={makeUserOrganizer}
                  leftIcon={<FiShield />}
                  variant="success"
                  disabled={isSaving}
                >
                  Стать организатором
                </RoleButton>
              )}
            </RoleOption>
            
            <RoleOption>
              <RoleOptionTitle isActive={userData?.role === 'admin'}>Администратор</RoleOptionTitle>
              <RoleOptionDescription>
                Полные права в системе, включая управление пользователями и всеми играми.
              </RoleOptionDescription>
              {userData?.role !== 'admin' && (
                <AdminButton
                  type="button"
                  onClick={makeUserAdmin}
                  leftIcon={<FiShield />}
                  disabled={isSaving}
                >
                  Стать администратором
                </AdminButton>
              )}
            </RoleOption>
          </RoleContainer>
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

const RoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const RoleOption = styled.div`
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const RoleOptionTitle = styled.h3<{ isActive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ isActive, theme }) => isActive ? theme.colors.primary : theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const RoleOptionDescription = styled.p`
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

const AdminButton = styled(Button)`
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colors.textTertiary : theme.colors.warning};
  color: white;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.warningDark};
  }
`;

const RoleButton = styled(Button)`
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

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

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const ConnectionInfo = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const ConnectSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const ConnectButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const ConnectButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const ConnectionWarning = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const NetworkStatusBar = styled.div<{ online: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ online, theme }) => 
    online ? theme.colors.success + '20' : theme.colors.danger + '20'};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const NetworkStatusIcon = styled.div`
  margin-right: ${({ theme }) => theme.space.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NetworkStatusText = styled.span`
  flex: 1;
`;

const NetworkWarningIcon = styled.span`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.space.sm};
`;

export default EditProfilePage;