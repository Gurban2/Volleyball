import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiX, FiUser } from 'react-icons/fi';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  spots: number;
  isOrganizer?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  onRemove?: (id: string) => void;
  canRemove?: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onRemove,
  canRemove = false,
}) => {
  const organizers = participants.filter(p => p.isOrganizer);
  const regularParticipants = participants.filter(p => !p.isOrganizer);

  return (
    <Container>
      <ListTitle>Participants ({participants.length})</ListTitle>

      {organizers.length > 0 && (
        <Section>
          <SectionTitle>Organizers</SectionTitle>
          {organizers.map(participant => (
            <ParticipantItem
              key={participant.id}
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ParticipantInfo>
                <Avatar src={participant.avatar || '/images/default-avatar.jpg'} alt={participant.name} />
                <ParticipantDetails>
                  <ParticipantName>{participant.name}</ParticipantName>
                  <ParticipantRole>Organizer</ParticipantRole>
                </ParticipantDetails>
              </ParticipantInfo>
              <ParticipantSpots>
                {participant.spots > 1 ? `${participant.spots} spots` : '1 spot'}
              </ParticipantSpots>
            </ParticipantItem>
          ))}
        </Section>
      )}

      {regularParticipants.length > 0 && (
        <Section>
          <SectionTitle>Players</SectionTitle>
          {regularParticipants.map(participant => (
            <ParticipantItem
              key={participant.id}
              as={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ParticipantInfo>
                <Avatar src={participant.avatar || '/images/default-avatar.jpg'} alt={participant.name} />
                <ParticipantName>{participant.name}</ParticipantName>
              </ParticipantInfo>
              <ParticipantActions>
                <ParticipantSpots>
                  {participant.spots > 1 ? `${participant.spots} spots` : '1 spot'}
                </ParticipantSpots>
                {canRemove && onRemove && (
                  <RemoveButton
                    type="button"
                    onClick={() => onRemove(participant.id)}
                    aria-label="Remove participant"
                  >
                    <FiX />
                  </RemoveButton>
                )}
              </ParticipantActions>
            </ParticipantItem>
          ))}
        </Section>
      )}

      {participants.length === 0 && (
        <EmptyState>
          <EmptyMessage>No participants have joined yet</EmptyMessage>
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const ListTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;

const Section = styled.div`
  padding: ${({ theme }) => theme.space.md} 0;
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0 ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const ParticipantDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ParticipantRole = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const ParticipantActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const ParticipantSpots = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.danger};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

export default ParticipantsList; 