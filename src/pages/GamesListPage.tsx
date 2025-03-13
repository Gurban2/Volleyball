import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../components/ui/Button';
import GameCard, { GameCardProps } from '../components/ui/GameCard';
import GameFilters from '../components/ui/GameFilters';


const GAMES_DATA: GameCardProps[] = [
  {
    id: '1',
    title: 'Weekly Volleyball Game',
    location: 'Olympus Sports Center, New York',
    date: 'June 15, 2023',
    time: '6:00 PM - 8:00 PM',
    format: 'Round Robin',
    totalSpots: 12,
    availableSpots: 5,
    imageUrl: '/images/23.webp',
  },
  {
    id: '2',
    title: 'Beach Volleyball Tournament',
    location: 'Sunny Beach, Miami',
    date: 'June 20, 2023',
    time: '10:00 AM - 4:00 PM',
    format: 'Single Elimination',
    totalSpots: 16,
    availableSpots: 8,
    imageUrl: '/images/hq720.jpg',
    
  },
  {
    id: '3',
    title: 'Corporate Tournament',
    location: 'Dynamo Sports Complex, Chicago',
    date: 'June 25, 2023',
    time: '12:00 PM - 6:00 PM',
    format: 'Double Elimination',
    totalSpots: 24,
    availableSpots: 0,
    imageUrl: '/images/hq720.jpg',

  },
  {
    id: '4',
    title: 'Mixed Doubles Tournament',
    location: 'Central Park, San Francisco',
    date: 'July 1, 2023',
    time: '9:00 AM - 3:00 PM',
    format: 'Round Robin',
    totalSpots: 16,
    availableSpots: 2,
    imageUrl: '/images/23.webp',
   
  },
  {
    id: '5',
    title: 'Recreational Evening Game',
    location: 'Sportplace Arena, Los Angeles',
    date: 'July 5, 2023',
    time: '7:00 PM - 9:00 PM',
    format: 'Friendly Match',
    totalSpots: 12,
    availableSpots: 6,
    imageUrl: '/images/23.webp',
  },
  {
    id: '6',
    title: 'Pro-Amateur Championship',
    location: 'Victory Hall, Boston',
    date: 'July 10, 2023',
    time: '2:00 PM - 8:00 PM',
    format: 'Double Elimination',
    totalSpots: 32,
    availableSpots: 12,
    imageUrl: '/images/23.webp',
  },
];

const GamesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    format: '',
    availableSpotsOnly: false,
  });

  // Filter games based on search and filters
  const filteredGames = GAMES_DATA.filter(game => {
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

          {filteredGames.length > 0 ? (
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

export default GamesListPage; 