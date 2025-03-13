import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMap, FiUpload, FiX, FiCheck } from 'react-icons/fi';
import Button from '../components/ui/Button';

interface GameFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  format: string;
  totalSpots: number;
  image: File | null;
  imagePreview: string;
}

const FORMATS = [
  { value: 'round_robin', label: 'Round Robin' },
  { value: 'single_elimination', label: 'Single Elimination' },
  { value: 'double_elimination', label: 'Double Elimination' },
  { value: 'friendly', label: 'Friendly Match' }
];

const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    duration: '2',
    format: 'round_robin',
    totalSpots: 12,
    image: null,
    imagePreview: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof GameFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
      
      if (errors[name as keyof GameFormData]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: undefined,
        }));
      }
    }
  };
  
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: '',
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.totalSpots || formData.totalSpots <= 0) {
      newErrors.totalSpots = 'Number of participants must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Redirect to game page after success
      setTimeout(() => {
        navigate('/games/1');
      }, 2000);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="container">
          <HeaderContent>
            <BackButton 
              as={Link} 
              to="/games"
              whileHover={{ x: -5 }}
            >
              <FiArrowLeft />
              <span>Back to Games</span>
            </BackButton>
            <HeaderTitle
              as={motion.h1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create New Game
            </HeaderTitle>
          </HeaderContent>
        </div>
      </PageHeader>

      <FormSection>
        <div className="container">
          {submitSuccess ? (
            <SuccessMessage
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessIcon>
                <FiCheck size={32} />
              </SuccessIcon>
              <h2>Game Created Successfully!</h2>
              <p>Your game has been successfully created. Redirecting to game page...</p>
            </SuccessMessage>
          ) : (
            <FormContainer
              as={motion.form}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
            >
              <FormSection>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label htmlFor="title">Game Title*</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    $hasError={!!errors.title}
                    placeholder="Enter game title"
                  />
                  {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your game, rules, requirements, etc."
                  />
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Date & Location</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="date">Date*</Label>
                    <InputWithIcon $hasError={!!errors.date}>
                      <FiCalendar />
                      <Input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        $hasError={!!errors.date}
                      />
                    </InputWithIcon>
                    {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="time">Start Time*</Label>
                    <InputWithIcon $hasError={!!errors.time}>
                      <FiClock />
                      <Input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        $hasError={!!errors.time}
                      />
                    </InputWithIcon>
                    {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="1">1 hour</option>
                      <option value="1.5">1.5 hours</option>
                      <option value="2">2 hours</option>
                      <option value="2.5">2.5 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5 hours</option>
                      <option value="6">6 hours</option>
                    </Select>
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <Label htmlFor="location">Location*</Label>
                  <InputWithIcon $hasError={!!errors.location}>
                    <FiMap />
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      $hasError={!!errors.location}
                      placeholder="Enter location address"
                    />
                  </InputWithIcon>
                  {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                </FormGroup>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Format & Participants</SectionTitle>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="format">Game Format</Label>
                    <Select
                      id="format"
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                    >
                      {FORMATS.map(format => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="totalSpots">Number of Participants*</Label>
                    <Input
                      type="number"
                      id="totalSpots"
                      name="totalSpots"
                      min="1"
                      value={formData.totalSpots}
                      onChange={handleNumberChange}
                      $hasError={!!errors.totalSpots}
                    />
                    {errors.totalSpots && <ErrorMessage>{errors.totalSpots}</ErrorMessage>}
                  </FormGroup>
                </FormRow>
              </FormSection>
              
              <FormSection>
                <SectionTitle>Game Image</SectionTitle>
                <ImageUploadContainer>
                  {formData.imagePreview ? (
                    <ImagePreviewContainer>
                      <ImagePreview src={formData.imagePreview} alt="Game preview" />
                      <RemoveImageButton onClick={removeImage}>
                        <FiX />
                      </RemoveImageButton>
                    </ImagePreviewContainer>
                  ) : (
                    <ImageUploadLabel htmlFor="image">
                      <FiUpload size={32} />
                      <span>Click to upload an image</span>
                      <p>PNG, JPG or WEBP (max. 5MB)</p>
                      <ImageUploadInput
                        type="file"
                        id="image"
                        name="image"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                      />
                    </ImageUploadLabel>
                  )}
                </ImageUploadContainer>
              </FormSection>
              
              <FormActions>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Create Game
                </Button>
              </FormActions>
            </FormContainer>
          )}
        </div>
      </FormSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.space['2xl']};
`;

const PageHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const HeaderContent = styled.div`
  position: relative;
`;

const BackButton = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.sm};
  
  &:hover {
    opacity: 0.8;
  }
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`;

const FormSection = styled.div`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const FormContainer = styled.form`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.lg};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface InputProps {
  $hasError?: boolean;
}

const Input = styled.input<InputProps>`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? `${theme.colors.danger}25` : `${theme.colors.primary}25`};
  }
`;

const InputWithIcon = styled.div<InputProps>`
  position: relative;
  
  svg {
    position: absolute;
    left: ${({ theme }) => theme.space.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.danger : theme.colors.textSecondary};
  }
  
  input {
    padding-left: ${({ theme }) => theme.space.xl};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: ${({ theme }) => theme.transitions.default};
  resize: vertical;
  min-height: 120px;
  width: 100%;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const ImageUploadContainer = styled.div`
  width: 100%;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  aspect-ratio: 16 / 9;
`;

const ImageUploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  
  span {
    margin-top: ${({ theme }) => theme.space.md};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  p {
    margin-top: ${({ theme }) => theme.space.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  right: ${({ theme }) => theme.space.md};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

const SuccessMessage = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space['2xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: ${({ theme }) => theme.space.md} 0;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.space.lg};
  }
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default CreateGamePage; 