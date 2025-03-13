import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiEdit, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { GameCardProps } from '../components/ui/GameCard';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface UserStats {
  gamesCreated: number;
  gamesParticipated: number;
  upcomingGames: number;
}

// Временные данные для демонстрации
const MOCK_USER_PROFILE: UserProfile = {
  id: 'user1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+7 (999) 123-45-67',
  avatar: null,
};

const MOCK_USER_STATS: UserStats = {
  gamesCreated: 5,
  gamesParticipated: 12,
  upcomingGames: 3,
};

const MOCK_CREATED_GAMES: GameCardProps[] = [
  {
    id: '1',
    title: 'Еженедельная игра в волейбол',
    location: 'Спортивный центр "Олимп", Москва',
    date: '15 июня 2023',
    time: '18:00 - 20:00',
    format: 'Круговой турнир',
    totalSpots: 12,
    availableSpots: 5,
    imageUrl: '/images/23.webp',
  },
  {
    id: '2',
    title: 'Турнир по пляжному волейболу',
    location: 'Пляж "Солнечный", Сочи',
    date: '20 июня 2023',
    time: '10:00 - 16:00',
    format: 'Single Elimination',
    totalSpots: 16,
    availableSpots: 8,
    imageUrl: '/images/hq720.jpg',
  },
];

