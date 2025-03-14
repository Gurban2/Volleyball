import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiEdit, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { GameCardProps } from '../components/ui/GameCard';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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

const ProfilePage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    gamesCreated: 0,
    gamesParticipated: 0,
    upcomingGames: 0
  });
  const [createdGames, setCreatedGames] = useState<GameCardProps[]>([]);
  const [bookedGames, setBookedGames] = useState<GameCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'booked'>('created');

  // Загрузка данных из Firestore
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchUserGames = async () => {
      setIsLoading(true);
      try {
        // Поиск игр, созданных пользователем
        const createdGamesQuery = query(
          collection(db, 'games'),
          where('creatorId', '==', currentUser.uid)
        );
        const createdGamesSnapshot = await getDocs(createdGamesQuery);
        const createdGamesData = createdGamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GameCardProps[];
        
        // Поиск игр, в которых пользователь участвует
        const bookedGamesQuery = query(
          collection(db, 'gameParticipants'),
          where('userId', '==', currentUser.uid)
        );
        const bookedGamesSnapshot = await getDocs(bookedGamesQuery);
        const gameIds = bookedGamesSnapshot.docs.map(doc => doc.data().gameId);
        
        // Если пользователь участвует в играх, получаем данные этих игр
        let bookedGamesData: GameCardProps[] = [];
        if (gameIds.length > 0) {
          // Для простоты, можно использовать несколько запросов
          // В реальном приложении лучше использовать батчинг или другую оптимизацию
          for (const gameId of gameIds) {
            const gameQuery = query(
              collection(db, 'games'),
              where('id', '==', gameId)
            );
            const gameSnapshot = await getDocs(gameQuery);
            if (!gameSnapshot.empty) {
              bookedGamesData.push({
                id: gameSnapshot.docs[0].id,
                ...gameSnapshot.docs[0].data()
              } as GameCardProps);
            }
          }
        }
        
        // Обновляем состояние
        setCreatedGames(createdGamesData);
        setBookedGames(bookedGamesData);
        setStats({
          gamesCreated: createdGamesData.length,
          gamesParticipated: bookedGamesData.length,
          upcomingGames: [...createdGamesData, ...bookedGamesData].filter(
            game => new Date(game.date) > new Date()
          ).length
        });
      } catch (error) {
        console.error('Ошибка при загрузке игр:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserGames();
  }, [currentUser]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Загрузка профиля...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!userData) {
    return (
      <ErrorContainer>
        <ErrorMessage>Не удалось загрузить профиль</ErrorMessage>
        <Button as={Link} to="/" variant="primary">
          На главную
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Мой профиль</PageTitle>
        </PageHeader>

        <ProfileGrid>
          <ProfileCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileHeader>
              <ProfileAvatar>
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt={userData.displayName || ''} />
                ) : (
                  <FiUser size={48} />
                )}
              </ProfileAvatar>
              <ProfileInfo>
                <ProfileName>{userData.nickname || userData.displayName || 'Пользователь'}</ProfileName>
                <ProfileContact>
                  <FiMail />
                  <span>{userData.email}</span>
                </ProfileContact>
                {userData.height && userData.age && (
                  <ProfileDetails>
                    <ProfileDetail>Возраст: {userData.age} лет</ProfileDetail>
                    <ProfileDetail>Рост: {userData.height} см</ProfileDetail>
                  </ProfileDetails>
                )}
              </ProfileInfo>
              <EditProfileButton
                as={Link}
                to="/profile/edit"
                variant="outlined"
                size="small"
                leftIcon={<FiEdit />}
              >
                Редактировать
              </EditProfileButton>
            </ProfileHeader>

            <StatsContainer>
              <StatItem>
                <StatValue>{stats.gamesCreated}</StatValue>
                <StatLabel>Создано игр</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.gamesParticipated}</StatValue>
                <StatLabel>Участие в играх</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.upcomingGames}</StatValue>
                <StatLabel>Предстоящие игры</StatLabel>
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
                Созданные игры
              </Tab>
              <Tab
                isActive={activeTab === 'booked'}
                onClick={() => setActiveTab('booked')}
              >
                Мои записи
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
                            Подробнее
                          </Button>
                          <Button
                            as={Link}
                            to={`/games/${game.id}/edit`}
                            variant="primary"
                            size="small"
                          >
                            Редактировать
                          </Button>
                        </GameActions>
                      </GameContent>
                    </GameItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyStateText>У вас нет созданных игр</EmptyStateText>
                    {userData.role === 'organizer' || userData.role === 'admin' ? (
                      <Button as={Link} to="/games/create" variant="primary">
                        Создать игру
                      </Button>
                    ) : null}
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
                          Подробнее
                        </Button>
                      </GameActions>
                    </GameContent>
                  </GameItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateText>Вы не записаны на участие в играх</EmptyStateText>
                  <Button as={Link} to="/games" variant="primary">
                    Найти игры
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
  padding: 3rem 1rem;
  gap: 1.5rem;
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  gap: 1rem;
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-top: 1rem;
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

// Добавление нового компонента для информации о профиле
const ProfileDetails = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ProfileDetail = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default ProfilePage; 