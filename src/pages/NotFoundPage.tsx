import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FiHome } from 'react-icons/fi';

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <ErrorCode
          as={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </ErrorCode>
        <Title
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Page Not Found
        </Title>
        <Description
          as={motion.p}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The page you are looking for doesn't exist or has been moved.
        </Description>
        <Actions
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            as={Link}
            to="/"
            variant="primary"
            size="large"
            leftIcon={<FiHome />}
          >
            Back to Home
          </Button>
        </Actions>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const Content = styled.div`
  max-width: 600px;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1;
  
  @media (max-width: 640px) {
    font-size: 80px;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

export default NotFoundPage; 