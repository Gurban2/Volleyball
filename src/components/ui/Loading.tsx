import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullPage?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  color,
  fullPage = false 
}) => {
  return (
    <LoadingWrapper fullPage={fullPage}>
      <Spinner size={size} color={color} />
    </LoadingWrapper>
  );
};

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface LoadingWrapperProps {
  fullPage: boolean;
}

const LoadingWrapper = styled.div<LoadingWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ fullPage }) => fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  `}
`;

interface SpinnerProps {
  size: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${({ size }) => 
    size === 'small' ? '20px' : 
    size === 'medium' ? '40px' : '60px'
  };
  height: ${({ size }) => 
    size === 'small' ? '20px' : 
    size === 'medium' ? '40px' : '60px'
  };
  border: ${({ size }) => 
    size === 'small' ? '2px' : 
    size === 'medium' ? '3px' : '4px'
  } solid rgba(0, 0, 0, 0.1);
  border-left-color: ${({ theme, color }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spinAnimation} 0.8s linear infinite;
`;

export default Loading; 