import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Container
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FormWrapper>
        <RegisterForm />
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
  padding: ${({ theme }) => theme.space.xl};
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 480px;
`;

export default RegisterPage; 