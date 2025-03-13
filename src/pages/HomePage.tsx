import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiAward } from 'react-icons/fi';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  // Sample data for demonstration
  const featuredGames = [
    {
      id: '1',
      title: 'Weekly Volleyball Game',
      location: 'Central Park, New York',
      date: 'July 15, 2023',
      time: '6:00 PM - 8:00 PM',
      spotsAvailable: 5,
    },
    {
      id: '2',
      title: 'Beach Volleyball Tournament',
      location: 'Venice Beach, Los Angeles',
      date: 'July 22, 2023',
      time: '10:00 AM - 4:00 PM',
      spotsAvailable: 8,
    },
    {
      id: '3',
      title: 'Volleyball Training Session',
      location: 'Sports Center, Chicago',
      date: 'July 18, 2023',
      time: '7:00 PM - 9:00 PM',
      spotsAvailable: 10,
    },
  ];

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <div className="container">
            <HeroContentInner>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HeroTitle>Find & Join Volleyball Games Near You</HeroTitle>
                <HeroSubtitle>
                  Connect with local players, organize games, and improve your skills
                </HeroSubtitle>
                <HeroCTA>
                  <Button as={Link} to="/games" variant="primary" size="large">
                    Find Games
                  </Button>
                  <Button as={Link} to="/games/create" variant="outlined" size="large" color='white'>
                    Create Game
                  </Button>
                </HeroCTA>
              </motion.div>
            </HeroContentInner>
          </div>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <div className="container">
          <SectionTitle>Why VolleyConnect?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FeatureIcon>
                <FiCalendar size={32} />
              </FeatureIcon>
              <FeatureTitle>Easy Scheduling</FeatureTitle>
              <FeatureDescription>
                Create and manage volleyball games with our intuitive scheduling system
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FeatureIcon>
                <FiMapPin size={32} />
              </FeatureIcon>
              <FeatureTitle>Location Based</FeatureTitle>
              <FeatureDescription>
                Find games nearby or discover new places to play volleyball in your area
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FeatureIcon>
                <FiUsers size={32} />
              </FeatureIcon>
              <FeatureTitle>Community Building</FeatureTitle>
              <FeatureDescription>
                Connect with players, form teams, and build your volleyball network
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <FeatureIcon>
                <FiAward size={32} />
              </FeatureIcon>
              <FeatureTitle>Skill Matching</FeatureTitle>
              <FeatureDescription>
                Find games that match your skill level for more enjoyable play
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      {/* Featured Games Section */}
      <FeaturedGamesSection>
        <div className="container">
          <SectionHeader>
            <SectionTitle>Featured Games</SectionTitle>
            <ViewAllLink as={Link} to="/games">
              View All Games
            </ViewAllLink>
          </SectionHeader>

          <GamesGrid>
            {featuredGames.map((game) => (
              <GameCard
                key={game.id}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <GameCardContent>
                  <GameTitle>{game.title}</GameTitle>
                  <GameLocation>
                    <FiMapPin /> {game.location}
                  </GameLocation>
                  <GameDate>
                    <FiCalendar /> {game.date}, {game.time}
                  </GameDate>
                  <GameSpots>
                    <FiUsers /> {game.spotsAvailable} spots available
                  </GameSpots>
                  <GameCardActions>
                    <Button
                      as={Link}
                      to={`/games/${game.id}`}
                      variant="outlined"
                      size="small"
                      isFullWidth
                    >
                      View Details
                    </Button>
                  </GameCardActions>
                </GameCardContent>
              </GameCard>
            ))}
          </GamesGrid>
        </div>
      </FeaturedGamesSection>

      {/* CTA Section */}
      <CTASection>
        <div className="container">
          <CTAContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CTATitle>Ready to Play?</CTATitle>
              <CTADescription>
                Join our community today and never miss a volleyball game again.
              </CTADescription>
              <CTAButtons>
                <Button as={Link} to="/games" variant="primary" size="large">
                  Find Games
                </Button>
                <Button as={Link} to="/games/create" variant="outlined" size="large">
                  Create Game
                </Button>
              </CTAButtons>
            </motion.div>
          </CTAContent>
        </div>
      </CTASection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  margin-bottom: 60px;
`;

const HeroSection = styled.section`
  background-image: url('/images/23.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  min-height: 600px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  }
`;

const HeroContent = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  color: white;
  z-index: 1;
`;

const HeroContentInner = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  margin-bottom: ${({ theme }) => theme.space.lg};
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: white;

`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  margin-bottom: ${({ theme }) => theme.space.xl};
  max-width: 600px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.5;
  color: white;

`;

const HeroCTA = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.space['3xl']} 0;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: ${({ theme }) => theme.space['4xl']};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: white;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const FeaturedGamesSection = styled.section`
  padding: ${({ theme }) => theme.space['3xl']} 0;
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.space['4xl']};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space.md};
  }
`;

const ViewAllLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.lg};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GameCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const GameCardContent = styled.div`
  padding: ${({ theme }) => theme.space.lg};
`;

const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GameLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GameDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GameSpots = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const GameCardActions = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  padding: ${({ theme }) => theme.space['3xl']} 0;
  margin-bottom: 60px;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space['3xl']};
  
  @media (min-width: 640px) {
    margin: 0 ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space['3xl']};
  }
`;

const CTAContent = styled.div`
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const CTADescription = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  margin-bottom: ${({ theme }) => theme.space.xl};
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  justify-content: center;
  flex-wrap: wrap;
`;

export default HomePage; 