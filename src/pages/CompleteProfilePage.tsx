import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiUpload } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../firebase/uploadHelpers';

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, refreshUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    nickname: string;
    age: string;
    height: string;
    avatar: File | null;
    avatarPreview: string | null;
  }>({
    nickname: '',
    age: '',
    height: '',
    avatar: null,
    avatarPreview: null,
  });
  
  const [errors, setErrors] = useState<{
    nickname?: string;
    age?: string;
    height?: string;
  }>({});

  useEffect(() => {
    // Если профиль уже заполнен, перенаправляем на главную страницу
    if (userData?.profileCompleted) {
      navigate('/');
    }
  }, [userData, navigate]);

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
    const newErrors: {
      nickname?: string;
      age?: string;
      height?: string;
    } = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Пожалуйста, введите никнейм';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Пожалуйста, введите возраст';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Возраст должен быть положительным числом';
    }
    
    if (!formData.height.trim()) {
      newErrors.height = 'Пожалуйста, введите рост';
    } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      newErrors.height = 'Рост должен быть положительным числом';
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
      let photoURL = null;
      
      // Загрузка фотографии, если она была выбрана
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
          alert('Произошла ошибка при загрузке фото. Профиль будет создан без фотографии.');
          photoURL = null;
        }
      }
      
      console.log('🔄 Сохраняем данные профиля...');
      
      // Имитация сохранения данных в localStorage вместо Firestore
      if (currentUser) {
        // Создаем обновленные данные пользователя
        const updatedUserData = {
          ...userData,
          nickname: formData.nickname,
          age: Number(formData.age),
          height: Number(formData.height),
          photoURL: photoURL,
          profileCompleted: true
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Обновляем состояние пользователя
        await refreshUserData();
        
        console.log('✅ Профиль успешно создан');
        
        // Перенаправляем на страницу профиля
        navigate('/profile');
      }
    } catch (error) {
      console.error('❌ Ошибка при создании профиля:', error);
      alert('Произошла ошибка при создании профиля. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="container">
          <PageTitle>Заполните профиль</PageTitle>
        </div>
      </PageHeader>
      
      <PageContent>
        <div className="container">
          <FormContainer
            as={motion.form}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
          >
            <FormSection>
              <SectionTitle>Ваш аватар</SectionTitle>
              <AvatarContainer>
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
                  <AvatarUploadHint>Рекомендуемый размер: 200x200 px</AvatarUploadHint>
                </AvatarUpload>
              </AvatarContainer>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Информация о вас</SectionTitle>
              <FormGroup>
                <FormLabel htmlFor="nickname">Ник в игре</FormLabel>
                <FormInput
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  error={!!errors.nickname}
                  placeholder="Ваш ник"
                />
                {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="age">Возраст</FormLabel>
                  <FormInput
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    error={!!errors.age}
                    min="1"
                    placeholder="Ваш возраст"
                  />
                  {errors.age && <ErrorMessage>{errors.age}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="height">Рост (см)</FormLabel>
                  <FormInput
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    error={!!errors.height}
                    min="1"
                    placeholder="Ваш рост в см"
                  />
                  {errors.height && <ErrorMessage>{errors.height}</ErrorMessage>}
                </FormGroup>
              </FormRow>
            </FormSection>
            
            <FormActions>
              <SubmitButton 
                type="submit" 
                loading={isSaving}
              >
                Сохранить профиль
              </SubmitButton>
            </FormActions>
          </FormContainer>
        </div>
      </PageContent>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const PageHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space.lg} 0;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const PageContent = styled.main`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const FormSection = styled.section`
  padding: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
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
  margin-bottom: ${({ theme }) => theme.space.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

interface FormInputProps {
  error?: boolean;
}

const FormInput = styled.input<FormInputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => 
      error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme, error }) => 
      error ? `${theme.colors.danger}25` : `${theme.colors.primary}25`};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface SubmitButtonProps {
  loading?: boolean;
}

const SubmitButton = styled(Button)<SubmitButtonProps>`
  min-width: 200px;
`;

export default CompleteProfilePage; 