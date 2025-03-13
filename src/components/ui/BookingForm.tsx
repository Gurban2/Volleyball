import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiUsers, FiCheckCircle } from 'react-icons/fi';
import Button from './Button';

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  spots: number;
  agreeToTerms: boolean;
}

interface BookingFormProps {
  gameId: string;
  availableSpots: number;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  gameId, 
  availableSpots, 
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    spots: 1,
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.spots < 1) {
      newErrors.spots = 'Must book at least 1 spot';
    } else if (formData.spots > availableSpots) {
      newErrors.spots = `Only ${availableSpots} spots available`;
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
        setSubmitted(true);
        
        // Reset form after success
        setFormData({
          name: '',
          email: '',
          phone: '',
          spots: 1,
          agreeToTerms: false,
        });
        
        // Reset submission state after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
          form: 'Failed to submit booking. Please try again.'
        });
      }
    }
  };
  
  if (availableSpots === 0) {
    return (
      <FormContainer>
        <FormTitle>Booking</FormTitle>
        <NoSpotsMessage>
          <FiUsers />
          <span>No spots available</span>
        </NoSpotsMessage>
        <Button variant="outlined" disabled>Fully Booked</Button>
      </FormContainer>
    );
  }
  
  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage
          as={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FiCheckCircle />
          <SuccessTitle>Booking Confirmed!</SuccessTitle>
          <SuccessText>
            Thank you for your booking. You will receive a confirmation email shortly.
          </SuccessText>
        </SuccessMessage>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      <FormTitle>Book Your Spot</FormTitle>
      <SpotsAvailable>
        <FiUsers />
        <span>{availableSpots} spots available</span>
      </SpotsAvailable>
      
      {errors.form && <FormError>{errors.form}</FormError>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="name">Name</FormLabel>
          <InputWrapper>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              hasError={!!errors.name}
            />
          </InputWrapper>
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="email">Email</FormLabel>
          <InputWrapper>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              hasError={!!errors.email}
            />
          </InputWrapper>
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="phone">Phone (optional)</FormLabel>
          <InputWrapper>
            <InputIcon>
              <FiPhone />
            </InputIcon>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              hasError={!!errors.phone}
            />
          </InputWrapper>
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="spots">Number of Spots</FormLabel>
          <Select
            id="spots"
            name="spots"
            value={formData.spots}
            onChange={handleChange}
            hasError={!!errors.spots}
          >
            {[...Array(Math.min(10, availableSpots))].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} {index === 0 ? 'spot' : 'spots'}
              </option>
            ))}
          </Select>
          {errors.spots && <FieldError>{errors.spots}</FieldError>}
        </FormGroup>
        
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          <CheckboxLabel htmlFor="agreeToTerms" hasError={!!errors.agreeToTerms}>
            I agree to the terms and conditions
          </CheckboxLabel>
        </CheckboxGroup>
        {errors.agreeToTerms && <FieldError>{errors.agreeToTerms}</FieldError>}
        
        <SubmitButton
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Book Now
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.lg};
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SpotsAvailable = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  svg {
    min-width: 16px;
  }
`;

const NoSpotsMessage = styled(SpotsAvailable)`
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.space.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  padding-left: ${({ theme }) => theme.space['2xl']};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.danger : theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.danger : theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.xs};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const Checkbox = styled.input`
  margin-top: 3px;
`;

const CheckboxLabel = styled.label<{ hasError?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, hasError }) => 
    hasError ? theme.colors.danger : theme.colors.textSecondary};
`;

const FieldError = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: -2px;
`;

const FormError = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => `${theme.colors.danger}10`};
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.space.md};
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
  
  svg {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.success};
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const SuccessTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export default BookingForm; 