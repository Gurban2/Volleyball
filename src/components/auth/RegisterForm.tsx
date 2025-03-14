import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }
    
    if (password.length < 6) {
      return setError('Пароль должен содержать минимум 6 символов');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, name);
      navigate('/profile/complete');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Этот email уже зарегистрирован');
      } else {
        setError('Ошибка при создании аккаунта');
        console.error(error);
      }
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
      <FormTitle>Регистрация</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGroup>
        <FormLabel htmlFor="name">
          <FiUser />
          <span>Имя</span>
        </FormLabel>
        <FormInput
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          required
        />
      </FormGroup>
      
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
          placeholder="Минимум 6 символов"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel htmlFor="confirmPassword">
          <FiLock />
          <span>Подтверждение пароля</span>
        </FormLabel>
        <FormInput
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите пароль"
          required
        />
      </FormGroup>
      
      <SubmitButton 
        type="submit" 
        variant="primary" 
        size="large" 
        isFullWidth 
        disabled={loading}
      >
        {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
      </SubmitButton>
      
      <FormFooter>
        Уже есть аккаунт? <FormLink onClick={() => navigate('/login')}>Войти</FormLink>
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

export default RegisterForm; 