import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiAward } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

// Define an interface for featured games
interface FeaturedGame {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  spotsAvailable: number;
}

const HomePage: React.FC = () => {
  const { currentUser, userData, isAdmin, isOrganizer } = useAuth();
  const [featuredGames, setFeaturedGames] = useState<FeaturedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Функция для проверки, может ли пользователь создавать игры
  const canCreateGame = () => {
    if (!currentUser || !userData) return false;
    return isAdmin() || isOrganizer();
  };
  
  // Для отладки
  useEffect(() => {
    console.log('Auth state:', { 
      currentUser: currentUser ? 'Авторизован' : 'Не авторизован',
      userData,
      isAdmin: isAdmin(),
      isOrganizer: isOrganizer(),
      canCreateGame: canCreateGame()
    });
  }, [currentUser, userData]);
  
  // Fetch featured games from API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        
        // Make API call to fetch games - we'll get all and take the first 3 as featured
        const response = await fetch('http://localhost:5000/api/rooms');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const gamesData = await response.json() as any[];
        console.log('Games data for homepage:', gamesData);
        
        // Transform and limit to 3 featured games
        const transformedGames: FeaturedGame[] = gamesData
          .slice(0, 3) // Take only first 3 games
          .map((gameData: any) => ({
            id: gameData.id,
            title: gameData.name || gameData.title || 
              (gameData.homeTeam && gameData.awayTeam 
                ? `${gameData.homeTeam.name} vs ${gameData.awayTeam.name}` 
                : 'Игра без названия'),
            location: gameData.location || '',
            date: gameData.date || '',
            time: gameData.time || '',
            spotsAvailable: gameData.availableSpots || 
              (gameData.capacity - (gameData.participants?.length || 0)) || 0,
          }));
        
        setFeaturedGames(transformedGames);
      } catch (err) {
        console.error('Error fetching featured games:', err);
        setError(err instanceof Error ? err.message : 'Failed to load featured games');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

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
                <HeroTitle>Найдите и присоединяйтесь к волейбольным играм рядом с вами</HeroTitle>
                <HeroSubtitle>
                  Общайтесь с местными игроками, организуйте игры и улучшайте свои навыки
                </HeroSubtitle>
                <HeroCTA>
                  <Button as={Link} to="/games" variant="primary" size="large">
                    Найти игры
                  </Button>
                  {canCreateGame() && (
                    <Button as={Link} to="/games/create" variant="outlined" size="large" color="white">
                      Создать игру
                    </Button>
                  )}
                  {!currentUser && (
                    <Button as={Link} to="/register" variant="outlined" size="large" color="white">
                      Зарегистрироваться
                    </Button>
                  )}
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

          {loading ? (
            <LoadingContainer>
              <LoadingText>Loading featured games...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          ) : featuredGames.length > 0 ? (
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
          ) : (
            <NoGamesContainer>
              <NoGamesText>No featured games available at the moment.</NoGamesText>
              <Button as={Link} to="/games" variant="primary">Browse All Games</Button>
            </NoGamesContainer>
          )}
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: ${({ theme }) => theme.space.md};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const NoGamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: ${({ theme }) => theme.space.lg};
`;

const NoGamesText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

export default HomePage; 