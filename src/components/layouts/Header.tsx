import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCalendar, FiHome, FiUser, FiPlus, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../auth/UserAvatar';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin, isOrganizer } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const canCreateGame = () => {
    return isAdmin() || isOrganizer();
  };

  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <LogoWrapper to="/">
            <Logo>
              <span>Volley</span>Connect
            </Logo>
          </LogoWrapper>

          {/* Desktop Navigation */}
          <DesktopNav>
            <NavList>
              <NavItem>
                <StyledNavLink to="/">
                  <FiHome />
                  <span>Главная</span>
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink to="/games">
                  <FiCalendar />
                  <span>Игры</span>
                </StyledNavLink>
              </NavItem>
              {canCreateGame() && (
                <NavItem>
                  <StyledNavLink to="/games/create">
                    <FiPlus />
                    <span>Создать игру</span>
                  </StyledNavLink>
                </NavItem>
              )}
              {currentUser ? (
                <NavItem>
                  <UserAvatar />
                </NavItem>
              ) : (
                <>
                  <NavItem>
                    <LoginButton 
                      as={Link} 
                      to="/login"
                      variant="outlined"
                      leftIcon={<FiLogIn />}
                    >
                      Войти
                    </LoginButton>
                  </NavItem>
                  <NavItem>
                    <RegisterButton 
                      as={Link} 
                      to="/register"
                      variant="primary"
                    >
                      Регистрация
                    </RegisterButton>
                  </NavItem>
                </>
              )}
            </NavList>
          </DesktopNav>

          {/* Mobile Menu Toggle and Auth */}
          <MobileRightSection>
            {currentUser && !isMenuOpen && (
              <MobileAvatarWrapper>
                <UserAvatar />
              </MobileAvatarWrapper>
            )}
            <MobileMenuToggle onClick={toggleMenu}>
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </MobileMenuToggle>
          </MobileRightSection>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <MobileNav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MobileNavList>
                  <MobileNavItem>
                    <StyledMobileNavLink to="/" onClick={closeMenu}>
                      <FiHome size={20} />
                      <span>Главная</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
                  <MobileNavItem>
                    <StyledMobileNavLink to="/games" onClick={closeMenu}>
                      <FiCalendar size={20} />
                      <span>Игры</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
                  {canCreateGame() && (
                    <MobileNavItem>
                      <StyledMobileNavLink to="/games/create" onClick={closeMenu}>
                        <FiPlus size={20} />
                        <span>Создать игру</span>
                      </StyledMobileNavLink>
                    </MobileNavItem>
                  )}
                  {!currentUser && (
                    <>
                      <MobileNavItem>
                        <StyledMobileNavLink to="/login" onClick={closeMenu}>
                          <FiLogIn size={20} />
                          <span>Войти</span>
                        </StyledMobileNavLink>
                      </MobileNavItem>
                      <MobileNavAuthButton onClick={closeMenu}>
                        <Button 
                          as={Link} 
                          to="/register" 
                          variant="primary"
                          size="medium"
                          isFullWidth
                        >
                          Регистрация
                        </Button>
                      </MobileNavAuthButton>
                    </>
                  )}
                </MobileNavList>
              </MobileNav>
            )}
          </AnimatePresence>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md} 0;
  position: relative;
`;

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DesktopNav = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
`;

const NavItem = styled.li``;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  
  &:hover, &.active {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(255, 58, 47, 0.1);
  }
  
  svg {
    margin-right: ${({ theme }) => theme.space.xs};
  }
`;

const LoginButton = styled(Button)`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
`;

const RegisterButton = styled(Button)`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
`;

const MobileRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileAvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenuToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileNav = styled(motion.nav)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-radius: 0 0 ${({ theme }) => theme.radii.lg} ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MobileNavItem = styled.li`
  width: 100%;
`;

const StyledMobileNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.default};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
  
  &:hover, &.active {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(255, 58, 47, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MobileNavAuthButton = styled.div`
  padding: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.backgroundDark};
`;

export default Header; 