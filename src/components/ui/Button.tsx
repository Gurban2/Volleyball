import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isFullWidth?: boolean;
  isLoading?: boolean;
  as?: any;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      as={props.to ? Link : motion.button}
      whileTap={{ scale: 0.98 }}
      variant={variant}
      size={size}
      $isFullWidth={isFullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {leftIcon && <IconWrapper className="left-icon">{leftIcon}</IconWrapper>}
      <ButtonText>{children}</ButtonText>
      {rightIcon && <IconWrapper className="right-icon">{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

const LoadingSpinner = () => (
  <SpinnerWrapper>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
    </svg>
  </SpinnerWrapper>
);

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
  size: 'small' | 'medium' | 'large';
  $isFullWidth: boolean;
  $isLoading: boolean;
}

const StyledButton = styled(motion.button)<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'auto')};
  
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      cursor: not-allowed;
      opacity: 0.7;
    `}
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Size variants */
  ${({ size, theme }) =>
    size === 'small' &&
    css`
      height: 32px;
      padding: 0 ${theme.space.md};
      font-size: ${theme.fontSizes.sm};
      
      svg {
        width: 16px;
        height: 16px;
      }
    `}
  
  ${({ size, theme }) =>
    size === 'medium' &&
    css`
      height: 40px;
      padding: 0 ${theme.space.lg};
      font-size: ${theme.fontSizes.md};
      
      svg {
        width: 18px;
        height: 18px;
      }
    `}
  
  ${({ size, theme }) =>
    size === 'large' &&
    css`
      height: 48px;
      padding: 0 ${theme.space.xl};
      font-size: ${theme.fontSizes.lg};
      
      svg {
        width: 20px;
        height: 20px;
      }
    `}
  
  /* Style variants */
  ${({ variant, theme }) =>
    variant === 'primary' &&
    css`
      background-color: ${theme.colors.primary};
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
        transform: translateY(0);
      }
    `}
  
  ${({ variant, theme }) =>
    variant === 'secondary' &&
    css`
      background-color: ${theme.colors.secondary};
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.secondaryDark};
        transform: translateY(0);
      }
    `}
  
  ${({ variant, theme }) =>
    variant === 'outlined' &&
    css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary}10;
        transform: translateY(-2px);
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.primary}20;
        transform: translateY(0);
      }
    `}
  
  ${({ variant, theme }) =>
    variant === 'text' &&
    css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: none;
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary}10;
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.primary}20;
      }
    `}
  
  ${({ variant, theme }) =>
    variant === 'danger' &&
    css`
      background-color: ${theme.colors.danger};
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.danger};
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
      }
      
      &:active:not(:disabled) {
        background-color: ${theme.colors.danger};
        transform: translateY(0);
      }
    `}
`;

const ButtonText = styled.span`
  display: inline-block;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  
  &.left-icon {
    margin-right: ${({ theme }) => theme.space.xs};
  }
  
  &.right-icon {
    margin-left: ${({ theme }) => theme.space.xs};
  }
`;

const SpinnerWrapper = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    animation: spin 1s linear infinite;
    opacity: 0.6;
    
    circle {
      stroke: currentColor;
      stroke-dasharray: 80px, 200px;
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Button; 