const MOCK_BOOKED_GAMES: GameCardProps[] = [
  {
    id: '3',
    title: 'Корпоративный турнир',
    location: 'Спортивный комплекс "Динамо", Санкт-Петербург',
    date: '25 июня 2023',
    time: '12:00 - 18:00',
    format: 'Double Elimination',
    totalSpots: 24,
    availableSpots: 0,
    imageUrl: '/images/crop.webp',
  },
  {
    id: '4',
    title: 'Любительская лига волейбола',
    location: 'Школа №123, Казань',
    date: '30 июня 2023',
    time: '19:00 - 21:00',
    format: 'Швейцарская система',
    totalSpots: 18,
    availableSpots: 6,
    imageUrl: '/images/image1.jpg',
  },
];

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [createdGames, setCreatedGames] = useState<GameCardProps[]>([]);
  const [bookedGames, setBookedGames] = useState<GameCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'booked'>('created');

  // Имитация загрузки данных с сервера
  useEffect(() => {
    setIsLoading(true);

    // Имитация задержки загрузки
    const timer = setTimeout(() => {
      setProfile(MOCK_USER_PROFILE);
      setStats(MOCK_USER_STATS);
      setCreatedGames(MOCK_CREATED_GAMES);
      setBookedGames(MOCK_BOOKED_GAMES);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading profile...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!profile || !stats) {
    return (
      <ErrorContainer>
        <ErrorMessage>Failed to load profile</ErrorMessage>
        <Button as={Link} to="/" variant="primary">
          Back to Home
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>My Profile</PageTitle>
        </PageHeader>

        <ProfileGrid>
          <ProfileCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileHeader>
              <ProfileAvatar>
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <FiUser size={48} />
                )}
              </ProfileAvatar>
              <ProfileInfo>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileContact>
                  <FiMail />
                  <span>{profile.email}</span>
                </ProfileContact>
                {profile.phone && (
                  <ProfileContact>
                    <FiPhone />
                    <span>{profile.phone}</span>
                  </ProfileContact>
                )}
              </ProfileInfo>
              <EditProfileButton
                as={Link}
                to="/profile/edit"
                variant="outlined"
                size="small"
                leftIcon={<FiEdit />}
              >
                Edit Profile
              </EditProfileButton>
            </ProfileHeader>

            <StatsContainer>
              <StatItem>
                <StatValue>{stats.gamesCreated}</StatValue>
                <StatLabel>Games Created</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.gamesParticipated}</StatValue>
                <StatLabel>Games Participated</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.upcomingGames}</StatValue>
                <StatLabel>Upcoming Games</StatLabel>
              </StatItem>
            </StatsContainer>
          </ProfileCard>

          <GamesSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TabsContainer>
              <Tab
                isActive={activeTab === 'created'}
                onClick={() => setActiveTab('created')}
              >
                Created Games
              </Tab>
              <Tab
                isActive={activeTab === 'booked'}
                onClick={() => setActiveTab('booked')}
              >
                Booked Games
              </Tab>
            </TabsContainer>

            <GamesContainer>
              {activeTab === 'created' ? (
                createdGames.length > 0 ? (
                  createdGames.map((game) => (
                    <GameItem key={game.id}>
                      <GameImage src={game.imageUrl || '/images/default-game.jpg'} alt={game.title} />
                      <GameContent>
                        <GameTitle>{game.title}</GameTitle>
                        <GameMeta>
                          <GameMetaItem>
                            <FiCalendar />
                            <span>{game.date}</span>
                          </GameMetaItem>
                          <GameMetaItem>
                            <FiClock />
                            <span>{game.time}</span>
                          </GameMetaItem>
                          <GameMetaItem>
                            <FiMapPin />
                            <span>{game.location}</span>
                          </GameMetaItem>
                        </GameMeta>
                        <GameActions>
                          <Button
                            as={Link}
                            to={`/games/${game.id}`}
                            variant="outlined"
                            size="small"
                          >
                            View Details
                          </Button>
                          <Button
                            as={Link}
                            to={`/games/${game.id}/edit`}
                            variant="primary"
                            size="small"
                          >
                            Edit
                          </Button>
                        </GameActions>
                      </GameContent>
                    </GameItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyStateText>You haven't created any games yet.</EmptyStateText>
                    <Button as={Link} to="/games/create" variant="primary">
                      Create Game
                    </Button>
                  </EmptyState>
                )
              ) : bookedGames.length > 0 ? (
                bookedGames.map((game) => (
                  <GameItem key={game.id}>
                    <GameImage src={game.imageUrl || '/images/default-game.jpg'} alt={game.title} />
                    <GameContent>
                      <GameTitle>{game.title}</GameTitle>
                      <GameMeta>
                        <GameMetaItem>
                          <FiCalendar />
                          <span>{game.date}</span>
                        </GameMetaItem>
                        <GameMetaItem>
                          <FiClock />
                          <span>{game.time}</span>
                        </GameMetaItem>
                        <GameMetaItem>
                          <FiMapPin />
                          <span>{game.location}</span>
                        </GameMetaItem>
                      </GameMeta>
                      <GameActions>
                        <Button
                          as={Link}
                          to={`/games/${game.id}`}
                          variant="primary"
                          size="small"
                        >
                          View Details
                        </Button>
                      </GameActions>
                    </GameContent>
                  </GameItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateText>You haven't booked any games yet.</EmptyStateText>
                  <Button as={Link} to="/games" variant="primary">
                    Find Game
                  </Button>
                </EmptyState>
              )}
            </GamesContainer>
          </GamesSection>
        </ProfileGrid>
      </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding-bottom: ${({ theme }) => theme.space['2xl']};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const ProfileCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  height: fit-content;
`;

const ProfileHeader = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radii.round};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const ProfileContact = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space.xs};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditProfileButton = styled(Button)``;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: ${({ theme }) => theme.space.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.sm};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GamesSection = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ isActive, theme }) => 
    isActive ? 'white' : theme.colors.textSecondary};
  border: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ isActive, theme }) => 
      isActive ? theme.colors.primary : theme.colors.backgroundDark};
  }
`;

const GamesContainer = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const GameItem = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const GameImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 640px) {
    width: 100%;
    height: 120px;
  }
`;

const GameContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.space.md};
  display: flex;
  flex-direction: column;
`;

const GameTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const GameMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.md};
  flex: 1;
`;

const GameMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    min-width: 16px;
  }
`;

const GameActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xl} 0;
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space['3xl']} 0;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(74, 106, 255, 0.2);
  border-left-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space['3xl']} 0;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

export default ProfilePage; 