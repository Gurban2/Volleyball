import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Button from './Button';

export interface GameCardProps {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  format: string;
  totalSpots: number;
  availableSpots: number;
  imageUrl?: string;
  showOrganizer?: boolean;
  organizer?: {
    name: string;
    avatar?: string;
  };
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  location,
  date,
  time,
  format,
  totalSpots,
  availableSpots,
  imageUrl,
  showOrganizer = true,
  organizer,
}) => {
  const isFull = availableSpots === 0;
  
  return (
    <CardContainer>
      <CardImageWrapper>
        <CardImage src={imageUrl || '/images/default-game.jpg'} alt={title} />
        <CardBadge>{format}</CardBadge>
        
        {isFull && (
          <FullOverlay>
            <FullBadge>Fully Booked</FullBadge>
          </FullOverlay>
        )}
      </CardImageWrapper>
      
      <CardContent>
        <CardTitle>{title}</CardTitle>
        
        <CardMetaList>
          <CardMeta>
            <FiCalendar />
            <span>{date}</span>
          </CardMeta>
          <CardMeta>
            <FiClock />
            <span>{time}</span>
          </CardMeta>
          <CardMeta>
            <FiMapPin />
            <span>{location}</span>
          </CardMeta>
          <CardMeta>
            <FiUsers />
            <span>
              {availableSpots} of {totalSpots} spots available
            </span>
          </CardMeta>
        </CardMetaList>
        
        {showOrganizer && organizer && (
          <OrganizerInfo>
            <OrganizerAvatar src={organizer.avatar || '/images/default-avatar.jpg'} alt={organizer.name} />
            <OrganizerName>Organized by {organizer.name}</OrganizerName>
          </OrganizerInfo>
        )}
        
        <CardActions>
          <Button
            as={Link}
            to={`/games/${id}`}
            variant={isFull ? "outlined" : "primary"}
            size="medium"
            isFullWidth
          >
            {isFull ? 'View Details' : 'Join Game'}
          </Button>
        </CardActions>
      </CardContent>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const CardBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space.sm};
  left: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const FullOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  transform: rotate(-5deg);
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
`;

const CardMetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    min-width: 16px;
  }
`;

const OrganizerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: auto;
  margin-bottom: ${({ theme }) => theme.space.lg};
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrganizerAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const OrganizerName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardActions = styled.div`
  margin-top: auto;
`;

export default GameCard; 