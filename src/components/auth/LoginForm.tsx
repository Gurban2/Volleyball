import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Дожидаемся результата login()
      const result = await login(email, password);
      
      // Перенаправляем ТОЛЬКО при успешном входе
      if (result) {
        navigate('/');
      }
    } catch (error: any) {
      // Обрабатываем ошибку и показываем на странице
      console.error('Login error:', error);
      
      // Четко задаем сообщение об ошибке на основе полученного сообщения
      if (error.message && error.message.includes('Неверные учетные данные')) {
        setError('Неверный email или пароль');
      } else if (error.code === 'auth/user-not-found') {
        setError('Пользователь не найден');
      } else if (error.code === 'auth/invalid-email') {
        setError('Некорректный email');
      } else {
        // Если это другая ошибка, отображаем ее сообщение напрямую
        setError(error.message || 'Не удалось войти');
      }
      // НЕ перенаправляем при ошибке
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormContainer 
      as={motion.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <FormTitle>Вход</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGroup>
        <FormLabel htmlFor="email">
          <FiMail />
          <span>Email</span>
        </FormLabel>
        <FormInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="password">
          <FiLock />
          <span>Пароль</span>
        </FormLabel>
        <FormInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormGroup>
      
      <RememberForgotRow>
        <RememberMe>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Запомнить меня</label>
        </RememberMe>
        <ForgotPassword onClick={() => navigate('/forgot-password')}>
          Забыли пароль?
        </ForgotPassword>
      </RememberForgotRow>
      
      <SubmitButton 
        type="submit" 
        variant="primary" 
        size="large" 
        isFullWidth 
        disabled={loading}
      >
        {loading ? 'Вход...' : 'Войти'}
      </SubmitButton>
      
      <FormFooter>
        Нет аккаунта? <FormLink onClick={() => navigate('/register')}>Зарегистрироваться</FormLink>
      </FormFooter>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.xl};
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const RememberForgotRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  input {
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
  }
`;

const ForgotPassword = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.colors.danger}15`};
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.space.md};
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormLink = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginForm; 