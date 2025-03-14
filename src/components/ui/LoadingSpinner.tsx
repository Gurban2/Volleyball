import React from 'react';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(74, 106, 255, 0.2);
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner: React.FC = () => {
  return <SpinnerContainer />;
};

export default LoadingSpinner; 