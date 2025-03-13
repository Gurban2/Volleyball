import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCalendar, FiHome, FiUser, FiPlus } from 'react-icons/fi';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
                  <span>Home</span>
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink to="/games">
                  <FiCalendar />
                  <span>Games</span>
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink to="/games/create">
                  <FiPlus />
                  <span>Create Game</span>
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink to="/profile">
                  <FiUser />
                  <span>Profile</span>
                </StyledNavLink>
              </NavItem>
            </NavList>
          </DesktopNav>

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle onClick={toggleMenu}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuToggle>

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
                      <span>Home</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
                  <MobileNavItem>
                    <StyledMobileNavLink to="/games" onClick={closeMenu}>
                      <FiCalendar size={20} />
                      <span>Games</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
                  <MobileNavItem>
                    <StyledMobileNavLink to="/games/create" onClick={closeMenu}>
                      <FiPlus size={20} />
                      <span>Create Game</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
                  <MobileNavItem>
                    <StyledMobileNavLink to="/profile" onClick={closeMenu}>
                      <FiUser size={20} />
                      <span>Profile</span>
                    </StyledMobileNavLink>
                  </MobileNavItem>
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

const MobileMenuToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    display: none;
  }
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

export default Header; 