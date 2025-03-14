import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';
import GameCard from '../components/ui/GameCard';
import GameFilters from '../components/ui/GameFilters';
import { useAuth } from '../contexts/AuthContext';

interface Game {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  format: string;
  totalSpots: number;
  availableSpots: number;
  imageUrl?: string;
  organizer: {
    name: string;
  };
}

// Mock data for demonstration
const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'Weekly Volleyball Game',
    description: 'Join us for our weekly volleyball game. All skill levels welcome!',
    location: 'Central Park, New York',
    date: 'July 15, 2023',
    time: '6:00 PM - 8:00 PM',
    format: 'Friendly Game',
    totalSpots: 12,
    availableSpots: 5,
    imageUrl: '/images/23.webp',
    organizer: {
      name: 'John Smith',
    },
  },
  {
    id: '2',
    title: 'Beach Volleyball Tournament',
    description: 'Beach volleyball tournament with prizes for the winners!',
    location: 'Venice Beach, Los Angeles',
    date: 'July 22, 2023',
    time: '10:00 AM - 4:00 PM',
    format: 'Tournament',
    totalSpots: 24,
    availableSpots: 8,
    imageUrl: '/images/crop.webp',
    organizer: {
      name: 'Sarah Johnson',
    },
  },
  {
    id: '3',
    title: 'Volleyball Training Session',
    description: 'Improve your skills with professional coaches. Focus on serves and reception.',
    location: 'Sports Center, Chicago',
    date: 'July 18, 2023',
    time: '7:00 PM - 9:00 PM',
    format: 'Training',
    totalSpots: 16,
    availableSpots: 10,
    imageUrl: '/images/hq720.jpg',
    organizer: {
      name: 'Michael Brown',
    },
  },
  {
    id: '4',
    title: 'Corporate Volleyball Tournament',
    description: 'Annual corporate volleyball tournament between local companies.',
    location: 'Corporate Park, Houston',
    date: 'July 29, 2023',
    time: '1:00 PM - 7:00 PM',
    format: 'Tournament',
    totalSpots: 36,
    availableSpots: 0,
    imageUrl: '/images/image1.jpg',
    organizer: {
      name: 'Corporate Sports Inc.',
    },
  },
];

interface GamesFilters {
  location: string;
  dateFrom: string;
  dateTo: string;
  format: string;
  availableSpotsOnly: boolean;
}

const GamesPage: React.FC = () => {
  const { currentUser, userData, isAdmin, isOrganizer } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<GamesFilters>({
    location: '',
    dateFrom: '',
    dateTo: '',
    format: '',
    availableSpotsOnly: false,
  });

  useEffect(() => {
    // Simulate API call to fetch games
    setIsLoading(true);
    setTimeout(() => {
      setGames(MOCK_GAMES);
      setIsLoading(false);
    }, 800);
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters: Partial<GamesFilters>) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
  };

  const handleFilterReset = () => {
    setFilters({
      location: '',
      dateFrom: '',
      dateTo: '',
      format: '',
      availableSpotsOnly: false,
    });
  };

  const filterGames = (gamesArray: Game[]) => {
    return gamesArray.filter((game) => {
      if (filters.availableSpotsOnly && game.availableSpots === 0) {
        return false;
      }
      if (filters.location && !game.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.format && game.format !== filters.format) {
        return false;
      }
      // Date filtering would require proper date parsing and comparison
      // This is simplified for the mockup
      return true;
    });
  };

  const filteredGames = filterGames(games);

  // Функция для проверки, может ли пользователь создавать игры
  const canCreateGame = () => {
    if (!currentUser || !userData) return false;
    return isAdmin() || isOrganizer();
  };
  
  // Для отладки
  useEffect(() => {
    console.log('GamesPage - Auth state:', { 
      currentUser: currentUser ? 'Авторизован' : 'Не авторизован',
      userData,
      isAdmin: isAdmin(),
      isOrganizer: isOrganizer(),
      canCreateGame: canCreateGame()
    });
  }, [currentUser, userData]);

  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <HeaderContent>
            <PageTitle>Volleyball Games</PageTitle>
            <PageDescription>
              Find and join volleyball games in your area. Whether you're looking for casual play
              or competitive tournaments, you'll find the perfect match here.
            </PageDescription>
          </HeaderContent>
          <FilterButton variant="outlined" leftIcon={<FiFilter />} onClick={toggleFilters}>
            Filters
          </FilterButton>
        </PageHeader>

        {showFilters && (
          <FiltersContainer
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </FiltersContainer>
        )}

        <GamesStats>
          <span>{filteredGames.length} games found</span>
          {Object.values(filters).some(value => 
            typeof value === 'string' ? value !== '' : value === true
          ) && (
            <FiltersApplied>Filters applied</FiltersApplied>
          )}
        </GamesStats>

        {isLoading ? (
          <LoadingContainer>
            <LoadingMessage>Loading games...</LoadingMessage>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorContainer>
        ) : filteredGames.length === 0 ? (
          <NoGamesContainer>
            <NoGamesMessage>No games found matching your criteria.</NoGamesMessage>
            <Button variant="primary" onClick={handleFilterReset}>Reset Filters</Button>
          </NoGamesContainer>
        ) : (
          <GamesGrid>
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GameCard 
                  {...game} 
                  organizer={game.organizer}
                  showOrganizer={true}
                />
              </motion.div>
            ))}
          </GamesGrid>
        )}
        
        {canCreateGame() && (
          <CreateGameCTA>
            <CTAContent>
              <CTATitle>Хотите организовать свою игру?</CTATitle>
              <CTADescription>
                Создайте новую волейбольную игру и пригласите других присоединиться!
              </CTADescription>
            </CTAContent>
            <Button 
              variant="primary" 
              size="large" 
              as={Link} 
              to="/games/create"
            >
              Создать игру
            </Button>
          </CreateGameCTA>
        )}
        
        {!currentUser && (
          <CreateGameCTA>
            <CTAContent>
              <CTATitle>Хотите организовать свою игру?</CTATitle>
              <CTADescription>
                Зарегистрируйтесь, чтобы получить возможность создавать игры и управлять ими!
              </CTADescription>
            </CTAContent>
            <Button 
              variant="primary" 
              size="large" 
              as={Link} 
              to="/register"
            >
              Зарегистрироваться
            </Button>
          </CreateGameCTA>
        )}
      </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space.xl} 0;
  margin-bottom: ${({ theme }) => theme.space['2xl']};
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.md};
  }
`;

const HeaderContent = styled.div`
  max-width: 800px;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.base};
`;

const FilterButton = styled(Button)`
  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const FiltersContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  overflow: hidden;
`;

const GamesStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FiltersApplied = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space['2xl']};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space['4xl']} 0;
`;

const LoadingMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space['4xl']} 0;
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const NoGamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space['4xl']} 0;
  gap: ${({ theme }) => theme.space.xl};
`;

const NoGamesMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const CreateGameCTA = styled.div`
  margin-top: ${({ theme }) => theme.space['3xl']};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.lg};
    text-align: center;
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default GamesPage; 