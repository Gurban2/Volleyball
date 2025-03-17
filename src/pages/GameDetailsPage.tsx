import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import Button from '../components/ui/Button';
import BookingForm from '../components/ui/BookingForm';
import ParticipantsList from '../components/ui/ParticipantsList';
import { Participant } from '../components/ui/ParticipantsList';
import { BookingFormData } from '../components/ui/BookingForm';

interface GameDetails {
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
    id: string;
    name: string;
    avatar?: string;
  };
  participants: Participant[];
}

// Empty game details template instead of mock data
const MOCK_GAME_DETAILS: GameDetails | null = null;

const GameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!id) {
        setError('Game ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Make API call to fetch game details
        // Если id не начинается с "game", добавляем префикс "game"
        const apiId = id.startsWith('game') ? id : `game${id}`;
        const response = await fetch(`http://localhost:5000/api/games/${apiId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const gameData = await response.json();
        console.log('Game data from API:', gameData);
        
        // Transform the API response to match our GameDetails type if needed
        // This may need to be adjusted based on your actual API response structure
        const transformedData: GameDetails = {
          id: gameData.id,
          title: gameData.name || gameData.title,
          description: gameData.description || '',
          location: gameData.location || '',
          date: gameData.date || '',
          time: gameData.time || '',
          format: gameData.format || 'Unknown',
          totalSpots: gameData.totalSpots || gameData.capacity || 0,
          availableSpots: gameData.availableSpots || (gameData.capacity - (gameData.participants?.length || 0)) || 0,
          imageUrl: gameData.imageUrl,
          organizer: {
            id: gameData.organizer?.id || 'unknown',
            name: gameData.organizer?.name || 'Unknown Organizer',
            avatar: gameData.organizer?.avatar,
          },
          participants: (gameData.participants || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            spots: p.spots || 1,
            isOrganizer: p.isOrganizer || p.id === gameData.organizer?.id,
          })),
        };
        
        setGame(transformedData);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log('Booking submitted:', data);
    // In a real application, you would send this data to your API
    // and update the game state with the new participant
    
    if (game) {
      const newParticipant: Participant = {
        id: `new-${Date.now()}`,
        name: data.name,
        spots: parseInt(data.spots.toString(), 10),
      };
      
      const updatedGame = {
        ...game,
        availableSpots: Math.max(0, game.availableSpots - newParticipant.spots),
        participants: [...game.participants, newParticipant],
      };
      
      setGame(updatedGame);
    }
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (game) {
      const participant = game.participants.find(p => p.id === participantId);
      
      if (participant) {
        const updatedGame = {
          ...game,
          availableSpots: game.availableSpots + participant.spots,
          participants: game.participants.filter(p => p.id !== participantId),
        };
        
        setGame(updatedGame);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingMessage>Loading game details...</LoadingMessage>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container">
        <ErrorMessage>{error || 'Error loading game details'}</ErrorMessage>
        <Button as={Link} to="/games" variant="primary">
          Back to Games
        </Button>
      </div>
    );
  }

  return (
    <PageContainer>
      <GameHeader style={{ backgroundImage: `url(${game.imageUrl || '/images/default-game.jpg'})` }}>
        <HeaderOverlay>
          <div className="container">
            <Breadcrumbs>
              <BreadcrumbLink to="/games">Games</BreadcrumbLink>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbCurrent>{game.title}</BreadcrumbCurrent>
            </Breadcrumbs>
            
            <HeaderContent>
              <HeaderTitle
                as={motion.h1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {game.title}
              </HeaderTitle>
              
              <HeaderDetails
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <HeaderDetail>
                  <FiCalendar />
                  <span>{game.date}</span>
                </HeaderDetail>
                <HeaderDetail>
                  <FiClock />
                  <span>{game.time}</span>
                </HeaderDetail>
                <HeaderDetail>
                  <FiMapPin />
                  <span>{game.location}</span>
                </HeaderDetail>
                <HeaderDetail>
                  <FiUsers />
                  <span>{game.availableSpots} of {game.totalSpots} spots available</span>
                </HeaderDetail>
              </HeaderDetails>
              
              <HeaderActions
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  as={Link}
                  to="/games"
                  variant="outlined"
                  leftIcon={<FiArrowLeft />}
                >
                  Back to Games
                </Button>
                <Button
                  variant="outlined"
                  leftIcon={<FiShare2 />}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Share
                </Button>
              </HeaderActions>
            </HeaderContent>
          </div>
        </HeaderOverlay>
      </GameHeader>
      
      <ContentSection>
        <div className="container">
          <ContentGrid>
            <MainContent>
              <ContentBlock>
                <SectionTitle>Description</SectionTitle>
                <SectionContent>{game.description}</SectionContent>
              </ContentBlock>
              
              <ContentBlock>
                <SectionTitle>Organizer</SectionTitle>
                <OrganizerCard>
                  <OrganizerAvatar src={game.organizer.avatar || '/images/default-avatar.jpg'} alt={game.organizer.name} />
                  <OrganizerName>{game.organizer.name}</OrganizerName>
                </OrganizerCard>
              </ContentBlock>
              
              <ContentBlock>
                <SectionTitle>Participants</SectionTitle>
                <ParticipantsList
                  participants={game.participants}
                  onRemove={handleRemoveParticipant}
                  canRemove={true} // In a real app, check if current user is the organizer
                />
              </ContentBlock>
            </MainContent>
            
            <Sidebar>
              <SidebarBlock>
                <GameFormatLabel>{game.format}</GameFormatLabel>
                <BookingForm
                  gameId={game.id}
                  availableSpots={game.availableSpots}
                  onSubmit={handleBookingSubmit}
                />
              </SidebarBlock>
            </Sidebar>
          </ContentGrid>
        </div>
      </ContentSection>
    </PageContainer>
  );
};

const PageContainer = styled.div``;

const GameHeader = styled.header`
  background-size: cover;
  background-position: center;
  position: relative;
  color: white;
  height: 400px;
  
  @media (max-width: 768px) {
    height: auto;
  }
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8));
  padding: ${({ theme }) => theme.space.xl} 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const BreadcrumbLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 ${({ theme }) => theme.space.xs};
  color: rgba(255, 255, 255, 0.5);
`;

const BreadcrumbCurrent = styled.span`
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const HeaderContent = styled.div``;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeaderDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const HeaderDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ContentSection = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
`;

const ContentBlock = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const SidebarBlock = styled(ContentBlock)`
  position: sticky;
  top: ${({ theme }) => theme.space.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionContent = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.base};
  white-space: pre-line;
`;

const OrganizerCard = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const OrganizerAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const OrganizerName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GameFormatLabel = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  right: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space['3xl']} 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space['2xl']} 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

export default GameDetailsPage; 