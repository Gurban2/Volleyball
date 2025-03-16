import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';
import GameCard, { GameCardProps } from '../components/ui/GameCard';
import GameFilters from '../components/ui/GameFilters';


const GamesListPage: React.FC = () => {
  const [games, setGames] = useState<GameCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    format: '',
    availableSpotsOnly: false,
  });

  // Fetch games data from the API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make API call to fetch all games
        const response = await fetch('http://localhost:3000/api/games');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const gamesData = await response.json() as any[];
        console.log('Games data from API:', gamesData);
        
        // Transform the API response to match our GameCardProps type
        const transformedGames: GameCardProps[] = gamesData.map((gameData: any) => ({
          id: gameData.id,
          title: gameData.name || gameData.title || 
            (gameData.homeTeam && gameData.awayTeam 
              ? `${gameData.homeTeam.name} vs ${gameData.awayTeam.name}` 
              : 'Игра без названия'),
          location: gameData.location || '',
          date: gameData.date || '',
          time: gameData.time || '',
          format: gameData.format || 'Unknown',
          totalSpots: gameData.totalSpots || gameData.capacity || 0,
          availableSpots: gameData.availableSpots || (gameData.capacity - (gameData.participants?.length || 0)) || 0,
          imageUrl: gameData.imageUrl,
          organizer: gameData.organizer ? {
            name: gameData.organizer.name || 'Unknown Organizer',
            avatar: gameData.organizer.avatar,
          } : undefined,
        }));
        
        setGames(transformedGames);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games based on search and filters
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        game.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filters.location || game.location.toLowerCase().includes(filters.location.toLowerCase());
    
    // Корректная обработка дат
    let matchesDateFrom = true;
    let matchesDateTo = true;
    
    if (filters.dateFrom) {
      // Преобразуем строковые даты в объекты Date для корректного сравнения
      const gameDate = new Date(game.date);
      const fromDate = new Date(filters.dateFrom);
      matchesDateFrom = gameDate >= fromDate;
    }
    
    if (filters.dateTo) {
      const gameDate = new Date(game.date);
      const toDate = new Date(filters.dateTo);
      matchesDateTo = gameDate <= toDate;
    }
    
    // Специальная обработка для формата
    let matchesFormat = !filters.format;
    
    if (filters.format) {
      if (filters.format === 'friendly' && (
        game.format === 'Friendly Match' || 
        game.format === 'Friendly Game'
      )) {
        matchesFormat = true;
      } else if (filters.format === 'tournament' && (
        game.format.includes('Tournament') || 
        game.format.includes('Championship')
      )) {
        matchesFormat = true;
      } else if (filters.format === 'training' && game.format.includes('Training')) {
        matchesFormat = true;
      } else if (filters.format === 'league' && game.format.includes('League')) {
        matchesFormat = true;
      } else if (filters.format === 'round_robin' && game.format === 'Round Robin') {
        matchesFormat = true;
      } else if (filters.format === 'single_elimination' && game.format === 'Single Elimination') {
        matchesFormat = true;
      } else if (filters.format === 'double_elimination' && game.format === 'Double Elimination') {
        matchesFormat = true;
      } else if (filters.format === game.format) {
        matchesFormat = true;
      }
    }
    
    const matchesAvailability = !filters.availableSpotsOnly || game.availableSpots > 0;
    
    return matchesSearch && matchesLocation && matchesDateFrom && matchesDateTo && matchesFormat && matchesAvailability;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
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

  return (
    <PageContainer>
      <PageHeader>
        <div className="container">
          <HeaderContent>
            <HeaderTitle
              as={motion.h1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Volleyball Games
            </HeaderTitle>
            <HeaderSubtitle
              as={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Find and join volleyball games in your area
            </HeaderSubtitle>
          </HeaderContent>
        </div>
      </PageHeader>

      <SearchSection>
        <div className="container">
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search for games by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              as={motion.input}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
            <SearchIconWrapper>
              <FiSearch />
            </SearchIconWrapper>
            <FiltersButton
              variant="outlined"
              onClick={toggleFilters}
              leftIcon={<FiFilter />}
              as={motion.button}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Filters
            </FiltersButton>
          </SearchBar>

          {showFilters && (
            <FiltersContainer
              as={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <GameFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </FiltersContainer>
          )}
        </div>
      </SearchSection>

      <GamesSection>
        <div className="container">
          <ResultsCount>
            Found {filteredGames.length} games
          </ResultsCount>

          {loading ? (
            <LoadingContainer>
              <LoadingMessage>Loading games...</LoadingMessage>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorMessage>{error}</ErrorMessage>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </ErrorContainer>
          ) : filteredGames.length > 0 ? (
            <GamesGrid>
              {filteredGames.map(game => (
                <GameCardWrapper
                  key={game.id}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <GameCard {...game} />
                </GameCardWrapper>
              ))}
            </GamesGrid>
          ) : (
            <NoResults>
              <NoResultsText>No games found matching your search criteria</NoResultsText>
              <Button variant="outlined" onClick={handleFilterReset}>Clear Filters</Button>
            </NoResults>
          )}
        </div>
      </GamesSection>
    </PageContainer>
  );
};

const PageContainer = styled.div``;

const PageHeader = styled.header`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryDark});
  color: white;
  padding: ${({ theme }) => theme.space['2xl']} 0;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const SearchSection = styled.section`
  padding: ${({ theme }) => theme.space.xl} 0;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  position: relative;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ theme }) => theme.space.md};
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textTertiary};
  
  @media (max-width: 640px) {
    top: 24px;
  }
`;

const FiltersButton = styled(Button)`
  min-width: 120px;
  
  @media (max-width: 640px) {
    align-self: flex-end;
  }
`;

const FiltersContainer = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
`;

const GamesSection = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
`;

const ResultsCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GameCardWrapper = styled.div`
  height: 100%;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space['3xl']};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
`;

const NoResultsText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.lg};
  min-height: 300px;
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

export default GamesListPage; 