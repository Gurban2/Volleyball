import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiUpload } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../firebase/uploadHelpers';

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
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
    const newErrors: typeof errors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Ник обязателен для заполнения';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Возраст обязателен для заполнения';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 10 || Number(formData.age) > 100) {
      newErrors.age = 'Введите корректный возраст (от 10 до 100 лет)';
    }
    
    if (!formData.height.trim()) {
      newErrors.height = 'Рост обязателен для заполнения';
    } else if (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250) {
      newErrors.height = 'Введите корректный рост в сантиметрах (от 100 до 250)';
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
      
      // Загрузка фотографии в Firebase Storage, если она была выбрана
      if (formData.avatar) {
        try {
          console.log('Начинаем загрузку фото...');
          
          // Используем простую функцию загрузки
          photoURL = await uploadFile(
            formData.avatar, 
            `user-avatars/${currentUser.uid}`
          );
          
          console.log('Файл успешно загружен, получен URL:', photoURL);
        } catch (uploadError) {
          console.error('Ошибка при загрузке файла:', uploadError);
          alert('Произошла ошибка при загрузке фото. Профиль будет создан без фотографии.');
          
          // Продолжаем создание профиля без фото
          photoURL = null;
        }
      }
      
      console.log('Сохраняем данные профиля в Firestore...');
      console.log('photoURL перед сохранением:', photoURL);
      
      // Сохраняем данные профиля в Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        nickname: formData.nickname,
        age: Number(formData.age),
        height: Number(formData.height),
        photoURL: photoURL,
        profileCompleted: true
      });
      
      console.log('✅ Профиль успешно сохранен в Firestore');
      
      // Проверяем, что URL фото действительно сохранился
      try {
        const updatedUserDocRef = doc(db, 'users', currentUser.uid);
        const updatedUserDoc = await getDoc(updatedUserDocRef);
        const updatedData = updatedUserDoc.data();
        console.log('Данные после сохранения:', updatedData);
        console.log('Сохраненный photoURL:', updatedData?.photoURL);
        
        if (photoURL && (!updatedData?.photoURL || updatedData.photoURL !== photoURL)) {
          console.warn('⚠️ URL фото не был правильно сохранен в Firestore!');
        }
      } catch (verifyError) {
        console.error('Ошибка при проверке сохраненных данных:', verifyError);
      }
      
      // После успешного сохранения перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      alert('Произошла ошибка при сохранении профиля. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <ErrorContainer>
        <ErrorMessage>Необходимо войти в систему</ErrorMessage>
        <Button onClick={() => navigate('/login')} variant="primary">
          Войти
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Заполните свой профиль</PageTitle>
          <PageDescription>
            Эта информация будет доступна другим пользователям. 
            <br />
            <strong>Важно:</strong> эти данные нельзя будет изменить после сохранения.
          </PageDescription>
        </PageHeader>

        <FormContainer
          as={motion.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormSection>
            <SectionTitle>Данные игрока</SectionTitle>
            
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
              <FormLabel htmlFor="nickname">Никнейм</FormLabel>
              <FormInput
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Введите ваш никнейм"
                hasError={!!errors.nickname}
              />
              {errors.nickname && <FormError>{errors.nickname}</FormError>}
              <FormHint>Это имя будет отображаться другим игрокам</FormHint>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="age">Возраст</FormLabel>
              <FormInput
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Введите ваш возраст"
                hasError={!!errors.age}
                min="10"
                max="100"
              />
              {errors.age && <FormError>{errors.age}</FormError>}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="height">Рост (см)</FormLabel>
              <FormInput
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Введите ваш рост в сантиметрах"
                hasError={!!errors.height}
                min="100"
                max="250"
              />
              {errors.height && <FormError>{errors.height}</FormError>}
            </FormGroup>
          </FormSection>

          <FormActions>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить профиль'}
            </Button>
          </FormActions>
        </FormContainer>
      </div>
    </PageContainer>
  );
};

// Стили компонентов
const PageContainer = styled.div`
  padding-bottom: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const FormContainer = styled.form`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

const FormSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#e53e3e' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53e3e' : '#3182ce'};
  }
`;

const FormError = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormHint = styled.div`
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormActions = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  gap: 1.5rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 1.25rem;
  font-weight: 500;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin-right: 1.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.div`
  flex: 1;
`;

const AvatarUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const AvatarUploadInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const AvatarUploadHint = styled.div`
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  gap: 1rem;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 1rem;
`;

export default CompleteProfilePage; 