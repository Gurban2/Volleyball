import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMap, FiCheck, FiUsers } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale/ru';

interface GameFormData {
  title: string;
  location: string;
  dateObj: Date | null;
  timeObj: Date | null;
  duration: string;
  format: string;
  totalSpots: number;
}

// Только 2 формата игры согласно требованиям
const FORMATS = [
  { value: 'friendly', label: 'Дружеская игра' },
  { value: 'tournament', label: 'Турнир' }
];

const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, isOrganizer, isAdmin } = useAuth();
  
  // Автозаполнение имени организатора в заголовке
  const organizerName = userData?.displayName || 'Игра';
  const defaultTitle = `Игра от ${organizerName}`;
  
  // Текущая дата и время для минимальных значений
  const today = new Date();
  const minDate = new Date();
  const minTime = new Date();
  
  // Устанавливаем минимальное время (текущее + 3 часа)
  minTime.setHours(today.getHours() + 3);
  
  const [formData, setFormData] = useState<GameFormData>({
    title: defaultTitle,
    location: '',
    dateObj: null,
    timeObj: null,
    duration: '2',
    format: 'friendly',
    totalSpots: 12, // Минимальное количество игроков по умолчанию
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData | 'date' | 'time', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isOrganizer() && !isAdmin()) {
      console.log('⚠️ У пользователя нет прав для создания игры, перенаправление...');
      navigate('/access-denied');
    }
    
    // Обновляем заголовок при изменении имени пользователя
    setFormData(prev => ({
      ...prev,
      title: defaultTitle
    }));
  }, [currentUser, userData, isOrganizer, isAdmin, navigate, defaultTitle]);

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
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        dateObj: date,
      }));
      
      if (errors.date || errors.dateObj) {
        setErrors(prev => ({
          ...prev,
          date: undefined,
          dateObj: undefined,
        }));
      }
      
      // Если меняем дату на сегодня, проверяем время
      const today = new Date();
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
      
      if (isToday && formData.timeObj) {
        // Проверяем, что время как минимум через 3 часа
        const gameTime = new Date(formData.timeObj);
        const minAllowedTime = new Date();
        minAllowedTime.setHours(today.getHours() + 3);
        
        if (gameTime < minAllowedTime) {
          setErrors(prev => ({
            ...prev,
            time: 'Время начала должно быть минимум через 3 часа от текущего времени',
            timeObj: 'Время начала должно быть минимум через 3 часа от текущего времени',
          }));
        }
      }
    }
  };
  
  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setFormData(prev => ({
        ...prev,
        timeObj: time,
      }));
      
      if (errors.time || errors.timeObj) {
        setErrors(prev => ({
          ...prev,
          time: undefined,
          timeObj: undefined,
        }));
      }
      
      // Если дата сегодня, проверяем время
      if (formData.dateObj) {
        const today = new Date();
        const isToday = formData.dateObj.getDate() === today.getDate() &&
                        formData.dateObj.getMonth() === today.getMonth() &&
                        formData.dateObj.getFullYear() === today.getFullYear();
        
        if (isToday) {
          // Проверяем, что время как минимум через 3 часа
          const gameTime = new Date(time);
          const minAllowedTime = new Date();
          minAllowedTime.setHours(today.getHours() + 3);
          
          if (gameTime < minAllowedTime) {
            setErrors(prev => ({
              ...prev,
              time: 'Время начала должно быть минимум через 3 часа от текущего времени',
              timeObj: 'Время начала должно быть минимум через 3 часа от текущего времени',
            }));
          }
        }
      }
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    // Минимальное количество участников - 12
    if (!isNaN(numValue) && numValue >= 12) {
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
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData | 'date' | 'time', string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Введите название игры';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Введите место проведения';
    }
    
    if (!formData.dateObj) {
      newErrors.date = 'Выберите дату';
      newErrors.dateObj = 'Выберите дату';
    } else {
      // Проверка, что дата в будущем
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const gameDate = new Date(formData.dateObj);
      gameDate.setHours(0, 0, 0, 0);
      
      if (gameDate < today) {
        newErrors.date = 'Дата должна быть в будущем';
        newErrors.dateObj = 'Дата должна быть в будущем';
      }
    }
    
    if (!formData.timeObj) {
      newErrors.time = 'Выберите время';
      newErrors.timeObj = 'Выберите время';
    } else {
      // Проверка, что время как минимум через 3 часа от текущего
      const now = new Date();
      
      // Если дата сегодня
      if (formData.dateObj) {
        const today = new Date();
        const isToday = formData.dateObj.getDate() === today.getDate() &&
                        formData.dateObj.getMonth() === today.getMonth() &&
                        formData.dateObj.getFullYear() === today.getFullYear();
        
        if (isToday) {
          const gameTime = new Date(formData.timeObj);
          const minAllowedTime = new Date();
          minAllowedTime.setHours(now.getHours() + 3);
          
          if (gameTime < minAllowedTime) {
            newErrors.time = 'Время начала должно быть минимум через 3 часа от текущего времени';
            newErrors.timeObj = 'Время начала должно быть минимум через 3 часа от текущего времени';
          }
        }
      }
    }
    
    if (!formData.totalSpots || formData.totalSpots < 12) {
      newErrors.totalSpots = 'Количество участников должно быть минимум 12';
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
    
    // Форматируем данные для отправки
    const dateString = formData.dateObj 
      ? `${formData.dateObj.getDate().toString().padStart(2, '0')}.${(formData.dateObj.getMonth() + 1).toString().padStart(2, '0')}.${formData.dateObj.getFullYear()}`
      : '';
      
    const timeString = formData.timeObj
      ? `${formData.timeObj.getHours().toString().padStart(2, '0')}:${formData.timeObj.getMinutes().toString().padStart(2, '0')}`
      : '';
    
    const submissionData = {
      ...formData,
      date: dateString,
      time: timeString,
    };
    
    console.log('📊 Создание игры пользователем:', {
      userId: currentUser?.uid,
      userRole: userData?.role,
      gameData: submissionData
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate('/games/1');
      }, 2000);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  // Фильтрация времени для ограничения выбора времени в зависимости от даты
  const filterTime = (time: Date): boolean => {
    // Если выбрана сегодняшняя дата, ограничиваем по минимальному времени (+3 часа)
    if (formData.dateObj) {
      const today = new Date();
      const isToday = formData.dateObj.getDate() === today.getDate() &&
                      formData.dateObj.getMonth() === today.getMonth() &&
                      formData.dateObj.getFullYear() === today.getFullYear();
      
      if (isToday) {
        const minTime = new Date();
        minTime.setHours(today.getHours() + 3);
        return time >= minTime;
      }
    }
    
    return true;
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="container">
          <BackButton as={Link} to="/games">
            <FiArrowLeft />
            <span>Назад к списку игр</span>
          </BackButton>
          <PageTitle>Создание новой игры</PageTitle>
        </div>
      </PageHeader>

      <PageContent>
        <div className="container">
          {submitSuccess ? (
            <SuccessMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessIcon>
                <FiCheck size={48} />
              </SuccessIcon>
              <SuccessTitle>Игра успешно создана!</SuccessTitle>
              <SuccessText>Вы будете перенаправлены на страницу игры...</SuccessText>
            </SuccessMessage>
          ) : (
            <FormContainer
              as={motion.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection>
                <FormGroup>
                  <FormLabel htmlFor="title">Название игры</FormLabel>
                  <FormInput
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    placeholder="Введите название игры"
                  />
                  {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="location">Место проведения</FormLabel>
                  <InputWithIcon>
                    <LocationIcon>
                      <FiMap />
                    </LocationIcon>
                    <FormInput
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      error={!!errors.location}
                      placeholder="Введите адрес или место проведения"
                      className="input-with-icon"
                    />
                  </InputWithIcon>
                  {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="date">Дата</FormLabel>
                    <InputWithIcon>
                      <DateIcon>
                        <FiCalendar />
                      </DateIcon>
                      <DatePickerWrapper error={!!errors.date}>
                        <DatePicker
                          selected={formData.dateObj}
                          onChange={handleDateChange}
                          dateFormat="dd.MM.yyyy"
                          minDate={minDate}
                          placeholderText="ДД.ММ.ГГГГ"
                          locale={ru}
                          className="date-picker-input input-with-icon"
                          id="date"
                          autoComplete="off"
                        />
                      </DatePickerWrapper>
                    </InputWithIcon>
                    {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="time">Время начала</FormLabel>
                    <InputWithIcon>
                      <TimeIcon>
                        <FiClock />
                      </TimeIcon>
                      <DatePickerWrapper error={!!errors.time}>
                        <DatePicker
                          selected={formData.timeObj}
                          onChange={handleTimeChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Время"
                          dateFormat="HH:mm"
                          placeholderText="ЧЧ:ММ"
                          locale={ru}
                          filterTime={filterTime}
                          className="date-picker-input input-with-icon"
                          id="time"
                          autoComplete="off"
                        />
                      </DatePickerWrapper>
                    </InputWithIcon>
                    {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="duration">Продолжительность (часы)</FormLabel>
                    <FormInput
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      placeholder="Введите продолжительность в часах"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="format">Формат игры</FormLabel>
                    <FormSelect
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
                    </FormSelect>
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel htmlFor="totalSpots">Количество участников</FormLabel>
                  <InputWithIcon>
                    <UsersIcon>
                      <FiUsers />
                    </UsersIcon>
                    <FormInput
                      type="number"
                      id="totalSpots"
                      name="totalSpots"
                      value={formData.totalSpots}
                      onChange={handleNumberChange}
                      error={!!errors.totalSpots}
                      min="12"
                      className="input-with-icon"
                      placeholder="Минимум 12 участников"
                    />
                  </InputWithIcon>
                  {errors.totalSpots && <ErrorMessage>{errors.totalSpots}</ErrorMessage>}
                </FormGroup>
              </FormSection>

              <FormActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Создать игру
                </Button>
              </FormActions>
            </FormContainer>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const PageHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.space.lg} 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: white;
  margin-bottom: ${({ theme }) => theme.space.xs};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const PageContent = styled.main`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const FormContainer = styled.form`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const FormSection = styled.section`
  padding: ${({ theme }) => theme.space.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

interface FormInputProps {
  error?: boolean;
}

const FormInput = styled.input<FormInputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => 
      error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme, error }) => 
      error ? `${theme.colors.danger}25` : `${theme.colors.primary}25`};
  }
  
  &.input-with-icon {
    padding-left: 2.5rem;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const InputWithIcon = styled.div`
  position: relative;
`;

const DatePickerWrapper = styled.div<FormInputProps>`
  .date-picker-input {
    width: 100%;
    padding: ${({ theme }) => theme.space.md};
    padding-left: 2.5rem;
    border: 1px solid ${({ theme, error }) => 
      error ? theme.colors.danger : theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    
    &:focus {
      outline: none;
      border-color: ${({ theme, error }) => 
        error ? theme.colors.danger : theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme, error }) => 
        error ? `${theme.colors.danger}25` : `${theme.colors.primary}25`};
    }
  }
`;

const DateIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  z-index: 1;
`;

const TimeIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  z-index: 1;
`;

const LocationIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  z-index: 1;
`;

const UsersIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  z-index: 1;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.success + '20'};
  color: ${({ theme }) => theme.colors.success};
  border-radius: 50%;
`;

const SuccessTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

export default CreateGamePage; 