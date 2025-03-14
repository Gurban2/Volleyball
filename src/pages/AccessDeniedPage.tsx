import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/ui/Button';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <Container>
        <ContentWrapper
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconWrapper>
            <FiLock size={64} />
          </IconWrapper>
          
          <Title>Доступ запрещен</Title>
          
          <Description>
            У вас недостаточно прав для доступа к этой странице. Если вы считаете, что это ошибка, 
            пожалуйста, свяжитесь с администратором.
          </Description>
          
          <ButtonsWrapper>
            <BackButton
              leftIcon={<FiArrowLeft />}
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Вернуться назад
            </BackButton>
            
            <HomeButton
              variant="primary"
              onClick={() => navigate('/')}
            >
              На главную
            </HomeButton>
          </ButtonsWrapper>
        </ContentWrapper>
      </Container>
    </MainLayout>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
  padding: ${({ theme }) => theme.space.xl};
`;

const ContentWrapper = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.xl};
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.xl};
  line-height: 1.6;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const BackButton = styled(Button)`
  min-width: 160px;
`;

const HomeButton = styled(Button)`
  min-width: 160px;
`;

export default AccessDeniedPage; 