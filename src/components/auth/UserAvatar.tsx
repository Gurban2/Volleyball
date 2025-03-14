import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const UserAvatar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе из системы', error);
    }
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };
  
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  if (!currentUser) return null;
  
  return (
    <Container ref={menuRef}>
      <AvatarButton 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        as={motion.button}
        whileTap={{ scale: 0.95 }}
      >
        {currentUser.photoURL ? (
          <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
        ) : (
          <AvatarFallback>
            {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
          </AvatarFallback>
        )}
      </AvatarButton>
      
      <AnimatePresence>
        {isMenuOpen && (
          <UserMenu
            as={motion.div}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <UserInfo>
              <UserName>{currentUser.displayName || 'Пользователь'}</UserName>
              <UserEmail>{currentUser.email}</UserEmail>
            </UserInfo>
            
            <MenuDivider />
            
            <MenuItem onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
              <FiUser />
              <span>Мой профиль</span>
            </MenuItem>
            
            <MenuItem onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}>
              <FiSettings />
              <span>Настройки</span>
            </MenuItem>
            
            <MenuDivider />
            
            <MenuItem onClick={handleLogout} isLogout>
              <FiLogOut />
              <span>Выйти</span>
            </MenuItem>
          </UserMenu>
        )}
      </AnimatePresence>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const UserMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 240px;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  z-index: 1000;
`;

const UserInfo = styled.div`
  padding: ${({ theme }) => theme.space.md};
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  word-break: break-all;
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.space.xs} 0;
`;

interface MenuItemProps {
  isLogout?: boolean;
}

const MenuItem = styled.button<MenuItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: ${({ theme, isLogout }) => isLogout ? theme.colors.danger : theme.colors.textPrimary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
  
  svg {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

export default UserAvatar; 