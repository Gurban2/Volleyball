import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <Header />
      <Main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </Main>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Main = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.space.xl} 0;
  margin-bottom: ${({ theme }) => theme.space['3xl']};
`;

export default MainLayout; 