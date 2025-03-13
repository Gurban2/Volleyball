import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <FooterLogo>
              <span>Volley</span>Connect
            </FooterLogo>
            <FooterDescription>
              The ultimate platform for volleyball enthusiasts to connect, organize games, and build a community.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FiFacebook size={20} />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter size={20} />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={20} />
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FiYoutube size={20} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterLinksGroup>
            <FooterSection>
              <FooterSectionTitle>Navigation</FooterSectionTitle>
              <FooterLinksList>
                <FooterLinkItem>
                  <FooterLink to="/">Home</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/games">Games</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/games/create">Create Game</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/profile">Profile</FooterLink>
                </FooterLinkItem>
              </FooterLinksList>
            </FooterSection>
            
            <FooterSection>
              <FooterSectionTitle>Information</FooterSectionTitle>
              <FooterLinksList>
                <FooterLinkItem>
                  <FooterLink to="/about">About Us</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/contact">Contact</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/privacy">Privacy Policy</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/terms">Terms of Service</FooterLink>
                </FooterLinkItem>
              </FooterLinksList>
            </FooterSection>
          </FooterLinksGroup>
        </FooterContent>
        
        <FooterDivider />
        
        <FooterBottom>
          <Copyright>&copy; {currentYear} VolleyConnect. All rights reserved.</Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/privacy">Privacy</FooterBottomLink>
            <FooterBottomLink to="/terms">Terms</FooterBottomLink>
            <FooterBottomLink to="/contact">Contact</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.space.xl} 0;
  position: relative;
  z-index: 10;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
`;

const FooterLogo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  line-height: 1.6;
  max-width: 400px;
  font-weight: 500;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const FooterLinksGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const FooterSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FooterLinksList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const FooterLinkItem = styled.li``;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: 500;
  display: inline-block;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &:after {
      width: 100%;
    }
  }
`;

const FooterDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.space.xl} 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.md};
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
`;

const FooterBottomLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default Footer; 