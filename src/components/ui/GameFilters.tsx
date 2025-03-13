import React from 'react';
import styled from 'styled-components';
import { FiMapPin, FiCalendar, FiTag, FiX } from 'react-icons/fi';
import Button from './Button';

export interface GameFiltersData {
  location: string;
  dateFrom: string;
  dateTo: string;
  format: string;
  availableSpotsOnly: boolean;
}

interface GameFiltersProps {
  filters: GameFiltersData;
  onChange: (filters: Partial<GameFiltersData>) => void;
  onReset: () => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({ filters, onChange, onReset }) => {
  // Game formats available for filtering
  const formats = [
    { id: 'friendly', name: 'Friendly Game' },
    { id: 'tournament', name: 'Tournament' },
    { id: 'training', name: 'Training' },
    { id: 'league', name: 'League Match' },
    { id: 'round_robin', name: 'Round Robin' },
    { id: 'single_elimination', name: 'Single Elimination' },
    { id: 'double_elimination', name: 'Double Elimination' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    onChange({
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>Filters</FiltersTitle>
        <ResetButton type="button" onClick={onReset}>
          <FiX />
          <span>Reset</span>
        </ResetButton>
      </FiltersHeader>
      
      <FiltersGrid>
        <FilterGroup>
          <FilterLabel>
            <FiMapPin />
            <span>Location</span>
          </FilterLabel>
          <Input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="City, venue name"
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FiCalendar />
            <span>Date Range</span>
          </FilterLabel>
          <DateInputGroup>
            <DateInput
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleInputChange}
              placeholder="From"
            />
            <DateInput
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleInputChange}
              placeholder="To"
            />
          </DateInputGroup>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FiTag />
            <span>Format</span>
          </FilterLabel>
          <Select
            name="format"
            value={filters.format}
            onChange={handleInputChange}
          >
            <option value="">All Formats</option>
            {formats.map(format => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              name="availableSpotsOnly"
              checked={filters.availableSpotsOnly}
              onChange={handleInputChange}
            />
            <span>Show only games with available spots</span>
          </CheckboxLabel>
        </FilterGroup>
      </FiltersGrid>
      
      <FiltersActions>
        <Button 
          variant="primary" 
          onClick={() => {}} // This would typically apply the filters
          disabled={Object.values(filters).every(value => 
            typeof value === 'string' ? value === '' : value === false
          )}
        >
          Apply Filters
        </Button>
      </FiltersActions>
    </FiltersContainer>
  );
};

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.lg};
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const FiltersTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;

const DateInput = styled(Input)`
  flex: 1;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const FiltersActions = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
  display: flex;
  justify-content: flex-end;
`;

export default GameFilters; 