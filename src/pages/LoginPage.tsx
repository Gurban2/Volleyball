import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiAlertCircle } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Вход в систему с данными:', formData.email);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container">
        <PageTitle>Вход в систему</PageTitle>

        <FormContainer
          as={motion.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error && (
            <ErrorMessage>
              <FiAlertCircle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Пароль</FormLabel>
            <FormInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите ваш пароль"
              required
            />
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          <FormFooter>
            <p>
              Нет аккаунта?{' '}
              <Link to="/register">Зарегистрироваться</Link>
            </p>
          </FormFooter>
          
          <DebugSection>
            <DebugButton 
              type="button" 
              onClick={() => setShowDebugInfo(!showDebugInfo)}
            >
              {showDebugInfo ? 'Скрыть отладочную информацию' : 'Показать отладочную информацию'}
            </DebugButton>
            
            {showDebugInfo && (
              <DebugInfo>
                <h4>Отладочная информация:</h4>
                <p>Firebase authError: {authError || 'нет ошибок'}</p>
                <p>Локальная ошибка: {error || 'нет ошибок'}</p>
                <p>Текущий путь: {window.location.pathname}</p>
                <p>Firebase конфигурация: {window.localStorage.getItem('firebase-debug-mode') || 'не установлена'}</p>
                <p>Кэш Firebase auth: {localStorage.getItem('firebase:authUser:AIzaSyAHpnRMDWPYKQSHKfxNep_WW9-fksYE1vk:[DEFAULT]') ? 'имеется' : 'отсутствует'}</p>
                
                <h4>Действия:</h4>
                <DebugButton 
                  type="button" 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    console.log('Локальное хранилище очищено');
                    window.location.reload();
                  }}
                >
                  Очистить хранилище и перезагрузить
                </DebugButton>
                
                <DebugButton 
                  type="button" 
                  onClick={() => {
                    localStorage.setItem('firebase-debug-mode', 'enabled');
                    console.log('Режим отладки Firebase включен');
                  }}
                >
                  Включить режим отладки Firebase
                </DebugButton>
              </DebugInfo>
            )}
          </DebugSection>
        </FormContainer>
      </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.space.lg} 0;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.xl};
  max-width: 480px;
  margin: 0 auto;
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

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundInput};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  svg {
    min-width: 18px;
  }
`;

const FormFooter = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DebugSection = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const DebugButton = styled.button`
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.xs};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundDark};
  }
`;

const DebugInfo = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: 1.5;
  
  h4 {
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: ${({ theme }) => theme.space.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.space.xs};
    word-break: break-all;
  }
`;

export default LoginPage; 